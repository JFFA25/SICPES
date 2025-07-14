document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/dashboard/reservation');
        if (!res.ok) {
            throw new Error(`Error al obtener la reservación: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const reservationData = Array.isArray(data) ? data[0] : data;

        // Referencia al elemento <span> del estado de pago
        const paymentStatusSpan = document.getElementById('payment-status');
        let paymentStatusText = '--';
        let paymentStatusClass = 'status-no-aplica'; // Clase por defecto

        if (reservationData) {
            // ... (tu código para habitacion-usuario, piso-usuario, etc. se mantiene igual) ...
            document.getElementById('habitacion-usuario').textContent = reservationData.habitacion || '--';
            document.getElementById('piso-usuario').textContent = reservationData.piso || '--';
            document.getElementById('estado-reservacion').textContent = reservationData.tipoCuarto || '--';
            document.getElementById('nombre-usuario').textContent = reservationData.nombreCompleto || '';

            document.getElementById('monto-pago').textContent = reservationData.monto ? `$${reservationData.monto.toLocaleString('es-MX')}` : '--';

            if (reservationData.fechaVencimiento) {
                const fechaVencimiento = new Date(reservationData.fechaVencimiento);
                const dia = String(fechaVencimiento.getDate()).padStart(2, '0');
                const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0');
                const anio = fechaVencimiento.getFullYear();
                document.getElementById('fecha-pago').textContent = `${dia}/${mes}/${anio}`;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                fechaVencimiento.setHours(0, 0, 0, 0);

                // Lógica de estado de pago (¡AQUÍ ES DONDE CAMBIA!)
                if (reservationData.isPaid) { // Asumiendo que tu backend envía `isPaid: true`
                    paymentStatusText = 'Pagado';
                    paymentStatusClass = 'status-pagado';
                } else if (today > fechaVencimiento) {
                    paymentStatusText = 'Vencido';
                    paymentStatusClass = 'status-vencido';
                } else {
                    paymentStatusText = 'Pendiente';
                    paymentStatusClass = 'status-pendiente';
                }

            } else {
                document.getElementById('fecha-pago').textContent = '--/--/----';
                paymentStatusText = 'No aplica';
                paymentStatusClass = 'status-no-aplica';
            }

            // Asignar el texto y la clase al <span>
            paymentStatusSpan.textContent = paymentStatusText;
            paymentStatusSpan.className = paymentStatusClass; // Esto reemplaza cualquier clase existente
            
        } else {
            // Si no hay datos de reservación
            document.getElementById('habitacion-usuario').textContent = '--';
            document.getElementById('piso-usuario').textContent = '--';
            document.getElementById('estado-reservacion').textContent = '--';
            document.getElementById('monto-pago').textContent = '--';
            document.getElementById('fecha-pago').textContent = '--/--/----';
            
            paymentStatusSpan.textContent = 'No activa';
            paymentStatusSpan.className = 'status-no-aplica';
        }

    } catch (e) {
        console.error('Error al cargar datos de reserva:', e);
        // En caso de error
        document.getElementById('habitacion-usuario').textContent = '--';
        document.getElementById('piso-usuario').textContent = '--';
        document.getElementById('estado-reservacion').textContent = '--';
        document.getElementById('monto-pago').textContent = '--';
        document.getElementById('fecha-pago').textContent = '--/--/----';
        
        const paymentStatusSpan = document.getElementById('payment-status');
        paymentStatusSpan.textContent = 'Error';
        paymentStatusSpan.className = 'status-error'; // Nueva clase para errores
    }
});