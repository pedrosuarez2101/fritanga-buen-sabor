const apiURL = "https://68453c34fc51878754dad8ed.mockapi.io/reservaciones";

document.addEventListener("DOMContentLoaded", () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (!admin) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar nombre del administrador
  document.getElementById(
    "adminNombre"
  ).textContent = `Bienvenido, ${admin.usuario}`;

  const tabla = document.querySelector("#tablaReservas tbody");
  obtenerReservas(tabla);
});

function obtenerReservas(tabla) {
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      tabla.innerHTML = "";
      let totalPersonas = 0;

      data.forEach((reserva) => {
        totalPersonas += parseInt(reserva.personas) || 0;

        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td><input value="${reserva.nombre}" disabled class="admin-tabla__input" /></td>
          <td><input value="${reserva.telefono}" disabled class="admin-tabla__input" /></td>
          <td><input value="${reserva.fecha}" disabled class="admin-tabla__input" /></td>
          <td><input value="${reserva.hora}" disabled class="admin-tabla__input" /></td>
          <td><input value="${reserva.personas}" disabled class="admin-tabla__input" /></td>
          <td><input value="${reserva.comentario}" disabled class="admin-tabla__input" /></td>
          <td>
            <button class="admin-tabla__boton admin-tabla__boton--editar" onclick="editarReserva(this)">Editar</button>
            <button class="admin-tabla__boton admin-tabla__boton--actualizar" onclick="actualizarReserva(this, '${reserva.id}')">Actualizar</button>
            <button class="admin-tabla__boton admin-tabla__boton--eliminar" onclick="eliminarReserva('${reserva.id}')">Eliminar</button>
          </td>
        `;
        tabla.appendChild(fila);
      });

      document.getElementById(
        "contadorReservas"
      ).textContent = `Total de personas reservadas: ${totalPersonas}`;
    });
}

function editarReserva(boton) {
  const fila = boton.closest("tr");
  const inputs = fila.querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
}

function actualizarReserva(boton, id) {
  const fila = boton.closest("tr");
  const inputs = fila.querySelectorAll("input");

  const data = {
    nombre: inputs[0].value.trim(),
    telefono: inputs[1].value.trim(),
    fecha: inputs[2].value.trim(),
    hora: inputs[3].value.trim(),
    personas: parseInt(inputs[4].value),
    comentario: inputs[5].value.trim(),
  };

  fetch(`${apiURL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    inputs.forEach((input) => (input.disabled = true));
    alert("Reservación actualizada");
  });
}

function eliminarReserva(id) {
  if (!confirm("¿Seguro que deseas eliminar esta reservación?")) return;

  fetch(`${apiURL}/${id}`, {
    method: "DELETE",
  }).then(() => {
    alert("Reservación eliminada");
    location.reload();
  });
}

function cerrarSesion() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}
