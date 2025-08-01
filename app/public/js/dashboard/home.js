document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/dashboard/getUserReservation', { credentials: 'include' });

    if (res.status === 401) {
      window.location.href = '/login'; // Redirige si no está autenticado
      return;
    }

    if (!res.ok) throw new Error('No se pudo cargar la reservación');

    const data = await res.json();

    // Mostrar datos en la tarjeta
    document.getElementById('tipo-cuarto').textContent = data.tipoCuarto || 'No especificado';
    document.getElementById('habitacion-usuario').textContent = data.habitacion || 'N/A';
    document.getElementById('estado-reservacion').textContent = data.estado || 'Desconocido';

    // Mostrar nombre de usuario
    document.getElementById('nombre-usuario').textContent = data.nombreUsuario || 'Invitado';

  } catch (error) {
    console.error('Error al obtener la reservación:', error);
    // Mostrar datos vacíos si hay error
    document.getElementById('tipo-cuarto').textContent = 'No especificado';
    document.getElementById('habitacion-usuario').textContent = 'N/A';
    document.getElementById('estado-reservacion').textContent = 'Desconocido';
    document.getElementById('nombre-usuario').textContent = 'Invitado';
  }
});
