"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var sellerVerification = function sellerVerification(reqBody, response) {
  var data, verifySellerResponse;
  return regeneratorRuntime.async(function sellerVerification$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = {
            trackingId: reqBody.trackingId
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(paypalService.isPaypalVerified(data));

        case 3:
          verifySellerResponse = _context.sent;

          if (verifySellerResponse) {
            response.status(200).json(verifySellerResponse);
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sellerVerification = onRequest(function _callee(req, res) {
  var body;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = JSON.stringify(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(sellerVerification(JSON.parse(body), res));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});