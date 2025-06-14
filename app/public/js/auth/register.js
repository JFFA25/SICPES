document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e.target.elements.email.value);
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: e.target.elements.email.value,
      password: e.target.elements.password.value,
      confirmPassword: e.target.elements.confirmPassword.value
    })
  });
});