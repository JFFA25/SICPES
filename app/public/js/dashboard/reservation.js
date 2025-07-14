document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');
  const mensaje = document.getElementById('mensaje');

  // --- Elementos para Monto Automático y Fecha de Vencimiento ---
  const montoInput = document.getElementById('monto');
  const tipoCuartoRadios = document.querySelectorAll('input[name="tipoCuarto"]');
  const fechaIngresoInput = document.getElementById('fechaIngreso'); // Referencia al input de fecha de ingreso
  const fechaVencimientoInput = document.getElementById('fechaVencimiento'); // Referencia al input de fecha de vencimiento


  // Precios según tipo de habitación (¡Ajusta estos valores según tu necesidad!)
  const precios = {
    individual: 1800, // Precio para habitación individual
    compartida: 900,  // Precio para habitación compartida (por persona si aplica)
    dormitorio: 750   // Precio para dormitorio (por persona si aplica)
  };

  // --- Lógica para establecer el Monto Mensual automáticamente ---
  tipoCuartoRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      montoInput.value = precios[radio.value] || '';
    });
  });

  // --- Lógica para establecer la Fecha de Vencimiento un mes después de la Fecha de Ingreso ---
  if (fechaIngresoInput && fechaVencimientoInput) {
    fechaIngresoInput.addEventListener('change', () => {
      if (fechaIngresoInput.value) { // Solo si hay una fecha de ingreso seleccionada
        const fechaIngreso = new Date(fechaIngresoInput.value);
        // Establecer el día del mes al día de ingreso
        const diaIngreso = fechaIngreso.getDate();
        // Calcular la fecha de vencimiento un mes después
        fechaIngreso.setMonth(fechaIngreso.getMonth() + 1);

        // Ajustar el día para evitar problemas con meses más cortos (ej. 31 de Enero a Febrero)
        // Si el día original (diaIngreso) es mayor que el último día del mes actual,
        // se ajusta al último día del mes actual.
        if (fechaIngreso.getDate() !== diaIngreso) {
            fechaIngreso.setDate(0); // Establece la fecha al último día del mes anterior (que es el mes actual antes del setMonth)
                                   //  Luego, al sumar un mes, se moverá al último día del mes siguiente.
                                   // Una forma más robusta sería: fechaIngreso.setDate(Math.min(diaIngreso, getLastDayOfMonth(fechaIngreso.getFullYear(), fechaIngreso.getMonth())));
        }


        // Formatear la fecha a YYYY-MM-DD
        const year = fechaIngreso.getFullYear();
        const month = String(fechaIngreso.getMonth() + 1).padStart(2, '0');
        const day = String(fechaIngreso.getDate()).padStart(2, '0');

        fechaVencimientoInput.value = `${year}-${month}-${day}`;
      } else {
        fechaVencimientoInput.value = ''; // Limpiar si no hay fecha de ingreso
      }
    });
  }

  // --- Lógica existente para el envío del formulario ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Recolectar datos del formulario, incluyendo monto y fecha de vencimiento
      const data = {
        nombreCompleto: form.elements['nombreCompleto'].value,
        telefono: form.elements['telefono'].value,
        universidad: form.elements['universidad'].value,
        fechaIngreso: form.elements['fechaIngreso'].value,
        fechaSalida: form.elements['fechaSalida'].value,
        tipoCuarto: form.elements['tipoCuarto'].value,
        piso: form.elements['piso'].value,
        habitacion: form.elements['habitacion'].value,
        monto: montoInput.value, // Asegurarse de enviar el monto
        fechaVencimiento: fechaVencimientoInput.value // Asegurarse de enviar la fecha de vencimiento
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
        !data.habitacion ||
        !data.monto ||
        !data.fechaVencimiento
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
        
        // Al resetear el formulario, también limpiar la fecha de vencimiento
        fechaVencimientoInput.value = '';
        montoInput.value = ''; // También limpiar el monto
      } catch (error) {
        mensaje.textContent = error.message;
        mensaje.style.color = 'red';
      }
    });
  }
});