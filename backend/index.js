import express from 'express';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productRouter from './routes/productsRoutes.js';
import uploadRouter from './routes/uploads.js';
import ordersRouter from './routes/ordersRoute.js';
import connectDB from './config/db.js';

//configuration
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/uploads",uploadRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
//routes
app.get('/', (req, res) => {
    res.send('Welcome to the backend server! 🚀');
});
 
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
