"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadimg = exports.uploadbulk = exports.uploadHandler = exports.hash = exports.verifyNew = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const config_1 = __importDefault(require("../config"));
const awsS3_1 = require("../utils/awsS3");
// Verify if a user already exists in the database
const verifyNew = (model, para) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield (0, config_1.default)(model)
            .where({ [para]: req.body[para] })
            .first();
        if (!doc) {
            return next();
        }
        res.status(409).json({ error: 'User already exists' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.verifyNew = verifyNew;
// Hash a password
const hash = (password) => bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
exports.hash = hash;
// Upload handler for specific model
// Function for handling uploads
const uploadHandler = (model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: 'fail',
                error: `No ${model} files uploaded.`
            });
        }
        const filesToProcess = Array.isArray(req.files)
            ? req.files.filter((file) => file.fieldname === model)
            : [];
        if (filesToProcess.length === 0) {
            return res.status(400).json({
                status: 'fail',
                error: `No ${model} files uploaded.`
            });
        }
        yield Promise.all(filesToProcess.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const filename = file.location;
            const doc = {
                filename,
                user_id
            };
            yield (0, config_1.default)(model).insert(doc);
        })));
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.uploadHandler = uploadHandler;
// Multer configurations
const uploadConfig = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        bucket: awsS3_1.BUCKET,
        s3: awsS3_1.s3,
        key: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `img-${Date.now()}.${ext}`);
        }
    })
});
const uploadLocal = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage()
});
exports.uploadbulk = uploadLocal.single('bulk');
exports.uploadimg = uploadConfig.any();
