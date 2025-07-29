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
exports.api = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin SDK
admin.initializeApp();
const app = (0, express_1.default)();
// --- CORS Configuration ---
// This is the most critical part. We define a strict whitelist of origins.
// The `cors` middleware will handle all OPTIONS preflight requests automatically.
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://smartslate.io',
        'https://www.smartslate.io'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Origin'
    ],
    exposedHeaders: [
        'Content-Type'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
};
// Apply CORS middleware to all routes
app.use((0, cors_1.default)(corsOptions));
// --- Authentication Middleware ---
// A robust middleware to verify the Firebase ID token and check for admin claims.
const authenticateAndAuthorizeAdmin = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(403).send("Unauthorized: No token provided.");
    }
    const idToken = authorization.split("Bearer ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken.admin !== true) {
            return res.status(403).send("Permission Denied: User is not an admin.");
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.user = decodedToken; // Attach user info to the request object
        return next();
    }
    catch (error) {
        functions.logger.error("Error while verifying token:", error);
        return res.status(403).send("Unauthorized: Invalid token.");
    }
};
// --- API Routes ---
// All admin routes are protected by the authentication middleware.
const adminRouter = express_1.default.Router();
adminRouter.use(authenticateAndAuthorizeAdmin);
adminRouter.get("/users", async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        const users = listUsersResult.users.map((user) => ({
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
        functions.logger.error("Error listing users:", error);
        return res.status(500).json({ error: "An error occurred while listing users." });
    }
});
adminRouter.post("/setAdminClaim", async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).json({ error: "UID is required." });
    }
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        return res.status(200).json({ message: `Successfully set admin claim for user ${uid}` });
    }
    catch (error) {
        functions.logger.error(`Error setting admin claim for user ${uid}:`, error);
        return res.status(500).json({ error: "An error occurred while setting the admin claim." });
    }
});
adminRouter.post("/deleteUser", async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).json({ error: "UID is required." });
    }
    try {
        await admin.auth().deleteUser(uid);
        return res.status(200).json({ message: `Successfully deleted user ${uid}` });
    }
    catch (error) {
        functions.logger.error(`Error deleting user ${uid}:`, error);
        return res.status(500).json({ error: "An error occurred while deleting the user." });
    }
});
// Mount the admin router under the /admin path
app.use("/admin", adminRouter);
// --- Export the Express app as a single Cloud Function ---
// This is a more scalable pattern than exporting multiple functions.
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map