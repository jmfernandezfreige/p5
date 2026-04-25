const API_AUTH = "http://localhost:8080/api/usuarios/me";

document.addEventListener("DOMContentLoaded", cargarUsuario);

const cargarUsuario = async function() {
    const menu = document.getElementById("menu-usuario");
    if (!menu) {
        return;
    }

    try {
        const token = localStorage.getItem('token');

        const respuesta = await fetch(API_AUTH, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        
        if (respuesta.ok){
            const usuario = await respuesta.json();
            console.log('Respuesta OK:', usuario);
            menu.innerHTML = `
                <span>Hola, ${usuario.email}</span>
                <a href="index.html" class="boton boton-secundario" id="logout">Logout</a>
            `;

            document.getElementById("logout").addEventListener("click", cerrarSesion);

        } else {
            localStorage.removeItem('token');

            menu.innerHTML = '<a href="login.html" class="boton boton-secundario">Iniciar sesión</a>';
            menu.innerHTML += '<a href="registro.html" class="boton boton-secundario">Registrarse</a>';
        }

    } catch (error) {
        console.error('Error inesperado:', error);
        menu.innerHTML = '<a href="login.html" class="boton boton-secundario">Iniciar sesión</a>';
        menu.innerHTML += '<a href="registro.html" class="boton boton-secundario">Registrarse</a>';
        throw error;
    }
}

const cerrarSesion = function(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = "index.html";
}
