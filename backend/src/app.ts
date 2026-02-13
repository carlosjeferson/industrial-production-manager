import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import productRoutes from "./routes/productRoutes.js";
import rawMaterialRoutes from "./routes/rawMaterialRoutes.js";
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/raw-materials', rawMaterialRoutes);

app.use(errorHandler);

export default app;
