document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');
  const montoMensualInput = document.getElementById('montoMensual');
  const tipoCuartoRadios = document.querySelectorAll('input[name="tipoCuarto"]');
  const fechaIngresoInput = document.getElementById('fechaIngreso');
  const fechaSalidaInput = document.getElementById('fechaSalida');

  // Precios según tipo de habitación
  const precios = {
    individual: 1800,
    compartida: 900,
    dormitorio: 750
  };

  // Actualizar monto mensual cuando cambia el tipo de cuarto
  tipoCuartoRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      montoMensualInput.value = precios[radio.value] || '';
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      mensaje.textContent = '';
      mensaje.style.color = '';

      // Recolectar datos del formulario
      const data = {
        nombreCompleto: form.elements['nombreCompleto'].value,
        telefono: form.elements['telefono'].value,
        universidad: form.elements['universidad'].value,
        cuatrimestre: form.elements['cuatrimestre'].value,
        fechaIngreso: fechaIngresoInput.value,
        fechaSalida: fechaSalidaInput.value,
        tipoCuarto: form.elements['tipoCuarto'].value,
        piso: form.elements['piso'].value,
        habitacion: form.elements['habitacion'].value,
        montoMensual: montoMensualInput.value
      };

      // Validar campos obligatorios
      if (Object.values(data).some(val => !val)) {
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
          throw new Error(result.message || 'Error al procesar la reserva');
        }

        // Éxito
        mensaje.textContent = '¡Reserva creada exitosamente!';
        mensaje.style.color = 'green';
        form.reset();
        montoMensualInput.value = '';

        // Redirección opcional después de 2 segundos
        setTimeout(() => {
          window.location.href = '/reservations';
        }, 2000);

      } catch (error) {
        console.error('Error:', error);
        mensaje.textContent = error.message || 'Error al crear la reserva';
        mensaje.style.color = 'red';
      }
    });
  }
});