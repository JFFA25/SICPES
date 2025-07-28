document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaReservaciones').querySelector('tbody');

  // Obtener reservaciones pendientes
  const res = await fetch('/api/admin/reservations');
  const reservaciones = await res.json();

  tabla.innerHTML = '';
  reservaciones.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.nombreCompleto}</td>
      <td>${r.telefono}</td>
      <td>${r.tipoCuarto}</td>
      <td>${r.piso}</td>
      <td>${r.habitacion}</td>
      <td>${r.estado}</td>
      <td>
        <button onclick="cambiarEstado('${r._id}', 'aceptada')">Aceptar</button>
        <button onclick="cambiarEstado('${r._id}', 'rechazada')">Rechazar</button>
      </td>
    `;
    tabla.appendChild(tr);
  });
});

window.cambiarEstado = async function(id, estado) {
  await fetch(`/api/admin/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  });
  location.reload();
}