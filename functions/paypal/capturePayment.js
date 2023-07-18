/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const capturePayment = async (reqBody, response) => {
  const capturePaymentResponse = await paypalService.capturePayment(reqBody);
  console.log("🚀 ~ file: capturePayment.js:7 ~ capturePayment ~ capturePaymentResponse:", capturePaymentResponse)
  if (capturePaymentResponse) {
    response.status(200).json(capturePaymentResponse);
  }
};

exports.capturePayment = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app"] }, async (req, res) => {
  const body = JSON.stringify(req.body);
  await capturePayment(JSON.parse(body), res);
});
