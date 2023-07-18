"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var sellerOnboardingStatus = function sellerOnboardingStatus(reqBody, response) {
  var sellerOnboardingStatusResponse;
  return regeneratorRuntime.async(function sellerOnboardingStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("🚀 ~ file: sellerOnboardingStatus.js:5 ~ sellerOnboardingStatus ~ reqBody:", reqBody);
          _context.next = 3;
          return regeneratorRuntime.awrap(paypalService.sellerOnboardingStatus(reqBody));

        case 3:
          sellerOnboardingStatusResponse = _context.sent;

          if (sellerOnboardingStatusResponse) {
            console.log("🚀 ~ file: sellerOnboardingStatus.js:9 ~ sellerOnboardingStatus ~ sellerOnboardingStatusResponse:", sellerOnboardingStatusResponse);
            response.status(200).json(sellerOnboardingStatusResponse);
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.sellerOnboardingStatus = onRequest(function _callee(req, res) {
  var body;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = JSON.stringify(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(sellerOnboardingStatus(JSON.parse(body), res));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});