// cartRoutes.js
import { Router } from 'express';
import CartManager from "../Dao/mongomanagers/cartManagerMongo.js";

const router = Router();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await CartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para crear un carrito vacío
router.post('/', async (req, res) => {
    const result = await CartManager.createCart();
    if (result.success) {
        res.status(201).json({ message: 'Carrito creado exitosamente', cart: result.cart });
    } else {
        res.status(500).json({ message: 'Error al crear el carrito', error: result.error });
    }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
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
        const cart = await CartManager.deleteProductInCart(req.params.cid, req.params.pid);
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
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await CartManager.updateOneProduct(req.params.cid, products);
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
