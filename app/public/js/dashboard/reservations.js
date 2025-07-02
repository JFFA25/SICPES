document.addEventListener('DOMContentLoaded', () => {
  const miniaturas = document.querySelectorAll('.miniaturas img');
  const fotoPrincipal = document.getElementById('foto-principal');
  miniaturas.forEach(img => {
    img.addEventListener('click', function() {
      fotoPrincipal.src = this.src;
      // Quitar borde a todas
      miniaturas.forEach(i => i.classList.remove('miniatura-activa'));
      // Poner borde a la seleccionada
      this.classList.add('miniatura-activa');
    });
  });
});