const API_BASE_CARRITO = "http://localhost:8080/api/carritos";

const parametroURL = new URLSearchParams(window.location.search);
const idCarrito = parametroURL.get("id");
const token = localStorage.getItem('token');

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        alert("Debes iniciar sesión para realizar el pago.");
        window.location.href = "login.html";
        return;
    }
    
    if (!idCarrito) {
        alert("No se encontró ningún carrito para pagar.");
        window.location.href = "index.html";
        return;
    }

    const enlacesNav = document.querySelectorAll("nav ul li a");
    enlacesNav.forEach(enlace => {
        if (enlace.textContent === "Volver al Carrito") {
            enlace.href = `carrito.html?id=${idCarrito}`;
        }
    });

    const formulario = document.querySelector("form");
    formulario.addEventListener("submit", procesarPago);
});

async function procesarPago(event) {
    event.preventDefault();

    if (!confirm("¿Confirmas el pago y envío de este pedido?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE_CARRITO}/${idCarrito}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token
            }
        });

        if (respuesta.ok) {
            alert("¡Pago realizado con éxito! Tu pedido está en camino.");
            window.location.href = "index.html";
        } else {
            console.error("Error al procesar el pago, estado:", respuesta.status);
            alert("Hubo un problema procesando tu pago. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert("No se pudo conectar con el servidor para realizar el pago.");
    }
}