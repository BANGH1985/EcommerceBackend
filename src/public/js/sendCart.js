document.addEventListener('DOMContentLoaded', () => {
    const products = document.getElementsByClassName('product');
    const btnCartFinal = document.getElementById('cartFinal');
    const btnViewCart = document.querySelector('[data-bs-target="#modalCart"]'); // Botón "View Cart"
    const modalBody = document.getElementById('modalBody');

    const arrayProducts = Array.from(products);

    const productsInCart = async () => {
        try {
            const response = await fetch('http://localhost:8080/products/inCart');
            const data = await response.json();
            if (data.cartLength > 0) {
                let productHTML = '';
                data.productsInCart.forEach((product, key) => {
                    productHTML += `<h6>${key + 1}) ${product.title} : ${product.quantity}</h6>`;
                });
                modalBody.innerHTML = productHTML;
            } else {
                modalBody.innerHTML = `<h3> Empty cart </h3>`;
            }
        } catch (error) {
            console.error('Error fetching products in cart:', error);
        }
    };

    // Llamar a productsInCart cuando se haga clic en el botón "View Cart"
    btnViewCart.addEventListener('click', productsInCart);

    arrayProducts.forEach(product => {
        product.addEventListener('click', async () => {
            const stock = Number(product.getAttribute('data-value'));
            const { value: quantity } = await Swal.fire({
                title: 'Add quantity',
                input: 'number',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirm',
            });
            if (quantity !== null) {
                const quantityNumber = Number(quantity);
                if (quantityNumber > 0 && stock >= quantityNumber) {
                    Swal.fire({
                        title: 'Product added successfully',
                        text: `ID: ${product.id} - Quantity: ${quantityNumber}`,
                        icon: 'success',
                    });
                    try {
                        const response = await fetch('http://localhost:8080/api/carts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ products: [{ _id: product.id, quantity: quantityNumber }] }),
                        });
                        const data = await response.json();
                        if (data.status === 'success') {
                            productsInCart();
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: data.message,
                                icon: 'error',
                            });
                        }
                    } catch (error) {
                        console.error('Error adding product to cart:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'There was an error adding the product to the cart',
                            icon: 'error',
                        });
                    }
                } else if (quantityNumber <= 0) {
                    Swal.fire({
                        title: 'Quantity must be greater than 0',
                        icon: 'warning',
                    });
                } else {
                    Swal.fire({
                        title: 'Quantity cannot be greater than stock',
                        icon: 'error',
                    });
                }
            }
        });
    });

    btnCartFinal.addEventListener('click', async () => {
        const { isConfirmed } = await Swal.fire({
            title: 'Quieres finalizar la compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#73be73',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si!'
        });

        if (isConfirmed) {
            try {
                const response = await fetch('http://localhost:8080/products/inCart');
                const data = await response.json();
                if (data.cartLength > 0) {
                    await fetch('http://localhost:8080/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ finishBuy: true }),
                    });
                    Swal.fire({
                        title: 'Compra Completada',
                        icon: 'success',
                    });
                    modalBody.innerHTML = `<h3> Carrito Vacio </h3>`;
                } else {
                    Swal.fire({
                        title: 'Cart is empty',
                        text: 'The purchase was not made because the cart is empty',
                        icon: 'info',
                    });
                }
            } catch (error) {
                console.error('Error finalizing purchase:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error finalizing the purchase',
                    icon: 'error',
                });
            }
        } else {
            Swal.fire({
                title: 'The purchase has not been made yet',
                icon: 'info',
            });
        }
    });

    // Inicializar mostrando los productos en el carrito
    productsInCart();
});
