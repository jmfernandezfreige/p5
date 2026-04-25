const API_LINEAS = "http://localhost:8080/api/carritos/{idCarrito}/lineas";
const API_LINEA = "http://localhost:8080/api/carritos/{idCarrito}/lineas/{idLinea";

const parametroURL = new URLSearchParams(window.location.search);
const idCarrito = parametroURL.get("id");
const token = localStorage.getItem('token');

const lineas = document.getElementById("contenido-carrito");
const precio = document.getElementById("precio-carrito");
const botonProductos = document.getElementById("boton-productos");
const botonPagar = document.getElementById("boton-pagar");

//Para simular base de datos de productos, ya que no se ha implementado la parte de productos ni su API
const catalogoProductos = {
    1: "Camiseta Real Madrid",
    2: "Taza especial 'buenos días'",
    3: "Cargador iPhone",
    4: "Plátano de Canarias"
};

document.addEventListener("DOMContentLoaded", cargarLineas);

async function cargarLineas() {
    if (!token) {
        alert("Inicia sesión para ver el carrito");
        window.location.href = "login.html";
        return;
    };
    if (!idCarrito) {
        alert("No se encontró el id del carrito en la URL");
        window.location.href = "index.html";
        return;
    }

    try {
        const respuesta = await fetch(API_LINEAS.replace("{idCarrito}", idCarrito), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token
            }
        });
        
        if (respuesta.ok) {
            const listaLineas = await respuesta.json();
            lineas.innerHTML = "";
            let precioTotal = 0;

            if (listaLineas.length === 0) {
                lineas.innerHTML = "<tr><td>Tu carrito está vacío</td></tr>";
                precio.textContent = "Precio total: 0€";
                botonPagar.style.display = "none";
                return;
            }

            listaLineas.forEach((linea) => {
                const nombreProducto = catalogoProductos[linea.idProducto] || "Producto desconocido";
                precioTotal += linea.costeLinea;

                lineas.innerHTML += `
                    <tr>
                        <td>${nombreProducto}</td>
                        <td>${linea.unidades}</td>
                        <td>${linea.precioUnitario}€</td>
                        <td>${linea.costeLinea}€</td>
                        <td>
                            <button onclick="borrarLinea(${linea.idLinea})" class="boton boton-secundario">Eliminar</button>
                        </td>
                    </tr>
                `;
            });

            precio.textContent = "Precio total: " + precioTotal + "€";
        } else {
            console.log("Error al cargar las líneas del carrito.");
            lineas.innerHTML = "<p>No se pudieron cargar los productos del carrito</p>";
            precio.textContent = "Precio total: 0€";
            botonPagar.style.display = "none";
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        lineas.innerHTML = "<p>No se pudieron cargar los productos del carrito</p>";
        precio.textContent = "Precio total: 0€";
        botonPagar.style.display = "none";
    }
}

async function borrarLinea(idLinea) {
    if (!token) {
        alert("Inicia sesión para modificar el carrito");
        window.location.href = "login.html";
        return;
    }

    try {
        const respuesta = await fetch(API_LINEAS.replace("{idCarrito}", idCarrito).replace("{idLinea}", idLinea), {
            method: 'DELETE',
            mode: 'cors',
            header: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token
            },
        });

        if (respuesta.ok) {
            console.log("Líneas eliminada con éxito");
            cargarLineas();
        } else {
            alert("No se pudo borrar la línea del carrito");
            console.log("Error al borrar la línea del carrito.");
        }
    } catch (error) {
        alert("No se pudo borrar la línea del carrito");
        console.error('Error inesperado:', error);
    }
};