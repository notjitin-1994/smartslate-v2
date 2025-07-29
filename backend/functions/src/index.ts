import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';

admin.initializeApp();

// Configure CORS to allow requests from your frontend origin
const corsHandler = cors({
  origin: [
    'http://localhost:5173',
    'https://smartslate.io/',
    'https://www.smartslate.io/'
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
  preflightContinue: true
});

/**
 * Middleware to authenticate the user and check for admin privileges.
 * It verifies the Firebase ID token from the Authorization header.
 */
const authenticateAndAuthorize = async (req: any, res: any, next: any) => {
  logger.info('Verifying token...');
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    logger.error('No token provided.');
    res.status(403).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      logger.error('User is not an admin.');
      res.status(403).send('Permission Denied');
      return;
    }
    req.user = decodedToken; // Add user to the request object
    next();
  } catch (error) {
    logger.error('Error while verifying token:', error);
    res.status(403).send('Unauthorized');
  }
};

/**
 * A wrapper for admin functions that applies CORS and authentication middleware.
 * @param handler The core function logic to execute after middleware checks.
 * @returns An HTTPS function handler.
 */
const createAdminFunction = (handler: (req: any, res: any) => void) => {
  return onRequest((req, res) => {
    corsHandler(req, res, () => {
      authenticateAndAuthorize(req, res, () => {
        handler(req, res);
      });
    });
  });
};

// --- Admin Functions ---

export const listUsers = createAdminFunction(async (req, res) => {
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
  } catch (error) {
    logger.error('Error listing users:', error);
    res.status(500).json({ error: 'An error occurred while listing users.' });
  }
});

export const setAdminClaim = createAdminFunction(async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'UID is required.' });
    return;
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.status(200).json({ message: `Successfully set admin claim for user ${uid}` });
  } catch (error) {
    logger.error(`Error setting admin claim for user ${uid}:`, error);
    res.status(500).json({ error: 'An error occurred while setting the admin claim.' });
  }
});

export const deleteUser = createAdminFunction(async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'UID is required.' });
    return;
  }

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: `Successfully deleted user ${uid}` });
  } catch (error) {
    logger.error(`Error deleting user ${uid}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});
