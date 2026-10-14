/**
 * ==========================================================================
 * RYAD KHENSOUS — PORTFOLIO QR PORTAL
 * Interactive Controller & QR Engine
 * ==========================================================================
 */

// Target Portfolio Configuration
const CONFIG = {
  portfolioUrl: 'https://ryadkhensous.vercel.app/',
  author: 'Ryad Khensous',
  title: 'Portfolio Ryad Khensous',
  description: 'Découvrez le portfolio professionnel de Ryad Khensous — Développeur Web & Mobile.',
};

// State
let currentPreset = 'cyber';
let isLaserActive = true;
let qrCodeInstance = null;
let miniQrInstance = null;

// Preset Color Configurations for QRCodeStyling & CSS variables
const PRESETS = {
  cyber: {
    name: 'Cyber Cyan',
    primary: '#00f2fe',
    secondary: '#4facfe',
    glow: 'rgba(0, 242, 254, 0.35)',
    dotsColor: '#0a0f1d',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#0369a1' },
        { offset: 1, color: '#00b4d8' }
      ]
    }
  },
  violet: {
    name: 'Néon Violet',
    primary: '#d946ef',
    secondary: '#8b5cf6',
    glow: 'rgba(217, 70, 239, 0.35)',
    dotsColor: '#1e082b',
    dotsType: 'classy-rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#7928ca' },
        { offset: 1, color: '#d946ef' }
      ]
    }
  },
  emerald: {
    name: 'Émeraude Tech',
    primary: '#10b981',
    secondary: '#06b6d4',
    glow: 'rgba(16, 185, 129, 0.35)',
    dotsColor: '#06281e',
    dotsType: 'dots',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#047857' },
        { offset: 1, color: '#10b981' }
      ]
    }
  },
  monochrome: {
    name: 'Minimal Noir & Blanc',
    primary: '#ffffff',
    secondary: '#cbd5e1',
    glow: 'rgba(255, 255, 255, 0.25)',
    dotsColor: '#000000',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
    gradient: null
  }
};

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Lucide icons
  refreshIcons();

  // Initialize Fluid Animated Background
  initFluidBackground();

  // Build and render QR Codes
  initQrCode(currentPreset);

  // Bind all user events
  setupEventListeners();
});

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* --------------------------------------------------------------------------
   QR Code Generator Engine
   -------------------------------------------------------------------------- */
function initQrCode(presetKey) {
  const container = document.getElementById('qr-code-container');
  const miniContainer = document.getElementById('mini-qr-target');
  if (!container) return;

  const preset = PRESETS[presetKey] || PRESETS.cyber;

  // Clear previous content
  container.innerHTML = '';
  if (miniContainer) miniContainer.innerHTML = '';

  // 1. Try modern QRCodeStyling (Stylized with gradients & curves)
  if (typeof window.QRCodeStyling !== 'undefined') {
    try {
      const qrOptions = {
        width: 250,
        height: 250,
        type: 'svg',
        data: CONFIG.portfolioUrl,
        margin: 8,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.35,
          margin: 6
        },
        dotsOptions: {
          type: preset.dotsType || 'rounded',
          color: preset.dotsColor,
          gradient: preset.gradient
        },
        backgroundOptions: {
          color: '#ffffff'
        },
        cornersSquareOptions: {
          type: preset.cornersSquareType || 'extra-rounded',
          color: preset.gradient ? preset.gradient.colorStops[0].color : '#0f172a'
        },
        cornersDotOptions: {
          type: preset.cornersDotType || 'dot',
          color: preset.gradient ? preset.gradient.colorStops[1].color : '#0f172a'
        }
      };

      qrCodeInstance = new window.QRCodeStyling(qrOptions);
      qrCodeInstance.append(container);

      // Also render mini preview on the business card
      if (miniContainer) {
        miniQrInstance = new window.QRCodeStyling({
          ...qrOptions,
          width: 72,
          height: 72,
          margin: 2
        });
        miniQrInstance.append(miniContainer);
      }
      return;
    } catch (err) {
      console.warn('QRCodeStyling render error, falling back to QRCode.js', err);
    }
  }

  // 2. Fallback: Classic QRCode.js
  if (typeof window.QRCode !== 'undefined') {
    try {
      new window.QRCode(container, {
        text: CONFIG.portfolioUrl,
        width: 240,
        height: 240,
        colorDark: preset.dotsColor || '#000000',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });

      if (miniContainer) {
        new window.QRCode(miniContainer, {
          text: CONFIG.portfolioUrl,
          width: 70,
          height: 70,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.M
        });
      }
      return;
    } catch (err) {
      console.warn('QRCode.js render error, using SVG API fallback', err);
    }
  }

  // 3. Fallback: Direct High-Quality QR Code API via Image
  renderApiQrFallback(container, miniContainer);
}

function renderApiQrFallback(container, miniContainer) {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(CONFIG.portfolioUrl)}&margin=10`;
  
  const img = document.createElement('img');
  img.src = qrApiUrl;
  img.alt = `QR Code pointant vers ${CONFIG.portfolioUrl}`;
  img.style.width = '240px';
  img.style.height = '240px';
  img.style.display = 'block';
  container.appendChild(img);

  if (miniContainer) {
    const miniImg = document.createElement('img');
    miniImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(CONFIG.portfolioUrl)}&margin=0`;
    miniImg.alt = 'QR Code';
    miniImg.style.width = '100%';
    miniImg.style.height = '100%';
    miniContainer.appendChild(miniImg);
  }
}

/* --------------------------------------------------------------------------
   Theme Switcher & CSS Sync
   -------------------------------------------------------------------------- */
function applyThemePreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  currentPreset = presetKey;
  const root = document.documentElement;

  // Apply CSS Tokens
  root.style.setProperty('--accent-primary', preset.primary);
  root.style.setProperty('--accent-secondary', preset.secondary);
  root.style.setProperty('--accent-glow', preset.glow);
  root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`);

  // Update Active Preset Pill
  document.querySelectorAll('.preset-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-preset') === presetKey);
  });

  // Update fluid background color theme smoothly
  if (fluidBg && typeof fluidBg.setTheme === 'function') {
    fluidBg.setTheme(presetKey);
  }

  // Re-render QR Code with new style colors
  initQrCode(presetKey);

  showToast(`Thème appliqué : ${preset.name}`);
}

/* --------------------------------------------------------------------------
   User Event Handlers
   -------------------------------------------------------------------------- */
function setupEventListeners() {
  // 1. Copy Link Button
  const btnCopy = document.getElementById('btn-copy-link');
  if (btnCopy) {
    btnCopy.addEventListener('click', handleCopyLink);
  }

  // 2. Share Button
  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', handleShare);
  }

  // 3. Laser Animation Toggle
  const btnToggleLaser = document.getElementById('btn-toggle-laser');
  const laserLine = document.getElementById('laser-line');
  if (btnToggleLaser && laserLine) {
    btnToggleLaser.addEventListener('click', () => {
      isLaserActive = !isLaserActive;
      laserLine.classList.toggle('paused', !isLaserActive);
      
      const laserIcon = document.getElementById('laser-btn-icon');
      const laserText = document.getElementById('laser-btn-text');
      
      if (laserIcon) {
        laserIcon.setAttribute('data-lucide', isLaserActive ? 'pause' : 'play');
      }
      if (laserText) {
        laserText.textContent = isLaserActive ? 'Pause' : 'Activer';
      }
      refreshIcons();
      showToast(isLaserActive ? 'Animation laser activée' : 'Animation laser en pause');
    });
  }

  // 4. Preset Theme Buttons
  const presetButtons = document.querySelectorAll('.preset-pill');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      applyThemePreset(presetKey);
    });
  });

  // 5. Download PNG
  const btnDownloadPng = document.getElementById('btn-download-png');
  if (btnDownloadPng) {
    btnDownloadPng.addEventListener('click', () => handleDownload('png'));
  }

  // 6. Download SVG
  const btnDownloadSvg = document.getElementById('btn-download-svg');
  if (btnDownloadSvg) {
    btnDownloadSvg.addEventListener('click', () => handleDownload('svg'));
  }

  // 7. Click on QR container (visual pulse feedback & test link prompt)
  const qrContainer = document.getElementById('qr-code-container');
  if (qrContainer) {
    qrContainer.addEventListener('click', () => {
      qrContainer.style.transform = 'scale(0.96)';
      setTimeout(() => {
        qrContainer.style.transform = '';
      }, 150);
      showToast('QR Code prêt à être scanné !');
    });
  }
}

/* --------------------------------------------------------------------------
   Copy Link with Feedback
   -------------------------------------------------------------------------- */
async function handleCopyLink() {
  const copyBtn = document.getElementById('btn-copy-link');
  const copyBtnText = document.getElementById('copy-btn-text');
  const copyIcon = document.getElementById('copy-icon');

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(CONFIG.portfolioUrl);
    } else {
      // Fallback for non-https or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = CONFIG.portfolioUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    if (copyBtnText) copyBtnText.textContent = 'Copié !';
    if (copyIcon) copyIcon.setAttribute('data-lucide', 'check');
    refreshIcons();

    showToast('Lien du portfolio copié dans le presse-papier !');

    setTimeout(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copier le lien';
      if (copyIcon) copyIcon.setAttribute('data-lucide', 'copy');
      refreshIcons();
    }, 2500);
  } catch (err) {
    console.error('Erreur lors de la copie :', err);
    showToast('Impossible de copier automatiquement le lien');
  }
}

/* --------------------------------------------------------------------------
   Share Handler (Web Share API)
   -------------------------------------------------------------------------- */
async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: CONFIG.title,
        text: `${CONFIG.description} Visitez :`,
        url: CONFIG.portfolioUrl,
      });
      showToast('Merci pour le partage !');
    } catch (err) {
      if (err.name !== 'AbortError') {
        handleCopyLink();
      }
    }
  } else {
    // Fallback: Copy link and inform user
    handleCopyLink();
  }
}

/* --------------------------------------------------------------------------
   Download QR Code (PNG / SVG)
   -------------------------------------------------------------------------- */
function handleDownload(extension) {
  const filename = `ryad-khensous-portfolio-qr-${currentPreset}.${extension}`;

  if (qrCodeInstance && typeof qrCodeInstance.download === 'function') {
    qrCodeInstance.download({
      name: `ryad-khensous-portfolio-qr-${currentPreset}`,
      extension: extension
    });
    showToast(`Téléchargement de ${filename} lancé !`);
    return;
  }

  // Fallback: extract image from canvas or DOM
  const container = document.getElementById('qr-code-container');
  const canvas = container.querySelector('canvas');
  const img = container.querySelector('img');

  if (canvas) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`Téléchargement de ${filename} terminé !`);
  } else if (img) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = img.src;
    link.target = '_blank';
    link.click();
    showToast(`Téléchargement de ${filename} initié !`);
  } else {
    showToast('Le QR Code est en cours de préparation...');
  }
}

/* --------------------------------------------------------------------------
   Toast Notifications
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   FLUID BACKGROUND ANIMATION ENGINE
   Interactive Particle Mesh & Organic Wave Physics
   -------------------------------------------------------------------------- */
let fluidBg = null;

function initFluidBackground() {
  const canvas = document.getElementById('fluid-bg-canvas');
  if (!canvas) return;
  fluidBg = new FluidBackground(canvas, currentPreset);
  fluidBg.start();
}

class FluidBackground {
  constructor(canvas, initialPresetKey) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.isRunning = false;
    this.lastTime = 0;

    // Theme RGB palettes
    this.palettes = {
      cyber: {
        primary: { r: 0, g: 242, b: 254 },
        secondary: { r: 56, g: 189, b: 248 }
      },
      violet: {
        primary: { r: 217, g: 70, b: 239 },
        secondary: { r: 139, g: 92, b: 246 }
      },
      emerald: {
        primary: { r: 16, g: 185, b: 129 },
        secondary: { r: 6, g: 182, b: 212 }
      },
      monochrome: {
        primary: { r: 255, g: 255, b: 255 },
        secondary: { r: 203, g: 213, b: 225 }
      }
    };

    // Current interpolated color state
    const current = this.palettes[initialPresetKey] || this.palettes.cyber;
    this.colorCurrent = {
      primary: { ...current.primary },
      secondary: { ...current.secondary }
    };
    this.colorTarget = {
      primary: { ...current.primary },
      secondary: { ...current.secondary }
    };

    // Mouse tracking for fluid ripples
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 140,
      isActive: false
    };

    this.setupListeners();
    this.handleResize();
    this.initParticles();
  }

  setupListeners() {
    // Resize with debouncing
    window.addEventListener('resize', () => {
      this.handleResize();
      this.initParticles();
    }, { passive: true });

    // Smooth mouse coordinates with lerp
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isActive = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.isActive = false;
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
    }, { passive: true });

    // Touch device support
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
        this.mouse.isActive = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isActive = false;
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
    }, { passive: true });

    // Pause when tab is inactive to preserve battery & GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.start();
      }
    });
  }

  handleResize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initParticles() {
    // Determine count based on screen width
    const isMobile = this.width < 768;
    const count = isMobile ? 32 : 62;
    this.maxConnectDistance = isMobile ? 95 : 135;

    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: Math.random() * this.width,
        originY: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.45 + 0.35,
        alphaOffset: Math.random() * Math.PI * 2,
        seed: Math.random() * 100,
        isAccent: i % 4 === 0
      });
    }
  }

  setTheme(presetKey) {
    const palette = this.palettes[presetKey];
    if (!palette) return;
    this.colorTarget = {
      primary: { ...palette.primary },
      secondary: { ...palette.secondary }
    };
  }

  updateColors() {
    // Smooth lerp color values towards target
    const lerpSpeed = 0.08;
    ['primary', 'secondary'].forEach(type => {
      ['r', 'g', 'b'].forEach(ch => {
        this.colorCurrent[type][ch] += (this.colorTarget[type][ch] - this.colorCurrent[type][ch]) * lerpSpeed;
      });
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));

    // Smooth mouse position lerping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;

    this.updateColors();

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const time = currentTime * 0.001;
    const prim = this.colorCurrent.primary;
    const sec = this.colorCurrent.secondary;

    const r1 = Math.round(prim.r), g1 = Math.round(prim.g), b1 = Math.round(prim.b);
    const r2 = Math.round(sec.r), g2 = Math.round(sec.g), b2 = Math.round(sec.b);

    const count = this.particles.length;

    // 1. Draw Connecting Fluid Filaments
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < count; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.maxConnectDistance) {
          const ratio = 1 - (dist / this.maxConnectDistance);
          const lineAlpha = (ratio * ratio * 0.22);
          
          ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 2. Update and Draw Fluid Particles
    for (let i = 0; i < count; i++) {
      const p = this.particles[i];

      // Organic fluid motion (harmonic drift)
      const waveX = Math.cos(time * 0.8 + p.seed) * 0.28;
      const waveY = Math.sin(time * 0.7 + p.seed) * 0.28;

      p.x += p.vx + waveX;
      p.y += p.vy + waveY;

      // Mouse fluid ripple interaction
      if (this.mouse.isActive) {
        const mdx = p.x - this.mouse.x;
        const mdy = p.y - this.mouse.y;
        const mDist = Math.hypot(mdx, mdy);

        if (mDist < this.mouse.radius && mDist > 0.1) {
          const force = (1 - mDist / this.mouse.radius) * 2.2;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }
      }

      // Torus wrapping with margin
      const margin = 20;
      if (p.x < -margin) p.x = this.width + margin;
      else if (p.x > this.width + margin) p.x = -margin;
      if (p.y < -margin) p.y = this.height + margin;
      else if (p.y > this.height + margin) p.y = -margin;

      // Twinkling pulsation
      const currentAlpha = Math.max(0.15, p.baseAlpha + Math.sin(time * 1.5 + p.alphaOffset) * 0.2);

      // Choose color
      const useColor = p.isAccent ? `rgba(${r2}, ${g2}, ${b2}, ` : `rgba(${r1}, ${g1}, ${b1}, `;

      // Particle outer glow for accent particles
      if (p.isAccent) {
        ctx.fillStyle = `${useColor}${currentAlpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particle core
      ctx.fillStyle = `${useColor}${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
