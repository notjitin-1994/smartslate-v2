"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSSAInterestCreate = exports.onInquiryCreate = exports.createUserDocument = exports.handleFormSubmission = exports.api = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin SDK
admin.initializeApp();
const app = (0, express_1.default)();
// --- CORS Configuration ---
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://smartslate.io",
        "https://www.smartslate.io",
    ],
    allowedHeaders: ["Content-Type", "Authorization", "Origin"],
    exposedHeaders: ["Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
};
app.use((0, cors_1.default)(corsOptions));
// --- Authentication Middleware ---
const authenticateAndAuthorize = (allowedRoles) => async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(403).send("Unauthorized: No token provided.");
    }
    const idToken = authorization.split("Bearer ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userRole = decodedToken.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).send("Permission Denied: Insufficient role.");
        }
        // @ts-ignore
        req.user = decodedToken;
        return next();
    }
    catch (error) {
        logger.error("Error while verifying token:", error);
        return res.status(403).send("Unauthorized: Invalid token.");
    }
};
// --- API Routes ---
const adminRouter = express_1.default.Router();
adminRouter.get("/stats", authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]), async (_req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        const totalUsers = listUsersResult.users.length;
        const coursesSnapshot = await admin
            .firestore()
            .collection("courses")
            .get();
        const totalCourses = coursesSnapshot.size;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const inquiriesSnapshot = await admin
            .firestore()
            .collection("inquiries")
            .where("createdAt", ">=", startOfMonth)
            .get();
        const newInquiriesThisMonth = inquiriesSnapshot.size;
        return res.status(200).json({
            totalUsers,
            totalCourses,
            newInquiriesThisMonth,
        });
    }
    catch (error) {
        logger.error("Error fetching dashboard stats:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching dashboard stats." });
    }
});
adminRouter.get("/stats/user-signups", authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]), async (_req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        const usersSnapshot = await admin
            .firestore()
            .collection("users")
            .where("createdAt", ">=", thirtyDaysAgo)
            .get();
        const dailySignups = new Map();
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split("T")[0];
            dailySignups.set(dateString, 0);
        }
        usersSnapshot.forEach((doc) => {
            var _a;
            const user = doc.data();
            if ((_a = user.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) {
                const creationDate = user.createdAt.toDate();
                const dateString = creationDate.toISOString().split("T")[0];
                if (dailySignups.has(dateString)) {
                    dailySignups.set(dateString, dailySignups.get(dateString) + 1);
                }
            }
        });
        const chartData = Array.from(dailySignups.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return res.status(200).json(chartData);
    }
    catch (error) {
        logger.error("Error fetching user signup stats:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching user signup stats." });
    }
});
adminRouter.get("/users", authenticateAndAuthorize([
    "smartslateAdmin",
    "smartslateManager",
    "smartslateClientManager",
]), async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        const users = listUsersResult.users
            .filter((user) => user.email && user.displayName)
            .map((user) => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            metadata: {
                creationTime: user.metadata.creationTime,
            },
            customClaims: user.customClaims,
        }));
        return res.status(200).json({ users });
    }
    catch (error) {
        logger.error("Error listing users:", error);
        return res
            .status(500)
            .json({ error: "An error occurred while listing users." });
    }
});
app.use("/admin", adminRouter);
exports.api = (0, https_1.onRequest)(app);
exports.handleFormSubmission = (0, https_2.onCall)(async (request) => {
    var _a;
    const { formData, type } = request.data;
    if (!type || !formData) {
        throw new https_2.HttpsError("invalid-argument", "The function must be called with 'type' and 'formData' arguments.");
    }
    const uid = ((_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid) || "anonymous";
    const inquiry = {
        name: formData.name,
        email: formData.email,
        type: type,
        userId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await admin.firestore().collection("inquiries").add(inquiry);
    return { success: true };
});
var v1_functions_1 = require("./v1-functions");
Object.defineProperty(exports, "createUserDocument", { enumerable: true, get: function () { return v1_functions_1.createUserDocument; } });
exports.onInquiryCreate = (0, firestore_1.onDocumentCreated)("inquiries/{inquiryId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        logger.error("No data associated with the event");
        return;
    }
    const inquiryData = snap.data();
    const mailPayload = {
        to: ["sanam@smartslate.io"],
        cc: ["jitin@smartslate.io"],
        message: {
            subject: `🚀 New SmartSlate Inquiry: ${inquiryData.name}`,
            html: `...`,
        },
    };
    await admin.firestore().collection("mail").add(mailPayload);
});
exports.onSSAInterestCreate = (0, firestore_1.onDocumentCreated)("ssa_interest/{interestId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        logger.error("No data associated with the event");
        return;
    }
    const interestData = snap.data();
    const mailPayload = {
        to: ["sanam@smartslate.io"],
        cc: ["jitin@smartslate.io"],
        message: {
            subject: `🔥 New SSA Lead: ${interestData.name} from ${interestData.organization}`,
            html: `...`,
        },
    };
    await admin.firestore().collection("mail").add(mailPayload);
});
//# sourceMappingURL=index.js.map