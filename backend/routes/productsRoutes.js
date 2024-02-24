import express from "express"
import { createProduct, createProductReview, deleteProduct, deleteProductReview, getProductByID, getProductReviews, getProducts, updateProduct } from "../controllers/productControllers.js"
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router()
router.route('/').get(getProducts).post(protect, admin, createProduct) 

router
  .route('/:id')
  .get(getProductByID)
  .put(protect, admin, updateProduct)
  .delete(protect, admin,deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id/reviews').get(getProductReviews)
router
  .route('/:productId/reviews/:reviewId')
  .delete(protect, admin, deleteProductReview)

export default router