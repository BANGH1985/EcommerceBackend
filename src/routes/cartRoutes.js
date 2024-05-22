import { Router } from 'express';
import CartManager from "../Dao/mongomanagers/cartManagerMongo.js";

const router = Router();
const manager = new CartManager()

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
    const cart = await manager.addCart([])
    res.status(200).json(cart)
})

// Agregar un producto al carrito o crear un nuevo carrito si no existe
router.post('/:cid', async (req, res) => {
    try {  
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const cart = await manager.addProductToCart(req.params.cid, productId, quantity)
        res.status(200).json(cart)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.render('cart', { cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.deleteProductInCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', message: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Ruta para actualizar los productos de un carrito
router.post('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await manager.addPro(req.params.cid, products);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', message: 'Cart updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
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
