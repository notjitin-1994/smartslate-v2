const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Download this from your Firebase project settings

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address as an argument.");
  process.exit(1);
}

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`Successfully set admin claim for ${email}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });
