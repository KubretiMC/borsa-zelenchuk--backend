require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import * as admin from 'firebase-admin';
import productRoutes from './routes/productRoutes';
import productFiltersRoutes from './routes/productFiltersRoutes';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express();
const port = process.env.PORT || 3001;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/productFilters', productFiltersRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
