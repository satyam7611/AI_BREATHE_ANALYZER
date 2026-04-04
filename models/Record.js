import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  patientId: String,
  cid: String,
  data: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Record", recordSchema);