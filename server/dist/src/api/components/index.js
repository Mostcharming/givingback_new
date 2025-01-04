"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const community_routes_1 = __importDefault(require("./community/community.routes"));
const contact_routes_1 = __importDefault(require("./contact_us/contact.routes"));
const landing_routes_1 = __importDefault(require("./landing/landing.routes"));
const router = express_1.default.Router();
router.use('/auth', auth_routes_1.default);
router.use('/', contact_routes_1.default);
router.use('/', landing_routes_1.default);
router.use('/community', community_routes_1.default);
exports.default = router;
