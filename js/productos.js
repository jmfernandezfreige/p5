const API_CARRITO = "http://localhost:8080/api/carritos";

const token = localStorage.getItem('token');

const parametroURL = new URLSearchParams(window.location.search);
const idCarrito = parametroURL.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página'); 
        window.location.href = 'index.html';
        return;
    }

    if (!idCarrito) {
        alert('Por favor, selecciona primero un carrito primero en la página de inicio');
        window.location.href = 'index.html';
        return;
    }

    const enlaceVerMiCarrito = document.getElementById("link-nav-carrito");
    if (enlaceVerMiCarrito) {
        enlaceVerMiCarrito.href = `carrito.html?id=${idCarrito}`;
    }
});

async function añadirProducto(idArticulo, precio) {
    if (!token) {
        alert('Debes iniciar sesión para añadir productos al carrito');
        return;
    }

    try {
        const respuesta = await fetch(`${API_CARRITO}/${idCarrito}/lineas`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token
            },
            body: JSON.stringify({
                idArticulo: idArticulo,
                unidades: 1,
                precioUnitario: precio
            })
        });

        if (respuesta.ok) {
            alert('Producto añadido al carrito');
        } else {
            console.error('Error al añadir el producto: ', respuesta.status);
            alert('Error al añadir el producto al carrito');
        }
    } catch (error) {
        console.error('Error inesperado: ', error);
        alert('Error inesperado al añadir el producto al carrito');
    }
}


