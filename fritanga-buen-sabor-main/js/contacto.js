document
  .querySelector(".formulario")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const mensaje = document.getElementById("mensaje").value;

    // Crear el objeto con los datos
    const datosContacto = {
      Nombre: nombre,
      Correo: correo,
      Mensaje: mensaje,
    };

    try {
      const respuesta = await fetch(
        "https://685973cf138a18086dfe7ca3.mockapi.io/contacto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosContacto),
        }
      );

      if (respuesta.ok) {
        alert("¡Mensaje enviado con éxito!");
        document.querySelector(".formulario").reset(); // Limpia el formulario
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error de conexión. Intenta más tarde.");
    }
  });
