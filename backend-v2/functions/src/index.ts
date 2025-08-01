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

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// --- Authentication Middleware ---
// A robust middleware to verify the Firebase ID token and check for admin claims.
// A robust middleware to verify the Firebase ID token and check for specific roles.
const authenticateAndAuthorize =
  (allowedRoles: string[]) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(403).send("Unauthorized: No token provided.");
    }

    const idToken = authorization.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userRole = decodedToken.role;

      // Diagnostic logging
      functions.logger.info(`Authenticating request for path: ${req.path}`, {
        userEmail: decodedToken.email,
        userRole: userRole,
        allowedRoles: allowedRoles,
        hasPermission: userRole && allowedRoles.includes(userRole),
      });

      if (!userRole || !allowedRoles.includes(userRole)) {
        functions.logger.warn(
          `Authorization failed for ${decodedToken.email}. Role '${userRole}' is not in allowed roles [${allowedRoles.join(", ")}].`,
        );
        return res.status(403).send("Permission Denied: Insufficient role.");
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

adminRouter.get(
  "/users",
  authenticateAndAuthorize([
    "smartslateAdmin",
    "smartslateManager",
    "smartslateClientManager",
  ]),
  async (req: express.Request, res: express.Response) => {
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
    } catch (error) {
      functions.logger.error("Error listing users:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while listing users." });
    }
  },
);

adminRouter.get(
  "/user/:uid",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    try {
      const userRecord = await admin.auth().getUser(uid);
      const user = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        disabled: userRecord.disabled,
        metadata: {
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime,
        },
        customClaims: userRecord.customClaims,
      };
      return res.status(200).json({ user });
    } catch (error) {
      functions.logger.error(`Error fetching user ${uid}:`, error);
      if ((error as any).code === "auth/user-not-found") {
        return res.status(404).json({ error: "User not found." });
      }
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user data." });
    }
  },
);

// This new endpoint allows a smartslateAdmin to set a role for any user.
adminRouter.post(
  "/setUserRole",
  authenticateAndAuthorize(["smartslateAdmin"]),
  async (req: express.Request, res: express.Response) => {
    const { uid, role } = req.body;
    const validRoles = [
      "smartslateAdmin",
      "smartslateManager",
      "smartslateClientManager",
      "learner",
    ];

    if (!uid || !role) {
      return res.status(400).json({ error: "UID and role are required." });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }

    try {
      // 1. Set the custom claim on the Firebase Auth user.
      await admin.auth().setCustomUserClaims(uid, { role: role });

      // 2. Update the role in the user's Firestore document.
      const userRef = admin.firestore().collection("users").doc(uid);
      await userRef.set({ role: role }, { merge: true });

      return res
        .status(200)
        .json({ message: `Successfully set role '${role}' for user ${uid}` });
    } catch (error) {
      functions.logger.error(`Error setting role for user ${uid}:`, error);
      return res
        .status(500)
        .json({ error: "An error occurred while setting the user role." });
    }
  },
);

adminRouter.post(
  "/deleteUser",
  authenticateAndAuthorize(["smartslateAdmin"]),
  async (req: express.Request, res: express.Response) => {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    try {
      await admin.auth().deleteUser(uid);
      return res
        .status(200)
        .json({ message: `Successfully deleted user ${uid}` });
    } catch (error) {
      functions.logger.error(`Error deleting user ${uid}:`, error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the user." });
    }
  },
);

adminRouter.post(
  "/toggleUserStatus",
  authenticateAndAuthorize(["smartslateAdmin"]),
  async (req: express.Request, res: express.Response) => {
    const { uid, disabled } = req.body;
    if (!uid || typeof disabled !== "boolean") {
      return res
        .status(400)
        .json({ error: "UID and disabled status are required." });
    }

    try {
      await admin.auth().updateUser(uid, { disabled });
      return res.status(200).json({
        message: `Successfully ${disabled ? "disabled" : "enabled"} user ${uid}`,
      });
    } catch (error) {
      functions.logger.error(`Error updating user ${uid}:`, error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the user." });
    }
  },
);

adminRouter.post(
  "/impersonateUser",
  authenticateAndAuthorize(["smartslateAdmin"]),
  async (req: express.Request, res: express.Response) => {
    const { uid } = req.body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const adminUid = req.user.uid;

    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    try {
      // --- Security Check ---
      // Prevent an admin from impersonating another admin.
      const userToImpersonate = await admin.auth().getUser(uid);
      if (userToImpersonate.customClaims?.role === "smartslateAdmin") {
        functions.logger.warn(
          `Attempt to impersonate an admin blocked. Admin: ${adminUid}, Target: ${uid}`,
        );
        return res.status(403).json({
          error: "Permission Denied: Cannot impersonate another admin.",
        });
      }

      // --- Token Generation ---
      // Generate a custom token for the target user. This token is short-lived by default.
      const customToken = await admin.auth().createCustomToken(uid);

      functions.logger.info(`Admin ${adminUid} is impersonating user ${uid}.`);
      return res.status(200).json({ customToken });
    } catch (error) {
      functions.logger.error(
        `Error during impersonation for user ${uid}:`,
        error,
      );
      if ((error as any).code === "auth/user-not-found") {
        return res
          .status(404)
          .json({ error: "User to impersonate not found." });
      }
      return res
        .status(500)
        .json({ error: "An error occurred during impersonation." });
    }
  },
);

// --- Course Management Endpoints ---

// GET /api/admin/courses
// Fetches a list of all available courses.
// For now, this uses dummy data. In a real implementation, this would fetch from a 'courses' collection in Firestore.
adminRouter.get(
  "/courses",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    try {
      // DUMMY DATA: Replace with actual Firestore query
      const courses = [
        { id: "course-101", name: "Introduction to SvelteKit" },
        { id: "course-102", name: "Advanced Firebase" },
        { id: "course-103", name: "UI/UX Design Principles" },
        { id: "course-104", name: "DevOps for Web Developers" },
      ];
      return res.status(200).json({ courses });
    } catch (error) {
      functions.logger.error("Error fetching courses:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching courses." });
    }
  },
);

// GET /api/admin/user/:uid/enrollments
// Fetches the course enrollments for a specific user.
adminRouter.get(
  "/user/:uid/enrollments",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    try {
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found." });
      }
      const userData = userDoc.data();
      const enrollments = userData?.enrollments || []; // Default to empty array if not present
      return res.status(200).json({ enrollments });
    } catch (error) {
      functions.logger.error(
        `Error fetching enrollments for user ${uid}:`,
        error,
      );
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user enrollments." });
    }
  },
);

// POST /api/admin/user/:uid/enrollments
// Updates the course enrollments for a specific user.
adminRouter.post(
  "/user/:uid/enrollments",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    const { uid } = req.params;
    const { enrollments } = req.body; // Expects an array of course IDs

    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    if (!Array.isArray(enrollments)) {
      return res
        .status(400)
        .json({ error: "Enrollments must be an array of course IDs." });
    }

    try {
      const userRef = admin.firestore().collection("users").doc(uid);
      await userRef.update({ enrollments });
      return res
        .status(200)
        .json({ message: `Successfully updated enrollments for user ${uid}` });
    } catch (error) {
      functions.logger.error(
        `Error updating enrollments for user ${uid}:`,
        error,
      );
      return res
        .status(500)
        .json({ error: "An error occurred while updating enrollments." });
    }
  },
);

// --- Inquiry Management Endpoints ---

// GET /api/admin/inquiries
// Fetches a list of all submitted inquiries.
adminRouter.get(
  "/inquiries",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    try {
      const inquiriesSnapshot = await admin
        .firestore()
        .collection("inquiries")
        .orderBy("createdAt", "desc")
        .get();

      const inquiries = inquiriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ inquiries });
    } catch (error) {
      functions.logger.error("Error fetching inquiries:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching inquiries." });
    }
  },
);

// Mount the admin router under the /admin path
app.use("/admin", adminRouter);

// --- Public Routes ---

// POST /api/ssa-interest
// Endpoint for submitting interest in the Strategic Skills Architecture product.
app.post("/ssa-interest", async (req, res) => {
  const { name, email, phone, organization, jobTitle, companySize, message } =
    req.body;

  // --- Input Validation ---
  if (!name || !email || !phone || !organization) {
    return res.status(400).json({
      error:
        "Missing required fields: name, email, phone, and organization are required.",
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const interestData = {
      name,
      email,
      phone,
      organization,
      jobTitle: jobTitle || null,
      companySize: companySize || null,
      message: message || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin
      .firestore()
      .collection("ssa_interest")
      .add(interestData);
    functions.logger.info(`New SSA interest document created: ${docRef.id}`);
    return res
      .status(201)
      .json({ message: "Interest successfully recorded.", id: docRef.id });
  } catch (error) {
    functions.logger.error("Error recording SSA interest:", error);
    return res
      .status(500)
      .json({ error: "An internal error occurred. Please try again." });
  }
});

// --- Export the Express app as a single Cloud Function ---
// This is a more scalable pattern than exporting multiple functions.
export const api = functions.https.onRequest(app);

// --- Firestore Triggers ---
// This function triggers when a new user is created in Firebase Authentication.
// It creates a corresponding user document in Firestore with a default 'learner' role.
export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    const { uid, email, displayName } = user;
    const userRef = admin.firestore().collection("users").doc(uid);

    const newUser = {
      uid,
      email,
      displayName,
      role: "learner", // Default role for new users
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await userRef.set(newUser);
      functions.logger.info(`User document created for ${uid}`);
      // Also set the initial role as a custom claim
      await admin.auth().setCustomUserClaims(uid, { role: "learner" });
      functions.logger.info(`Custom claim set for ${uid}`);
    } catch (error) {
      functions.logger.error(`Error creating user document for ${uid}:`, error);
    }
  });

// --- Inquiry Creation Trigger ---
// This function triggers when a new document is created in the 'inquiries' collection.
// It triggers when a new inquiry is created, then creates a corresponding
// email document in the 'mail' collection. The "Trigger Email from Firestore"
// extension then picks up this document and sends the email.
export const onInquiryCreate = functions.firestore
  .document("inquiries/{inquiryId}")
  .onCreate(async (snap) => {
    const inquiryData = snap.data();
    if (!inquiryData) {
      functions.logger.error(
        `No data associated with the inquiry document: ${snap.id}`,
      );
      return;
    }

    // The payload for the email document.
    // The 'to' and 'cc' fields are arrays of email addresses.
    const mailPayload = {
      to: ["sanam@smartslate.io"],
      cc: ["jitin@smartslate.io"],
      message: {
        subject: `🚀 New SmartSlate Inquiry: ${inquiryData.name}`,
        html: `
          <h1>New Contact Inquiry Received</h1>
          <p>A new inquiry has been submitted via the website contact form.</p>
          <ul>
            <li><strong>Name:</strong> ${inquiryData.name}</li>
            <li><strong>Email:</strong> ${inquiryData.email}</li>
            <li><strong>Company:</strong> ${inquiryData.company || "Not provided"}</li>
            <li><strong>Inquiry Type:</strong> ${inquiryData.inquiryType}</li>
          </ul>
          <hr>
          <h3>Message:</h3>
          <p>${inquiryData.message}</p>
          <br>
          <p><em>This is an automated notification.</em></p>
        `,
      },
    };

    try {
      // Create a new document in the 'mail' collection.
      await admin.firestore().collection("mail").add(mailPayload);
      functions.logger.info(
        `Successfully queued email for inquiry: ${snap.id}`,
      );
    } catch (error) {
      functions.logger.error(
        `Error queuing email for inquiry ${snap.id}:`,
        error,
      );
    }
  });

// --- SSA Interest Creation Trigger ---
// This function triggers when a new document is created in the 'ssa_interest' collection.
// It sends an email notification to the sales team.
export const onSSAInterestCreate = functions.firestore
  .document("ssa_interest/{interestId}")
  .onCreate(async (snap) => {
    const interestData = snap.data();
    if (!interestData) {
      functions.logger.error(
        `No data associated with the SSA interest document: ${snap.id}`,
      );
      return;
    }

    const mailPayload = {
      to: ["sanam@smartslate.io"],
      cc: ["jitin@smartslate.io"],
      message: {
        subject: `🔥 New SSA Lead: ${interestData.name} from ${interestData.organization}`,
        html: `
          <h1>New Strategic Skills Architecture Lead</h1>
          <p>A new lead has been captured for the SSA product.</p>
          <ul>
            <li><strong>Name:</strong> ${interestData.name}</li>
            <li><strong>Email:</strong> ${interestData.email}</li>
            <li><strong>Phone:</strong> ${interestData.phone}</li>
            <li><strong>Organization:</strong> ${interestData.organization}</li>
            <li><strong>Job Title:</strong> ${interestData.jobTitle || "Not provided"}</li>
            <li><strong>Company Size:</strong> ${interestData.companySize || "Not provided"}</li>
          </ul>
          <hr>
          <h3>Message:</h3>
          <p>${interestData.message || "No message provided."}</p>
          <br>
          <p><em>This is an automated notification. Please follow up promptly.</em></p>
        `,
      },
    };

    try {
      await admin.firestore().collection("mail").add(mailPayload);
      functions.logger.info(
        `Successfully queued email for SSA interest: ${snap.id}`,
      );
    } catch (error) {
      functions.logger.error(
        `Error queuing email for SSA interest ${snap.id}:`,
        error,
      );
    }
  });
