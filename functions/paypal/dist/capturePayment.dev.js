"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var capturePayment = function capturePayment(reqBody, response) {
  var capturePaymentResponse;
  return regeneratorRuntime.async(function capturePayment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(paypalService.capturePayment(reqBody));

        case 2:
          capturePaymentResponse = _context.sent;
          console.log("🚀 ~ file: capturePayment.js:7 ~ capturePayment ~ capturePaymentResponse:", capturePaymentResponse);

          if (capturePaymentResponse) {
            response.status(200).json(capturePaymentResponse);
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.capturePayment = onRequest(function _callee(req, res) {
  var body;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = JSON.stringify(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(capturePayment(JSON.parse(body), res));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});