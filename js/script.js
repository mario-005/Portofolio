// Interactive behaviors for the portfolio
document.addEventListener('DOMContentLoaded',()=>{
  // year
  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = currentYear;
  const yearDup = document.querySelector('.year-duplicate');
  if (yearDup) yearDup.textContent = currentYear;  // Header scroll behavior - simpler version that keeps header visible

  // last updated (from meta tag)
  const lastUpdatedMeta = document.querySelector('meta[name="last-updated"]');
  const lastUpdatedLabelEl = document.getElementById('lastUpdatedLabel');
  const lastUpdatedEl = document.getElementById('lastUpdated');
  if (lastUpdatedMeta && lastUpdatedEl) {
    const iso = String(lastUpdatedMeta.getAttribute('content') || '').trim();
    const isId = (navigator.language || '').toLowerCase().startsWith('id');
    if (lastUpdatedLabelEl) lastUpdatedLabelEl.textContent = isId ? 'Terakhir diperbarui:' : 'Last updated:';

    const formatForLocale = (dateObj) => dateObj.toLocaleDateString(isId ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });

    const applyDate = (dateObj, datetimeValue) => {
      lastUpdatedEl.setAttribute('datetime', datetimeValue);
      lastUpdatedEl.textContent = formatForLocale(dateObj);
    };

    // Prefer server-provided Last-Modified when hosted (auto-updates on deploy).
    // Falls back to the meta value for local/file usage or hosts that don't expose Last-Modified.
    (async () => {
      try {
        if (typeof fetch !== 'function') return;
        const url = window.location.href.split('#')[0];
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        const lastModified = res && res.headers ? res.headers.get('last-modified') : null;
        if (lastModified) {
          const parsed = new Date(lastModified);
          if (!Number.isNaN(parsed.getTime())) {
            applyDate(parsed, parsed.toISOString());
            return;
          }
        }
      } catch (_) {
        // ignore and fall back
      }

      // Fallback: meta content
      if (iso) {
        let parsed = null;
        const m = iso.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
        if (m) {
          // Parse as a local calendar date to avoid timezone shifting (e.g. showing the previous day)
          parsed = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        } else {
          parsed = new Date(iso);
        }
        lastUpdatedEl.setAttribute('datetime', iso);
        if (!Number.isNaN(parsed.getTime())) {
          lastUpdatedEl.textContent = formatForLocale(parsed);
        } else {
          lastUpdatedEl.textContent = iso;
        }
      }
    })();
  }
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

  const defaultModalLang = (navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en';
  let currentModalId = null;
  let currentModalLang = defaultModalLang;

  function renderLangToggle(activeLang){
    const isId = activeLang === 'id';
    return `
      <div class="modal-lang" role="group" aria-label="Translation">
        <span class="modal-lang-label">Translation:</span>
        <button type="button" class="btn small outline" data-modal-lang="en" aria-pressed="${!isId}">EN</button>
        <button type="button" class="btn small outline" data-modal-lang="id" aria-pressed="${isId}">ID</button>
      </div>
    `;
  }

  function getModalContent(id, lang){
    const isId = lang === 'id';
    if(id==='modal1') return `
      <h3>Telkom Foodies</h3>
      ${renderLangToggle(lang)}
      <p>${isId
        ? 'Proyek akhir kelompok (Tubes) — aplikasi web pemesanan/manajemen makanan yang dibuat sebagai bagian dari tugas perkuliahan.'
        : 'Group final project (Tubes) — a food ordering/management web app created as part of coursework.'}
      </p>
      <h4>${isId ? 'Highlight' : 'Highlights'}</h4>
      <ul>
        <li>${isId ? 'Demo live tersedia (halaman login).' : 'Live demo available (login page).'}</li>
        <li>${isId ? 'Source code lengkap tersedia di repository.' : 'Full source code available in the repository.'}</li>
        <li>${isId ? 'Dibangun menggunakan stack Laravel (PHP).' : 'Built on a Laravel (PHP) stack.'}</li>
      </ul>
      <p>
        <a href="https://telkom-foodies.vercel.app/login" target="_blank" rel="noopener">${isId ? 'Buka Website' : 'Open Website'}</a>
        &nbsp;•&nbsp;
        <a href="https://github.com/mario-005/Tubes-Wad-Susah_kelompok-5" target="_blank" rel="noopener">${isId ? 'Buka Repository' : 'Open Repository'}</a>
      </p>
    `;

    if(id==='modal2') return `
      <h3>Galaxy Medical Center — Website Design</h3>
      ${renderLangToggle(lang)}
      <p>${isId
        ? 'Remake/redesign website responsif untuk perusahaan fisioterapi (Galaxy Medical Center), dibuat di Figma.'
        : 'Responsive website remake/redesign for a physiotherapy company (Galaxy Medical Center), created in Figma.'}
      </p>
      <h4>${isId ? 'Yang dibuat' : 'What’s included'}</h4>
      <ul>
        <li>${isId ? 'Versi layout responsif (desktop/tablet/mobile) untuk UX yang konsisten di berbagai perangkat.' : 'Responsive layout versions (desktop/tablet/mobile) to ensure consistent UX across devices.'}</li>
        <li>${isId ? 'Prototype interaktif dengan screen utama dan alur navigasi.' : 'Interactive prototype with key screens and navigation flow.'}</li>
        <li>${isId ? 'Komponen reusable + konsistensi spacing/typography untuk handoff yang rapi.' : 'Reusable components and consistent spacing/typography for clean handoff.'}</li>
      </ul>
      <p><a href="https://www.figma.com/design/mydpWMtt44xrN4zucJpxrz/GMC?node-id=157-7802&t=JbLTGy8lhamjXs3n-1" target="_blank" rel="noopener">${isId ? 'Buka Desain Figma' : 'Open Figma Design'}</a></p>
    `;

    if(id==='modal3') return `
      <h3>${isId ? 'Manajemen Rumah Sakit' : 'Hospital Management Dashboard'}</h3>
      ${renderLangToggle(lang)}
      <p>${isId
        ? 'Dashboard manajemen rumah sakit yang dibuat dengan Python dan database MySQL.'
        : 'Hospital management dashboard built with Python and a MySQL database.'}
      </p>
      <h4>${isId ? 'Highlight' : 'Highlights'}</h4>
      <ul>
        <li>${isId ? 'Struktur aplikasi Python (termasuk konfigurasi Streamlit).' : 'Python app structure (includes Streamlit configuration).'}</li>
        <li>${isId ? 'Script database (SQL) disediakan untuk setup lokal.' : 'Database script (SQL) included for local setup.'}</li>
        <li>${isId ? 'Kredensial demo user tersedia di README repository.' : 'Demo user credentials are provided in the repository README.'}</li>
      </ul>
      <p><a href="https://github.com/mario-005/python-rumah-sakit.git" target="_blank" rel="noopener">${isId ? 'Buka Repository' : 'Open Repository'}</a></p>
    `;

    if(id==='modal4') return `
      <h3>Finance Tracker</h3>
      ${renderLangToggle(lang)}
      <p>${isId
        ? 'Aplikasi web pencatat keuangan pribadi untuk memantau pemasukan, pengeluaran, dan budget.'
        : 'Personal finance tracker web app to monitor income, expenses, and budgets.'}
      </p>
      <h4>${isId ? 'Yang tersedia' : 'What’s included'}</h4>
      <ul>
        <li>${isId ? 'Alur autentikasi: Login, Register, dan Forgot Password (tersedia di website live).' : 'Authentication flow: Login, Register, and Forgot Password (available on the live site).'}</li>
        <li>${isId ? 'Membantu mencatat transaksi dan meninjau pengeluaran vs target budget.' : 'Designed to help users record transactions and review spending vs. budget goals.'}</li>
        <li>${isId ? 'UI responsif bergaya aplikasi untuk penggunaan harian.' : 'Responsive, app-style UI focused on day-to-day usage.'}</li>
      </ul>
      <p><a href="https://finance-opal-theta.vercel.app/" target="_blank" rel="noopener">${isId ? 'Buka Website' : 'Open Website'}</a></p>
    `;

    return `${renderLangToggle(lang)}<p>${isId ? 'Detail belum tersedia.' : 'Details not available.'}</p>`;
  }

  function openModal(id){
    currentModalId = id;
    currentModalLang = defaultModalLang;
    modalBody.innerHTML = getModalContent(id, currentModalLang);
    modal.setAttribute('aria-hidden','false');
  }

  // language toggle inside modal
  modalBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-modal-lang]');
    if(!btn || !currentModalId) return;
    const nextLang = btn.dataset.modalLang;
    if(nextLang !== 'en' && nextLang !== 'id') return;
    currentModalLang = nextLang;
    modalBody.innerHTML = getModalContent(currentModalId, currentModalLang);
  });
  document.querySelectorAll('[data-open]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.open;
      openModal(id);
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
