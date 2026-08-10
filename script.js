document.addEventListener('DOMContentLoaded', () => {
  const stopCards = document.querySelectorAll('.stop-card');
  const carMarker = document.getElementById('car-marker');
  const trackNodes = document.querySelectorAll('.track-node');
  const polaroidCard = document.getElementById('polaroid-card');
  
  const imgA = document.getElementById('photo-a');
  const imgB = document.getElementById('photo-b');
  const caption = document.getElementById('polaroid-caption');

  // Back-face detail elements
  const backTime = document.getElementById('back-time');
  const backReqs = document.getElementById('back-reqs');
  const backTakeaway = document.getElementById('back-takeaway');

  let activeIndex = -1;

  // 3D Card Flip Handler
  polaroidCard.addEventListener('click', () => {
    polaroidCard.classList.toggle('is-flipped');
  });

  // Click-to-Jump Navigation Handler
  trackNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const jumpIndex = node.getAttribute('data-jump');
      const targetCard = document.getElementById(`stop-${jumpIndex}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  function updatePolaroid(card) {
    const newImageSrc = card.getAttribute('data-image');
    const newCaptionText = card.getAttribute('data-caption');
    const tiltDirection = card.getAttribute('data-tilt');

    // Update Back-Face details
    backTime.textContent = card.getAttribute('data-time');
    backReqs.textContent = card.getAttribute('data-reqs');
    backTakeaway.textContent = card.getAttribute('data-takeaway');

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

          // Update Track Nodes
          trackNodes.forEach((node, i) => {
            if (i <= activeIndex) {
              node.classList.add('active');
            } else {
              node.classList.remove('active');
            }
          });

          // Move Car Marker
          const progressPercent = (activeIndex / (stopCards.length - 1)) * 100;
          carMarker.style.top = `${progressPercent}%`;

          updatePolaroid(card);
        }
      }
    });
  }, observerOptions);

  stopCards.forEach((card) => observer.observe(card));
});
