document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
      mostrarMensaje("Completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        `https://68453c34fc51878754dad8ed.mockapi.io/usuarios?usuario=${usuario}`
      );
      const data = await response.json();

      if (data.length === 0) {
        mostrarMensaje("Usuario no encontrado.");
        return;
      }

      const user = data[0];

      if (user.password === password) {
        localStorage.setItem("admin", JSON.stringify(user));
        window.location.href = "admin.html";
      } else {
        mostrarMensaje("Contraseña incorrecta.");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al conectar con el servidor.");
    }
  });

  function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    mensaje.style.color = "#d62828";
  }
});


