document.addEventListener('DOMContentLoaded', () => {
  // Wait a short moment to ensure page is ready
  setTimeout(() => {
    // Select all sections and elements that need scroll animations
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    
    // Function to check if element is in viewport
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= windowHeight * 0.9 && rect.bottom >= windowHeight * 0.1;
    };

    // Function to animate elements
    const animateElement = (element, shouldAnimate) => {
      if (shouldAnimate) {
        element.classList.add('reveal');
        element.classList.add('fade-in');
      } else {
        element.classList.remove('fade-in');
      }
    };

    // Handle all animations
    const handleAnimations = () => {
      sections.forEach(section => {
        // Check if section is in viewport
        const isVisible = isInViewport(section);
        
        // Animate section
        animateElement(section, isVisible);
        
        // Animate child elements
        const elements = section.querySelectorAll('.fade-content');
        elements.forEach((el, index) => {
          if (isVisible) {
            setTimeout(() => {
              animateElement(el, true);
            }, index * 100); // Stagger the animations
          } else {
            animateElement(el, false);
          }
        });
      });

      // Update header
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = window.scrollY;
    };

    // Add initial classes
    sections.forEach(section => {
      const elements = section.querySelectorAll('h2, p, .projects-controls, .projects-grid, .skills-grid, .edu-grid, .cert-grid, .exp-grid, .contact-grid');
      elements.forEach(el => el.classList.add('fade-content'));
    });

    // Handle scroll events
    window.addEventListener('scroll', handleAnimations, { passive: true });
    
    // Initial animation check
    handleAnimations();
  }, 100);
});