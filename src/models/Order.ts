import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: number;
  items: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'open' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'creditCard' | 'other';
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  orderNumber: {
    type: Number,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'paid', 'cancelled'],
    default: 'open'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'creditCard', 'other'],
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Son adisyon numarasını bulup bir sonraki numarayı döndüren statik metod
OrderSchema.statics.getNextOrderNumber = async function() {
  const lastOrder = await this.findOne({}, {}, { sort: { 'orderNumber': -1 } });
  return lastOrder ? lastOrder.orderNumber + 1 : 1;
};

type OrderModel = Model<IOrder> & {
  getNextOrderNumber(): Promise<number>;
};

const Order = (mongoose.models.Order as OrderModel) || mongoose.model<IOrder, OrderModel>('Order', OrderSchema);
export default Order; 