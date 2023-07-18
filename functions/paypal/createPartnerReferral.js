/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest, onCall } = require("firebase-functions/v2/https");

const createPartnerReferral = async (reqBody, response) => {
  const createPartnerReferralResponse =
    await paypalService.createPartnerReferral(reqBody);
  if (createPartnerReferralResponse) {
    response.status(200).json(createPartnerReferralResponse);
  }
};

exports.createPartnerReferral = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app"] }, 
async (req, res) => {
  const body = JSON.stringify(req.body);
  await createPartnerReferral(JSON.parse(body), res);
});


