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
exports.deleteUser = exports.setAdminClaim = exports.listUsers = void 0;
const admin = __importStar(require("firebase-admin"));
const firebase_functions_1 = require("firebase-functions");
const https_1 = require("firebase-functions/v2/https");
const cors_1 = __importDefault(require("cors"));
admin.initializeApp();
// Configure CORS to allow requests from your frontend origin
const corsHandler = (0, cors_1.default)({ origin: 'http://localhost:5173' });
/**
 * Middleware to authenticate the user and check for admin privileges.
 * It verifies the Firebase ID token from the Authorization header.
 */
const authenticateAndAuthorize = async (req, res, next) => {
    firebase_functions_1.logger.info('Verifying token...');
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        firebase_functions_1.logger.error('No token provided.');
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken.admin !== true) {
            firebase_functions_1.logger.error('User is not an admin.');
            res.status(403).send('Permission Denied');
            return;
        }
        req.user = decodedToken; // Add user to the request object
        next();
    }
    catch (error) {
        firebase_functions_1.logger.error('Error while verifying token:', error);
        res.status(403).send('Unauthorized');
    }
};
/**
 * A wrapper for admin functions that applies CORS and authentication middleware.
 * @param handler The core function logic to execute after middleware checks.
 * @returns An HTTPS function handler.
 */
const createAdminFunction = (handler) => {
    return (0, https_1.onRequest)((req, res) => {
        corsHandler(req, res, () => {
            authenticateAndAuthorize(req, res, () => {
                handler(req, res);
            });
        });
    });
};
// --- Admin Functions ---
exports.listUsers = createAdminFunction(async (req, res) => {
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
        res.status(200).json({ users });
    }
    catch (error) {
        firebase_functions_1.logger.error('Error listing users:', error);
        res.status(500).json({ error: 'An error occurred while listing users.' });
    }
});
exports.setAdminClaim = createAdminFunction(async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        res.status(400).json({ error: 'UID is required.' });
        return;
    }
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        res.status(200).json({ message: `Successfully set admin claim for user ${uid}` });
    }
    catch (error) {
        firebase_functions_1.logger.error(`Error setting admin claim for user ${uid}:`, error);
        res.status(500).json({ error: 'An error occurred while setting the admin claim.' });
    }
});
exports.deleteUser = createAdminFunction(async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        res.status(400).json({ error: 'UID is required.' });
        return;
    }
    try {
        await admin.auth().deleteUser(uid);
        res.status(200).json({ message: `Successfully deleted user ${uid}` });
    }
    catch (error) {
        firebase_functions_1.logger.error(`Error deleting user ${uid}:`, error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
});
//# sourceMappingURL=index.js.map