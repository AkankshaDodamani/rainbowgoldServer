import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    productphotolink: {
        type: String,
        required: false
    },
    productprice: {
        type: Number,
        required: true
    },
    flavor: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    packagingtype: {
        type: String,
        required: true
    },
    pieces: {
        type: Number,
        required: true
    },
    brandid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isNewLaunch:{
        type: Boolean,
        default: false
    }
});
const Product = mongoose.model('Product', productSchema);
export default Product;