document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/dashboard/reservation');
    if (!res.ok) return mostrarDatosVacios('No activa');

    const data = await res.json();
    const reserva = Array.isArray(data) ? data[0] : data;
    if (!reserva) return mostrarDatosVacios('No activa');

    document.getElementById('piso-usuario').textContent = reserva.piso || '--';
    document.getElementById('habitacion-usuario').textContent = reserva.habitacion || '--';
    document.getElementById('estado-reservacion').textContent = reserva.tipoCuarto || '--';
    document.getElementById('monto-pago').textContent = reserva.montoMensual
      ? `$${parseFloat(reserva.montoMensual).toLocaleString('es-MX')}`
      : '--';

    // --- Cálculo dinámico de próximo pago mensual ---
    const fechaIngreso = new Date(reserva.fechaIngreso);
    const fechaSalida = new Date(reserva.fechaSalida);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let proximoPago = new Date(fechaIngreso);
    while (proximoPago < hoy && proximoPago < fechaSalida) {
      proximoPago.setMonth(proximoPago.getMonth() + 1);
    }

    const vencido = hoy > proximoPago;
    const paymentStatusSpan = document.getElementById('payment-status');
    const fechaPagoSpan = document.getElementById('fecha-pago');

    if (proximoPago <= fechaSalida) {
      const dia = String(proximoPago.getDate()).padStart(2, '0');
      const mes = String(proximoPago.getMonth() + 1).padStart(2, '0');
      const anio = proximoPago.getFullYear();
      fechaPagoSpan.textContent = `${dia}/${mes}/${anio}`;

      // Estado de pago
      if (reserva.isPaid) {
        paymentStatusSpan.textContent = 'Pagado';
        paymentStatusSpan.className = 'status-pagado';
      } else if (vencido) {
        paymentStatusSpan.textContent = 'Vencido';
        paymentStatusSpan.className = 'status-vencido';
      } else {
        paymentStatusSpan.textContent = 'Pendiente';
        paymentStatusSpan.className = 'status-pendiente';
      }
    } else {
      // Ya pasó la fecha final de la estancia
      fechaPagoSpan.textContent = '--/--/----';
      paymentStatusSpan.textContent = 'Finalizado';
      paymentStatusSpan.className = 'status-no-aplica';
    }

  } catch (error) {
    console.error('Error al cargar datos de reserva:', error);
    mostrarDatosVacios('Error');
  }
});

function mostrarDatosVacios(statusText) {
  document.getElementById('piso-usuario').textContent = '--';
  document.getElementById('habitacion-usuario').textContent = '--';
  document.getElementById('estado-reservacion').textContent = '--';
  document.getElementById('monto-pago').textContent = '--';
  document.getElementById('fecha-pago').textContent = '--/--/----';
  const paymentStatusSpan = document.getElementById('payment-status');
  paymentStatusSpan.textContent = statusText;
  paymentStatusSpan.className = 'status-no-aplica';
}
