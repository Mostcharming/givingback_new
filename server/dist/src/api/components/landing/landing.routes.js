"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const landing_controller_1 = require("./landing.controller");
const router = express_1.default.Router();
router.get('/allprojects', landing_controller_1.getAllProjectsForAllUsers);
exports.default = router;
