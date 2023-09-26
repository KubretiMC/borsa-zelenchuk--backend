"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    getRegistration(req, res) {
        res.json({ message: 'GET request to /api/register2222' });
    }
}
exports.default = new UserController();
