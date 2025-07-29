window.cambiarEstado = async (id, nuevoEstado) => {
  if (!confirm(`¿Está seguro de cambiar el estado a "${nuevoEstado}"?`)) return;

  try {
    const response = await fetch(`/api/admin/reservations/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas autenticación
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    // Mostrar mensaje de éxito y recargar
    alert(`Estado cambiado a ${nuevoEstado} correctamente`);
    location.reload();
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    alert(`Error: ${error.message}`);
  }
};

window.mostrarModalEdicion = async function(id) {
  try {
    const res = await fetch(`/api/admin/reservations/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}: Not Found`);
    const reservacion = await res.json();

    // Asigna los valores a los inputs (usa los mismos IDs para editar)
    const campos = [
      'nombreCompleto', 'telefono', 'tipoCuarto', 'piso',
      'habitacion', 'montoMensual', 'estado', 'observaciones', 'editReservaId'
    ];
    campos.forEach(campo => {
      const input = document.getElementById(campo);
      if (input) {
        input.value = reservacion[campo] !== undefined ? reservacion[campo] : (campo === 'editReservaId' ? id : '');
      }
    });

    // Mostrar modal
    new bootstrap.Modal(document.getElementById('editarReservaModal')).show();

  } catch (error) {
    console.error('Error al cargar datos para edición:', error);
    alert(`Error: ${error.message}`);
  }
};

window.guardarCambiosReserva = async () => {
  const id = document.getElementById('editReservaId').value;

  const datosActualizados = {
    nombreCompleto: document.getElementById('nombreCompleto').value,
    telefono: document.getElementById('telefono').value,
    tipoCuarto: document.getElementById('tipoCuarto').value,
    piso: parseInt(document.getElementById('piso').value),
    habitacion: document.getElementById('habitacion').value,
    montoMensual: parseFloat(document.getElementById('montoMensual').value),
    estado: document.getElementById('estado').value,
    observaciones: document.getElementById('observaciones').value
  };

  try {
    const response = await fetch(`/api/admin/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    // Cerrar modal y recargar
    bootstrap.Modal.getInstance(document.getElementById('editarReservaModal')).hide();
    location.reload();

  } catch (error) {
    console.error('Error al guardar cambios:', error);
    alert(`Error al guardar: ${error.message}`);
  }
};

window.eliminarReserva = async (id) => {
  if (!confirm('¿Está seguro de eliminar esta reserva?')) return;
  try {
    const response = await fetch(`/api/admin/reservations/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }
    alert('Reserva eliminada correctamente');
    location.reload();
  } catch (error) {
    alert(`Error al eliminar: ${error.message}`);
  }
};

// 2. Luego el código que necesita el DOM
document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaReservaciones').querySelector('tbody');
  const searchInput = document.getElementById('searchInput');
  const estadoFiltro = document.getElementById('estadoFiltro');

  const res = await fetch('/api/admin/reservations');
  let reservaciones = await res.json();

  function filtrar() {
    let estado = estadoFiltro.value;
    let texto = searchInput.value.toLowerCase();

    let filtradas = reservaciones.filter(r => {
      let coincideEstado = estado === 'todas' ? true : r.estado === estado;
      let coincideBusqueda =
        r.nombreCompleto.toLowerCase().includes(texto) ||
        r.telefono.toLowerCase().includes(texto) ||
        r.tipoCuarto.toLowerCase().includes(texto);
      return coincideEstado && coincideBusqueda;
    });

    renderTabla(filtradas);
  }

  searchInput.addEventListener('input', filtrar);
  estadoFiltro.addEventListener('change', filtrar);

  filtrar();

  function renderTabla(datos) {
    tabla.innerHTML = '';
    if (datos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="8">No hay reservaciones</td></tr>`;
      return;
    }
    datos.forEach(r => {
      tabla.innerHTML += `
        <tr>
          <td>${r.nombreCompleto}</td>
          <td>${r.telefono}</td>
          <td>${r.tipoCuarto}</td>
          <td>${r.piso}</td>
          <td>${r.habitacion}</td>
          <td>${r.montoMensual}</td>
          <td>${r.estado}</td>
          <td class="acciones-cell">
            <button onclick="cambiarEstado('${r._id}', 'aceptada')" class="btn-accion btn-success">Aceptar</button>
            <button onclick="cambiarEstado('${r._id}', 'rechazada')" class="btn-accion btn-danger">Rechazar</button>
            <button onclick="mostrarModalEdicion('${r._id}')" class="btn-accion btn-warning">Editar</button>
          </td>
        </tr>
      `;
    });
  }
}
);