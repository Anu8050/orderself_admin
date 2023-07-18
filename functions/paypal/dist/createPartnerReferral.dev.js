"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var createPartnerReferral = function createPartnerReferral(reqBody, response) {
  var createPartnerReferralResponse;
  return regeneratorRuntime.async(function createPartnerReferral$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(paypalService.createPartnerReferral(reqBody));

        case 2:
          createPartnerReferralResponse = _context.sent;

          if (createPartnerReferralResponse) {
            response.status(200).json(createPartnerReferralResponse);
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createPartnerReferral = onRequest(function _callee(req, res) {
  var body;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = JSON.stringify(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(createPartnerReferral(JSON.parse(body), res));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});