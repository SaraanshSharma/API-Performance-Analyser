import { Request, Response, NextFunction } from "express";
import { ApiLog } from "../models/ApiLog";

export async function apiLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on("finish", async () => {
    const responseTime = Date.now() - start;
    await ApiLog.create({
      url: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      timestamp : Date.now()
    });
  });

  next();
}
