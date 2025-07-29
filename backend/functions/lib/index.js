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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.listUsers = exports.setAdminClaim = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
admin.initializeApp();
const ensureAdmin = (context) => {
    if (!context.auth) {
        throw new https_1.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    if (context.auth.token.admin !== true) {
        throw new https_1.HttpsError('permission-denied', 'Only an admin can perform this action.');
    }
};
exports.setAdminClaim = (0, https_1.onCall)({ cors: true }, async (request) => {
    ensureAdmin(request);
    const { uid } = request.data;
    if (typeof uid !== 'string' || uid.length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'The function must be called with a valid "uid" argument.');
    }
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        return { message: `Success! User ${uid} has been made an admin.` };
    }
    catch (error) {
        firebase_functions_1.logger.error('Error setting custom claim:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while setting the custom claim.');
    }
});
exports.listUsers = (0, https_1.onCall)({ cors: true }, async (request) => {
    ensureAdmin(request);
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
        return { users };
    }
    catch (error) {
        firebase_functions_1.logger.error('Error listing users:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while listing users.');
    }
});
exports.deleteUser = (0, https_1.onCall)({ cors: true }, async (request) => {
    ensureAdmin(request);
    const { uid } = request.data;
    if (typeof uid !== 'string' || uid.length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'The function must be called with a valid "uid" argument.');
    }
    try {
        await admin.auth().deleteUser(uid);
        return { message: `Successfully deleted user ${uid}` };
    }
    catch (error) {
        firebase_functions_1.logger.error('Error deleting user:', error);
        throw new https_1.HttpsError('internal', 'An error occurred while deleting the user.');
    }
});
//# sourceMappingURL=index.js.map