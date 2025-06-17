document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.elements.email.value;
  const password = e.target.elements.password.value;
  const confirmPassword = e.target.elements.confirmPassword.value;

  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = '';

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('No se pudo interpretar la respuesta del servidor.');
    }

    if (!response.ok) {
      mensaje.textContent = data?.error || 'Ocurrió un error.';
      mensaje.style.color = 'red';
    } else {
      mensaje.textContent = data.message || 'Registro exitoso.';
      mensaje.style.color = 'green';
    }
  } catch (err) {
    console.error(err);
    mensaje.textContent = 'Error del servidor.';
    mensaje.style.color = 'red';
  }})