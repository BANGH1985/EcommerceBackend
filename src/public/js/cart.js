document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:8080/api/carts/66542840430ba167de09065a');
        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }
        const cart = await response.json();
        renderCart(cart);
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
});

function renderCart(cart) {
    const cartTableBody = document.getElementById('cart-products');
    cartTableBody.innerHTML = ''; 
    
    cart.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.product.title}</td>
            <td>${product.product._id}</td>
            <td class="quantity">${product.quantity}</td>
            <td class="price">${product.product.price}</td>
            <td>
                <button class="btn btn-danger" onclick="removeProduct('${product.product._id}', '${cart._id}')">Eliminar</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    // Calcular y mostrar el total de cantidad y precio
    const totalQuantity = cart.products.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = cart.products.reduce((sum, product) => sum + product.quantity * product.product.price, 0);
    
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice;
}

async function removeProduct(productId, cartId) {
    try {
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }
        const result = await response.json();
        console.log(result);
        location.reload(); // Recargar la página después de eliminar el producto
    } catch (error) {
        console.error('Error removing product from cart:', error);
    }
}

async function clearCart(cartId) {
    try {
        const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to clear cart');
        }
        const result = await response.json();
        console.log(result);
        location.reload(); // Recargar la página después de vaciar el carrito
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}
