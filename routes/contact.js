import express from "express";
import { CreateContact } from "../controllers/Contact.js";

const router = express.Router();

router.post("/addContact", CreateContact);
export default router;
