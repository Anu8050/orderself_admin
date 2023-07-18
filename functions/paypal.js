/* eslint-disable */
const helperFunctions = require("./helper");
const https = require("https");
const axios = require("axios");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();

const partnerMerchantId = "BU9AC7AQ73H9Q"; // obtained from sb-7wipc26503454@business.example.com
// client Id and secret obtained from Platform Partner App - 5344651197937780686
const clientId =
  "Ac9lZ5VomxhnTrzo7X1SJLw-57KpwPJglOICJMF4a0e9k8-w-3uXSSimJ0bJ79ETUfnVSbkVTwnu8XQs";
const clientSecret =
  "EBypxvQYk8Z9dFn7_61XioB5oZacdx_XVWbpNxX-BHVCfGU4PfMeInd3ObkU2Zj7t2MgRSMHtWRdvvOi";

async function generatePayPalAuthorization() {
  const requestBody = "grant_type=client_credentials";
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
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
      return accessToken;
    } else {
      throw new Error(response.data.error_description);
    }
  } catch (error) {
    throw error;
  }
}

async function confirmSellerVerification(sellerData) {
  if (
    sellerData.payments_receivable === true &&
    sellerData.primary_email_confirmed === true &&
    sellerData.oauth_third_party === true
  )
    return "verified";
  else return "unverified";
}

async function updateDocument(collectionName, documentId, newData) {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const res = await docRef.update(newData);
    console.log("Document updated successfully.", res);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

async function getSellerStatus(trackingId, merchantIdInPayPal) {
  const accessToken = await generatePayPalAuthorization();

  const options = {
    url: `https://api-m.sandbox.paypal.com/v1/customer/partners/${partnerMerchantId}/merchant-integrations/${merchantIdInPayPal}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(options);
    if (response.status === 200) {
      const status = await confirmSellerVerification(response.data);
      if (status === "verified") {
        const newData = {
          merchantId: response.data.merchant_id,
          isPaypalVerified: true,
        };
        await updateDocument("restaurantInfo", trackingId, newData);
      } else {
        const newData = {
          merchantId: response.data.merchant_id,
          isPaypalVerified: false,
        };
        await updateDocument("restaurantInfo", trackingId, newData);
      }
      return "status";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = onRequest(async (req, res) => {
  const body = JSON.parse(req.body);
  const resp = await getSellerStatus(body.trackingId, body.merchantIdInPayPal);
  res.status(200).json(resp);
});
