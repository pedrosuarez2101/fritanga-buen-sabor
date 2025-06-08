document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: document.getElementById("nombre").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      personas: parseInt(document.getElementById("personas").value),
    };

    try {
      const response = await fetch(
        "https://68453c34fc51878754dad8ed.mockapi.io/reservaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("¡Reservación enviada exitosamente!");
        form.reset();
      } else {
        alert("Error al enviar la reservación.");
      }
    } catch (error) {
      alert("No se pudo conectar con la API.");
    }
  });
});
