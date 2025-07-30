const admin = require("firebase-admin");
const serviceAccount = require("../.firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = "jitin@smartslate.io";
const newPassword = "Vtvt@1234";

(async () => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    console.log(`Successfully updated password for user: ${email}`);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  }
})();
