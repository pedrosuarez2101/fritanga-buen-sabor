const apiReservas = "https://68453c34fc51878754dad8ed.mockapi.io/reservaciones";
const apiContacto = "https://685973cf138a18086dfe7ca3.mockapi.io/contacto";

document.addEventListener("DOMContentLoaded", () => {
  mostrarReservas();
  mostrarContactos();
  mostrarKPI();
});

function mostrarSeccion(seccionId) {
  document.querySelectorAll(".admin-seccion").forEach((seccion) => {
    seccion.style.display = "none";
  });
  document.getElementById(`seccion-${seccionId}`).style.display = "block";
}

function mostrarReservas() {
  const tabla = document.querySelector("#tablaReservas tbody");
  fetch(apiReservas)
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
            <button onclick="editar(this)">✏️</button>
            <button onclick="guardar(this, '${reserva.id}')">💾</button>
            <button onclick="eliminar('${reserva.id}')">🗑️</button>
          </td>
        `;
        tabla.appendChild(fila);
      });

      document.getElementById(
        "resumenReservas"
      ).textContent = `Total reservaciones: ${data.length} | Total personas: ${totalPersonas}`;
    });
}

function editar(boton) {
  const inputs = boton.closest("tr").querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
}

function guardar(boton, id) {
  const fila = boton.closest("tr");
  const inputs = fila.querySelectorAll("input");
  const datos = {
    nombre: inputs[0].value.trim(),
    telefono: inputs[1].value.trim(),
    fecha: inputs[2].value.trim(),
    hora: inputs[3].value.trim(),
    personas: parseInt(inputs[4].value),
    comentario: inputs[5].value.trim(),
  };

  fetch(`${apiReservas}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then(() => {
    alert("Reservación actualizada");
    mostrarReservas();
  });
}

function eliminar(id) {
  if (!confirm("¿Eliminar esta reservación?")) return;
  fetch(`${apiReservas}/${id}`, {
    method: "DELETE",
  }).then(() => {
    alert("Reservación eliminada");
    mostrarReservas();
  });
}

// Crear nueva reserva
function crearReserva() {
  const datos = {
    nombre: prompt("Nombre:"),
    telefono: prompt("Teléfono:"),
    fecha: prompt("Fecha (YYYY-MM-DD):"),
    hora: prompt("Hora (HH:mm):"),
    personas: parseInt(prompt("Cantidad de personas:")),
    comentario: prompt("Comentario:"),
  };

  if (!datos.nombre || isNaN(datos.personas)) {
    alert("Datos inválidos.");
    return;
  }

  fetch(apiReservas, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }).then(() => {
    alert("Reservación agregada");
    mostrarReservas();
  });
}

function mostrarContactos() {
  const tabla = document.querySelector("#tablaContacto tbody");
  fetch(apiContacto)
    .then((res) => res.json())
    .then((data) => {
      console.log("Datos contacto recibidos:", data); // <--- aquí
      tabla.innerHTML = "";

      data.forEach((contacto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td><input value="${contacto.Nombre}" disabled class="admin-tabla__input" /></td>
          <td><input value="${contacto.Correo}" disabled class="admin-tabla__input" /></td>
          <td><input value="${contacto.Mensaje}" disabled class="admin-tabla__input" /></td>
          <td>
            <button onclick="editarContacto(this)">✏️</button>
            <button onclick="guardarContacto(this, '${contacto.id}')">💾</button>
            <button onclick="eliminarContacto('${contacto.id}')">🗑️</button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch((error) => {
      console.error("Error al obtener contactos:", error);
    });
}

function editarContacto(boton) {
  const inputs = boton.closest("tr").querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
}

function guardarContacto(boton, id) {
  const fila = boton.closest("tr");
  const inputs = fila.querySelectorAll("input");
  const datos = {
    nombre: inputs[0].value.trim(),
    correo: inputs[1].value.trim(),
    mensaje: inputs[2].value.trim(),
  };

  fetch(`${apiContacto}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(() => {
      alert("Mensaje actualizado");
      mostrarContactos();
    })
    .catch((error) => {
      alert("Error al actualizar mensaje");
      console.error(error);
    });
}

function eliminarContacto(id) {
  if (!confirm("¿Eliminar este mensaje de contacto?")) return;
  fetch(`${apiContacto}/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      alert("Mensaje eliminado");
      mostrarContactos();
    })
    .catch((error) => {
      alert("Error al eliminar mensaje");
      console.error(error);
    });
}

function mostrarSeccion(seccionId) {
  document
    .querySelectorAll(".admin-seccion")
    .forEach((seccion) => (seccion.style.display = "none"));
  document.getElementById(`seccion-${seccionId}`).style.display = "block";

  if (seccionId === "kpi") {
    mostrarKPI();
  }
}

function mostrarKPI() {
  fetch(apiReservas)
    .then((res) => res.json())
    .then((data) => {
      const total = data.length;
      const personas = data.reduce(
        (acc, r) => acc + (parseInt(r.personas) || 0),
        0
      );

      document.getElementById(
        "kpi-total-reservas"
      ).textContent = `Total de Reservaciones: ${total}`;
      document.getElementById(
        "kpi-total-personas"
      ).textContent = `Total de Personas: ${personas}`;

      generarGraficoReservas(data); // ← Aquí generamos el gráfico
    })
    .catch((error) => {
      console.error("Error al cargar datos de KPI:", error);
    });
}

let graficoReservas = null;

function generarGraficoReservas(data) {
  const resumenPorMes = {};

  data.forEach((reserva) => {
    if (!reserva.fecha) return;

    const fecha = new Date(reserva.fecha);
    const mesClave = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`; // Ej: "2025-06"

    if (!resumenPorMes[mesClave]) {
      resumenPorMes[mesClave] = {
        reservaciones: 0,
        personas: 0,
      };
    }

    resumenPorMes[mesClave].reservaciones += 1;
    resumenPorMes[mesClave].personas += parseInt(reserva.personas) || 0;
  });

  const etiquetas = Object.keys(resumenPorMes).sort();
  const datosReservaciones = etiquetas.map(
    (mes) => resumenPorMes[mes].reservaciones
  );
  const datosPersonas = etiquetas.map((mes) => resumenPorMes[mes].personas);

  const etiquetasFormateadas = etiquetas.map((mes) => {
    const [anio, mesNum] = mes.split("-");
    const nombresMes = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${nombresMes[parseInt(mesNum) - 1]} ${anio}`;
  });

  const ctx = document.getElementById("graficoReservas").getContext("2d");

  if (graficoReservas) graficoReservas.destroy();

  graficoReservas = new Chart(ctx, {
    type: "bar",
    data: {
      labels: etiquetasFormateadas,
      datasets: [
        {
          label: "Reservaciones",
          data: datosReservaciones,
          backgroundColor: "#d62828",
          borderColor: "#b71c1c",
          borderWidth: 1,
        },
        {
          label: "Personas",
          data: datosPersonas,
          backgroundColor: "#3e2723",
          borderColor: "#1b0c07",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: false,
          ticks: {
            color: "#3e2723",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#3e2723",
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#3e2723",
          },
        },
        tooltip: {
          backgroundColor: "#fff",
          titleColor: "#3e2723",
          bodyColor: "#3e2723",
        },
      },
    },
  });
}

function cerrarSesion() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}
