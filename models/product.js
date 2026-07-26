import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  productphotolink: {
    type: String,
    required: false,
  },
  productprice: {
    type: Number,
    required: false,
  },
  flavor: {
    type: String,
    required: false,
  },
  weight: {
    type: String,
    required: false,
  },
  packagingtype: {
    type: String,
    required: false,
  },
  pieces: {
    type: Number,
    required: false,
  },
  brandid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isNewLaunch: {
    type: Boolean,
    default: false,
  },
});
const Product = mongoose.model("Product", productSchema);
export default Product;
