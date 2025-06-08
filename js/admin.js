const API_URL = "https://68453c34fc51878754dad8ed.mockapi.io/reservaciones";

const lista = document.getElementById("lista-reservas");
const formAgregar = document.getElementById("formAgregar");

function cargarReservaciones() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      lista.innerHTML = "";
      data.forEach((res) => {
        const div = document.createElement("div");
        div.classList.add("platillo");
        div.innerHTML = `
          <p><strong>Nombre:</strong> ${res.nombre}</p>
          <p><strong>Fecha:</strong> ${res.fecha}</p>
          <p><strong>Hora:</strong> ${res.hora}</p>
          <p><strong>Personas:</strong> ${res.personas}</p>
          <button onclick="eliminarReservacion('${res.id}')">Eliminar</button>
          <button onclick="editarReservacion(${res.id}, '${res.nombre}', '${res.fecha}', '${res.hora}', ${res.personas})">Editar</button>
        `;
        lista.appendChild(div);
      });
    });
}

function eliminarReservacion(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  }).then(() => cargarReservaciones());
}

function editarReservacion(id, nombre, fecha, hora, personas) {
  const nuevoNombre = prompt("Nuevo nombre:", nombre);
  const nuevaFecha = prompt("Nueva fecha:", fecha);
  const nuevaHora = prompt("Nueva hora:", hora);
  const nuevasPersonas = prompt("Nuevo número de personas:", personas);

  if (nuevoNombre && nuevaFecha && nuevaHora && nuevasPersonas) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        fecha: nuevaFecha,
        hora: nuevaHora,
        personas: parseInt(nuevasPersonas),
      }),
    }).then(() => cargarReservaciones());
  }
}

formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nueva = {
    nombre: document.getElementById("nombre").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    personas: parseInt(document.getElementById("personas").value),
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nueva),
  }).then(() => {
    formAgregar.reset();
    cargarReservaciones();
  });
});

cargarReservaciones();
