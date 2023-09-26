import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import registerRoutes from './routes/userRoutes';
import * as admin from 'firebase-admin';

const serviceAccount = require('./../../KEYBORSA/key.json');

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Other Firebase configurations like databaseURL if needed
  });

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/register', registerRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
