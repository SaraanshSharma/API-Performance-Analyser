import { Router } from "express";
import { ApiLog } from "../models/ApiLog";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const totalRequests = await ApiLog.countDocuments();
    const avgResponseTime = await ApiLog.aggregate([
      { $group: { _id: null, avgTime: { $avg: "$responseTime" } } },
    ]).exec();

    res.json({
      totalRequests,
      avgResponseTime: avgResponseTime[0]?.avgTime || 0,
    });
  } catch (error) {
    console.log("Error caused while running stats api", error);
    res.status(500).json(error);
  }
});

export default router;
