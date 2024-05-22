document.addEventListener('DOMContentLoaded', () => {
    const products = document.getElementsByClassName('product');
    const arrayProducts = Array.from(products);

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
                console.log("QUANTITY", quantity);
                const quantityNumber = Number(quantity);
                if (quantityNumber > 0 && stock >= quantityNumber) {
                    try {
                        const response = await fetch('http://localhost:8080/api/carts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ products: [{ _id: product._id, quantity: quantityNumber }] }),
                        });
                        if (response.ok) {
                            const data = await response.json();
                            Swal.fire({
                                title: 'Product added successfully',
                                text: `ID: ${product.id} - Quantity: ${quantityNumber}`,
                                icon: 'success',
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'There was an error adding the product to the cart',
                                icon: 'error',
                            });
                        }
                    } catch (error) {
                        console.error('Error al agregar el producto al carrito:', error);
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
});
