document.addEventListener('DOMContentLoaded', () => {
  const stopCards = document.querySelectorAll('.stop-card');
  const carMarker = document.getElementById('car-marker');
  const polaroidCard = document.getElementById('polaroid-card');
  const imgA = document.getElementById('photo-a');
  const imgB = document.getElementById('photo-b');
  const caption = document.getElementById('polaroid-caption');

  let activeIndex = -1;

  // Function to cross-fade polaroid photos & captions smoothly
  function updatePolaroid(newImageSrc, newCaptionText, tiltDirection) {
    const activeImg = imgA.classList.contains('active') ? imgA : imgB;
    const nextImg = activeImg === imgA ? imgB : imgA;

    // Apply tilt variable based on card data-tilt
    const tiltAngle = tiltDirection === 'right' ? '3.5deg' : '-3.5deg';
    polaroidCard.style.setProperty('--tilt-angle', tiltAngle);

    // Fade out caption slightly, update text, fade back in
    caption.style.opacity = '0';
    setTimeout(() => {
      caption.textContent = newCaptionText;
      caption.style.opacity = '1';
    }, 200);

    // Start loading new image on the hidden image tag
    nextImg.src = newImageSrc;
    
    // Cross-fade the image tags
    activeImg.classList.remove('active');
    nextImg.classList.add('active');
  }

  // Define IntersectionObserver settings
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // Detect when card enters center of viewport
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = parseInt(card.getAttribute('data-stop'), 10);

        // Only update if we have actually changed sections
        if (index !== activeIndex) {
          activeIndex = index;

          // Update active status on content cards
          stopCards.forEach((c) => c.classList.remove('active'));
          card.classList.add('active');

          // Update Car Position down the track line (percent from top)
          const progressPercent = (activeIndex / (stopCards.length - 1)) * 100;
          carMarker.style.top = `${progressPercent}%`;

          // Pull necessary data attributes from card to update Polaroid stage
          const newImg = card.getAttribute('data-image');
          const newCap = card.getAttribute('data-caption');
          const tilt = card.getAttribute('data-tilt');
          updatePolaroid(newImg, newCap, tilt);
        }
      }
    });
  }, observerOptions);

  // Monitor every stop-card
  stopCards.forEach((card) => observer.observe(card));
});
