import CartModel from "../models/carts.model.js";

export default class CartManager {
    getCarts = async () => {
        try {
            const carts = await CartModel.find().lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };

    getCartById = async (cartId) => {
        try {
            const cart = await CartModel.findById(cartId).populate('products._id').lean();
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return null;
        }
    }

    addCart = async (products) => {
        try {
            const cart = await CartModel.create({ products });
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            return null;
        }
    }

    addProductToCart = async (cid, productId, quantity) => {
        try {
            const productFromBody = {   
                _id: productId,
                quantity: quantity
            }
            const cart = await CartModel.findOne({ _id: cid })
            const findProduct = cart.products.some(
                (product) => product._id.toString() === productFromBody._id)
            if (findProduct) {
                await CartModel.updateOne(
                    { _id: cid, "products._id": productFromBody._id },
                    { $inc: { "products.$.quantity": productFromBody.quantity } })
                return await CartModel.findOne({ _id: cid })
            }
            return await CartModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products: {
                            _id: productFromBody._id,
                            quantity: productFromBody.quantity
                        }
                    }
                })
                
        }
        catch (err) {
            console.log(err.message);
            return err
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await CartModel.findByIdAndUpdate(cid, {
                $pull: { products: { _id: pid } }
            }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            return null;
        }
    }
    updateCart = async (cartId, products) => {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error al actualizar el carrito:', err.message);
            return null;
        }
    }

    updateOneProduct = async (cid, product) => {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid, "products._id": product._id },
                { $set: { "products.$.quantity": product.quantity } },
                { new: true }
            );
            return cart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err.message);
            return null;
        }
    }

    deleteAllProductsInCart = async (cid) => {
        try {
            const cart = await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error al eliminar todos los productos del carrito:', err.message);
            return null;
        }
    }
}
