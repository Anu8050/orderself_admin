/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const sellerVerification = async (reqBody, response) => {
  const data = {
    trackingId: reqBody.trackingId,
  };
  const verifySellerResponse = await paypalService.isPaypalVerified(data);
  if (verifySellerResponse) {
    response.status(200).json(verifySellerResponse);
  }
};

exports.sellerVerification = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app"] }, async (req, res) => {
  const body = JSON.stringify(req.body);
  await sellerVerification(JSON.parse(body), res);
});
