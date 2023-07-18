/* eslint-disable */

const axios = require("axios");
const paypalConfig = require("../config/paypal-config.json");
const fetch = require('node-fetch');

const getPaypalAccessToken = async () => {
  const requestBody = "grant_type=client_credentials";
  const authString = Buffer.from(
    `${paypalConfig.clientId}:${paypalConfig.clientSecret}`
  ).toString("base64");

  try {
    const response = await axios.post(
      `${paypalConfig.api_baseURL}/v1/oauth2/token`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
        },
      }
    );

    if (response.status === 200) {
      const accessToken = response.data.access_token;
      console.log(`Bearer ${accessToken}`);
      return `Bearer ${accessToken}`;
    } else {
      throw new Error(response.data.error_description);
    }
  } catch (error) {
    throw error;
  }
};

const createOrder = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v2/checkout/orders`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = data;
  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    console.log("🚀 ~ file: paypalService.js:50 ~ createOrder ~ error:", error);
    throw error;
  }
};

const capturePayment = async (data) => {
  const PAYPAL_PARTNER_ATTRIBUTION_ID =
    paypalConfig.paypal_partner_attribution_id;
  const accessToken = await getPaypalAccessToken();
  const orderID = data.orderID;
  const url = `${paypalConfig.api_baseURL}/v2/checkout/orders/${orderID}/capture`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
    "PayPal-Partner-Attribution-Id": PAYPAL_PARTNER_ATTRIBUTION_ID,
  };
  const requestBody = null;
  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: paypalService.js:76 ~ capturePayment ~ error:",
      error
    );
    throw error;
  }
};

const isPaypalVerified = async (data) => {
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v1/customer/partners/${paypalConfig.partnerId}/merchant-integrations?tracking_id=${data.trackingId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  try {
    const response = await axios.post(url, {}, { headers });
    if (response?.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log("🚀 ~ file: paypalService.js:36 ~ createOrder ~ err:", err);
  }
};

const createPartnerReferral = async (data) => {
  const accessToken = await getPaypalAccessToken();
  const url = `${paypalConfig.api_baseURL}/v2/customer/partner-referrals`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  const requestBody = data;
  try {
    const response = await axios.post(url, requestBody, { headers });
    if (response?.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.log(
      "🚀 ~ file: paypalService.js:96 ~ createPartnerReferral ~ err:",
      err
    );
  }
};

const sellerOnboardingStatus = async (data) => {
  const accessToken = await getPaypalAccessToken();
  const partnerId = paypalConfig.partnerId;
  const sellerMerchantId = data.merchantIdInPayPal;
  const url = `${paypalConfig.api_baseURL}/v1/customer/partners/${partnerId}/merchant-integrations/${sellerMerchantId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Request failed with status:", response.status);
      return null;
    }
  } catch (err) {
    console.log(
      "🚀 ~ file: paypalService.js:117 ~ sellerOnboardingStatus ~ err:",
      err
    );
  }
  // const accessToken = await getPaypalAccessToken();
  // const partnerId = paypalConfig.partnerId;
  // const sellerMerchantId = data.merchantIdInPayPal;
  // const url = `${paypalConfig.api_baseURL}/v1/customer/partners/${partnerId}/merchant-integrations/${sellerMerchantId}`;
  // const headers = {
  //   "Content-Type": "application/json",
  //   Authorization: accessToken,
  //   "Access-Control-Allow-Origin": "*",
  // };

  // try {
  //   const response = await axios.get(url, null, { headers });
  //   if (response?.data) {
  //     return response.data;
  //   }
  //   return null;
  // } catch (err) {
  //   console.log(
  //     "🚀 ~ file: paypalService.js:117 ~ sellerOnboardingStatus ~ err:",
  //     err
  //   );
  // }
};

module.exports = {
  getPaypalAccessToken,
  createOrder,
  capturePayment,
  isPaypalVerified,
  createPartnerReferral,
  sellerOnboardingStatus,
};
