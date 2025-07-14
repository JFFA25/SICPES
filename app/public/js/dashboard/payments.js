document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a elementos del DOM
    const DOM = {
        pendingAmount: document.getElementById('pending-amount'),
        dueDate: document.getElementById('due-date'),
        paymentStatus: document.getElementById('payment-status'),
        payButton: document.getElementById('pay-button'),
        paymentMessage: document.getElementById('payment-message'),
        paymentInfo: document.getElementById('payment-info'),
        noPaymentMessage: document.getElementById('no-payment-message'),
        historyList: document.getElementById('history-list')
    };

    let currentReservation = null; // Almacena los datos de la reserva activa

    /**
     * Formatea una cadena de fecha a DD/MM/AAAA.
     * @param {string} dateString - Cadena de fecha ISO.
     * @returns {string} Fecha formateada.
     */
    const formatDate = (dateString) => {
        if (!dateString) return '--/--/----';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    /**
     * Carga y muestra los detalles del próximo pago.
     */
    const loadPaymentDetails = async () => {
        try {
            const res = await fetch('/api/dashboard/reservation');
            if (!res.ok) {
                // Si no hay reserva activa o error en la API
                DOM.paymentInfo.style.display = 'none';
                DOM.noPaymentMessage.style.display = 'block';
                return;
            }
            const data = await res.json();
            const reservationData = Array.isArray(data) ? data[0] : data;

            if (reservationData && reservationData.monto && reservationData.fechaVencimiento) {
                currentReservation = reservationData; // Guarda la reserva para futuras acciones

                DOM.pendingAmount.textContent = `$${reservationData.monto.toLocaleString('es-MX')}`;
                DOM.dueDate.textContent = formatDate(reservationData.fechaVencimiento);

                const today = new Date();
                const dueDate = new Date(reservationData.fechaVencimiento);
                if (today > dueDate) {
                    DOM.paymentStatus.textContent = 'Vencido';
                    DOM.paymentStatus.style.color = 'red';
                } else {
                    DOM.paymentStatus.textContent = 'Pendiente';
                    DOM.paymentStatus.style.color = 'orange';
                }

                DOM.payButton.disabled = false; // Habilitar el botón de pago
                DOM.paymentInfo.style.display = 'block';
                DOM.noPaymentMessage.style.display = 'none';

                // Posible carga de historial de pagos aquí (requiere nuevo endpoint)
                // loadPaymentHistory();

            } else {
                DOM.paymentInfo.style.display = 'none';
                DOM.noPaymentMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar la información de pago:', error);
            DOM.paymentInfo.style.display = 'none';
            DOM.noPaymentMessage.style.display = 'block';
            DOM.noPaymentMessage.textContent = 'Error al cargar información de pago. Intente nuevamente.';
        }
    };

    /**
     * Simula el proceso de pago.
     */
    DOM.payButton.addEventListener('click', async () => {
        if (!currentReservation) {
            DOM.paymentMessage.textContent = 'No hay un pago pendiente que procesar.';
            DOM.paymentMessage.style.color = 'red';
            return;
        }

        DOM.payButton.disabled = true;
        DOM.paymentMessage.textContent = 'Procesando pago...';
        DOM.paymentMessage.style.color = 'blue';

        try {
            // SIMULACIÓN DE LLAMADA AL BACKEND PARA PROCESAR PAGO
            const response = await fetch('/api/dashboard/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservationId: currentReservation._id,
                    amount: currentReservation.monto,
                    paymentDate: new Date().toISOString().split('T')[0]
                })
            });

            const result = await response.json();

            if (response.ok) {
                DOM.paymentMessage.textContent = '¡Pago realizado con éxito!';
                DOM.paymentMessage.style.color = 'green';
                DOM.paymentStatus.textContent = 'Pagado';
                DOM.paymentStatus.style.color = 'green';
                DOM.payButton.style.display = 'none'; // Oculta el botón tras el pago

                // Actualizar historial o recargar detalles si es necesario
                // loadPaymentHistory();
                // loadPaymentDetails(); 
            } else {
                throw new Error(result.message || 'Error al procesar el pago.');
            }
        } catch (error) {
            console.error('Error durante el pago:', error);
            DOM.paymentMessage.textContent = `Error: ${error.message}`;
            DOM.paymentMessage.style.color = 'red';
            DOM.payButton.disabled = false;
        }
    });

    // Carga inicial de detalles de pago
    loadPaymentDetails();
});