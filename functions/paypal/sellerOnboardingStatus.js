/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const sellerOnboardingStatus = async (reqBody, response) => {
  console.log("🚀 ~ file: sellerOnboardingStatus.js:5 ~ sellerOnboardingStatus ~ reqBody:", reqBody)
  const sellerOnboardingStatusResponse =
    await paypalService.sellerOnboardingStatus(reqBody);
  if (sellerOnboardingStatusResponse) {
    console.log("🚀 ~ file: sellerOnboardingStatus.js:9 ~ sellerOnboardingStatus ~ sellerOnboardingStatusResponse:", sellerOnboardingStatusResponse)
    response.status(200).json(sellerOnboardingStatusResponse);
  }
};

exports.sellerOnboardingStatus = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app"] }, async (req, res) => {
  const body = JSON.stringify(req.body);
  await sellerOnboardingStatus(JSON.parse(body), res);
});
