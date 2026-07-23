import express from 'express';
import Product from '../models/Product.js';
import Brand from '../models/Brand.js';

// create product
export const CreateProduct = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    try{
        const body = req.body;

        const productExists = await Product.findOne({ productname: body.productname });
        if (productExists) {
            response.success = false;
            response.message = "Product already exists";
            response.errMessage = "Product with the same name already exists";
            return res.status(400).json(response);
        }

        const brandId = await Brand.findOne({ brandname: body.brandname });

        const newProduct = new Product({
            productname: body.productname,
            productphotolink: body.productphotolink,
            productprice: body.productprice,
            flavor: body.flavor,
            weight: body.weight,
            packagingtype: body.packagingtype,
            pieces: body.pieces,
            brandid: brandId._id
        });
        const saveProduct = await newProduct.save();
        if(!saveProduct){
            response.success = false;
            response.message = "Failed to add product!!";
            response.errMessage = "Error occurred while saving the product";
            return res.status(400).json(response);
        }
        response.success = true;
        response.message = "Product added successfully!!";
        return res.status(200).json(response);
    }
    catch (error) {
        response.success = false;
        response.message = "Failed to add product!!";
        response.errMessage = error.message;
        return res.status(500).json(response);
    }
}

// get all products
export const GetAllProductsByBrand = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    try {
        const brandName = req.params.brandname;
        const brand = await Brand.findOne({ brandname: brandName });

        const products = await Product.find({ brandid: brand._id, isDeleted: false });
        if (!products || products.length === 0) {
            response.success = false;
            response.message = "No products found for the specified brand";
            response.errMessage = "No products found";
            return res.status(404).json(response);
        }
        response.success = true;
        response.message = "Products found successfully";
        response.count = products.length;
        response.data = products;
        return res.status(200).json(response);
    }
    catch (error) {
        response.success = false;
        response.message = "Failed to fetch products!!";
        response.errMessage = error.message;
        return res.status(500).json(response);
    }
}

// update product
export const UpdateProduct = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    try {
        const productname = req.params.productname.split('-').join(' ');
        const body = req.body;

        const updateProductDetails = ({
            productname: body.productname,
            productphotolink: body.productphotolink,
            productprice: body.productprice,
            flavor: body.flavor,
            weight: body.weight,
            packagingtype: body.packagingtype,
            pieces: body.pieces
        });
        const updateProduct = await Product.findOneAndUpdate({ productname: productname }, updateProductDetails, { returnDocument: 'after' }, { isDeleted: false });

        if (!updateProduct) {
            response.success = false;
            response.message = "Failed to update product!!";
            response.errMessage = "Product not found or update failed";
            return res.status(400).json(response);
        }
        response.success = true;
        response.message = "Product updated successfully!!";
        response.data = updateProduct;
        return res.status(200).json(response);
    }
    catch (error) {
        response.success = false;
        response.message = "Failed to update product!!";
        response.errMessage = error.message;
        return res.status(500).json(response);
    }
}

// delete product
export const DeleteProduct = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    try{
        const product = await Product.findOne({ productname: req.params.productname.split('-').join(' ') });

        const deleteProduct = await Product.findByIdAndUpdate(product._id, { isDeleted: true }, { new: true });
        if (!deleteProduct) {
            response.success = false;
            response.message = "Failed to delete product!!";
            response.errMessage = "Product not found or delete failed";
            return res.status(400).json(response);
        }
        response.success = true;
        response.message = "Product deleted successfully!!";
        return res.status(200).json(response);
    }
    catch (error) {
        response.success = false;
        response.message = "Failed to delete product!!";
        response.errMessage = error.message;
        return res.status(500).json(response);
    }
}