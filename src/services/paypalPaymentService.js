import axios from "axios";
import * as menuService from "./menuService";
import { getRestaurantInfo } from "./menuService";

export const encodeCredentials = (clientId, clientSecret) => {
  const credentials = `${clientId}:${clientSecret}`;
  const encoded = window.btoa(credentials);
  return encoded;
};

export const generatePaypalAccessToken = async (clientId, clientSecret) => {
  const PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
  const credentials = encodeCredentials(clientId, clientSecret);
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("Failed to generate PayPal access token");
  }
  const data = await response.json();
  localStorage.setItem("paypalAccessToken", data.access_token);
  return data.access_token;
};

export const createPaypalOrder = async (currency, amount) => {
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantInfo = await getRestaurantInfo(restaurantId)
    .then((restaurant) => {
      return restaurant;
    });
    // const PAYPAL_BASE_URL = "http://localhost:5001";
    const PAYPAL_BASE_URL = "https://us-central1-orderselfdb.cloudfunctions.net";
  
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    process.env.PAYPAL_PARTNER_ATTRIBUTION_ID;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/createPaypalOrder`;
  const orderData = JSON.stringify({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: "REFID-1",
        payee: {
          email_address: restaurantInfo.emailId,
          merchant_id: restaurantInfo.merchantId,
        },
        amount: {
          currency_code: currency,
          value: amount,
        },
        payment_instruction: {
          disbursement_mode: "INSTANT",
          platform_fees: [
            {
              amount: {
                currency_code: currency,
                value: "2.00",
              },
            },
          ],
        },
      },
    ],
  });
  try {
    const response = await axios.post(apiUrl, orderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:",
      error
    );
  }
};

export const capturePayPalPayment = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    process.env.PAYPAL_PARTNER_ATTRIBUTION_ID;
    // const PAYPAL_BASE_URL = "http://localhost:5001";
    const PAYPAL_BASE_URL = "https://us-central1-orderselfdb.cloudfunctions.net";
  
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/capturePaypalPayment`;
  const orderData = JSON.stringify({ orderID: data.orderID });
  try {
    const response = await axios.post(apiUrl, orderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(
      "🚀 ~ file: paypalPaymentService.js:102 ~ capturePayPalPayment ~ response:",
      response
    );
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalPaymentService.js:66 ~ createPaypalOrder ~ error:",
      error
    );
  }
};

export async function confirmPayPalOrder(orderId, authToken) {
  const PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to confirm order:", error);
    throw error;
  }
}

export async function authorizePayPalPayment(orderId) {
  const PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
  const accessToken = localStorage.getItem("paypalAccessToken");
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/authorize`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to authorize payment:", error);
    throw error;
  }
}

export async function createPartnerReferral(
  trackingId,
  restaurantInfo,
  tableNumber
) {
  const PAYPAL_BASE_URL = process.env.REACT_APP_PAYPAL_BASE_URL;
  const apiUrl = `${PAYPAL_BASE_URL}/v2/customer/partner-referrals`;
  const accessToken = localStorage.getItem("paypalAccessToken");

  // const encodedUrl = encodeURIComponent(
  //   `http://localhost:3000/check-in/${trackingId}/${tableNumber}`
  // );

  const partnerReferralData = {
    email: restaurantInfo.emailId,
    preferred_language_code: "en-US",
    tracking_id: trackingId,
    partner_config_override: {
      // return_url: `http://localhost:3000/check-in/${trackingId}/${tableNumber}`,
      return_url: `https://orderselfdb.web.app/configure`,
    },
    operations: [
      {
        operation: "API_INTEGRATION",
        api_integration_preference: {
          rest_api_integration: {
            integration_method: "PAYPAL",
            integration_type: "THIRD_PARTY",
            third_party_details: {
              features: ["PAYMENT", "REFUND"],
            },
          },
        },
      },
    ],
    legal_consents: [
      {
        type: "SHARE_DATA_CONSENT",
        granted: true,
      },
    ],
    products: ["EXPRESS_CHECKOUT"],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(partnerReferralData),
      mode: "no-cors",
    });

    if (!response.ok) {
      throw new Error("Failed to create partner referral");
    }
    const responseData = await response.json();
    console.log("🚀 ~ step 5 ->:", responseData);
    return responseData;
  } catch (error) {
    // Handle any errors here
    console.error("Error creating partner referral:", error);
    throw error;
  }
}

export async function verifySellerOnboardStatus(data) {
  // const PAYPAL_BASE_URL = "http://localhost:5001";
  const PAYPAL_BASE_URL = "https://us-central1-orderselfdb.cloudfunctions.net";
  
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/sellerOnboardingStatus`;
  const sellerData = JSON.stringify({
    trackingId: data.merchantId,
    merchantIdInPayPal: data.merchantIdInPayPal,
  });
  try {
    const response = await axios.post(apiUrl, sellerData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      "🚀 ~ file: paypalPaymentService.js:260 ~ verifySellerOnboardStatus ~ response:",
      response
    );
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
}

// export async function isVerified(trackingId) {
//   const PAYPAL_BASE_URL = "http://localhost:5001";
//   const accessToken = localStorage.getItem("paypalAccessToken");
//   const apiUrl = `${PAYPAL_BASE_URL}/orderselfdb/us-central1/sellerVerification`;
//   try {
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({
//         trackingId,
//       }),
//       mode: "no-cors",
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(
//       "🚀 ~ file: paypalPaymentService.js:281 ~ isVerified ~ data:",
//       data
//     );
//   } catch (error) {
//     console.log(
//       "🚀 ~ file: paypalPaymentService.js:283 ~ isVerified ~ error:",
//       error
//     );
//   }
// }

export async function createReferral(trackingId, restaurantInfo, tableNumber) {
  const partnerReferralData = JSON.stringify({
    email: restaurantInfo.emailId,
    preferred_language_code: "en-US",
    tracking_id: trackingId,
    partner_config_override: {

      //return_url: `http://localhost:3000/check-in/${trackingId}/${tableNumber}`,
      return_url: `https://orderselfdb.web.app/configure`,
    },
    operations: [
      {
        api_integration_preference: {
          rest_api_integration: {
            integration_method: "PAYPAL",
            integration_type: "THIRD_PARTY",
            third_party_details: {
              features: [
                "PAYMENT",
                "ACCESS_MERCHANT_INFORMATION",
                "PARTNER_FEE",
              ],
            },
          },
        },
        operation: "API_INTEGRATION",
      },
    ],
    legal_consents: [
      {
        type: "SHARE_DATA_CONSENT",
        granted: true,
      },
    ],
    products: ["EXPRESS_CHECKOUT"],
  });
  // const PAYPAL_BASE_URL = "http://localhost:5001";
  const PAYPAL_BASE_URL = "https://us-central1-orderselfdb.cloudfunctions.net";
    
  const accessToken = localStorage.getItem("paypalAccessToken");
  const apiUrl = `${PAYPAL_BASE_URL}/createPartnerReferral`;

  try {
    const response = await axios.post(apiUrl, partnerReferralData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error:", error);
  }
}