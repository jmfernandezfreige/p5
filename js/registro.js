const API_REGISTRO = "http://localhost:8080/api/auth/register";

const form = document.getElementById("form-registro");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    registrarUsuario(event);
});

async function registrarUsuario(event) {
    const formData = new FormData(form);

    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const contraseña = formData.get("contraseña");
    const contraseña2 = formData.get("repetición");

    if (contraseña !== contraseña2) {
        alert("Las contraseñas no coinciden");
        return;
    } else {
        try {
            const respuesta = await fetch(API_REGISTRO, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, contraseña: contraseña, rol: {nombreRol: "USER"} })
            });

            if (respuesta.ok) {
                alert("Usuario registrado con éxito, inicie sesión ahora.");
                window.location.href = "login.html";
            } else {
                console.log("Registro fallido");
                const errorBackend = await respuesta.json(); // O respuesta.text() si no devuelve JSON
                console.log("Motivo del Bad Request:", errorBackend);
                alert("Error del servidor: " + (errorBackend.message || "Revisa la consola para más detalles"));
                throw new Error("Registro fallido con código 400");
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            alert("No se pudo registrar el usuario");
        }

    }

}