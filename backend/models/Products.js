import mongoose from 'mongoose'
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      maxLength: [120, 'Product name must be less than 120 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      maxLength: [120, 'Product price must be less than 120 characters'],
    },
    description: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please enter a category'],
      enum: {
        values: [
          'Laptops',
          'Cameras',
          'Food',
          'Home',
          'Electronics',
          'Headphones',
          'Accessories',
        ],
        message: 'Please select a correct category',
      },
    },
    seller: {
      type: String,
      required: [true, 'Please enter a seller'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    stock: { type: Number, required: true, default: 0 },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [reviewSchema]
  },
  {
    timestamps: true,
  }
)

const Products = mongoose.model('Products', productSchema)

export default Products
