import express from "express";
import slugify from "slugify";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Brand from "../models/brand.js";
import uploadToCloudinary from "../middleware/cloudinaryUpload.js";

export const CreateProduct = async (req, res) => {
    let response = {
        success: false,
        message: "",
        errMessage: ""
    };

    try {
        let productUrl;
        const body = req.body;
        const productPhoto = req.file;

        // Check if product already exists for the same brand
        const productExists = await Product.findOne({
            productname: body.productname,
            brandname: body.brandname
        });
        
        if (productExists) {
            response.message = "Product already exists";
            response.errMessage = "Product with the same name already exists for this brand";
            return res.status(400).json(response);
        }

        // Find Brand
        const brand = await Brand.findOne({
            brandname: body.brandname,
            isDeleted: false
        });

        if (!brand) {
            response.message = "Brand not found";
            response.errMessage = `Brand '${body.brandname}' does not exist`;
            return res.status(404).json(response);
        }

        if (productPhoto != null){
            const normalizedBrand = req.body.brandname.trim().replace(/[^a-zA-Z0-9]/g, "");
            const folderPath = `Rainbow-gold/${normalizedBrand}`;
            const uploadImage = await uploadToCloudinary(productPhoto.buffer, folderPath);
            productUrl = uploadImage.secure_url;
        }

        // Create Product
        const newProduct = new Product({
            productname: body.productname,
            slug: generateUniqueSlug(body.productname),
            productphotolink: productUrl,
            productprice: body.productprice,
            flavor: body.flavor,
            weight: body.weight,
            packagingtype: body.packagingtype,
            pieces: body.pieces,
            brandid: brand._id,
            brandname: brand.brandname,
            isDeleted: body.isDeleted ?? false,
            isNewLaunch: body.isNewLaunch ?? false
        });

        const savedProduct = await newProduct.save();

        response.success = true;
        response.message = "Product added successfully";
        response.data = savedProduct;

        return res.status(201).json(response);

    } catch (error) {
        response.success = false;
        response.message = "Failed to add product";
        response.errMessage = error.message;

        return res.status(500).json(response);
    }
};

// get all products by brands
export const GetAllProductsByBrand = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    try {
        const brandSlug = req.query.slug;
        const brand = await Brand.findOne({ slug: brandSlug, isDeleted: false });

        const products = await Product.find({ brandid: brand._id, isDeleted: false });
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
        const currentSlug = req.query.slug;
        const body = req.body;

        if(body.productname){
            req.body.slug = generateUniqueSlug(body.productname);
        }

        const updateProductDetails = ({
            productname: body.productname,
            slug: req.body.slug,
            productphotolink: body.productphotolink,
            productprice: body.productprice,
            flavor: body.flavor,
            weight: body.weight,
            packagingtype: body.packagingtype,
            pieces: body.pieces
        });
        const updateProduct = await Product.findOneAndUpdate({ slug: currentSlug }, updateProductDetails, { returnDocument: 'after' }, { isDeleted: false });

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
        console.log("inside delete product controller", req);
        const product = await Product.findOne({ slug: req.query.slug });

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

// get all products
export const GetAllProducts = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    const products = await Product.find({ isDeleted: false });
    if (!products) {
      response.success = false;
      response.message = "Failed to fetch products!!";
      response.errMessage = "No products found";
      return res.status(400).json(response);
    }
    response.success = true;
    response.message = "Products fetched successfully!!";
    response.count = products.length;
    response.data = products;
    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Failed to fetch products!!";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

const generateUniqueSlug = (productName) => {
      const slug = slugify(productName, {
        lower: true,
        strict: true,
        trim: true,
      });

      const unique = new mongoose.Types.ObjectId().toString().slice(-6);

      return `${unique}-${slug}-${unique}`;
};