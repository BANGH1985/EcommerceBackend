import CartModel from "../models/carts.model.js";

const cartModel = new CartModel()
class CartManager {
    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (err) {
            console.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };
    async createCart() {
        try {
            const newCart = new cartModel({ products: [] });
            await newCart.save();
            return { success: true, cart: newCart };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).populate('products._id').lean();
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return err;
        }
    };

    addCart = async (products) => {
        try {
            const cart = await cartModel.create(products);
            return cart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            return err;
        }
    };

    async addProductToCart(productId, quantity) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { 'products._id': productId },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            );

            if (!cart) {
                const newCart = await cartModel.create({
                    products: [{ _id: productId, quantity}],
                });
                return newCart;
            }

            return cart;
        } catch (err) {
            throw new Error('Error al agregar el producto al carrito: ' + err.message);
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await cartModel.findByIdAndUpdate(cid, {
                $pull: { products: { _id: pid } }
            }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            return err;
        }
    };

    updateOneProduct = async (cid, product) => {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid, "products._id": product._id },
                { $set: { "products.$.quantity": product.quantity } },
                { new: true }
            );
            return cart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err.message);
            return err;
        }
    };

    deleteAllProductsInCart = async (cid) => {
        try {
            const cart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error al eliminar todos los productos del carrito:', err.message);
            return err;
        }
    };
}

export default CartManager;
