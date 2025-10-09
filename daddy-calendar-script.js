(function () {
  fitty('.fit-text');
  // Constants
  const CIRCLE_IMAGE_CLASSES = {
    PREV: 'circle-prev-day',
    CURRENT: 'circle-current-day',
    FUTURE: 'circle-future-day',
  }; 
  const CIRCLE_IMAGES = {
    PREV: 'https://daddy-wordpress-test.s3.amazonaws.com/uploads/2025/10/circle-prev-day.png',
    CURRENT: 'https://daddy-wordpress-test.s3.amazonaws.com/uploads/2025/10/circle-current-day.png',
    FUTURE: 'https://daddy-wordpress-test.s3.amazonaws.com/uploads/2025/10/circle-future-day.png',
  }; 
  const CIRCLE_LIGHT_IMAGE =
    'https://daddy-wordpress-test.s3.amazonaws.com/uploads/2025/10/circle-light-current-day.png';
  const BLUR_CIRCLES_IMAGE =
    'https://daddy-wordpress-test.s3.amazonaws.com/uploads/2025/10/blur-circles.png';
  const BLUR_WIDTH = window.matchMedia('(max-width: 768px)').matches ? 78 : 112;
  const BLUR_HEIGHT = window.matchMedia('(max-width: 768px)').matches ? 72 : 102; 
  const CIRCLE_SIZE = window.matchMedia('(max-width: 768px)').matches ? 66 : 100;
  const LIGHT_CIRCLE_WIDTH = window.matchMedia('(max-width: 768px)').matches ? 66 : 107;
  const LIGHT_CIRCLE_HEIGHT = window.matchMedia('(max-width: 768px)').matches ? 66 : 107;
  const LIGHT_CIRCLE_OFFSET_Y = window.matchMedia('(max-width: 768px)').matches ? 1 : 1; 
  // Helper functions
  const createImage = className => {
    return document.createElementNS('http://www.w3.org/2000/svg', 'image');
  }; 
  const createCircleImage = dayType => {
    const clipId = `circle-clip-${Date.now()}`; 
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g'); 
    clipPath.setAttributeNS(null, 'id', clipId);
    circle.setAttributeNS(null, 'cx', CIRCLE_SIZE / 1.9);
    circle.setAttributeNS(null, 'cy', CIRCLE_SIZE / 1.9);
    circle.setAttributeNS(null, 'r', CIRCLE_SIZE / 1.9); 
    image.setAttributeNS(null, 'href', CIRCLE_IMAGES[dayType]);
    image.setAttributeNS(null, 'width', CIRCLE_SIZE);
    image.setAttributeNS(null, 'height', CIRCLE_SIZE);
    image.setAttributeNS(null, 'class', CIRCLE_IMAGE_CLASSES[dayType]);
    image.setAttributeNS(null, 'clip-path', `url(#${clipId})`); 
    clipPath.appendChild(circle);
    group.appendChild(clipPath);
    group.appendChild(image); 
    return group;
  }; 
  const calculateCirclePosition = gElement => {
    const path = gElement.querySelector('path');
    if (!path) return null; 
    const bbox = path.getBBox();
    const mobileOffsetY = window.matchMedia('(max-width: 768px)').matches ? -1 : -1;
    const mobileOffsetX = window.matchMedia('(max-width: 768px)').matches ? -1 : -2; 
    return {
      x: bbox.x + (bbox.width - CIRCLE_SIZE) / 2 + mobileOffsetX,
      y: bbox.y + (bbox.height - CIRCLE_SIZE) / 2 + mobileOffsetY,
    };
  }; 
  const handleCircleImages = gElement => {
    const existingCircle = gElement.querySelector(`.${CIRCLE_IMAGE_CLASSES.PREV}, 
      .${CIRCLE_IMAGE_CLASSES.CURRENT}, 
      .${CIRCLE_IMAGE_CLASSES.FUTURE}`);
    const path = gElement.querySelector('path'); 
    if (gElement.classList.contains('day-btn_current_day')) {
      const existingLight = gElement.querySelector('.circle-light-current-day');
      if (!existingLight && path) {
        const bbox = path.getBBox();
        const lightImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        lightImage.setAttributeNS(null, 'href', CIRCLE_LIGHT_IMAGE);
        lightImage.setAttributeNS(null, 'class', 'circle-light-current-day');
        lightImage.setAttributeNS(null, 'width', LIGHT_CIRCLE_WIDTH);
        lightImage.setAttributeNS(null, 'height', LIGHT_CIRCLE_HEIGHT);
        lightImage.setAttributeNS(null, 'x', bbox.x + (bbox.width - LIGHT_CIRCLE_WIDTH) / 2);
        lightImage.setAttributeNS(
          null,
          'y',
          bbox.y + (bbox.height - LIGHT_CIRCLE_HEIGHT) / 2 + LIGHT_CIRCLE_OFFSET_Y
        );
        gElement.insertBefore(lightImage, gElement.firstChild);
      }
    } 
    if (!existingCircle) {
      let circleType;
      if (gElement.classList.contains('day-btn_prev_day')) circleType = 'PREV';
      if (gElement.classList.contains('day-btn_current_day')) circleType = 'CURRENT';
      if (gElement.classList.contains('day-btn_future_day')) circleType = 'FUTURE'; 
      if (circleType) {
        const newCircle = createCircleImage(circleType);
        const position = calculateCirclePosition(gElement); 
        if (position) {
          newCircle.setAttributeNS(null, 'transform', `translate(${position.x},${position.y})`); 
          const pathElement = gElement.querySelector('path');
          if (pathElement) {
            pathElement.insertAdjacentElement('beforebegin', newCircle);
          } else {
            gElement.appendChild(newCircle);
          } 
          if (path) {
            newCircle.onclick = path.onclick;
            path.style.pointerEvents = 'none';
          }
        }
      }
    } 
    const addBlurOverlay = () => {
      const existingBlur = gElement.querySelector('.blur-overlay');
      if (!existingBlur && path) {
        const bbox = path.getBBox();
        const blurImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        blurImage.setAttributeNS(null, 'href', BLUR_CIRCLES_IMAGE);
        blurImage.setAttributeNS(null, 'class', 'blur-overlay');
        blurImage.setAttributeNS(null, 'width', BLUR_WIDTH);
        blurImage.setAttributeNS(null, 'height', BLUR_HEIGHT);
        blurImage.setAttributeNS(null, 'x', bbox.x + bbox.width / 2 - BLUR_WIDTH / 2);
        blurImage.setAttributeNS(null, 'y', bbox.y + bbox.height / 2 - BLUR_HEIGHT / 2 + 5);
        blurImage.style.pointerEvents = 'none';
        gElement.appendChild(blurImage);
      }
    }; 
    addBlurOverlay();
  }; 
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const gElement = mutation.target; 
        if (gElement.classList.contains('day-btn')) {
          handleCircleImages(gElement); 
          if (
            !gElement.classList.contains('day-btn_current_day') &&
            !gElement.classList.contains('day-btn_prev_day') &&
            !gElement.classList.contains('day-btn_future_day')
          ) {
            // Удален код для удаления изображений
          }
        }
      }
    });
  }); 
  // Calendar initialization
  const initializeCalendarDays = () => {
    const startDate = new Date('2025-10-01');
    const currentDate = new Date();
    let timeDiff = currentDate - startDate;
    let originalDaysPassed = timeDiff >= 0 ? Math.floor(timeDiff / (1000 * 3600 * 24)) + 1 : 0; 
    const totalCalendarDays = 31;
    const daysPassed = Math.min(originalDaysPassed, totalCalendarDays);
    const isCalendarExpired = originalDaysPassed > totalCalendarDays; 
    document.querySelectorAll('[data-popup-trigger]').forEach(dayElement => {
      const trigger = dayElement.getAttribute('data-popup-trigger');
      const dayNumber = parseInt(trigger.match(/\d+/)?.[0] || 0); 
      dayElement.classList.remove('day-btn_prev_day', 'day-btn_current_day', 'day-btn_future_day');
      dayElement.style.pointerEvents = 'auto';
      dayElement.style.filter = ''; 
      if (currentDate < startDate) {
        dayElement.classList.add('day-btn_future_day');
        dayElement.style.pointerEvents = 'none';
        return;
      } 
      if (isCalendarExpired) {
        dayElement.classList.add(
          dayNumber <= totalCalendarDays ? 'day-btn_prev_day' : 'day-btn_future_day'
        );
      } else {
        if (dayNumber === daysPassed) {
          dayElement.classList.add('day-btn_current_day');
        } else if (dayNumber < daysPassed) {
          dayElement.classList.add('day-btn_prev_day');
        } else {
          dayElement.classList.add('day-btn_future_day');
        }
      } 
      if (dayElement.classList.contains('day-btn_future_day')) {
        dayElement.style.pointerEvents = 'none';
      }
    }); 
    // Event listeners for modals
    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-popup-trigger]');
      if (!trigger || trigger.classList.contains('day-btn_future_day')) return; 
      const popupId = trigger.getAttribute('data-popup-trigger');
      const popupModal = document.querySelector(`[data-popup-modal="${popupId}"]`); 
      if (popupModal) {
        document.querySelectorAll('.popup-modal').forEach(m => m.classList.remove('is--visible'));
        popupModal.classList.add('is--visible');
        document.querySelector('.popup-overlay').classList.add('is-blacked-out');
        document.body.style.overflow = 'hidden'; 
        // Add the .disabled class to base-button if the trigger has day-btn_prev_day class
        if (trigger.classList.contains('day-btn_prev_day')) {
          const baseButton = popupModal.querySelector('.base-button');
          if (baseButton) {
            baseButton.classList.add('disabled');
          }
        }
      }
    }); 
    document.querySelectorAll('.popup-modal__close, .popup-overlay').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.popup-modal').forEach(m => m.classList.remove('is--visible'));
        document.querySelector('.popup-overlay').classList.remove('is-blacked-out');
        document.body.style.overflow = 'initial';
      });
    }); 
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.popup-modal').forEach(m => m.classList.remove('is--visible'));
        document.querySelector('.popup-overlay').classList.remove('is-blacked-out');
        document.body.style.overflow = 'initial';
      }
    });
  }; 
  // Initialize active elements and observer
  const initialize = () => {
    document.querySelectorAll('g.day-btn').forEach(element => {
      observer.observe(element, { attributes: true, attributeFilter: ['class'] });
    });
  }; 
  // Accordion functionality
  const initializeAccordions = () => {
    const accordions = document.querySelectorAll('.accordion'); 
    const openAccordion = accordion => {
      const content = accordion.querySelector('.accordion__content');
      accordion.classList.add('accordion__active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }; 
    const closeAccordion = accordion => {
      const content = accordion.querySelector('.accordion__content');
      accordion.classList.remove('accordion__active');
      content.style.maxHeight = null;
    }; 
    accordions.forEach(accordion => {
      const intro = accordion.querySelector('.accordion__intro');
      const content = accordion.querySelector('.accordion__content');
      intro.onclick = () => {
        if (content.style.maxHeight) {
          closeAccordion(accordion);
        } else {
          accordions.forEach(accordion => closeAccordion(accordion));
          openAccordion(accordion);
        }
      };
    });
  }; 
  // DOM ready handlers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initialize();
      initializeCalendarDays();
      initializeAccordions();
    });
  } else {
    initialize();
    initializeCalendarDays();
    initializeAccordions();
  }
})();