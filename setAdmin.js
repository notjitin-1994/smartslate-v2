const admin = require("firebase-admin");
// IMPORTANT: Replace with the actual path to your service account key file.
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = "jitin@smartslate.io";
const role = "smartslateAdmin";

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    console.log(`Successfully set role '${role}' for user ${email}`);
  } catch (error) {
    console.error("Error setting custom claim:", error);
  }
})();
