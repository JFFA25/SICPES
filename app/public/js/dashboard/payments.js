document.addEventListener('DOMContentLoaded', async () => {
  const DOM = {
    pendingAmount: document.getElementById('pending-amount'),
    dueDate: document.getElementById('due-date'),
    paymentStatus: document.getElementById('payment-status'),
    payButton: document.getElementById('pay-button'),
    paymentMessage: document.getElementById('payment-message'),
    paymentInfo: document.getElementById('payment-details'),
    noPaymentMessage: document.getElementById('no-payment-info'),
    historyList: document.getElementById('history-list'),
    paymentFormSection: document.getElementById('payment-form-section'),
    paymentForm: document.getElementById('payment-form'),
  };

  let currentReservation = null;

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

const loadPaymentDetails = async () => {
  try {
    const res = await fetch('/api/dashboard/reservation');
    if (!res.ok) throw new Error('Error al obtener la reservación.');

    const data = await res.json();
    const reservationData = Array.isArray(data) ? data[0] : data;

    // Validar monto usando 'montoMensual' para que sea igual que el Home
    let monto = Number(reservationData.montoMensual);
    if (isNaN(monto)) {
      console.warn('Monto no disponible, usando valor por defecto.');
      monto = 0;
    }

    // Validar fecha de vencimiento, si no existe o es inválida, calcularla dinámicamente igual que en Home
    let fechaVencimiento = reservationData.fechaVencimiento;
    if (!fechaVencimiento || isNaN(Date.parse(fechaVencimiento))) {
      console.warn('Fecha de vencimiento no disponible o inválida, calculando valor dinámico.');

      // Calcular próximo pago basado en fechaIngreso y fechaSalida
      if (reservationData.fechaIngreso && reservationData.fechaSalida) {
        const fechaIngreso = new Date(reservationData.fechaIngreso);
        const fechaSalida = new Date(reservationData.fechaSalida);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        let proximoPago = new Date(fechaIngreso);
        while (proximoPago < hoy && proximoPago < fechaSalida) {
          proximoPago.setMonth(proximoPago.getMonth() + 1);
        }
        fechaVencimiento = proximoPago.toISOString();
      } else {
        fechaVencimiento = new Date().toISOString();
      }
    }

    currentReservation = reservationData;

    DOM.pendingAmount.textContent = `$${monto.toLocaleString('es-MX')}`;
    DOM.dueDate.textContent = formatDate(fechaVencimiento);

    const today = new Date();
    const dueDate = new Date(fechaVencimiento);

    if (reservationData.isPaid) {
      DOM.paymentStatus.textContent = 'Pagado';
      DOM.paymentStatus.style.color = 'green';
      DOM.payButton.style.display = 'none';
    } else if (today > dueDate) {
      DOM.paymentStatus.textContent = 'Vencido';
      DOM.paymentStatus.style.color = 'red';
      DOM.payButton.style.display = 'block';
    } else {
      DOM.paymentStatus.textContent = 'Pendiente';
      DOM.paymentStatus.style.color = 'orange';
      DOM.payButton.style.display = 'block';
    }

    DOM.payButton.disabled = false;
    DOM.paymentInfo.style.display = 'block';
    DOM.noPaymentMessage.style.display = 'none';

  } catch (error) {
    console.error('Error al cargar la información de pago:', error);
    DOM.paymentInfo.style.display = 'none';
    DOM.noPaymentMessage.style.display = 'block';
    DOM.noPaymentMessage.textContent = 'Error al cargar información de pago. Intenta nuevamente.';
  }
};


  const loadPaymentHistory = async () => {
    try {
      const res = await fetch('/api/dashboard/payment-history');
      if (!res.ok) throw new Error('No se pudo cargar el historial.');

      const pagos = await res.json();
      DOM.historyList.innerHTML = '';

      if (pagos.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Aún no has realizado pagos.';
        DOM.historyList.appendChild(li);
        return;
      }

      pagos.forEach(pago => {
        const li = document.createElement('li');
        li.style.marginBottom = '1rem';

        const ultimos4 = pago.numeroTarjeta?.slice(-4) || '----';
        const fechaPago = pago.fechaPago || pago.createdAt;
        const fecha = fechaPago
          ? new Date(fechaPago).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
          : '--/--/----';

        li.innerHTML = `
          <p>Estado: <strong style="color: green;">Pagado</strong></p>
          <p>Tarjeta: ****${ultimos4}</p>
          <p>Fecha: ${fecha}</p>
        `;

        DOM.historyList.appendChild(li);
      });
    } catch (err) {
      console.error('Error al cargar historial de pagos:', err);
      const li = document.createElement('li');
      li.textContent = 'No se pudo cargar el historial.';
      DOM.historyList.appendChild(li);
    }
  };

  DOM.payButton.addEventListener('click', () => {
    if (!currentReservation) {
      DOM.paymentMessage.textContent = 'No hay un pago pendiente que procesar.';
      DOM.paymentMessage.style.color = 'red';
      return;
    }
    DOM.paymentFormSection.style.display = 'block';
  });

  DOM.paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const numeroTarjeta = document.getElementById('card-number').value.trim();
    const nombreEnTarjeta = document.getElementById('card-name').value.trim();
    const fechaExpiracion = document.getElementById('expiry').value.trim();
    const CVV = document.getElementById('cvv').value.trim();

    if (!numeroTarjeta || !nombreEnTarjeta || !fechaExpiracion || !CVV) {
      DOM.paymentMessage.textContent = 'Por favor completa todos los campos.';
      DOM.paymentMessage.style.color = 'red';
      return;
    }

    if (!/^\d{16}$/.test(numeroTarjeta)) {
      DOM.paymentMessage.textContent = 'Número de tarjeta inválido. Deben ser 16 dígitos.';
      DOM.paymentMessage.style.color = 'red';
      return;
    }

    if (!/^\d{3,4}$/.test(CVV)) {
      DOM.paymentMessage.textContent = 'CVV inválido. Deben ser 3 o 4 dígitos.';
      DOM.paymentMessage.style.color = 'red';
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(fechaExpiracion)) {
      DOM.paymentMessage.textContent = 'Formato de fecha inválido. Usa MM/AA.';
      DOM.paymentMessage.style.color = 'red';
      return;
    }

    const [mes, anio] = fechaExpiracion.split('/');
    const fechaFormateada = new Date(`20${anio}-${mes}-01`);

    DOM.paymentMessage.textContent = 'Procesando pago...';
    DOM.paymentMessage.style.color = 'blue';

    try {
      const response = await fetch('/api/dashboard/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: currentReservation._id,
          numeroTarjeta,
          nombreEnTarjeta,
          fechaExpiracion: fechaFormateada,
          CVV
        })
      });

      const result = await response.json();

      if (response.ok) {
        DOM.paymentMessage.textContent = '¡Pago realizado con éxito!';
        DOM.paymentMessage.style.color = 'green';
        DOM.paymentFormSection.style.display = 'none';

        // Actualizar UI
        await loadPaymentDetails();
        await loadPaymentHistory();
      } else {
        throw new Error(result.message || 'Error al procesar el pago.');
      }
    } catch (error) {
      console.error('Error durante el pago:', error);
      DOM.paymentMessage.textContent = `Error: ${error.message}`;
      DOM.paymentMessage.style.color = 'red';
    }
  });

  // Cargar al inicio
  await loadPaymentDetails();
  await loadPaymentHistory();
});