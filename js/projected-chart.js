/* ============================================================
   Milestone Financial — Projected Value Multi-Series Chart Engine
   Bar + Multi-Line Visualizer with Dual Y-Axis & Tooltips
   ============================================================ */

window.renderProjectedChart = function (canvas, tooltipEl, config) {
  if (!canvas) return;

  const data = config.data || [];
  if (data.length === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.floor(rect.width) || 600;
  const cssHeight = parseInt(canvas.getAttribute('height')) || 340;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Generous paddings for dual Y-Axis
  const padL = cssWidth < 500 ? 45 : 68;
  const padR = cssWidth < 500 ? 45 : 68;
  const padT = 24;
  const padB = 34;
  const w = cssWidth - padL - padR;
  const h = cssHeight - padT - padB;

  // Colors matching the user's reference image
  const colBar = config.barColor || '#2b7cb3';
  const colLine1 = config.line1Color || '#f97316'; // Orange: Monthly Flow
  const colLine2 = config.line2Color || '#eab308'; // Gold/Yellow: Ending Value
  const colLine3 = config.line3Color || '#16a34a'; // Green: Monthly Growth

  // Formatting helper
  const formatCompact = config.formatCompact || function (num) {
    if (num >= 1e7) return '₹ ' + (num / 1e7).toFixed(2) + ' Cr';
    if (num >= 1e5) return '₹ ' + (num / 1e5).toFixed(2) + ' L';
    if (num >= 1e3) return '₹ ' + (num / 1e3).toFixed(1) + ' K';
    return '₹ ' + Math.round(num).toLocaleString('en-IN');
  };

  // Find max value across all series
  let allVals = [];
  data.forEach(d => {
    if (typeof d.barVal === 'number') allVals.push(d.barVal);
    if (typeof d.line1Val === 'number') allVals.push(d.line1Val);
    if (typeof d.line2Val === 'number') allVals.push(d.line2Val);
    if (typeof d.line3Val === 'number') allVals.push(d.line3Val);
  });
  const rawMax = Math.max(...allVals, 1000);
  const maxVal = rawMax * 1.12;

  // Coordinate mappers
  const stepW = w / data.length;
  const getX = (idx) => padL + idx * stepW + stepW / 2;
  const getY = (val) => {
    const clamped = Math.max(0, Math.min(val, maxVal));
    return padT + h - (clamped / maxVal) * h;
  };

  // Active hover state
  let hoveredIndex = canvas._hoveredIndex !== undefined ? canvas._hoveredIndex : -1;

  function draw() {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // 1. Horizontal Gridlines & Dual Y-Axis (5 levels)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(15, 29, 54, 0.08)';
    ctx.fillStyle = '#64748b';
    ctx.font = '500 11px Poppins, sans-serif';

    const gridSteps = 5;
    for (let g = 0; g <= gridSteps; g++) {
      const gy = padT + (h / gridSteps) * g;
      const val = maxVal * (1 - g / gridSteps);
      const valStr = formatCompact(val);

      // Grid line
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(cssWidth - padR, gy);
      ctx.stroke();

      // Left Y-Axis label
      ctx.textAlign = 'right';
      ctx.fillText(valStr, padL - 8, gy + 4);

      // Right Y-Axis label
      ctx.textAlign = 'left';
      ctx.fillText(valStr, cssWidth - padR + 8, gy + 4);
    }

    // 2. Base bottom border
    ctx.beginPath();
    ctx.moveTo(padL, padT + h);
    ctx.lineTo(cssWidth - padR, padT + h);
    ctx.strokeStyle = 'rgba(15, 29, 54, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Vertical Columns / Bars (Blue)
    const barW = Math.max(3, Math.min(stepW * 0.72, 22));
    data.forEach((d, idx) => {
      if (d.barVal <= 0) return;
      const x = getX(idx) - barW / 2;
      const y = getY(d.barVal);
      const barH = (padT + h) - y;

      ctx.beginPath();
      // Draw bar with slight top rounded corners if width allows
      if (barW > 6) {
        const rad = Math.min(4, barW / 2);
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + barW - rad, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + rad);
        ctx.lineTo(x + barW, padT + h);
        ctx.lineTo(x, padT + h);
        ctx.lineTo(x, y + rad);
        ctx.quadraticCurveTo(x, y, x + rad, y);
      } else {
        ctx.rect(x, y, barW, barH);
      }

      ctx.fillStyle = idx === hoveredIndex ? '#1d4ed8' : colBar;
      ctx.fill();
    });

    const nodeR = data.length > 70 ? 2 : data.length > 40 ? 2.5 : 3.5;
    const hoverNodeR = nodeR + 2.5;

    // 4. Line 3: Monthly Growth / Gain (Green with circular nodes)
    ctx.beginPath();
    let hasLine3 = false;
    data.forEach((d, idx) => {
      if (typeof d.line3Val === 'number') {
        const x = getX(idx);
        const y = getY(d.line3Val);
        if (!hasLine3) {
          ctx.moveTo(x, y);
          hasLine3 = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    if (hasLine3) {
      ctx.strokeStyle = colLine3;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Green Node dots
      data.forEach((d, idx) => {
        if (typeof d.line3Val === 'number') {
          const x = getX(idx);
          const y = getY(d.line3Val);
          ctx.beginPath();
          ctx.arc(x, y, idx === hoveredIndex ? hoverNodeR : nodeR, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = colLine3;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // 5. Line 1: Periodic Flow / SWP / SIP (Orange with circular nodes)
    ctx.beginPath();
    let hasLine1 = false;
    data.forEach((d, idx) => {
      if (typeof d.line1Val === 'number') {
        const x = getX(idx);
        const y = getY(d.line1Val);
        if (!hasLine1) {
          ctx.moveTo(x, y);
          hasLine1 = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    if (hasLine1) {
      ctx.strokeStyle = colLine1;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Orange Node dots
      data.forEach((d, idx) => {
        if (typeof d.line1Val === 'number') {
          const x = getX(idx);
          const y = getY(d.line1Val);
          ctx.beginPath();
          ctx.arc(x, y, idx === hoveredIndex ? hoverNodeR : nodeR, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = colLine1;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }

    // 6. Line 2: Ending Balance / Total Portfolio Value (Gold with circular nodes)
    ctx.beginPath();
    let hasLine2 = false;
    data.forEach((d, idx) => {
      if (typeof d.line2Val === 'number') {
        const x = getX(idx);
        const y = getY(d.line2Val);
        if (!hasLine2) {
          ctx.moveTo(x, y);
          hasLine2 = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    if (hasLine2) {
      ctx.strokeStyle = colLine2;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Gold Node dots
      data.forEach((d, idx) => {
        if (typeof d.line2Val === 'number') {
          const x = getX(idx);
          const y = getY(d.line2Val);
          ctx.beginPath();
          ctx.arc(x, y, idx === hoveredIndex ? hoverNodeR + 1 : nodeR + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      });
    }

    // 7. X-Axis Month / Year Labels with Short Natural Steps
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px Poppins, sans-serif';
    ctx.textAlign = 'center';

    const count = data.length;
    let tickInterval = 6;
    if (count <= 12) {
      tickInterval = cssWidth < 500 ? 3 : 2;
    } else if (count <= 36) {
      tickInterval = cssWidth < 500 ? 6 : 3;
    } else if (count <= 65) {
      tickInterval = cssWidth < 500 ? 12 : 6;
    } else if (count <= 125) {
      tickInterval = cssWidth < 600 ? 24 : 12;
    } else {
      tickInterval = cssWidth < 600 ? 36 : 24;
    }

    data.forEach((d, idx) => {
      const m = d.month || (idx + 1);
      const isStart = idx === 0;
      const isStep = (m - 1) % tickInterval === 0;
      const isEnd = idx === data.length - 1;

      if (isStart || isStep) {
        if (isEnd || idx < data.length - Math.round(tickInterval * 0.5)) {
          const x = getX(idx);
          ctx.fillText(d.label, x, padT + h + 20);
        }
      } else if (isEnd && count > tickInterval && (m - 1) % tickInterval >= Math.round(tickInterval * 0.6)) {
        const x = getX(idx);
        ctx.fillText(d.label, x, padT + h + 20);
      }
    });

    // 8. Hover Highlight Guide Line
    if (hoveredIndex >= 0 && hoveredIndex < data.length) {
      const hx = getX(hoveredIndex);
      ctx.beginPath();
      ctx.moveTo(hx, padT);
      ctx.lineTo(hx, padT + h);
      ctx.strokeStyle = 'rgba(200, 150, 44, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  draw();

  // Mouse interactivity & Tooltip
  if (!canvas._hasInteractionListeners) {
    canvas._hasInteractionListeners = true;

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const mouseX = e.clientX - r.left;
      const mouseY = e.clientY - r.top;

      if (mouseX < padL || mouseX > cssWidth - padR || mouseY < padT || mouseY > cssHeight - padB) {
        canvas._hoveredIndex = -1;
        if (tooltipEl) tooltipEl.style.display = 'none';
        draw();
        return;
      }

      const rawIdx = Math.floor((mouseX - padL) / stepW);
      const idx = Math.max(0, Math.min(rawIdx, data.length - 1));
      canvas._hoveredIndex = idx;
      draw();

      if (tooltipEl && data[idx]) {
        const item = data[idx];
        const titles = config.titles || {
          bar: 'Balance at Beginning',
          line1: 'Monthly Flow',
          line2: 'Ending Balance',
          line3: 'Monthly Growth'
        };

        let html = `<div style="font-weight:800; color:#f0b90b; margin-bottom:6px; font-size:0.84rem; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:4px;">${item.label} ${item.subLabel ? '(' + item.subLabel + ')' : ''}</div>`;
        html += `<div style="display:grid; gap:4px; font-size:0.78rem;">`;
        if (typeof item.barVal === 'number') {
          html += `<div><span style="color:#60a5fa;">■</span> ${titles.bar}: <strong>${formatCompact(item.barVal)}</strong></div>`;
        }
        if (typeof item.line1Val === 'number') {
          html += `<div><span style="color:#fb923c;">●</span> ${titles.line1}: <strong>${formatCompact(item.line1Val)}</strong></div>`;
        }
        if (typeof item.line3Val === 'number') {
          html += `<div><span style="color:#4ade80;">●</span> ${titles.line3}: <strong>${formatCompact(item.line3Val)}</strong></div>`;
        }
        if (typeof item.line2Val === 'number') {
          html += `<div><span style="color:#fde047;">●</span> ${titles.line2}: <strong>${formatCompact(item.line2Val)}</strong></div>`;
        }
        html += `</div>`;

        tooltipEl.innerHTML = html;
        tooltipEl.style.display = 'block';

        const tipW = tooltipEl.offsetWidth || 180;
        let tipX = getX(idx) + 14;
        if (tipX + tipW > cssWidth - 10) {
          tipX = getX(idx) - tipW - 14;
        }
        tooltipEl.style.left = tipX + 'px';
        tooltipEl.style.top = Math.max(10, mouseY - 50) + 'px';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      canvas._hoveredIndex = -1;
      if (tooltipEl) tooltipEl.style.display = 'none';
      draw();
    });
  }
};
