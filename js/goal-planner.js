/* ============================================================
   Goal-Based Investment Planner — Interactive Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const goalSelect = document.getElementById('goalSelect')
  const customGoalWrap = document.getElementById('customGoalWrap')
  const customGoalInput = document.getElementById('customGoalInput')
  const compactGoalRow = document.getElementById('compactGoalRow')
  const goalAmount = document.getElementById('goalAmount')
  const goalYears = document.getElementById('goalYears')
  const goalReturn = document.getElementById('goalReturn')
  const inflationToggle = document.getElementById('inflationToggle')

  if (!goalSelect || !goalAmount || !goalYears || !goalReturn) return

  // Output elements
  const goalAmountInput = document.getElementById('goalAmountInput')
  const goalAmountVal = document.getElementById('goalAmountVal')
  const goalYearsVal = document.getElementById('goalYearsVal')
  const goalReturnInput = document.getElementById('goalReturnInput')
  const goalReturnVal = document.getElementById('goalReturnVal')
  const goalTitleDisplay = document.getElementById('goalTitleDisplay')
  const futureCostDisplay = document.getElementById('futureCostDisplay')
  const requiredSipOut = document.getElementById('requiredSipOut')
  const requiredLumpOut = document.getElementById('requiredLumpOut')
  const stepUpSipOut = document.getElementById('stepUpSipOut')
  const totalInvestedOut = document.getElementById('totalInvestedOut')
  const wealthGainOut = document.getElementById('wealthGainOut')
  const goalTargetOut = document.getElementById('goalTargetOut')
  const gainRatioBar = document.getElementById('gainRatioBar')
  const investRatioBar = document.getElementById('investRatioBar')
  const milestoneTableBody = document.getElementById('goalMilestoneBody')
  const canvas = document.getElementById('goalChart')
  const consultationBtn = document.getElementById('goalConsultBtn')
  const waBtn = document.getElementById('goalWaBtn')

  // Clean crisp vector SVGs for every life goal (no emojis)
  const GOAL_SVGS = {
    education: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    retirement: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    marriage: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="M9 7l3-3 3 3"/><polyline points="8.5 7.5 12 4 15.5 7.5"/></svg>`,
    car: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h8l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>`,
    vacation: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    business: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    other: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8962c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
  }

  // Common preset goals
  const GOAL_PRESETS = {
    education: {
      name: "Child's Higher Education",
      amount: 3000000,
      years: 10,
      badge: "Higher Education",
      desc: "Planning for college, engineering, MBA, or study abroad degree."
    },
    home: {
      name: "Dream Home Down Payment",
      amount: 5000000,
      years: 7,
      badge: "Home Down Payment",
      desc: "Accumulate down payment and interior cost without crushing EMI debts."
    },
    retirement: {
      name: "Retirement & Financial Freedom",
      amount: 15000000,
      years: 18,
      badge: "Early Retirement",
      desc: "Build a self-sustaining corpus to generate lifelong monthly passive income."
    },
    marriage: {
      name: "Child's Marriage Celebration",
      amount: 2500000,
      years: 12,
      badge: "Wedding Celebration",
      desc: "Fund your child's wedding grandly without liquidating family properties."
    },
    car: {
      name: "Luxury Vehicle Purchase",
      amount: 1500000,
      years: 4,
      badge: "Vehicle Upgrade",
      desc: "Buy your dream car with upfront cash instead of high 9.5% auto loans."
    },
    vacation: {
      name: "International Family Vacation",
      amount: 800000,
      years: 3,
      badge: "World Tour",
      desc: "Fully fund a luxury European or Swiss family holiday debt-free."
    },
    business: {
      name: "Startup / Business Expansion",
      amount: 4000000,
      years: 6,
      badge: "Business Venture",
      desc: "Seed capital reserve to launch or expand your enterprise in Gujarat."
    },
    other: {
      name: "Custom Wealth Milestone",
      amount: 2500000,
      years: 5,
      badge: "Custom Milestone",
      desc: "Your personalized wealth goal built specifically around your timeline."
    }
  }

  const formatINR = (num) => Math.round(num).toLocaleString('en-IN')

  const formatCompact = (num) => {
    if (num >= 1e7) return '₹' + (num / 1e7).toFixed(2) + ' Cr'
    if (num >= 1e5) return '₹' + (num / 1e5).toFixed(2) + ' L'
    if (num >= 1e3) return '₹' + (num / 1e3).toFixed(1) + ' K'
    return '₹' + Math.round(num).toLocaleString('en-IN')
  }

  /* Calculate required monthly SIP to reach target FV
     FV = P * (((1 + i)^n - 1) / i) * (1 + i)
     => P = (FV * i) / [ ((1 + i)^n - 1) * (1 + i) ] */
  const calcRequiredSip = (targetFV, annualRatePct, yearsCount) => {
    const i = annualRatePct / 100 / 12
    const n = Math.round(yearsCount * 12)
    if (i <= 0 || n <= 0) return targetFV / (n || 1)
    const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    return targetFV / factor
  }

  /* Calculate required one-time lump sum today (PV)
     PV = FV / (1 + r)^y */
  const calcRequiredLump = (targetFV, annualRatePct, yearsCount) => {
    const r = annualRatePct / 100
    return targetFV / Math.pow(1 + r, yearsCount)
  }

  /* Calculate Starting monthly SIP for a 10% annual Step-Up SIP */
  const calcStepUpStartingSip = (targetFV, annualRatePct, yearsCount, stepUpRate = 0.10) => {
    const i = annualRatePct / 100 / 12
    const totalMonths = Math.round(yearsCount * 12)
    let totalFactor = 0

    for (let yr = 0; yr < yearsCount; yr++) {
      const stepMultiplier = Math.pow(1 + stepUpRate, yr)
      for (let m = 1; m <= 12; m++) {
        const monthIndex = yr * 12 + m
        if (monthIndex > totalMonths) break
        const monthsCompounding = totalMonths - monthIndex + 1
        totalFactor += stepMultiplier * Math.pow(1 + i, monthsCompounding)
      }
    }

    return totalFactor > 0 ? targetFV / totalFactor : calcRequiredSip(targetFV, annualRatePct, yearsCount)
  }

  const updateSliderFill = (input) => {
    const min = parseFloat(input.min)
    const max = parseFloat(input.max)
    const pct = ((parseFloat(input.value) - min) / (max - min)) * 100
    input.style.setProperty('--fill', pct + '%')
  }

  // Draw chart showing goal trajectory over time
  const drawGoalTrajectory = (monthlySip, yearsCount, annualRatePct, targetFV) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width || 480
    const h = 260

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const padLeft = 60
    const padRight = 30
    const padTop = 30
    const padBottom = 40
    const chartW = w - padLeft - padRight
    const chartH = h - padTop - padBottom

    const months = Math.round(yearsCount * 12)
    const i = annualRatePct / 100 / 12

    // Points for SIP value and Invested line
    const dataPoints = []
    const stepMonths = Math.max(1, Math.floor(months / 24))

    for (let m = 0; m <= months; m += stepMonths) {
      const inv = monthlySip * m
      const val = m === 0 ? 0 : monthlySip * ((Math.pow(1 + i, m) - 1) / i) * (1 + i)
      dataPoints.push({
        month: m,
        year: (m / 12).toFixed(1),
        invested: inv,
        value: Math.min(val, targetFV * 1.05)
      })
    }
    if (dataPoints[dataPoints.length - 1].month !== months) {
      dataPoints.push({
        month: months,
        year: yearsCount,
        invested: monthlySip * months,
        value: targetFV
      })
    }

    const maxY = targetFV * 1.15 || 1000

    // Grid lines
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (let g = 0; g <= 4; g++) {
      const yVal = (maxY / 4) * g
      const yPos = padTop + chartH - (yVal / maxY) * chartH
      ctx.beginPath()
      ctx.moveTo(padLeft, yPos)
      ctx.lineTo(w - padRight, yPos)
      ctx.stroke()

      ctx.fillStyle = '#64748b'
      ctx.font = '10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(formatCompact(yVal), padLeft - 8, yPos + 3)
    }

    ctx.setLineDash([])

    // Target Horizon Dashed Goal Line (Top Target Marker)
    const targetY = padTop + chartH - (targetFV / maxY) * chartH
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(padLeft, targetY)
    ctx.lineTo(w - padRight, targetY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#b45309'
    ctx.font = 'bold 11px Inter, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Target: ' + formatCompact(targetFV), padLeft + 8, targetY - 6)

    // Area Fill for Value Growth
    const valGrad = ctx.createLinearGradient(0, padTop, 0, h - padBottom)
    valGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)')
    valGrad.addColorStop(1, 'rgba(16, 185, 129, 0.02)')

    ctx.beginPath()
    dataPoints.forEach((p, idx) => {
      const x = padLeft + (p.month / months) * chartW
      const y = padTop + chartH - (p.value / maxY) * chartH
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineTo(padLeft + chartW, padTop + chartH)
    ctx.lineTo(padLeft, padTop + chartH)
    ctx.closePath()
    ctx.fillStyle = valGrad
    ctx.fill()

    // Draw Line: Mutual Fund Compounded Value
    ctx.beginPath()
    dataPoints.forEach((p, idx) => {
      const x = padLeft + (p.month / months) * chartW
      const y = padTop + chartH - (p.value / maxY) * chartH
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw Line: Your Pocket Contribution
    ctx.beginPath()
    dataPoints.forEach((p, idx) => {
      const x = padLeft + (p.month / months) * chartW
      const y = padTop + chartH - (p.invested / maxY) * chartH
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.stroke()

    // Final point pulse
    const endPoint = dataPoints[dataPoints.length - 1]
    const endX = padLeft + chartW
    const endY = padTop + chartH - (endPoint.value / maxY) * chartH

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(endX, endY, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.stroke()

    // X axis ticks
    ctx.fillStyle = '#64748b'
    ctx.font = '10px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Today', padLeft, h - padBottom + 18)
    ctx.fillText('Year ' + Math.round(yearsCount / 2), padLeft + chartW / 2, h - padBottom + 18)
    ctx.fillText('Year ' + yearsCount + ' (Goal Reached)', padLeft + chartW, h - padBottom + 18)
  }

  // Update Milestone Table
  const updateMilestoneTable = (monthlySip, annualRatePct, yearsCount, targetFV) => {
    if (!milestoneTableBody) return
    const checkpoints = [0.25, 0.50, 0.75, 1.00]
    let html = ''

    const i = annualRatePct / 100 / 12

    checkpoints.forEach((pct) => {
      const targetChunk = targetFV * pct
      const targetYear = Math.max(1, Math.round(yearsCount * pct))
      const targetMonth = targetYear * 12
      const pocketInvested = monthlySip * targetMonth
      const accruedValue = targetMonth === 0 ? 0 : monthlySip * ((Math.pow(1 + i, targetMonth) - 1) / i) * (1 + i)
      const wealthCreated = Math.max(0, accruedValue - pocketInvested)
      const pctDisplay = (pct * 100).toFixed(0) + '%'

      html += `
        <tr>
          <td>
            <span class="milestone-badge-chip">Year ${targetYear}</span>
            <small style="display:block; color:#64748b; font-size:0.75rem; margin-top:2px;">${pctDisplay} of Goal Timeline</small>
          </td>
          <td>${formatCompact(pocketInvested)}</td>
          <td style="color:#10b981; font-weight:600;">+${formatCompact(wealthCreated)}</td>
          <td class="gold-td" style="font-weight:700;">${formatCompact(accruedValue)}</td>
        </tr>
      `
    })

    milestoneTableBody.innerHTML = html
  }

  const computeGoal = () => {
    const selectedKey = goalSelect.value
    let goalName = ''

    if (selectedKey === 'other' && customGoalInput && customGoalInput.value.trim()) {
      goalName = customGoalInput.value.trim()
    } else {
      const preset = GOAL_PRESETS[selectedKey] || GOAL_PRESETS.education
      goalName = preset.name
    }

    // Dynamic SVG icon badge updates for both top selector and blueprint title
    const goalSvgBadge = document.getElementById('goalSvgBadge')
    const blueprintGoalSvg = document.getElementById('blueprintGoalSvg')
    const currentSvg = GOAL_SVGS[selectedKey] || GOAL_SVGS.other
    if (goalSvgBadge) goalSvgBadge.innerHTML = currentSvg
    if (blueprintGoalSvg) blueprintGoalSvg.innerHTML = currentSvg

    const presentTarget = parseFloat(goalAmount.value)
    const yearsCount = parseFloat(goalYears.value)
    const annualRate = parseFloat(goalReturn.value)
    const isInflationOn = inflationToggle ? inflationToggle.checked : false

    // Effective Future Value considering 6% inflation if checked
    const inflationRate = isInflationOn ? 0.06 : 0.0
    const finalTargetFV = presentTarget * Math.pow(1 + inflationRate, yearsCount)

    const requiredMonthlySip = calcRequiredSip(finalTargetFV, annualRate, yearsCount)
    const requiredLumpSum = calcRequiredLump(finalTargetFV, annualRate, yearsCount)
    const stepUpStartingSip = calcStepUpStartingSip(finalTargetFV, annualRate, yearsCount, 0.10)

    const totalPocketInvested = requiredMonthlySip * yearsCount * 12
    const totalWealthGain = Math.max(0, finalTargetFV - totalPocketInvested)

    // Update Text Displays
    if (goalAmountInput && document.activeElement !== goalAmountInput) {
      goalAmountInput.value = '₹' + formatINR(presentTarget)
    }
    if (goalAmountVal) {
      goalAmountVal.textContent = '₹' + formatINR(presentTarget)
    }
    goalYearsVal.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
    if (goalReturnInput && document.activeElement !== goalReturnInput) {
      goalReturnInput.value = annualRate + '%'
    }
    if (goalReturnVal) {
      goalReturnVal.textContent = annualRate + '%'
    }
    if (goalTitleDisplay) goalTitleDisplay.textContent = goalName

    const goalYearsDisplay = document.getElementById('goalYearsDisplay')
    const goalReturnDisplay = document.getElementById('goalReturnDisplay')
    if (goalYearsDisplay) goalYearsDisplay.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
    if (goalReturnDisplay) goalReturnDisplay.textContent = annualRate + '%'

    if (futureCostDisplay) {
      if (isInflationOn) {
        futureCostDisplay.innerHTML = `
          <span class="future-inflation-alert">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Inflation-Adjusted Target: <strong>${formatCompact(finalTargetFV)}</strong> (at 6% p.a. inflation)
          </span>
        `
      } else {
        futureCostDisplay.innerHTML = `
          <span class="future-target-tag">Target Horizon Cost: <strong>${formatCompact(finalTargetFV)}</strong></span>
        `
      }
    }

    // Option 1 Metrics Sync
    const targetWithInflationOut = document.getElementById('targetWithInflationOut')
    if (targetWithInflationOut) targetWithInflationOut.textContent = formatCompact(finalTargetFV)

    const investYearsLabel = document.getElementById('investYearsLabel')
    if (investYearsLabel) investYearsLabel.textContent = `Investment in ${yearsCount} Yrs`

    const gainYearsLabel = document.getElementById('gainYearsLabel')
    if (gainYearsLabel) gainYearsLabel.textContent = `Gain in ${yearsCount} Yrs`

    if (requiredSipOut) requiredSipOut.textContent = formatCompact(requiredMonthlySip) + '/mo'
    if (requiredLumpOut) requiredLumpOut.textContent = formatCompact(requiredLumpSum)
    if (stepUpSipOut) stepUpSipOut.textContent = formatCompact(stepUpStartingSip) + '/mo'
    if (totalInvestedOut) totalInvestedOut.textContent = formatCompact(totalPocketInvested)
    if (wealthGainOut) wealthGainOut.textContent = formatCompact(totalWealthGain)
    if (goalTargetOut) goalTargetOut.textContent = formatCompact(finalTargetFV)

    // Option 2: Lump Sum breakdown (Full Width)
    const lumpTargetWithInflationEl = document.getElementById('lumpTargetWithInflationOut')
    if (lumpTargetWithInflationEl) lumpTargetWithInflationEl.textContent = formatCompact(finalTargetFV)

    const lumpInvestYearsEl = document.getElementById('lumpInvestYearsLabel')
    if (lumpInvestYearsEl) lumpInvestYearsEl.textContent = `Investment in ${yearsCount} Yrs`

    const lumpInvestedEl = document.getElementById('lumpInvestedOut')
    if (lumpInvestedEl) lumpInvestedEl.textContent = formatCompact(requiredLumpSum)

    const lumpReturnsYearsEl = document.getElementById('lumpReturnsYearsLabel')
    if (lumpReturnsYearsEl) lumpReturnsYearsEl.textContent = `Gain in ${yearsCount} Yrs`

    const lumpReturnsEl = document.getElementById('lumpReturnsOut')
    const lumpCorpusEl = document.getElementById('lumpCorpusOut')
    if (lumpReturnsEl) lumpReturnsEl.textContent = formatCompact(Math.max(0, finalTargetFV - requiredLumpSum))
    if (lumpCorpusEl) lumpCorpusEl.textContent = formatCompact(finalTargetFV)

    // Option 2 Ratio Bar
    const lumpInvestRatioBar = document.getElementById('lumpInvestRatioBar')
    const lumpGainRatioBar = document.getElementById('lumpGainRatioBar')
    if (lumpInvestRatioBar && lumpGainRatioBar) {
      const lumpInvestPct = Math.min(100, Math.max(5, (requiredLumpSum / finalTargetFV) * 100))
      lumpInvestRatioBar.style.width = lumpInvestPct + '%'
      lumpGainRatioBar.style.width = (100 - lumpInvestPct) + '%'
    }

    // Option 3: Step-Up SIP breakdown (Full Width)
    let stepUpTotalPocket = 0
    for (let yr = 0; yr < yearsCount; yr++) {
      stepUpTotalPocket += (stepUpStartingSip * Math.pow(1.10, yr)) * 12
    }

    const stepUpTargetWithInflationEl = document.getElementById('stepUpTargetWithInflationOut')
    if (stepUpTargetWithInflationEl) stepUpTargetWithInflationEl.textContent = formatCompact(finalTargetFV)

    const stepUpY2El = document.getElementById('stepUpY2Out')
    if (stepUpY2El) stepUpY2El.textContent = formatCompact(stepUpStartingSip * 1.10) + '/mo'

    const stepUpInvestYearsEl = document.getElementById('stepUpInvestYearsLabel')
    if (stepUpInvestYearsEl) stepUpInvestYearsEl.textContent = `Investment in ${yearsCount} Yrs`

    const stepUpTotalInvestedEl = document.getElementById('stepUpTotalInvestedOut')
    if (stepUpTotalInvestedEl) stepUpTotalInvestedEl.textContent = formatCompact(stepUpTotalPocket)

    const stepUpCorpusEl = document.getElementById('stepUpCorpusOut')
    if (stepUpCorpusEl) stepUpCorpusEl.textContent = formatCompact(finalTargetFV)

    // Option 3 Ratio Bar
    const stepUpInvestRatioBar = document.getElementById('stepUpInvestRatioBar')
    const stepUpGainRatioBar = document.getElementById('stepUpGainRatioBar')
    if (stepUpInvestRatioBar && stepUpGainRatioBar) {
      const stepUpInvestPct = Math.min(100, Math.max(5, (stepUpTotalPocket / finalTargetFV) * 100))
      stepUpInvestRatioBar.style.width = stepUpInvestPct + '%'
      stepUpGainRatioBar.style.width = (100 - stepUpInvestPct) + '%'
    }

    // Ratios Bar
    const investPct = Math.min(100, Math.max(5, (totalPocketInvested / finalTargetFV) * 100))
    const gainPct = 100 - investPct
    if (investRatioBar) investRatioBar.style.width = investPct + '%'
    if (gainRatioBar) gainRatioBar.style.width = gainPct + '%'

    updateSliderFill(goalAmount)
    updateSliderFill(goalYears)
    updateSliderFill(goalReturn)

    // Sync pill buttons
    document.querySelectorAll('[data-goal-amount]').forEach((b) => {
      b.classList.toggle('active', parseFloat(b.dataset.goalAmount) === presentTarget)
    })
    document.querySelectorAll('[data-goal-years]').forEach((b) => {
      b.classList.toggle('active', parseFloat(b.dataset.goalYears) === yearsCount)
    })
    document.querySelectorAll('[data-goal-return]').forEach((b) => {
      b.classList.toggle('active', parseFloat(b.dataset.goalReturn) === annualRate)
    })

    const inflationBadge = document.getElementById('inflationBadgeVal')
    if (inflationBadge) {
      if (isInflationOn) {
        inflationBadge.textContent = '6% p.a. ON'
        inflationBadge.style.background = '#047857'
      } else {
        inflationBadge.textContent = 'OFF (0%)'
        inflationBadge.style.background = '#64748b'
      }
    }

    // Dynamic Guidance & Status Banner update
    const goalGuidanceText = document.getElementById('goalGuidanceText')
    if (goalGuidanceText) {
      goalGuidanceText.innerHTML = `<strong>Customized Roadmap for:</strong> <strong>${goalName}</strong> &bull; Target: <strong>₹${formatINR(presentTarget)}</strong> ${isInflationOn ? `(Adjusted to <strong>₹${formatINR(finalTargetFV)}</strong> with 6% inflation)` : ''} in <strong>${yearsCount} Years</strong> @ <strong>${annualRate}% Return</strong>. <em>(Adjust inputs above to modify your blueprint)</em>`
    }

    // Dynamic Option Headings
    const opt1Title = document.getElementById('opt1Title')
    if (opt1Title) opt1Title.textContent = `Option 1: Regular Monthly SIP (Requires ₹${formatINR(requiredMonthlySip)}/mo)`

    const opt2Title = document.getElementById('opt2Title')
    if (opt2Title) opt2Title.textContent = `Option 2: One-Time Lump Sum (Invest ₹${formatINR(requiredLumpSum)} Today)`

    const opt3Title = document.getElementById('opt3Title')
    if (opt3Title) opt3Title.textContent = `Option 3: Step-Up SIP (+10%/yr) (Start with ₹${formatINR(stepUpStartingSip)}/mo in Year 1)`

    drawGoalTrajectory(requiredMonthlySip, yearsCount, annualRate, finalTargetFV)
    updateMilestoneTable(requiredMonthlySip, annualRate, yearsCount, finalTargetFV)

    /* ---------- Update Goal Report & Summary Tables ---------- */
    const rptGoalName = document.getElementById('goalRptName')
    const rptPresCost = document.getElementById('goalRptPresentCost')
    const rptYrs = document.getElementById('goalRptYears')
    const rptRet = document.getElementById('goalRptReturn')
    const rptFutCost = document.getElementById('goalRptFutureCost')
    if (rptGoalName) rptGoalName.textContent = goalName
    if (rptPresCost) rptPresCost.textContent = formatINR(presentTarget)
    if (rptYrs) rptYrs.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
    if (rptRet) rptRet.textContent = annualRate + '%'
    if (rptFutCost) rptFutCost.textContent = formatINR(finalTargetFV)

    const sumSipMo = document.getElementById('goalSumSipMonthly')
    const sumSipInv = document.getElementById('goalSumSipInvested')
    const sumSipGain = document.getElementById('goalSumSipGain')
    const sumSipMat = document.getElementById('goalSumSipMaturity')
    if (sumSipMo) sumSipMo.textContent = '₹' + formatINR(requiredMonthlySip) + '/mo'
    if (sumSipInv) sumSipInv.textContent = '₹' + formatINR(totalPocketInvested)
    if (sumSipGain) sumSipGain.textContent = '₹' + formatINR(totalWealthGain)
    if (sumSipMat) sumSipMat.textContent = '₹' + formatINR(finalTargetFV)

    const sumLumpOne = document.getElementById('goalSumLumpOneTime')
    const sumLumpInv = document.getElementById('goalSumLumpInvested')
    const sumLumpGain = document.getElementById('goalSumLumpGain')
    const sumLumpMat = document.getElementById('goalSumLumpMaturity')
    if (sumLumpOne) sumLumpOne.textContent = '₹' + formatINR(requiredLumpSum)
    if (sumLumpInv) sumLumpInv.textContent = '₹' + formatINR(requiredLumpSum)
    if (sumLumpGain) sumLumpGain.textContent = '₹' + formatINR(Math.max(0, finalTargetFV - requiredLumpSum))
    if (sumLumpMat) sumLumpMat.textContent = '₹' + formatINR(finalTargetFV)

    const sumStepMo = document.getElementById('goalSumStepMonthly')
    const sumStepInv = document.getElementById('goalSumStepInvested')
    const sumStepGain = document.getElementById('goalSumStepGain')
    const sumStepMat = document.getElementById('goalSumStepMaturity')
    if (sumStepMo) sumStepMo.textContent = '₹' + formatINR(stepUpStartingSip) + '/mo (Yr 1)'
    if (sumStepInv) sumStepInv.textContent = '₹' + formatINR(stepUpTotalPocket)
    if (sumStepGain) sumStepGain.textContent = '₹' + formatINR(Math.max(0, finalTargetFV - stepUpTotalPocket))
    if (sumStepMat) sumStepMat.textContent = '₹' + formatINR(finalTargetFV)

    // Update CTA link with pre-filled WhatsApp message
    if (waBtn) {
      const waMsg = encodeURIComponent(
        `Hello Chetan bhai! I used your Goal Planner on Milestone Financial. I want to achieve my goal for "${goalName}" of ${formatCompact(finalTargetFV)} in ${yearsCount} years. Please guide me with the best mutual fund portfolio & SIP allocation.`
      )
      waBtn.href = `https://wa.me/919824421676?text=${waMsg}`
    }

    if (consultationBtn) {
      consultationBtn.href = `contact.html?goal=${encodeURIComponent(goalName)}&amount=${encodeURIComponent(finalTargetFV)}&years=${yearsCount}`
    }
  }

  // Handle Preset Dropdown Changes
  goalSelect.addEventListener('change', () => {
    const key = goalSelect.value
    if (key === 'other') {
      if (customGoalWrap) customGoalWrap.style.display = 'block'
      if (compactGoalRow) compactGoalRow.classList.add('has-custom')
      if (customGoalInput) {
        customGoalInput.value = ''
        customGoalInput.placeholder = 'Type your custom goal name...'
        customGoalInput.focus()
      }
    } else {
      if (customGoalWrap) customGoalWrap.style.display = 'none'
      if (compactGoalRow) compactGoalRow.classList.remove('has-custom')
      const preset = GOAL_PRESETS[key]
      if (preset) {
        if (customGoalInput) customGoalInput.value = preset.name
        goalAmount.value = preset.amount
        goalYears.value = preset.years
      }
    }
    computeGoal()
  })

  if (customGoalInput) {
    customGoalInput.addEventListener('input', computeGoal)
  }

  // Quick Preset Pill Buttons for Target Amount, Years, and Return Rate
  document.querySelectorAll('[data-goal-amount]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-goal-amount]').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      goalAmount.value = btn.dataset.goalAmount
      computeGoal()
    })
  })

  document.querySelectorAll('[data-goal-years]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-goal-years]').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      goalYears.value = btn.dataset.goalYears
      computeGoal()
    })
  })

  document.querySelectorAll('[data-goal-return]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-goal-return]').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      goalReturn.value = btn.dataset.goalReturn
      computeGoal()
    })
  })

  // Input listeners
  goalAmount.addEventListener('input', computeGoal)

  if (goalAmountInput) {
    goalAmountInput.addEventListener('input', () => {
      const raw = goalAmountInput.value.replace(/[^0-9]/g, '')
      if (raw) {
        const val = Math.min(50000000, Math.max(100000, parseFloat(raw)))
        goalAmount.value = val
        computeGoal()
      }
    })

    goalAmountInput.addEventListener('blur', () => {
      const raw = goalAmountInput.value.replace(/[^0-9]/g, '')
      const val = raw ? Math.min(50000000, Math.max(100000, parseFloat(raw))) : 3000000
      goalAmount.value = val
      goalAmountInput.value = '₹' + formatINR(val)
      computeGoal()
    })

    goalAmountInput.addEventListener('focus', () => {
      goalAmountInput.select()
    })
  }

  goalYears.addEventListener('input', computeGoal)
  goalReturn.addEventListener('input', computeGoal)

  if (goalReturnInput) {
    goalReturnInput.addEventListener('input', () => {
      const raw = goalReturnInput.value.replace(/[^0-9.]/g, '')
      if (raw) {
        const val = Math.min(40, Math.max(1, parseFloat(raw)))
        goalReturn.value = val
        computeGoal()
      }
    })

    goalReturnInput.addEventListener('blur', () => {
      const raw = goalReturnInput.value.replace(/[^0-9.]/g, '')
      const val = raw ? Math.min(40, Math.max(1, parseFloat(raw))) : 12
      goalReturn.value = val
      goalReturnInput.value = val + '%'
      computeGoal()
    })

    goalReturnInput.addEventListener('focus', () => {
      goalReturnInput.select()
    })
  }

  if (inflationToggle) {
    inflationToggle.addEventListener('change', computeGoal)
  }

  // Quick preset cards at top
  document.querySelectorAll('.goal-preset-card').forEach((card) => {
    card.addEventListener('click', () => {
      const gkey = card.dataset.goalKey
      if (gkey && goalSelect) {
        goalSelect.value = gkey
        if (customGoalWrap) customGoalWrap.style.display = 'none'
        if (compactGoalRow) compactGoalRow.classList.remove('has-custom')
        goalSelect.dispatchEvent(new Event('change'))
        // Scroll smoothly to simulator
        const sim = document.getElementById('goalSimulatorSection')
        if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  /* PDF Download & Print Actions */
  const downloadPdfBtn = document.getElementById('downloadPdfBtn')
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (typeof window.generateCalculatorPDF === 'function') {
        const goalNameText = document.getElementById('goalTitleDisplay') ? document.getElementById('goalTitleDisplay').textContent : 'Goal'
        window.generateCalculatorPDF({
          calculatorType: 'Goal Planner',
          reportTitle: `Goal-Based Investment Roadmap — ${goalNameText}`,
          filename: `Milestone_Goal_Plan_${goalSelect.value || 'Custom'}.pdf`,
          buttonEl: downloadPdfBtn,
          chartCanvasId: 'goalChart',
          reportSectionSelector: '#goalReportSection',
          milestonesSelector: '.milestones-card'
        })
      } else {
        window.print()
      }
    })
  }

  const printReportBtn = document.getElementById('printReportBtn')
  if (printReportBtn) {
    printReportBtn.addEventListener('click', (e) => {
      e.preventDefault()
      window.print()
    })
  }

  // Initial calculation
  computeGoal()
  window.addEventListener('resize', computeGoal)
})
