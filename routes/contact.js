import express from "express";
import { CreateContact, GetAllContact } from "../controllers/Contact.js";
import { verifyToken } from "../middleware/generateToken.js"; 
const router = express.Router();

router.post("/addContact", CreateContact);
router.get("/getAllContacts",verifyToken, GetAllContact);
export default router;
