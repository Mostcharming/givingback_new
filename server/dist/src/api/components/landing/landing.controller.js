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
exports.getAllProjectsForAllUsers = void 0;
const config_1 = __importDefault(require("../../../config"));
const getProjects_1 = require("../../../helper/getProjects");
const getAllProjectsForAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, donor_id, organization_id, projectType, title, description, objectives, category, scope, status, startDate, endDate } = req.query;
        const filters = {
            donor_id: donor_id,
            organization_id: organization_id,
            projectType: projectType,
            title: title,
            description: description,
            objectives: objectives,
            category: category,
            scope: scope,
            status: status,
            startDate: startDate,
            endDate: endDate
        };
        const { previousProjects, presentProjects } = yield (0, getProjects_1.getProjects)(config_1.default, filters, parseInt(page), parseInt(limit));
        const totalItems = previousProjects.length + presentProjects.length;
        const totalPages = Math.ceil(totalItems / parseInt(limit));
        res.status(200).json({
            projects: [...previousProjects, ...presentProjects],
            totalItems,
            totalPages,
            currentPage: parseInt(page)
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: 'Unable to fetch all projects for all users' });
    }
});
exports.getAllProjectsForAllUsers = getAllProjectsForAllUsers;
