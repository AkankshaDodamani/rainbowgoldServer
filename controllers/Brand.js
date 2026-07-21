import express from "express";
import bcrypt from "bcrypt";
import Brand from "../models/Brand.js";

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

    // Create and save the new brand
    const brand = new Brand({
      brandname,
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
    const brands = await Brand.find({});
    
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

// export const getBrandById = async (req, res) => {
//   let response = { success: false, message: "", errMessage: "" };

//   try {
//     const brand = await Brand.findById(req.params.id);

//     if (!brand) {
//       response.errMessage = "Brand not found";
//       return res.status(404).json(response);
//     }

//     response.success = true;
//     response.message = "Brand fetched successfully";
//     response.data = brand;

//     return res.status(200).json(response);
//   } catch (error) {
//     response.message = "Error fetching brand";
//     response.errMessage = error.message;
//     return res.status(500).json(response);
//   }
// };

export const updateBrand = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  try {

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
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
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

    if (!deletedBrand) {
      response.errMessage = "Brand not found";
      return res.status(404).json(response);
    }

    response.success = true;
    response.message = "Brand deleted successfully";

    return res.status(200).json(response);
  } catch (error) {
    response.message = "Failed to delete brand";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};
