document.addEventListener('DOMContentLoaded', () => {
  const stopCards = document.querySelectorAll('.stop-card');
  const carMarker = document.getElementById('car-marker');
  const polaroidCard = document.getElementById('polaroid-card');
  const imgA = document.getElementById('photo-a');
  const imgB = document.getElementById('photo-b');
  const caption = document.getElementById('polaroid-caption');

  let activeIndex = -1;

  function updatePolaroid(newImageSrc, newCaptionText, tiltDirection) {
    const activeImg = imgA.classList.contains('active') ? imgA : imgB;
    const nextImg = activeImg === imgA ? imgB : imgA;

    const tiltAngle = tiltDirection === 'right' ? '3.5deg' : '-3.5deg';
    polaroidCard.style.setProperty('--tilt-angle', tiltAngle);

    caption.style.opacity = '0';
    setTimeout(() => {
      caption.textContent = newCaptionText;
      caption.style.opacity = '1';
    }, 200);

    nextImg.src = newImageSrc;
    activeImg.classList.remove('active');
    nextImg.classList.add('active');
  }

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = parseInt(card.getAttribute('data-stop'), 10);

        if (index !== activeIndex) {
          activeIndex = index;

          stopCards.forEach((c) => c.classList.remove('active'));
          card.classList.add('active');

          const progressPercent = (activeIndex / (stopCards.length - 1)) * 100;
          carMarker.style.top = `${progressPercent}%`;

          const newImg = card.getAttribute('data-image');
          const newCap = card.getAttribute('data-caption');
          const tilt = card.getAttribute('data-tilt');
          updatePolaroid(newImg, newCap, tilt);
        }
      }
    });
  }, observerOptions);

  stopCards.forEach((card) => observer.observe(card));
});
