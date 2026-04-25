const API_GET_CARRITOS = "http://localhost:8080/api/carritos/me";
const API_CARRITO = "http://localhost:8080/api/carritos";

const botonNuevo = document.getElementById("carrito-nuevo");
const buscador = document.getElementById("buscador-carritos");
const carritos = document.getElementById("carritos");
const token = localStorage.getItem('token');

document.addEventListener("DOMContentLoaded", cargarCarritos);
botonNuevo.addEventListener("click", crearCarrito);

async function cargarCarritos() {
    if (!token) {
        carritos.innerHTML = "<p>Inicia sesión para ver tus carritos</p>";
        botonNuevo.style.display = "none";
        console.log("No se encontró token, usuario no autenticado");
        return;
    }

    try {
        const respuesta = await fetch(API_GET_CARRITOS, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token
            }
        });

        if (respuesta.ok) {
            const listaCarritos = await respuesta.json();
            carritos.innerHTML = "";

            listaCarritos.forEach((carrito, index) => {
                // Index empieza en 0, con ello se muestra desde el carrito 1 en adelante
                const numeroCarrito = index + 1;

                carritos.innerHTML += `
                        <article class="carrito${numeroCarrito}">
                            <h2>Carrito ${numeroCarrito}</h2>
                            <span>Precio total ${carrito.precioTotal}€</span>
                            <div class="acciones">
                                <a href="carrito.html?id=${carrito.idCarrito}" class="boton boton-principal">Detalle del carrito</a>
                                <button onclick="borrarCarrito(${carrito.idCarrito})" class="boton boton-secundario">Eliminar carrito</button>
                            </div>
                        </article>
                    `;
            });
        } else {
            console.log("Error al cargar los carritos.");
            carritos.innerHTML = "<p>No se pudieron cargar los carritos</p>";
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        carritos.innerHTML = "<p>No se pudieron cargar los carritos</p>";
    }
}

async function crearCarrito() {
    if (!token) {
        alert("Inicia sesión para crear un carrito");
        return;
    }
    try {
        const respuesta = await fetch(API_CARRITO, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token
            },
            body: JSON.stringify({ precioTotal: 0.0 })
        });

        if (respuesta.ok) {
            cargarCarritos();
        } else {
            console.log("Error al crear el carrito.");
            alert("No se pudo crear el carrito");
        };
    } catch (error) {
        console.error('Error inesperado:', error);
        alert("No se pudo crear el carrito");
    }
}

async function borrarCarrito(idCarrito) {
    if (!token) {
        console.log("Para borrar un carrito debes iniciar sesión");
        return;
    }

    try {
        const respuesta = await fetch(`${API_CARRITO}/${idCarrito}`, {
            'method': 'DELETE',
            'headers': {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token
            }
        });

        if (respuesta.ok) {
            console.log(`Carrito ${idCarrito} eliminado`);
            cargarCarritos();
        } else {
            console.log(`Error al eliminar el carrito ${idCarrito}`);
            alert("No se pudo eliminar el carrito");
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        alert("No se pudo eliminar el carrito");
    }
};

buscador.addEventListener("submit", function (event) {
    event.preventDefault();
    const busqueda = buscador.querySelector("input").value.trim();
    if (busqueda) {
        alert("Funcionalidad de búsqueda no implementada. Busqueda: " + busqueda);
    }
});
