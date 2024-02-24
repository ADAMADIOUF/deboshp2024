
import Products from "../models/Products.js"
import asyncHandler from '../middleware/asyncHandler.js'
const createProduct = asyncHandler( async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      ratings,
      images,
      category,
      seller,
      numReviews,
      stock,
    
    } = req.body

    
    const newProduct = new Products({
      name,
      price,
      description,
      ratings,
      images,
      category,
      seller,
      numReviews,
      stock,
      
    })

    
    const createdProduct = await newProduct.save()
    res.status(201).json({
      success: true,
      data: createdProduct,
    })
  } catch (error) {
    
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})
const getProducts = asyncHandler(async (req, res) => {
  //pagination
  const pageSize = 4
  const page = Number(req.query.pageNumber) || 1
  //search
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}
  const count = await Products.countDocuments({ ...keyword })
  const products = await Products.find({ ...keyword })
    //pagination
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})
 const getProductByID = asyncHandler(async (req, res) => {
   const product = await Products.findById(req.params.id)
   if (product) {
     res.json(product)
   }
   res.status(404).json({ message: `Product not found` })
 })
 const updateProduct = asyncHandler( async (req, res) => {
   try {
     const { id } = req.params
     const {
       name,
       price,
       description,
       ratings,
       images,
       category,
       seller,
       numOfReviews,
       stock,
       reviews,
     } = req.body

     const updatedProduct = await Products.findByIdAndUpdate(
       id,
       {
         name,
         price,
         description,
         ratings,
         images,
         category,
         seller,
         numOfReviews,
         stock,
         reviews,
       },
       { new: true }
     )

     if (!updatedProduct) {
       return res.status(404).json({ message: 'Product not found' })
     }

     res.json(updatedProduct)
   } catch (error) {
     res.status(500).json({ message: 'Server Error' })
   }
 })
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id)
  if (product) {
    await Products.deleteOne({ _id: product._id })
    res.status(200).json({ message: 'Product deleted' })
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Products.findById(req.params.id)
  if (product) {
    const alreadyReview = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )
    if (alreadyReview) {
      res.status(400)
      throw new Error('Product already reviewed')
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
    product.ratings =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id)
  if (product) {
    res.status(200).json(product.reviews)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.productId)
  if (product) {
    const review = product.reviews.find(
      (review) => review._id.toString() === req.params.reviewId.toString()
    )
    if (review) {
      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.params.reviewId.toString()
      )
      product.numOfReviews = product.reviews.length
      product.ratings =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0
      await product.save()
      res.status(200).json({ message: 'Review deleted' })
    } else {
      res.status(404)
      throw new Error('Review not found')
    }
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
export {
  getProducts,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
}