document.addEventListener('DOMContentLoaded', () => {
    const addCartButtonHandler = async (productElement) => {
        const stock = Number(productElement.getAttribute('data-value'));
        const productId = productElement.getAttribute('id') || productElement.getAttribute('data-id');
        const productTitle = productElement.getAttribute('title') || productElement.getAttribute('data-id');

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
                try {
                    const response = await fetch(`/api/carts/${cart._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ productId, quantity: quantityNumber }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        Swal.fire({
                            title: 'Product added successfully',
                            text: `ID: ${productId} - Quantity: ${quantityNumber}`,
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
    };

    const products = document.getElementsByClassName('product');
    const arrayProducts = Array.from(products);

    arrayProducts.forEach(product => {
        product.addEventListener('click', () => addCartButtonHandler(product));
    });

    const detailPageAddButton = document.getElementById('add-to-cart');
    if (detailPageAddButton) {
        detailPageAddButton.addEventListener('click', () => addCartButtonHandler(detailPageAddButton));
    }
});
