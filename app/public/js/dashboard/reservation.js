document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');
  const montoMensualInput = document.getElementById('montoMensual');
  const tipoCuartoRadios = document.querySelectorAll('input[name="tipoCuarto"]');
  const fechaIngresoInput = document.getElementById('fechaIngreso');
  const pisoSelect = document.getElementById('piso');
  const habitacionSelect = document.getElementById('habitacion');
  const estudiantesCompartidaSelect = document.getElementById('estudiantesCompartida');
  const estudiantesCompartidaContainer = document.getElementById('estudiantesCompartidaContainer');

  // Precios según tipo de habitación
  const precios = {
    individual: 1200,
    compartida: 1400,
  };

  // Configurar habitaciones por piso
  const habitacionesPorPiso = { '1': ['101', '102', '103'], '2': ['201', '202', '203'] };

  // Inicialmente deshabilitar el select de habitación
  if (habitacionSelect) {
    habitacionSelect.disabled = true;
  }

  // Ocultar el contenedor de estudiantes compartida al inicio
  if (estudiantesCompartidaContainer) {
    estudiantesCompartidaContainer.style.display = 'none';
  }

  // Actualizar opciones de habitación cuando cambia el piso
  if (pisoSelect && habitacionSelect) {
    pisoSelect.addEventListener('change', () => {
      const pisoSeleccionado = pisoSelect.value;

      habitacionSelect.disabled = !pisoSeleccionado;
      habitacionSelect.innerHTML = '<option value="" disabled selected>Selecciona una habitación</option>';

      if (pisoSeleccionado) {
        habitacionesPorPiso[pisoSeleccionado].forEach(habitacion => {
          const option = document.createElement('option');
          option.value = habitacion;
          option.textContent = `Habitación ${habitacion}`;
          habitacionSelect.appendChild(option);
        });
      }
    });
  }

  // Mostrar/ocultar contenedor de estudiantes compartida según tipo de cuarto
  tipoCuartoRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      montoMensualInput.value = precios[radio.value] || '';
      if (radio.value === 'compartida') {
        estudiantesCompartidaContainer.style.display = 'flex';
      } else {
        estudiantesCompartidaContainer.style.display = 'none';
        estudiantesCompartidaSelect.value = '';
      }
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      mensaje.textContent = '';
      mensaje.style.color = '';

      // Recolectar datos del formulario
      const data = {
        fechaIngreso: fechaIngresoInput.value,
        tipoCuarto: form.elements['tipoCuarto'].value,
        piso: pisoSelect.value,
        habitacion: habitacionSelect.value,
        montoMensual: montoMensualInput.value,
        estudiantesCompartida: estudiantesCompartidaContainer.style.display === 'flex' ? estudiantesCompartidaSelect.value : ''
      };

      // Validar campos obligatorios
      if (
        !data.fechaIngreso ||
        !data.tipoCuarto ||
        !data.piso ||
        !data.habitacion ||
        !data.montoMensual ||
        (data.tipoCuarto === 'compartida' && !data.estudiantesCompartida)
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
          credentials: 'include', 
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Error al procesar la reserva');
        }

        mensaje.textContent = '¡Tu solicitud de reserva ha sido recibida y está en espera de aprobación!';
        mensaje.style.color = 'green';
        form.reset();
        montoMensualInput.value = '';
        habitacionSelect.disabled = true;
        estudiantesCompartidaContainer.style.display = 'none';

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