import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();
const app = express();

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

app.use(cors(corsOptions));

// --- Authentication Middleware ---
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

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).send("Permission Denied: Insufficient role.");
      }

      // @ts-ignore
      req.user = decodedToken;
      return next();
    } catch (error) {
      logger.error("Error while verifying token:", error);
      return res.status(403).send("Unauthorized: Invalid token.");
    }
  };

// --- API Routes ---
const adminRouter = express.Router();

adminRouter.get(
  "/stats",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (_req: express.Request, res: express.Response) => {
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

      const solaraInterestsSnapshot = await admin
        .firestore()
        .collection("solara_interest")
        .where("createdAt", ">=", startOfMonth)
        .get();
      const newSolaraInterestsThisMonth = solaraInterestsSnapshot.size;

      const ssaInterestsSnapshot = await admin
        .firestore()
        .collection("ssa_interest")
        .where("createdAt", ">=", startOfMonth)
        .get();
      const newSSAInterestsThisMonth = ssaInterestsSnapshot.size;

      return res.status(200).json({
        totalUsers,
        totalCourses,
        newInquiriesThisMonth,
        newSolaraInterestsThisMonth,
        newSSAInterestsThisMonth,
      });
    } catch (error) {
      logger.error("Error fetching dashboard stats:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching dashboard stats." });
    }
  },
);

adminRouter.get(
  "/stats/user-signups",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (_req: express.Request, res: express.Response) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30,
      );

      const usersSnapshot = await admin
        .firestore()
        .collection("users")
        .where("createdAt", ">=", thirtyDaysAgo)
        .get();

      const dailySignups = new Map<string, number>();
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split("T")[0];
        dailySignups.set(dateString, 0);
      }

      usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.createdAt?.toDate) {
          const creationDate = user.createdAt.toDate();
          const dateString = creationDate.toISOString().split("T")[0];
          if (dailySignups.has(dateString)) {
            dailySignups.set(dateString, dailySignups.get(dateString)! + 1);
          }
        }
      });

      const chartData = Array.from(dailySignups.entries())
        .map(([date, count]) => ({ date, count }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      return res.status(200).json(chartData);
    } catch (error) {
      logger.error("Error fetching user signup stats:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching user signup stats." });
    }
  },
);

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
      logger.error("Error listing users:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while listing users." });
    }
  },
);

adminRouter.get(
  "/solara-interests",
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    try {
      const solaraInterestsSnapshot = await admin
        .firestore()
        .collection("solara_interest")
        .orderBy("createdAt", "desc")
        .get();
      
      const interests = solaraInterestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return res.status(200).json({ interests });
    } catch (error) {
      logger.error("Error fetching Solara interests:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching Solara interests." });
    }
  },
);

adminRouter.get(
  "/ssa-interests", 
  authenticateAndAuthorize(["smartslateAdmin", "smartslateManager"]),
  async (req: express.Request, res: express.Response) => {
    try {
      const ssaInterestsSnapshot = await admin
        .firestore()
        .collection("ssa_interest")
        .orderBy("createdAt", "desc")
        .get();
      
      const interests = ssaInterestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return res.status(200).json({ interests });
    } catch (error) {
      logger.error("Error fetching SSA interests:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching SSA interests." });
    }
  },
);

app.use("/admin", adminRouter);

export const api = onRequest(app);

export const handleFormSubmission = onCall(async (request) => {
  const { formData, type } = request.data;

  if (!type || !formData) {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with 'type' and 'formData' arguments.",
    );
  }

  const uid = request.auth?.uid || "anonymous";

  const inquiry: { [key: string]: any } = {
    name: formData.name,
    email: formData.email,
    type: type,
    userId: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection("inquiries").add(inquiry);
  return { success: true };
});

export { createUserDocument } from "./v1-functions";

export const onInquiryCreate = onDocumentCreated("inquiries/{inquiryId}", async (event) => {
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

export const onSSAInterestCreate = onDocumentCreated("ssa_interest/{interestId}", async (event) => {
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
