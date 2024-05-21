import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
});

cartSchema.pre('find', function(next){
    this.populate('products.product');
    next();
});

cartSchema.pre('findOne', function(next) {
    this.populate('products.product');
    next();
});

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;
