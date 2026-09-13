/* ============================================================
   Modern SIP Calculator — Interactive Compounding Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const amount = document.getElementById('sipAmount')
  const years = document.getElementById('sipYears')
  const ret = document.getElementById('sipReturn')

  if (!amount || !years || !ret) return

  const amountVal = document.getElementById('sipAmountVal')
  const yearsVal = document.getElementById('sipYearsVal')
  const retVal = document.getElementById('sipReturnVal')
  const investedOut = document.getElementById('investedOut')
  const returnsOut = document.getElementById('returnsOut')
  const totalOut = document.getElementById('totalOut')
  const multiplierPill = document.getElementById('multiplierPill')
  const milestoneTableBody = document.getElementById('milestoneTableBody')
  const canvas = document.getElementById('sipChart')

  const formatINR = (num) =>
    Math.round(num).toLocaleString('en-IN', { maximumFractionDigits: 0 })

  const formatCompact = (num) => {
    if (num >= 1e7) return '₹' + (num / 1e7).toFixed(2) + ' Cr'
    if (num >= 1e5) return '₹' + (num / 1e5).toFixed(2) + ' L'
    if (num >= 1e3) return '₹' + (num / 1e3).toFixed(1) + ' K'
    return '₹' + Math.round(num).toLocaleString('en-IN')
  }

  /* Monthly-compounding future value of a SIP.
     FV = P * (((1 + i)^n - 1) / i) * (1 + i)
     where i = annual return / 12, n = months */
  const sipFV = (monthly, annualRatePct, yearsCount) => {
    const i = annualRatePct / 100 / 12
    const n = Math.round(yearsCount * 12)
    if (i === 0) return monthly * n
    return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
  }

  const updateSliderFill = (input) => {
    const min = parseFloat(input.min)
    const max = parseFloat(input.max)
    const pct = ((parseFloat(input.value) - min) / (max - min)) * 100
    input.style.setProperty('--fill', pct + '%')
  }

  const updateMilestones = (monthly, rate, yearsCount) => {
    if (!milestoneTableBody) return
    let html = ''
    for (let yr = 1; yr <= yearsCount; yr++) {
      const inv = monthly * yr * 12
      const tot = sipFV(monthly, rate, yr)
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
    amount: 5000,
    years: 10,
    rate: 12
  }

  const compute = () => {
    const monthly = state.amount
    const yearsCount = state.years
    const rate = state.rate

    const invested = monthly * yearsCount * 12
    const total = sipFV(monthly, rate, yearsCount)
    const returns = total - invested
    const multiplier = (total / (invested || 1)).toFixed(1)

    if (document.activeElement !== amountVal) {
      amountVal.value = '₹' + formatINR(monthly)
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
    const sipGuidanceText = document.getElementById('sipGuidanceText')
    if (sipGuidanceText) {
      sipGuidanceText.innerHTML = `<strong>Customized SIP Report for:</strong> <strong>₹${formatINR(monthly)}/month</strong> over <strong>${yearsCount} Years</strong> @ <strong>${rate}% Expected Return</strong>. Total Invested: <strong>₹${formatINR(invested)}</strong> &rarr; Expected Corpus: <strong>₹${formatINR(total)}</strong>. <em>(Modify inputs above to recalculate)</em>`
    }

    if (amount) {
      if (monthly < parseFloat(amount.min)) amount.min = Math.floor(monthly * 0.5)
      if (monthly > parseFloat(amount.max)) amount.max = Math.ceil(monthly * 1.5)
      amount.value = monthly
      updateSliderFill(amount)
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
    const rptAmt = document.getElementById('sipRptAmount')
    const rptFreq = document.getElementById('sipRptFrequency')
    const rptYrs = document.getElementById('sipRptYears')
    const rptRet = document.getElementById('sipRptReturn')
    if (rptAmt) rptAmt.textContent = formatINR(monthly)
    if (rptFreq) rptFreq.textContent = 'Monthly'
    if (rptYrs) rptYrs.textContent = yearsCount
    if (rptRet) rptRet.textContent = rate

    const sumInv = document.getElementById('sipSumInvestment')
    const sumGrowth = document.getElementById('sipSumGrowth')
    const sumMaturity = document.getElementById('sipSumMaturity')
    const sumMult = document.getElementById('sipSumMultiplier')
    const sumComp = document.getElementById('sipSumCompletedIn')
    if (sumInv) sumInv.textContent = formatINR(invested)
    if (sumGrowth) sumGrowth.textContent = formatINR(returns)
    if (sumMaturity) sumMaturity.textContent = formatINR(total)
    if (sumMult) sumMult.textContent = multiplier + 'x'
    if (sumComp) sumComp.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')

    drawChart(monthly, yearsCount, rate, canvas)
    updateMilestones(monthly, rate, yearsCount)
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

  setupManualInput(amountVal, 'amount', (v) => '₹' + formatINR(v))
  setupManualInput(yearsVal, 'years', (v) => v + (v === 1 ? ' Year' : ' Years'))
  setupManualInput(retVal, 'rate', (v) => v + '%')

  /* Range Selector for Chart (1Y, 3Y, 5Y, Full Horizon) */
  let chartRangeMonths = 60; // 5 Years default matching reference design
  const sipRangeWrap = document.getElementById('sipChartRange');
  if (sipRangeWrap) {
    sipRangeWrap.querySelectorAll('.proj-range-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sipRangeWrap.querySelectorAll('.proj-range-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.months;
        chartRangeMonths = val === 'all' ? 'all' : parseInt(val, 10);
        compute();
      });
    });
  }

  /* ---------- Canvas Projected Multi-Series Chart ---------- */
  const drawChart = (monthly, yearsCount, rate, cvs) => {
    if (!cvs) return
    const tooltipEl = document.getElementById('sipChartTooltip')
    const fullMonths = Math.round(yearsCount * 12)
    const targetMonths = chartRangeMonths === 'all' ? fullMonths : Math.min(fullMonths, chartRangeMonths)
    const i = rate / 100 / 12

    const chartData = []
    for (let m = 1; m <= targetMonths; m++) {
      const inv = monthly * m
      const val = i === 0 ? inv : monthly * ((Math.pow(1 + i, m) - 1) / i) * (1 + i)
      const gain = Math.max(0, val - inv)
      chartData.push({
        month: m,
        label: `${m} Month`,
        subLabel: `Yr ${(m / 12).toFixed(1)}`,
        barVal: inv,
        line1Val: monthly,
        line2Val: val,
        line3Val: gain
      })
    }

    if (window.renderProjectedChart) {
      window.renderProjectedChart(cvs, tooltipEl, {
        data: chartData,
        titles: {
          bar: 'Invested Capital',
          line1: 'Monthly SIP',
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
      if (targetId === 'sipAmount') {
        state.amount = targetVal
      } else if (targetId === 'sipYears') {
        state.years = targetVal
      } else if (targetId === 'sipReturn') {
        state.rate = targetVal
      }
      btn.parentElement.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      compute()
    })
  })

  amount.addEventListener('input', () => {
    state.amount = parseFloat(amount.value)
    amountVal.value = '₹' + formatINR(state.amount)
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
          calculatorType: 'SIP',
          reportTitle: 'Systematic Investment Plan (SIP) Wealth Report',
          filename: `Milestone_SIP_Report_${state.years}Yrs.pdf`,
          buttonEl: downloadPdfBtn,
          chartCanvasId: 'sipChart',
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
