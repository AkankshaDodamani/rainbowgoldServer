import express from "express";
import bcrypt from "bcrypt";
import Brand from "../models/brand.js";
import slugify from "slugify"; 
import uploadToCloudinary from "../middleware/cloudinaryUpload.js";
import mongoose from "mongoose";

//create brand
export const createBrand = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    let brandLogoUrl;
    const body = req.body;
    const brandPhoto = req.file;

    // Check if brand already exists
    const brandExists = await Brand.findOne({ brandname: body.brandname });
    if (brandExists) {
      response.errMessage = "A brand with this name already exists";
      return res.status(400).json(response);
    }

    if (brandPhoto != null) {
      const normalizedBrand = req.body.brandname.trim().replace(/[^a-zA-Z0-9]/g, "");
      const folderPath = `Rainbow-gold/${normalizedBrand}`;
      const uploadImage = await uploadToCloudinary(brandPhoto.buffer, folderPath);
      brandLogoUrl = uploadImage.secure_url;
    }

    // Create and save the new brand, including the slug
    const newBrand = new Brand({
      brandname: body.brandname,
      slug: generateUniqueSlug(body.brandname),
      brandlogo: brandLogoUrl,
      numberofproducts: body.numberofproducts,
    });
    const savedBrand = await newBrand.save();

    // Set success response
    response.success = true;
    response.message = "Brand created successfully";
    response.data = savedBrand;

    return res.status(201).json(response);
  } catch (error) {
    response.message = "Failed to create brand";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export const getAllBrands = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    const brands = await Brand.find({isDeleted: false});
    
    response.success = true;
    response.message = "Brands fetched successfully";
    response.data = brands;

    return res.status(200).json(response);
  } catch (error) {
    response.message = "Failed to fetch brands";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export const getBrandBySlug = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    const { slug } = req.query;
    const brand = await Brand.findOne({ slug });

    if (!brand) {
      response.errMessage = "Brand not found";
      return res.status(404).json(response);
    }

    response.success = true;
    response.message = "Brand fetched successfully";
    response.data = brand;

    return res.status(200).json(response);
  } catch (error) {
    response.message = "Error fetching brand";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export const updateBrand = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    const currentSlug = req.query.slug;
    let body = req.body || {};
    let fileBody = req.file;

    const updatedBrand = {};

    if (body.brandname) {
      updatedBrand.brandname = body.brandname;
      updatedBrand.slug = generateUniqueSlug(body.brandname);
    }

    if (fileBody) {
      const normalizedBrand = body.brandname.trim().replace(/[^a-zA-Z0-9]/g, "");
      const folderPath = `Rainbow-gold/${normalizedBrand}`;
      const brandLogoUrl = await uploadToCloudinary(fileBody.buffer, folderPath);
      updatedBrand.brandlogo = brandLogoUrl.secure_url;
    }

    const updateBrand = await Brand.findOneAndUpdate({ slug: currentSlug }, updatedBrand, { returnDocument: 'after' }, { isDeleted: false });

    
    if (!updatedBrand) {
      response.errMessage = "Brand not found";
      return res.status(404).json(response);
    }

    response.success = true;
    response.message = "Brand updated successfully";
    response.data = updatedBrand;

    return res.status(200).json(response);
  } catch (error) {
    console.error("Update Brand Error:", error);
    response.message = "Failed to update brand";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export const deleteBrand = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    // 7. Find the brand using the slug from the URL
    const brand = await Brand.findOne({ slug: req.query.slug });

    if (!brand) {
      response.success = false;
      response.message = "Failed to delete brand";
      response.errMessage = "Brand not found";
      return res.status(404).json(response);
    }

    const deletedBrand = await Brand.findByIdAndUpdate(
      brand._id,
      { isDeleted: true },
      { new: true }
    );

    response.success = true;
    response.message = "Brand deleted successfully";

    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Failed to delete brand";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

const generateUniqueSlug = (brandName) => {
      const slug = slugify(brandName, {
        lower: true,
        strict: true,
        trim: true,
      });

      const unique = new mongoose.Types.ObjectId().toString().slice(-6);

      return `${unique}-${slug}-${unique}`;
};