import express from "express";
import bcrypt from "bcrypt";
import Brand from "../models/Brand.js";
import slugify from "slugify"; 

//create brand
export const createBrand = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {
    const { brandname, brandlogo, numberofproducts } = req.body;

    // Check if brand already exists
    const brandExists = await Brand.findOne({ brandname });
    if (brandExists) {
      response.errMessage = "A brand with this name already exists";
      return res.status(400).json(response);
    }

    // 2. Generate the slug from the brandname
    const generatedSlug = slugify(brandname, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Create and save the new brand, including the slug
    const brand = new Brand({
      brandname,
      slug: generatedSlug, // 3. Save the slug to the database
      brandlogo,
      numberofproducts,
    });
    const savedBrand = await brand.save();

    // Set success response
    response.success = true;
    response.message = "Brand created successfully";
    response.data = savedBrand; // Attach the created data

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
    // 4. Look for the slug in the URL parameters instead of brandname
    const currentSlug = req.query.slug; 

    // 5. If the request body includes a new brandname, generate a new slug for it
    if (req.body.brandname) {
      req.body.slug = slugify(req.body.brandname, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    const updatedBrand = await Brand.findOneAndUpdate(
      { slug: currentSlug }, // 6. Query the database using the slug
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      response.errMessage = "Brand not found";
      return res.status(404).json(response);
    }

    response.success = true;
    response.message = "Brand updated successfully";
    response.data = updatedBrand;

    return res.status(200).json(response);
  } catch (error) {
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