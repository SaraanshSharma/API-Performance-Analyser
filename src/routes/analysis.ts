import { Router } from "express";
import { ApiLog } from "../models/ApiLog";

const router = Router();

router.get("/stats", async (req, res) => {
  const totalRequests = await ApiLog.countDocuments();
  const avgResponseTime = await ApiLog.aggregate([
    { $group: { _id: null, avgTime: { $avg: "$responseTime" } } }
  ]).exec();

  res.json({
    totalRequests,
    avgResponseTime: avgResponseTime[0]?.avgTime || 0
  });
});

export default router;
