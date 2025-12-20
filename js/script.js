// Interactive behaviors for the portfolio
document.addEventListener('DOMContentLoaded',()=>{
  // year
  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = currentYear;
  const yearDup = document.querySelector('.year-duplicate');
  if (yearDup) yearDup.textContent = currentYear;  // Header scroll behavior - simpler version that keeps header visible
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click',()=> mainNav.classList.toggle('show'));

  // smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        // hide nav on mobile
        mainNav.classList.remove('show');
      }
    });
  });

  // Typewriter effect for subtitle (cycles through words)
  const tw = document.querySelector('.typewriter');
  if (tw) {
    // parse dataset safely (support either single-quoted or double-quoted JSON)
    let words = [];
    try {
      words = JSON.parse(tw.dataset.words);
    } catch (err) {
      try { words = JSON.parse(tw.dataset.words.replace(/'/g, '"')); } catch (e) { words = [] }
    }

    const textEl = tw.querySelector('.typewriter-text') || tw;
    const cursorEl = tw.querySelector('.typewriter-cursor');

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfterFull = 1300;

    function step() {
      if (!words.length) return;
      const current = words[wordIndex];

      if (!deleting) {
        charIndex++;
        textEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(step, pauseAfterFull);
          return;
        }
        setTimeout(step, typeSpeed);
      } else {
        charIndex--;
        textEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(step, 300);
          return;
        }
        setTimeout(step, deleteSpeed);
      }
    }

    // start
    setTimeout(step, 200);

    // ensure cursor is visible even if CSS not loaded
    if (cursorEl) cursorEl.style.visibility = 'visible';
  }

  // animate skill bars when visible
  const bars = document.querySelectorAll('.bar');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const b = en.target; const lvl = b.dataset.level||80;
        b.querySelector('span').style.width = lvl + '%';
        obs.unobserve(b);
      }
    });
  },{threshold:0.25});
  bars.forEach(b=>obs.observe(b));

  // Projects filtering
  const filters = document.querySelectorAll('.filter');
  const projectsGrid = document.getElementById('projectsGrid');
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project').forEach(p=>{
      p.style.display = (f==='all' || p.dataset.type===f)?'block':'none';
    });
    // reset scroll when changing filters
    if(projectsGrid) projectsGrid.scrollLeft = 0;
    setTimeout(()=>updateCarouselButtons && updateCarouselButtons(),120);
  }));

  // Carousel navigation (horizontal slider behavior)
  const carouselPrev = document.querySelector('.carousel-btn.prev');
  const carouselNext = document.querySelector('.carousel-btn.next');
  const projectsTrack = document.getElementById('projectsGrid');

  function updateCarouselButtons(){
    if(!projectsTrack) return;
    const maxScroll = projectsTrack.scrollWidth - projectsTrack.clientWidth;
    if(carouselPrev) carouselPrev.disabled = projectsTrack.scrollLeft <= 5;
    if(carouselNext) carouselNext.disabled = projectsTrack.scrollLeft >= maxScroll - 5;
  }

  if(carouselPrev && carouselNext && projectsTrack){
    carouselPrev.addEventListener('click', ()=> { projectsTrack.scrollBy({left: -projectsTrack.clientWidth * 0.8, behavior:'smooth'}); setTimeout(updateCarouselButtons,350); });
    carouselNext.addEventListener('click', ()=> { projectsTrack.scrollBy({left: projectsTrack.clientWidth * 0.8, behavior:'smooth'}); setTimeout(updateCarouselButtons,350); });
    projectsTrack.addEventListener('scroll', updateCarouselButtons);
    window.addEventListener('resize', updateCarouselButtons);
    updateCarouselButtons();
    // keyboard navigation while focused
    projectsTrack.addEventListener('keydown', (e)=>{ if(e.key==='ArrowLeft'){ projectsTrack.scrollBy({left:-projectsTrack.clientWidth*0.8,behavior:'smooth'}); } if(e.key==='ArrowRight'){ projectsTrack.scrollBy({left:projectsTrack.clientWidth*0.8,behavior:'smooth'}); } });
  }

  // Modal for project details
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  document.querySelectorAll('[data-open]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.open;
      let html = '';
      if(id==='modal1') html = `
        <h3>Telkom Foodies</h3>
        <p>Group final project (Tubes) — a food ordering/management app created as part of coursework. The repository contains the source, instructions and screenshots.</p>
        <p><a href="https://github.com/mario-005/Tubes-Wad-Susah_kelompok-5" target="_blank" rel="noopener">Open GitHub Repo</a></p>
      `;
      if(id==='modal2') html = `
        <h3>Galaxy Medical Center — Website Design</h3>
        <p>Design prototype and UI screens created in Figma. Review the full design in the Figma file linked below.</p>
        <p><a href="https://www.figma.com/design/mydpWMtt44xrN4zucJpxrz/GMC?node-id=157-7802&t=JbLTGy8lhamjXs3n-1" target="_blank" rel="noopener">Open Figma Design</a></p>
      `;
      if(id==='modal3') html = `
        <h3>Dashboard Rumah Sakit berbasis Komputer</h3>
        <p>Hospital management dashboard implemented in Python. Repo includes implementation notes and usage instructions.</p>
        <p><a href="https://github.com/mario-005/python-rumah-sakit.git" target="_blank" rel="noopener">Open GitHub Repo</a></p>
      `;
      modalBody.innerHTML = html;
      modal.setAttribute('aria-hidden','false');
    });
  });
  modalClose.addEventListener('click',()=>modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true') });

  // copy email
  const copyBtn = document.getElementById('copyEmail');
  const emailText = document.getElementById('emailText').textContent.trim();
  copyBtn.addEventListener('click',async()=>{
    try{ await navigator.clipboard.writeText(emailText); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy',1500)}catch(e){
      const ta = document.createElement('textarea'); ta.value = emailText; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy',1500);
    }
  });

  // contact form (client-only demo)
  const form = document.getElementById('contactForm');
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const name = document.getElementById('cname').value.trim();
    const mail = document.getElementById('cemail').value.trim();
    const msg = document.getElementById('cmessage').value.trim();
    if(!name||!mail||!msg) return alert('Please complete the form');
    // show a fake sending flow
    const btn = document.getElementById('sendMsg');
    btn.disabled = true; btn.textContent = 'Sending...';
    await new Promise(r=>setTimeout(r,900));
    btn.textContent = 'Sent'; setTimeout(()=>{btn.disabled=false;btn.textContent='Send';form.reset()},900);
  });

  // resume download placeholder
  const resumeBtn = document.getElementById('downloadResume');
  resumeBtn.addEventListener('click',()=>{
    // If you have a resume.pdf in the project root, link it here. For now open mailto with subject and attach instructions.
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Benediktus_Mario_Laksono_Resume.pdf';
    // fallback: open email to request resume
    if(!link.href){window.location.href='mailto:benediktuslaksono@gmail.com?subject=Resume%20Request'} else alert('If you have a resume.pdf, place it in the project folder and uncomment the link code.');
  });


});
