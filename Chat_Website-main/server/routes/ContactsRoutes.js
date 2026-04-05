import { Router } from "express";
import { SearchContacts, getAllContacts, getContactsforDMList } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


const contactsRoutes = Router();
contactsRoutes.post("/search",verifyToken, SearchContacts);
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactsforDMList);
contactsRoutes.get("/get-all-contacts",verifyToken,getAllContacts);

export default contactsRoutes;
