document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/dashboard/getReservations')
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#tablaReservaciones tbody');
      tbody.innerHTML = '';

      data.forEach(reserva => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${reserva._id}</td>
          <td>${reserva.usuario?.name || 'Desconocido'}</td>
          <td>${new Date(reserva.fechaIngreso).toLocaleDateString()}</td>
          <td>${reserva.tipoCuarto}</td>
          <td>${reserva.piso}</td>
          <td>${reserva.habitacion}</td>
          <td>$${reserva.montoMensual}</td>
          <td>${reserva.estado}</td>
          <td>
          <div class="acciones-container">
          <button class="btn btn-aprobar" data-id="${reserva._id}">Aprobar</button>
          <button class="btn btn-rechazar" data-id="${reserva._id}">Rechazar</button>
          <button class="btn btn-editar" data-id="${reserva._id}">Editar</button>
          </div>
          </td>
        `;

        tbody.appendChild(row);
      });


      document.querySelectorAll('.btn-aprobar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          fetch(`/api/admin/reservations/${id}/approve`, { method: 'PUT' })
            .then(res => res.json())
            .then(() => location.reload())
            .catch(error => console.error('Error al aprobar:', error));
        });
      });

      document.querySelectorAll('.btn-rechazar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          fetch(`/api/admin/reservations/${id}/reject`, { method: 'PUT' })
            .then(res => res.json())
            .then(() => location.reload())
            .catch(error => console.error('Error al rechazar:', error));
        });
      });

      document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const nuevaHabitacion = prompt('Nueva habitación:');
          const nuevoMonto = prompt('Nuevo monto mensual:');

          fetch(`/api/admin/reservations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ habitacion: nuevaHabitacion, montoMensual: nuevoMonto })
          })
            .then(res => res.json())
            .then(() => location.reload())
            .catch(error => console.error('Error al editar:', error));
        });
      });
    })
    .catch(error => console.error('Error al cargar las reservaciones:', error));
});
