import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";

export const createUserDocument = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;
  const userRef = admin.firestore().collection("users").doc(uid);

  const newUser = {
    uid,
    email,
    displayName,
    role: "learner",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await userRef.set(newUser);
  await admin.auth().setCustomUserClaims(uid, { role: "learner" });
});