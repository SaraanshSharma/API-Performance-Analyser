import mongoose from "mongoose";

const ApiLogSchema = new mongoose.Schema(
  {
    url: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
  },
  {
    collection: "ApiLog",
    timestamps: true,
  }
);

export const ApiLog = mongoose.model("ApiLog", ApiLogSchema);
