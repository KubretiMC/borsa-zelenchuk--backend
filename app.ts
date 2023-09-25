const admin = require('firebase-admin');
const express = require('express');
const app = express();

const serviceAccount = require('./../KEYBORSA/key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Other Firebase configurations like databaseURL if needed
});
  
const db = admin.firestore();

// Your Express app code and routes go here...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
