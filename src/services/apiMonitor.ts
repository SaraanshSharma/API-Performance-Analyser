import axios from "axios";
import { ApiLog } from "../models/ApiLog";

export const checkApiPerformance = async (url: string, method: string = "GET") => {
  try {
    const startTime = Date.now();
    const response = await axios({ url, method });
    const responseTime = Date.now() - startTime;
    await ApiLog.create({
      url,
      method,
      statusCode: response.status,
      responseTime,
    });

    return { url, responseTime, status: response.status };
  } catch (error: any) {
    return { url, responseTime: null, status: error.response?.status || 500 };
  }
};
