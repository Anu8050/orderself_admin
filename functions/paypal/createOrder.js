/* eslint-disable */

const paypalService = require("../services/paypalService");
const { onRequest } = require("firebase-functions/v2/https");

const createOrder = async (reqBody, response) => {
  const createOrderResponse = await paypalService.createOrder(reqBody);
  if(createOrderResponse) {
    response.status(200).json({
      orderId: createOrderResponse?.id,
      status: createOrderResponse?.status,
    });
  }
};


exports.createOrder = onRequest({ cors: ["http://localhost:3000", "https://orderselfdb.web.app", "https://orderself-guest.web.app/"] }, async (req, res) => {
  const body = JSON.stringify(req.body);
  await createOrder(JSON.parse(body), res);
});