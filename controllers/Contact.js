import express from 'express';
import Contact from '../models/Contact.js';

export const CreateContact = async (req, res) => {
    let response = { success: false, message: "", errMessage: "" };

    const body = req.body;

    try {
        const newContact = new Contact({
            name: body.name,
            phonenumber: body.phonenumber,
            email: body.email,
            subject: body.subject,
            message: body.message
        })
        const saveContact = await newContact.save();
        response.success = true;
        response.message = "Contact created successfully!!";
        response.errMessage = "";
        return res.status(201).json(response);

        if (!saveContact) {
            response.success = false;
            response.message = "Failed to create contact!!";
            response.errMessage = error.message;
            return res.status(400).json(response);
        }
    }
    catch (error) {
        response.success = false;
        response.message = "Failed to create contact!!";
        response.errMessage = error.message;
        return res.status(500).json(response);
    }
}