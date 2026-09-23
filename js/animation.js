/**
 * HEARTINTEL - Visual Animation, ECG Canvas & Live Cardiac Telemetry Module
 * Authoritative integration with centralized appState.
 * Supports: IDLE -> VALIDATING -> ANALYZING -> RESULT -> ERROR -> RESET
 * Optimized with IntersectionObserver, Visibility API, and prefers-reduced-motion support.
 */

import { appState } from './state.js';

export function initECGCanvas() {
  const canvas = document.getElementById('ecg-canvas');
  if (!canvas || !canvas.parentElement) return;
  const ctx = canvas.getContext('2d');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = canvas.parentElement.clientWidth;
  let height = canvas.parentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
    if (prefersReducedMotion) {
      drawStaticEcg();
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Dynamic telemetry trace parameters
  let currentSpeed = 2.4;
  let traceColor = '#06b6d4';
  let glowColor = '#06b6d4';
  let wavelengthFactor = 280;

  function getEcgY(t) {
    const cycle = t % 1.0;
    const mid = height / 2;
    const scale = height * 0.38;

    // P-wave (atrial depolarization)
    if (cycle > 0.1 && cycle < 0.22) {
      return mid - Math.sin((cycle - 0.1) / 0.12 * Math.PI) * (scale * 0.22);
    }
    // Q-dip
    if (cycle >= 0.27 && cycle < 0.30) {
      return mid + (scale * 0.2);
    }
    // R-spike (ventricular depolarization)
    if (cycle >= 0.30 && cycle < 0.36) {
      return mid - Math.sin((cycle - 0.30) / 0.06 * Math.PI) * scale;
    }
    // S-dip
    if (cycle >= 0.36 && cycle < 0.40) {
      return mid + (scale * 0.3);
    }
    // T-wave (ventricular repolarization)
    if (cycle > 0.48 && cycle < 0.65) {
      return mid - Math.sin((cycle - 0.48) / 0.17 * Math.PI) * (scale * 0.35);
    }
    return mid;
  }

  function drawStaticEcg() {
    ctx.fillStyle = 'rgba(11, 17, 32, 0.95)';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = traceColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';

    for (let x = 0; x < width; x += 2) {
      const y = getEcgY(x / wavelengthFactor);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Redraw when theme changes
  window.addEventListener('themechange', () => {
    if (prefersReducedMotion) drawStaticEcg();
  });

  // If user prefers reduced motion, draw static waveform and skip rAF loop
  if (prefersReducedMotion) {
    drawStaticEcg();
  } else {
    let headX = 0;
    const history = [];
    let isVisible = true;
    let animId = null;

    function draw() {
      if (!isVisible || document.hidden) {
        animId = null;
        return;
      }

      ctx.fillStyle = 'rgba(11, 17, 32, 0.14)';
      ctx.fillRect(0, 0, width, height);

      const t = headX / wavelengthFactor;
      const y = getEcgY(t);

      history.push({ x: headX, y });
      if (history.length > 120) history.shift();

      // Telemetry trace line
      ctx.beginPath();
      ctx.strokeStyle = traceColor;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;

      for (let i = 0; i < history.length; i++) {
        const pt = history[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Pulse leading point
      ctx.beginPath();
      ctx.arc(headX, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.fill();

      headX += currentSpeed;
      if (headX > width) {
        headX = 0;
        history.length = 0;
      }

      animId = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (!animId && isVisible && !document.hidden) {
        animId = requestAnimationFrame(draw);
      }
    }

    // IntersectionObserver to avoid rendering when scrolled out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(canvas.parentElement);

    // Visibility change to conserve system resources
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && isVisible) {
        startLoop();
      }
    });

    startLoop();
  }

  // --- SINGLE SOURCE OF TRUTH: TELEMETRY PANEL SYNCHRONIZATION ---
  const heartNode = document.getElementById('hero-heart-node');
  const hrDisplay = document.getElementById('ecg-hr-display');
  const flowNodes = document.querySelectorAll('.flow-node-item[data-step]');
  const nodeRiskValue = document.getElementById('node-risk-value');

  /**
   * Authoritative render function for the Telemetry Panel Risk Stratification card
   * Handles: 'idle' | 'validating' | 'analyzing' | 'complete' | 'error'
   */
  function syncTelemetryPanel() {
    const state = appState.getState();
    const status = state.analysisStatus || 'idle';
    const step = state.analysisStep || 0;

    // 1. Update pipeline flow nodes (01 -> 04)
    flowNodes.forEach(fn => {
      const fnStep = parseInt(fn.getAttribute('data-step'), 10);
      if (status === 'complete') {
        fn.className = 'flow-node-item completed';
      } else if (status === 'validating' || status === 'analyzing') {
        if (fnStep < step) {
          fn.className = 'flow-node-item completed';
        } else if (fnStep === step) {
          fn.className = 'flow-node-item active';
        } else {
          fn.className = 'flow-node-item';
        }
      } else {
        // Idle or error
        if (fnStep === 1) {
          fn.className = 'flow-node-item active';
        } else {
          fn.className = 'flow-node-item';
        }
      }
    });

    // 2. Handle State-Specific Visuals & Risk Stratification Card
    if (status === 'idle') {
      if (heartNode) heartNode.className = 'heart-pulse-node state-idle';
      currentSpeed = 2.4;
      wavelengthFactor = 280;
      traceColor = '#06b6d4';
      glowColor = '#06b6d4';
      if (hrDisplay) hrDisplay.textContent = 'HR: 72 BPM';

      if (nodeRiskValue) {
        nodeRiskValue.style.color = 'var(--text-secondary)';
        nodeRiskValue.innerHTML = `<span style="font-size:0.88rem; font-weight:600;">Awaiting Analysis</span>`;
      }
    } else if (status === 'validating') {
      if (heartNode) heartNode.className = 'heart-pulse-node state-analyzing';
      currentSpeed = 3.5;
      wavelengthFactor = 240;
      traceColor = '#06b6d4';
      glowColor = '#06b6d4';
      if (hrDisplay) hrDisplay.textContent = 'HR: 100 BPM (VALIDATING)';

      if (nodeRiskValue) {
        nodeRiskValue.style.color = 'var(--accent-cyan)';
        nodeRiskValue.innerHTML = `<span style="font-size:0.88rem; font-weight:700;">Validating...</span>`;
      }
    } else if (status === 'analyzing') {
      if (step === 4) {
        if (heartNode) heartNode.className = 'heart-pulse-node state-risk-assessment';
        currentSpeed = 3.2;
        wavelengthFactor = 250;
        traceColor = '#f59e0b';
        glowColor = '#f59e0b';
        if (hrDisplay) hrDisplay.textContent = 'HR: 94 BPM (STRATIFYING)';
      } else {
        if (heartNode) heartNode.className = 'heart-pulse-node state-analyzing';
        currentSpeed = 4.0;
        wavelengthFactor = 220;
        traceColor = '#06b6d4';
        glowColor = '#06b6d4';
        if (hrDisplay) hrDisplay.textContent = 'HR: 112 BPM (INFERENCE)';
      }

      if (nodeRiskValue) {
        nodeRiskValue.style.color = 'var(--accent-amber)';
        nodeRiskValue.innerHTML = `<span style="font-size:0.88rem; font-weight:700;">Analyzing...</span>`;
      }
    } else if (status === 'complete') {
      const score = typeof state.riskScore === 'number' ? state.riskScore : null;
      const level = state.riskLevel || 'MODERATE';
      const levelLower = level.toLowerCase();

      // Color mapping
      let colorVar = 'var(--accent-emerald)';
      let hrText = 'HR: 68 BPM (LOW RISK)';
      if (level === 'CRITICAL' || level === 'HIGH') {
        colorVar = 'var(--accent-rose)';
        currentSpeed = 3.4;
        wavelengthFactor = 240;
        traceColor = '#f43f5e';
        glowColor = '#f43f5e';
        hrText = level === 'CRITICAL' ? 'HR: 104 BPM (CRITICAL)' : 'HR: 96 BPM (HIGH RISK)';
      } else if (level === 'MODERATE') {
        colorVar = 'var(--accent-amber)';
        currentSpeed = 2.6;
        wavelengthFactor = 270;
        traceColor = '#f59e0b';
        glowColor = '#f59e0b';
        hrText = 'HR: 78 BPM (MODERATE)';
      } else {
        currentSpeed = 2.2;
        wavelengthFactor = 300;
        traceColor = '#10b981';
        glowColor = '#10b981';
        hrText = 'HR: 68 BPM (LOW RISK)';
      }

      if (heartNode) {
        heartNode.className = `heart-pulse-node state-result result-${levelLower}`;
      }
      if (hrDisplay) hrDisplay.textContent = hrText;

      if (nodeRiskValue) {
        if (score !== null && level) {
          nodeRiskValue.style.color = colorVar;
          nodeRiskValue.innerHTML = `
            <span style="font-family:var(--font-mono); font-weight:800; font-size:1.05rem;">${score}%</span>
            <span class="visual-badge" style="font-size:0.65rem; background:rgba(255,255,255,0.08); border-color:currentColor; margin-left:4px;">
              ${level}
            </span>
          `;
        } else {
          nodeRiskValue.style.color = 'var(--text-secondary)';
          nodeRiskValue.innerHTML = `<span style="font-size:0.88rem; font-weight:600;">Awaiting Analysis</span>`;
        }
      }
    } else if (status === 'error') {
      if (heartNode) heartNode.className = 'heart-pulse-node state-idle';
      currentSpeed = 2.4;
      wavelengthFactor = 280;
      traceColor = '#f43f5e';
      glowColor = '#f43f5e';
      if (hrDisplay) hrDisplay.textContent = 'HR: -- BPM';

      if (nodeRiskValue) {
        nodeRiskValue.style.color = 'var(--accent-rose)';
        nodeRiskValue.innerHTML = `<span style="font-size:0.85rem; font-weight:700;">Analysis Unavailable</span>`;
      }
    }
  }

  // Initial synchronization
  syncTelemetryPanel();

  // Listen to all state transitions
  appState.on('analysis:step', () => syncTelemetryPanel());
  appState.on('analysis:complete', () => syncTelemetryPanel());
  appState.on('analysis:error', () => syncTelemetryPanel());
  appState.on('analysis:reset', () => syncTelemetryPanel());
}

export function initMetricsObserver() {
  const metricCards = document.querySelectorAll('.metric-number[data-target]');
  if (!metricCards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.getAttribute('data-decimal') === 'true';
        const suffix = el.getAttribute('data-suffix') || '';

        if (prefersReducedMotion) {
          el.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
        } else {
          animateValue(el, 0, target, 1200, isDecimal, suffix);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  metricCards.forEach(card => observer.observe(card));

  function animateValue(obj, start, end, duration, isDecimal, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;
      obj.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = (isDecimal ? end.toFixed(1) : end) + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }
}
