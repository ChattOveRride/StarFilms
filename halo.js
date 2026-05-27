window.addEventListener('load', () => {
  const colorThief = new ColorThief();
  const images = document.querySelectorAll('.cont-dest img');

  images.forEach(img => {
    img.crossOrigin = "anonymous";
    if (img.complete) {
      aplicarHalo(img);
    } else {
      img.addEventListener('load', () => aplicarHalo(img));
    }
  });

  function aplicarHalo(img) {
    try {
      const color = colorThief.getColor(img);
      const [r, g, b] = color;
      // Subir dos niveles: img → button → .image-container
      const container = img.closest('.image-container');
      if (container) {
        container.style.setProperty('--halo-color', `rgba(${r}, ${g}, ${b}, 9.0)`);
      }
    } catch (error) {
      console.error('Error leyendo color:', error);
    }
  }
});