document.querySelector('.logout-btn').addEventListener('click', async () => {
  try {
    const res = await fetch('/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/login';
    } else {
      alert('Error al cerrar sesión');
    }
  } catch {
    alert('Error al cerrar sesión');
  }
});
