document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.elements.name;
  const email = e.target.elements.email;
  const password = e.target.elements.password;
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      alert('No se pudo interpretar la respuesta del servidor.');
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (!response.ok && data.error) {
      alert(data.error);
      return;
    }
    alert(data.message || 'Registro exitoso.');
    e.target.reset();

  } catch (err) {
    console.error(err);
    alert('Error del servidor.');
  }
});