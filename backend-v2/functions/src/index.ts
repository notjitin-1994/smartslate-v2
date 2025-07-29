import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();
const app = express();

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
app.use(cors(corsOptions));

// --- Authentication Middleware ---
// A robust middleware to verify the Firebase ID token and check for admin claims.
const authenticateAndAuthorizeAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  } catch (error) {
    functions.logger.error("Error while verifying token:", error);
    return res.status(403).send("Unauthorized: Invalid token.");
  }
};

// --- API Routes ---
// All admin routes are protected by the authentication middleware.
const adminRouter = express.Router();
adminRouter.use(authenticateAndAuthorizeAdmin);

adminRouter.get("/users", async (req: express.Request, res: express.Response) => {
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
  } catch (error) {
    functions.logger.error("Error listing users:", error);
    return res.status(500).json({ error: "An error occurred while listing users." });
  }
});

adminRouter.post("/setAdminClaim", async (req: express.Request, res: express.Response) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "UID is required." });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return res.status(200).json({ message: `Successfully set admin claim for user ${uid}` });
  } catch (error) {
    functions.logger.error(`Error setting admin claim for user ${uid}:`, error);
    return res.status(500).json({ error: "An error occurred while setting the admin claim." });
  }
});

adminRouter.post("/deleteUser", async (req: express.Request, res: express.Response) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "UID is required." });
  }

  try {
    await admin.auth().deleteUser(uid);
    return res.status(200).json({ message: `Successfully deleted user ${uid}` });
  } catch (error) {
    functions.logger.error(`Error deleting user ${uid}:`, error);
    return res.status(500).json({ error: "An error occurred while deleting the user." });
  }
});

// Mount the admin router under the /admin path
app.use("/admin", adminRouter);

// --- Export the Express app as a single Cloud Function ---
// This is a more scalable pattern than exporting multiple functions.
export const api = functions.https.onRequest(app);