const API_LOGIN = "http://localhost:8080/api/usuarios/me";

const form = document.getElementById("form-login");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    iniciarSesion(event);
});

async function iniciarSesion(event) {
    const formData = new FormData(form);

    const email = formData.get("email");
    const contraseña = formData.get("contraseña");

    // En Basic Auth las credenciales se envían juntas separadas por dos puntos
    const credenciales = email + ":" + contraseña;

    // btoa() es una función de JS que codifica en Base64
    const tokenSimulado = btoa(credenciales);

    try {
        const respuesta = await fetch(API_LOGIN, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + tokenSimulado
            }
        });

        if (respuesta.ok) {
            console.log("Incio de sesión exitoso");
            localStorage.setItem('token', tokenSimulado);
            window.location.href = "index.html";
        } else {
            console.log("Credenciales incorrectos");
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        alert("No se pudo iniciar sesión");
    };

}