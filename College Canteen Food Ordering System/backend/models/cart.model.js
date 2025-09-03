import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  userId: {  
              type: mongoose.Schema.Types.ObjectId,
              ref: 'user'
  },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      img: { type: String },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;