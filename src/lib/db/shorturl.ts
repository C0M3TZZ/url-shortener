import mongoose from "mongoose";
const schema = mongoose.Schema;

const urlSchema = new schema({
  url: String,
  path: String,
  createdAt: Date,
});

const urlModel = mongoose.model("url", urlSchema);
export default urlModel;
