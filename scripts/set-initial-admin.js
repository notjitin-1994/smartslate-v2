const admin = require("firebase-admin");

// IMPORTANT: You must download your own service account key file from the
// Firebase console and place it in a secure directory.
// Go to Project settings > Service accounts > Generate new private key
// Update the path to your service account key file below.
// Make sure this file is NOT committed to your version control.
const serviceAccount = require("../.firebase/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/set-initial-admin.js <email> <password>");
  process.exit(1);
}

if (password.length < 6) {
  console.error("Error: Password must be at least 6 characters long.");
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();
const adminRole = "smartslate-admin";

(async () => {
  let uid;
  try {
    try {
      // Check if user already exists
      const userRecord = await auth.getUserByEmail(email);
      uid = userRecord.uid;
      console.log(`User ${email} already exists. UID: ${uid}.`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // If user does not exist, create a new one
        console.log(`User ${email} not found. Creating new user...`);
        const userRecord = await auth.createUser({
          email: email,
          password: password,
          emailVerified: true, // Consider the security implications of this
        });
        uid = userRecord.uid;
        console.log(`Successfully created new user: ${email} (UID: ${uid})`);
      } else {
        // Propagate other errors
        throw error;
      }
    }

    // Set custom user claims for role-based access control
    await auth.setCustomUserClaims(uid, { role: adminRole });
    console.log(`Custom claim '${adminRole}' set for user ${email}.`);

    // Create/update user document in Firestore
    await db.collection("users").doc(uid).set(
      {
        email: email,
        role: adminRole,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    console.log(
      `Firestore document for user ${email} created/updated with role '${adminRole}'.`,
    );
    console.log("\n✅ Initial admin setup complete.");
    console.log(
      "   The user can now sign in with the provided credentials and will have admin privileges.",
    );
  } catch (error) {
    console.error("Error setting up initial admin user:", error.message);
    process.exit(1);
  }
})();
