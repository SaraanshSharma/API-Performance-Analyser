import { Router, Request, Response } from "express";
import { checkApiPerformance } from "../services/apiMonitor";
import { ApiLog } from "../models/ApiLog";
import { PipelineStage } from "mongoose";

const router = Router();

router.post("/check", async (req: Request, res: Response) => {
  try {
    const { url, method } = req.body;

    if (!url) {
      res.status(400).json({ error: "API URL is required" });
      return;
    }

    const result = await checkApiPerformance(url, method || "GET");
    res.json(result);
  } catch (error) {
    console.error("Error checking API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logs", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    const startDate = new Date(from);
    const endDate = new Date(to);
    const query: any = {};
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = startDate;
      if (to) query.timestamp.$lt = endDate;
    }
    const result = await ApiLog.find(query, { _id: 0 }).sort({ timestamp: -1 });
    res.json(result);
  } catch (error) {
    console.error("Error checking API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/average", async (req: Request, res: Response) => {
  try {
    const { url, from, to } = req.body;
    const startDate = new Date(from);
    const endDate = new Date(to);
    if (!url) {
      res.status(400).json({ error: "API URL is required" });
      return;
    }

    const pipeline: any[] = [
      {
        $match: {
          url: url,
        },
      },
      {
        $group: {
          _id: "$url",
          averageResponseTime: { $avg: "$responseTime" },
        },
      },
      {
        $project: {
          _id: 0,
          url: "$_id",
          averageResponseTime: 1,
        },
      },
    ];

    if (from || to) {
      pipeline[0].$match.timestamp = {};
      if (from) pipeline[0].$match.timestamp.$gte = startDate;
      if (to) pipeline[0].$match.timestamp.$lt = endDate;
    }
    const result = await ApiLog.aggregate(pipeline).exec();
    if (result.length == 0) {
      res.json({ message: "No API calls recorded for this endpoint." });
      return;
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Error checking API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
