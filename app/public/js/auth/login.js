document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Formulario enviado");

  const email = e.target.elements.email.value.trim();
  const password = e.target.elements.password.value.trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok && data.redirectTo) {
      window.location.href = data.redirectTo;
      return;
    }

    if (!response.ok && data.error) {
      alert(data.error);
    }

  } catch (err) {
    console.error(err);
    alert('Error del servidor.');
  }
});
