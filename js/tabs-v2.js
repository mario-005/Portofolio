// Tab switching for Education/Certifications and Experience sections
document.addEventListener('DOMContentLoaded', () => {
  const allTabs = document.querySelectorAll('.section-tabs');
  
  allTabs.forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('h2');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active states from this tab group
        tabGroup.querySelectorAll('h2').forEach(t => t.classList.remove('active'));
        const parentSection = tabGroup.closest('section');
        parentSection.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        const tabContent = document.getElementById(tab.dataset.tab + 'Tab');
        if (tabContent) {
          tabContent.classList.add('active');
          // Reset and trigger animations
          const animations = tabContent.querySelectorAll('.slide-right, .slide-left, .slide-up');
          animations.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
            el.classList.add('reveal');
          });
        }
      });
    });
  });

  // Set initial active states
  document.querySelector('.section-tabs h2[data-tab="education"]')?.classList.add('active');
  document.getElementById('educationTab')?.classList.add('active');
  document.querySelector('.section-tabs h2[data-tab="work"]')?.classList.add('active');
  document.getElementById('workTab')?.classList.add('active');
});