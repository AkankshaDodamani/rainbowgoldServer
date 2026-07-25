import express from "express";
import { CreateContact, GetAllContact } from "../controllers/Contact.js";

const router = express.Router();

router.post("/addContact", CreateContact);
router.get("/getAllContacts", GetAllContact);
export default router;
