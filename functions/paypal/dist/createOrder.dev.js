"use strict";

var paypalService = require("../services/paypalService");

var _require = require("firebase-functions/v2/https"),
    onRequest = _require.onRequest;

var createOrder = function createOrder(reqBody, response) {
  var createOrderResponse;
  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("🚀 ~ file: createOrder.js:5 ~ createOrder ~ reqBody:", reqBody);
          _context.next = 3;
          return regeneratorRuntime.awrap(paypalService.createOrder(reqBody));

        case 3:
          createOrderResponse = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createOrder = onRequest(function _callee(req, res) {
  var body;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = JSON.stringify(req.body);
          _context2.next = 3;
          return regeneratorRuntime.awrap(createOrder(JSON.parse(body), res));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});