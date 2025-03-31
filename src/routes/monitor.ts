import { Router, Request, Response } from "express";
import { checkApiPerformance } from "../services/apiMonitor";

const router = Router();

router.post("/check", async (req: Request, res: Response) => {
  try {
    const { url, method } = req.body;

    if (!url) {
      res.status(400).json({ error: "API URL is required" });
    }

    const result = await checkApiPerformance(url, method || "GET");
    res.json(result);
  } catch (error) {
    console.error("Error checking API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
