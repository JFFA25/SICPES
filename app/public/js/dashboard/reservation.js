document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Recolectar datos del formulario
      const data = {
        nombreCompleto: form.elements['nombreCompleto'].value,
        telefono: form.elements['telefono'].value,
        universidad: form.elements['universidad'].value,
        fechaIngreso: form.elements['fechaIngreso'].value,
        fechaSalida: form.elements['fechaSalida'].value,
        tipoCuarto: form.elements['tipoCuarto'].value,
        piso: form.elements['piso'].value,
        habitacion: form.elements['habitacion'].value
      };

      // Validar datos obligatorios
      if (
        !data.nombreCompleto ||
        !data.telefono ||
        !data.universidad ||
        !data.fechaIngreso ||
        !data.fechaSalida ||
        !data.tipoCuarto ||
        !data.piso ||
        !data.habitacion
      ) {
        mensaje.textContent = 'Por favor, completa todos los campos obligatorios.';
        mensaje.style.color = 'red';
        return;
      }

      try {
        const response = await fetch('/api/dashboard/reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Error en la reserva, por favor intenta nuevamente.');
        }

        mensaje.textContent = '¡Reserva confirmada!';
        mensaje.style.color = 'green';
        form.reset();
      } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = 'red';
      }
    });
  }
 

});