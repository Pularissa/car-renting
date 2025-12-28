import express from "express";
import { createPurchase, getUserPurchases, getOwnerPurchases, updatePurchaseStatus } from "../controllers/purchaseController.js";
import { protect } from "../middleware/auth.js";

const purchaseRouter = express.Router();

purchaseRouter.post('/create', protect, createPurchase);
purchaseRouter.get('/user', protect, getUserPurchases);
purchaseRouter.get('/owner', protect, getOwnerPurchases);
purchaseRouter.put('/status/:id', protect, updatePurchaseStatus);

export default purchaseRouter;