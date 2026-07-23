import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
{
    brandname:{
        type: String,
        required: true,
        unique: true,
    },
    brandlogo:{
        type: String,
        required: false
    },
    numberofproducts:{
        type: Number,
        required: true,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;