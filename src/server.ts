import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB";
import { apiLogger } from "./middlewares/apiLogger";
import analysisRoutes from "./routes/analysis";
import monitorRoutes from "./routes/monitor";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(apiLogger);

app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/analysis", analysisRoutes);
app.use("/monitor", monitorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
