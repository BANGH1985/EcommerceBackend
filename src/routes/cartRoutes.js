import { Router } from 'express';
import CartManager from "../Dao/mongomanagers/cartManagerMongo.js";
import ProductManager from '../Dao/mongomanagers/productManagerMongo.js';
import cartModel from '../Dao/models/carts.model.js';

const router = Router();
const manager = new CartManager()
const pm = new ProductManager()


const getPopulatedCart = async (cartId) => {
    try {
        const cart = await cartModel.findById(cartId).populate('products.product').lean()
        return cart
    } catch (error) {
        throw new Error('Error al obtener el carrito')
    }
}

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
router.post('/', async (req, res) => {  
    try {
        const cart = await manager.addCart([]);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar un carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Agregar un producto al carrito o crear un nuevo carrito si no existe
router.post('/:cid', async (req, res) => {
    try {  
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const product = await pm.getProductById(productId)
        console.log(product);
        const cart = await manager.addProductToCart(req.params.cid, product, quantity);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar un producto al carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid
    try {
        const cart = await getPopulatedCart(cartId)
        res.render('cart', {
            cart: cart,
        })
    } catch (error) {
        console.error('Error al obtener el carrito:', error)
        res.status(500).render('cart', { error: error.message })
    }
})

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.deleteProductInCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', message: 'Product removed' });
    } catch (error) {
        console.error('Error al eliminar un producto del carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await CartManager.updateOneProduct(req.params.cid, { _id: req.params.pid, quantity });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', message: 'Product quantity updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.deleteAllProductsInCart(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', message: 'Cart cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

export default router;
