import mongoose from "mongoose";

const ApiLogSchema = new mongoose.Schema(
  {
    url: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
    timestamp : Date
  },
  {
    collection: "ApiLog",
    timestamps: false,
  }
);

export const ApiLog = mongoose.model("ApiLog", ApiLogSchema);
