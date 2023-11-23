import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderModel = model('Order', orderSchema);

export default OrderModel;
