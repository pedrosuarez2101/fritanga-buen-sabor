document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".formulario");
  const reservas = [];

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const reserva = {
      nombre: document.getElementById("nombre").value.trim(),
      telefono: parseInt(document.getElementById("telefono").value.trim()),
      fecha: document.getElementById("fecha").value.trim(),
      hora: document.getElementById("hora").value.trim(),
      personas: parseInt(document.getElementById("personas").value),
      comentario: document.getElementById("comentario").value.trim(),
    };

    if (!validarReserva(reserva)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const nuevaReserva = await guardarReservaEnAPI(reserva);
      reservas.push(nuevaReserva); // Guarda localmente
      alert("¡Reservación registrada con éxito!");
      form.reset();
    } catch (error) {
      console.error("Error al enviar la reservación:", error);
      alert("Hubo un problema al enviar tu reservación.");
    }
  });

  function validarReserva(data) {
    return (
      data.nombre &&
      !isNaN(data.telefono) &&
      data.fecha &&
      data.hora &&
      !isNaN(data.personas) &&
      data.personas > 0
    );
  }

  async function guardarReservaEnAPI(data) {
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

    if (!response.ok) {
      throw new Error("No se pudo guardar la reservación.");
    }

    return await response.json();
  }
});
