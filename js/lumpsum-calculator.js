/* ============================================================
   Modern Lump Sum Calculator — One-Time Investment Compounding Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const principal = document.getElementById('lsAmount')
  const years = document.getElementById('lsYears')
  const ret = document.getElementById('lsReturn')

  if (!principal || !years || !ret) return

  const principalVal = document.getElementById('lsAmountVal')
  const yearsVal = document.getElementById('lsYearsVal')
  const retVal = document.getElementById('lsReturnVal')
  const investedOut = document.getElementById('investedOut')
  const returnsOut = document.getElementById('returnsOut')
  const totalOut = document.getElementById('totalOut')
  const multiplierPill = document.getElementById('multiplierPill')
  const milestoneTableBody = document.getElementById('milestoneTableBody')
  const canvas = document.getElementById('lsChart')

  const formatINR = (num) =>
    Math.round(num).toLocaleString('en-IN', { maximumFractionDigits: 0 })

  const formatCompact = (num) => {
    if (num >= 1e7) return '₹' + (num / 1e7).toFixed(2) + ' Cr'
    if (num >= 1e5) return '₹' + (num / 1e5).toFixed(2) + ' L'
    if (num >= 1e3) return '₹' + (num / 1e3).toFixed(1) + ' K'
    return '₹' + Math.round(num).toLocaleString('en-IN')
  }

  /* Lump Sum Future Value: FV = P × (1 + r)^n
     where P = principal, r = annual rate, n = years */
  const lumpSumFV = (P, annualRatePct, yearsCount) => {
    const r = annualRatePct / 100
    return P * Math.pow(1 + r, yearsCount)
  }

  const updateSliderFill = (input) => {
    const min = parseFloat(input.min)
    const max = parseFloat(input.max)
    const pct = ((parseFloat(input.value) - min) / (max - min)) * 100
    input.style.setProperty('--fill', pct + '%')
  }

  const updateMilestones = (P, rate, yearsCount) => {
    if (!milestoneTableBody) return
    let html = ''
    for (let yr = 1; yr <= yearsCount; yr++) {
      const inv = P
      const tot = lumpSumFV(P, rate, yr)
      const ret = tot - inv
      const mult = (tot / inv).toFixed(1)
      html += `
        <tr>
          <td><strong>${yr} ${yr === 1 ? 'Year' : 'Years'}</strong></td>
          <td>${formatCompact(inv)}</td>
          <td style="color:#059669;">+${formatCompact(ret)}</td>
          <td class="gold-td">${formatCompact(tot)} (${mult}x)</td>
        </tr>
      `
    }
    milestoneTableBody.innerHTML = html
  }

  const state = {
    amount: 500000,
    years: 10,
    rate: 12
  }

  const compute = () => {
    const P = state.amount
    const yearsCount = state.years
    const rate = state.rate

    const invested = P
    const total = lumpSumFV(P, rate, yearsCount)
    const returns = total - invested
    const multiplier = (total / (invested || 1)).toFixed(1)

    if (document.activeElement !== principalVal) {
      principalVal.value = '₹' + formatINR(P)
    }
    if (document.activeElement !== yearsVal) {
      yearsVal.value = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
    }
    if (document.activeElement !== retVal) {
      retVal.value = rate + '%'
    }

    investedOut.textContent = formatCompact(invested)
    returnsOut.textContent = formatCompact(returns)
    totalOut.textContent = formatCompact(total)

    if (multiplierPill) {
      multiplierPill.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
        <span>${multiplier}x Wealth Multiplier</span>
      `
    }

    // Dynamic Guidance Banner Update
    const lsGuidanceText = document.getElementById('lsGuidanceText')
    if (lsGuidanceText) {
      lsGuidanceText.innerHTML = `<strong>Customized Lump Sum Plan for:</strong> <strong>₹${formatINR(P)} One-Time Investment</strong> over <strong>${yearsCount} Years</strong> @ <strong>${rate}% Expected Return</strong>. Total Gain: <strong>₹${formatINR(returns)}</strong> &rarr; Compounded Maturity Value: <strong>₹${formatINR(total)}</strong>. <em>(Modify inputs above to recalculate)</em>`
    }

    if (principal) {
      if (P < parseFloat(principal.min)) principal.min = Math.floor(P * 0.5)
      if (P > parseFloat(principal.max)) principal.max = Math.ceil(P * 1.5)
      principal.value = P
      updateSliderFill(principal)
    }
    if (years) {
      if (yearsCount < parseFloat(years.min)) years.min = 1
      if (yearsCount > parseFloat(years.max)) years.max = Math.ceil(yearsCount * 1.5)
      years.value = yearsCount
      updateSliderFill(years)
    }
    if (ret) {
      if (rate < parseFloat(ret.min)) ret.min = Math.floor(rate * 0.5)
      if (rate > parseFloat(ret.max)) ret.max = Math.ceil(rate * 1.5)
      ret.value = rate
      updateSliderFill(ret)
    }

    /* ---------- Update Report & Summary Tables ---------- */
    const rptAmt = document.getElementById('lsRptAmount')
    const rptMode = document.getElementById('lsRptMode')
    const rptYrs = document.getElementById('lsRptYears')
    const rptRet = document.getElementById('lsRptReturn')
    if (rptAmt) rptAmt.textContent = formatINR(P)
    if (rptMode) rptMode.textContent = 'One-Time Lump Sum'
    if (rptYrs) rptYrs.textContent = yearsCount
    if (rptRet) rptRet.textContent = rate

    const sumInv = document.getElementById('lsSumInvestment')
    const sumGrowth = document.getElementById('lsSumGrowth')
    const sumMaturity = document.getElementById('lsSumMaturity')
    const sumMult = document.getElementById('lsSumMultiplier')
    const sumComp = document.getElementById('lsSumCompletedIn')
    if (sumInv) sumInv.textContent = formatINR(invested)
    if (sumGrowth) sumGrowth.textContent = formatINR(returns)
    if (sumMaturity) sumMaturity.textContent = formatINR(total)
    if (sumMult) sumMult.textContent = multiplier + 'x'
    if (sumComp) sumComp.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')

    drawChart(P, yearsCount, rate, canvas)
    updateMilestones(P, rate, yearsCount)
  }

  /* Setup Manual Direct Input Editing */
  const setupManualInput = (inputEl, key, formatFn) => {
    if (!inputEl) return

    inputEl.addEventListener('focus', () => {
      inputEl.value = state[key]
      inputEl.select()
    })

    inputEl.addEventListener('input', () => {
      const raw = inputEl.value.replace(/[^0-9.]/g, '')
      if (raw !== '') {
        const num = parseFloat(raw)
        if (!isNaN(num) && num >= 0) {
          state[key] = num
          compute()
        }
      }
    })

    inputEl.addEventListener('blur', () => {
      const raw = inputEl.value.replace(/[^0-9.]/g, '')
      if (raw !== '') {
        const num = parseFloat(raw)
        if (!isNaN(num) && num > 0) {
          state[key] = num
        }
      }
      inputEl.value = formatFn(state[key])
      compute()
    })

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') inputEl.blur()
    })
  }

  setupManualInput(principalVal, 'amount', (v) => '₹' + formatINR(v))
  setupManualInput(yearsVal, 'years', (v) => v + (v === 1 ? ' Year' : ' Years'))
  setupManualInput(retVal, 'rate', (v) => v + '%')

  /* Range Selector for Chart (1Y, 3Y, 5Y, Full Horizon) */
  let chartRangeMonths = 60; // 5 Years default matching reference design
  const lsRangeWrap = document.getElementById('lsChartRange');
  if (lsRangeWrap) {
    lsRangeWrap.querySelectorAll('.proj-range-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        lsRangeWrap.querySelectorAll('.proj-range-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.months;
        chartRangeMonths = val === 'all' ? 'all' : parseInt(val, 10);
        compute();
      });
    });
  }

  /* ---------- Canvas Projected Multi-Series Chart ---------- */
  const drawChart = (P, yearsCount, rate, cvs) => {
    if (!cvs) return
    const tooltipEl = document.getElementById('lsChartTooltip')
    const fullMonths = Math.round(yearsCount * 12)
    const targetMonths = chartRangeMonths === 'all' ? fullMonths : Math.min(fullMonths, chartRangeMonths)
    const r = rate / 100

    const chartData = []
    for (let m = 1; m <= targetMonths; m++) {
      const yrs = m / 12
      const val = P * Math.pow(1 + r, yrs)
      const gain = Math.max(0, val - P)
      const annualYield = P * r
      chartData.push({
        month: m,
        label: `${m} Month`,
        subLabel: `Yr ${yrs.toFixed(1)}`,
        barVal: P,
        line1Val: annualYield,
        line2Val: val,
        line3Val: gain
      })
    }

    if (window.renderProjectedChart) {
      window.renderProjectedChart(cvs, tooltipEl, {
        data: chartData,
        titles: {
          bar: 'Initial Capital',
          line1: 'Annual Yield Benchmark',
          line2: 'Portfolio Value',
          line3: 'Compounded Gain'
        },
        formatCompact: formatCompact
      })
    }
  }

  /* Quick Pill Clicks */
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = btn.dataset.target
      const targetVal = parseFloat(btn.dataset.value)
      if (targetId === 'lsAmount') {
        state.amount = targetVal
      } else if (targetId === 'lsYears') {
        state.years = targetVal
      } else if (targetId === 'lsReturn') {
        state.rate = targetVal
      }
      btn.parentElement.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      compute()
    })
  })

  principal.addEventListener('input', () => {
    state.amount = parseFloat(principal.value)
    principalVal.value = '₹' + formatINR(state.amount)
    compute()
  })

  years.addEventListener('input', () => {
    state.years = parseFloat(years.value)
    yearsVal.value = state.years + (state.years === 1 ? ' Year' : ' Years')
    compute()
  })

  ret.addEventListener('input', () => {
    state.rate = parseFloat(ret.value)
    retVal.value = state.rate + '%'
    compute()
  })

  const redraw = () => compute()
  window.addEventListener('resize', redraw)

  /* PDF Download & Print Actions */
  const downloadPdfBtn = document.getElementById('downloadPdfBtn')
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (typeof window.generateCalculatorPDF === 'function') {
        window.generateCalculatorPDF({
          calculatorType: 'Lump Sum',
          reportTitle: 'One-Time Lump Sum Investment Compounding Report',
          filename: `Milestone_Lumpsum_Report_${state.years}Yrs.pdf`,
          buttonEl: downloadPdfBtn,
          chartCanvasId: 'lsChart',
          reportSectionSelector: '.calc-report-section',
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

  compute()
})
