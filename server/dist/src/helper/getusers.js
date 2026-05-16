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
exports.fetchUsers = exports.getUserImage = exports.getAddress = exports.getBank = void 0;
const config_1 = __importDefault(require("../config"));
const getBank = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)("banks")
        .where({ user_id: userId })
        .select("bankName", "accountName", "accountNumber", "bvn");
});
exports.getBank = getBank;
const getAddress = (userId, state) => __awaiter(void 0, void 0, void 0, function* () {
    let query = (0, config_1.default)("address").where({ user_id: userId });
    if (state) {
        query = query.where(config_1.default.raw("LOWER(state)"), "LIKE", `%${state.toLowerCase()}%`);
    }
    return yield query.select("state", "city_lga", "address");
});
exports.getAddress = getAddress;
const getUserImage = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, config_1.default)("userimg")
        .where({ user_id: userId })
        .select("filename")
        .first();
});
exports.getUserImage = getUserImage;
const fetchUsers = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, name, interest_area, active, state, user_id, organization_id, } = filters;
    const offset = (page - 1) * limit;
    // Build the query for users
    let query = (0, config_1.default)("users").select("id", "email", "role");
    if (user_id) {
        query = query.where("id", user_id); // Filter by user_id if provided
    }
    const allUsers = yield query;
    const allUsersDetails = [];
    for (const user of allUsers) {
        if (user.role !== "NGO")
            continue;
        // Fetch user organizations with an optional organization_id filter
        let userOrganizations = yield (0, config_1.default)("organizations")
            .where({ user_id: user.id })
            .select("id", "name", "phone", "website", "interest_area", "cac", "active");
        // Optional: If you need to apply the organization_id filter
        if (organization_id) {
            userOrganizations = yield (0, config_1.default)("organizations")
                .where({ user_id: user.id, id: organization_id })
                .select("id", "name", "phone", "website", "interest_area", "cac", "active");
        }
        if (userOrganizations.length === 0) {
            if (name ||
                interest_area ||
                active !== undefined ||
                state ||
                organization_id)
                continue;
            allUsersDetails.push({
                email: user.email,
                error: "User not associated with any account",
            });
            continue;
        }
        for (const organization of userOrganizations) {
            if (name && !organization.name.toLowerCase().includes(name.toLowerCase()))
                continue;
            if (interest_area &&
                !organization.interest_area
                    .toLowerCase()
                    .includes(interest_area.toLowerCase()))
                continue;
            if (active !== undefined && organization.active.toString() !== active)
                continue;
            const userDetails = {
                id: organization.id,
                email: user.email,
                name: organization.name,
                phone: organization.phone,
                website: organization.website,
                interest_area: organization.interest_area,
                cac: organization.cac,
                active: organization.active,
                bank: yield (0, exports.getBank)(user.id),
                address: yield (0, exports.getAddress)(user.id, state),
                userimage: yield (0, exports.getUserImage)(user.id),
            };
            allUsersDetails.push(userDetails);
        }
    }
    const paginatedUsers = allUsersDetails.slice(offset, offset + limit);
    const totalItems = allUsersDetails.length;
    const totalPages = Math.ceil(totalItems / limit);
    return {
        users: paginatedUsers,
        totalItems,
        totalPages,
        currentPage: page,
    };
});
exports.fetchUsers = fetchUsers;
