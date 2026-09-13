/* ============================================================
   Modern SWP Calculator — Interactive Cashflow & Corpus Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const corpus = document.getElementById('swpCorpus')
  const withdrawal = document.getElementById('swpWithdrawal')
  const ret = document.getElementById('swpReturn')
  const years = document.getElementById('swpYears')

  if (!corpus || !withdrawal || !ret || !years) return

  const corpusVal = document.getElementById('swpCorpusVal')
  const withdrawalVal = document.getElementById('swpWithdrawalVal')
  const retVal = document.getElementById('swpReturnVal')
  const yearsVal = document.getElementById('swpYearsVal')

  const investedOut = document.getElementById('swpInvestedOut')
  const withdrawnOut = document.getElementById('swpWithdrawnOut')
  const balanceOut = document.getElementById('swpBalanceOut')
  const statusPill = document.getElementById('swpStatusPill')
  const scheduleTableBody = document.getElementById('swpScheduleTableBody')
  const monthlyTableBody = document.getElementById('swpMonthlyTableBody')
  const tabYearly = document.getElementById('swpTabYearly')
  const tabMonthly = document.getElementById('swpTabMonthly')
  const yearlyWrap = document.getElementById('swpYearlyViewWrap')
  const monthlyWrap = document.getElementById('swpMonthlyViewWrap')
  const monthFilterBar = document.getElementById('swpMonthFilterBar')
  const yearPillsWrap = document.getElementById('swpYearPills')
  const canvas = document.getElementById('swpChart')

  let selectedYearFilter = 'all'
  let activeScheduleView = 'yearly'

  const formatINR = (num) =>
    Math.round(num).toLocaleString('en-IN', { maximumFractionDigits: 0 })

  const formatCompact = (num) => {
    if (num >= 1e7) return '₹' + (num / 1e7).toFixed(2) + ' Cr'
    if (num >= 1e5) return '₹' + (num / 1e5).toFixed(2) + ' L'
    if (num >= 1e3) return '₹' + (num / 1e3).toFixed(1) + ' K'
    return '₹' + Math.round(num).toLocaleString('en-IN')
  }

  /* Month-by-month SWP simulation for specified horizon */
  const simulateSWP = (initialCorpus, monthlyWithdrawal, annualRatePct, totalYears) => {
    const monthlyRate = annualRatePct / 100 / 12
    const totalMonths = Math.round(totalYears * 12)
    const pts = []
    let balance = initialCorpus
    let cumWithdrawn = 0
    let exhaustedMonth = null

    for (let m = 1; m <= totalMonths; m++) {
      const balanceBefore = balance
      if (balance <= 0) {
        if (!exhaustedMonth) exhaustedMonth = m - 1
        pts.push({
          month: m,
          beginningBalance: 0,
          monthlyGrowth: 0,
          monthlyPayout: 0,
          endingBalance: 0,
          cumulativeWithdrawn: cumWithdrawn
        })
        continue
      }

      // Balance earns interest during month, then withdrawal happens
      const interestEarned = balance * monthlyRate
      balance += interestEarned

      let actualWithdrawal = monthlyWithdrawal
      if (balance >= monthlyWithdrawal) {
        balance -= monthlyWithdrawal
        cumWithdrawn += monthlyWithdrawal
      } else {
        actualWithdrawal = balance
        cumWithdrawn += balance
        balance = 0
        if (!exhaustedMonth) exhaustedMonth = m
      }

      pts.push({
        month: m,
        beginningBalance: balanceBefore,
        monthlyGrowth: interestEarned,
        monthlyPayout: actualWithdrawal,
        endingBalance: balance,
        cumulativeWithdrawn: cumWithdrawn
      })
    }

    return { pts, exhaustedMonth, finalBalance: balance, totalWithdrawn: cumWithdrawn }
  }

  const updateSliderFill = (input) => {
    const min = parseFloat(input.min)
    const max = parseFloat(input.max)
    const pct = ((parseFloat(input.value) - min) / (max - min)) * 100
    input.style.setProperty('--fill', pct + '%')
  }

  /* Render Year Filter Pills for Month-wise View */
  const renderYearPills = (totalYears) => {
    if (!yearPillsWrap) return

    let pillsHtml = `<button type="button" class="swp-year-pill ${selectedYearFilter === 'all' ? 'active' : ''}" data-year="all">All Years (${totalYears}Y)</button>`
    for (let y = 1; y <= totalYears; y++) {
      pillsHtml += `<button type="button" class="swp-year-pill ${selectedYearFilter === String(y) ? 'active' : ''}" data-year="${y}">Year ${y}</button>`
    }
    yearPillsWrap.innerHTML = pillsHtml

    yearPillsWrap.querySelectorAll('.swp-year-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault()
        selectedYearFilter = pill.dataset.year
        yearPillsWrap.querySelectorAll('.swp-year-pill').forEach((p) => p.classList.remove('active'))
        pill.classList.add('active')
        compute()
      })
    })
  }

  /* Update Both Year-wise and Month-wise Tables */
  const updateScheduleTable = (initialCorpus, monthlyWithdrawal, annualRatePct, totalYears, sim) => {
    // 1. Render Year-wise Table
    if (scheduleTableBody) {
      let yearHtml = ''
      let hasDepletedRow = false

      for (let yr = 1; yr <= totalYears; yr++) {
        if (hasDepletedRow) break

        const res = simulateSWP(initialCorpus, monthlyWithdrawal, annualRatePct, yr)
        const totalGrowth = res.totalWithdrawn + res.finalBalance - initialCorpus
        const annualPayout = Math.min(res.totalWithdrawn, monthlyWithdrawal * 12)

        let statusBadge = ''
        if (res.finalBalance >= initialCorpus) {
          statusBadge = '<span style="color:#059669; font-weight:700;">✦ Capital Growing</span>'
        } else if (res.finalBalance > 0) {
          statusBadge = '<span style="color:#c98a00; font-weight:700;">✦ Sustainable</span>'
        } else {
          statusBadge = '<span style="color:#dc2626; font-weight:700;">⚠ Depleted</span>'
          hasDepletedRow = true
        }

        yearHtml += `
          <tr>
            <td><strong>${yr} ${yr === 1 ? 'Year' : 'Years'}</strong></td>
            <td style="color:#0284c7; font-weight:700;">₹${formatINR(annualPayout)}</td>
            <td style="color:#059669; font-weight:700;">${formatCompact(res.totalWithdrawn)}</td>
            <td style="color:#059669; font-weight:600;">+${formatCompact(Math.max(0, totalGrowth))}</td>
            <td class="gold-td">${formatCompact(res.finalBalance)}</td>
            <td>${statusBadge}</td>
          </tr>
        `
      }

      if (sim.exhaustedMonth && sim.exhaustedMonth < totalYears * 12 && !hasDepletedRow) {
        const exhaustYr = (sim.exhaustedMonth / 12).toFixed(1)
        yearHtml += `
          <tr>
            <td><strong>Year ${exhaustYr}</strong></td>
            <td style="color:#0284c7; font-weight:700;">₹${formatINR(monthlyWithdrawal * 12)}</td>
            <td style="color:#059669; font-weight:700;">${formatCompact(sim.totalWithdrawn)}</td>
            <td style="color:#64748b; font-weight:600;">—</td>
            <td class="gold-td">₹0</td>
            <td><span style="color:#dc2626; font-weight:700;">⚠ Depleted</span></td>
          </tr>
        `
      }

      scheduleTableBody.innerHTML = yearHtml
    }

    // 2. Render Month-wise Table
    if (monthlyTableBody && sim.pts) {
      renderYearPills(totalYears)

      let monthHtml = ''
      const pts = sim.pts
      const totalMonths = pts.length

      for (let i = 0; i < totalMonths; i++) {
        const pt = pts[i]
        const m = pt.month
        const yr = Math.ceil(m / 12)
        const mInYr = ((m - 1) % 12) + 1

        // Filter check
        if (selectedYearFilter !== 'all' && String(yr) !== selectedYearFilter) {
          continue
        }

        const isDepleted = (pt.endingBalance <= 0 && pt.beginningBalance <= 0)

        monthHtml += `
          <tr style="${isDepleted ? 'opacity: 0.6; background: #fff1f2;' : ''}">
            <td><strong>Month ${m}</strong> <span style="font-size:0.75rem; color:#64748b; font-weight:600;">(Yr ${yr}, M${mInYr})</span></td>
            <td>₹${formatINR(pt.beginningBalance)}</td>
            <td class="green-td">+₹${formatINR(pt.monthlyGrowth)}</td>
            <td class="blue-td">-₹${formatINR(pt.monthlyPayout)}</td>
            <td class="gold-td">${isDepleted ? '₹0 (Depleted)' : '₹' + formatINR(pt.endingBalance)}</td>
            <td style="color:#059669; font-weight:700;">${formatCompact(pt.cumulativeWithdrawn)}</td>
          </tr>
        `
      }

      monthlyTableBody.innerHTML = monthHtml
    }

    // 3. Update or inject depletion advisory notice
    const existingNotice = document.getElementById('swpDepletionNotice')
    if (sim.exhaustedMonth && sim.exhaustedMonth < totalYears * 12) {
      const exhaustYr = (sim.exhaustedMonth / 12).toFixed(1)
      const safeMonthly = Math.round(initialCorpus * (annualRatePct / 100 / 12))
      const noticeHtml = `
        <div class="swp-depletion-alert" id="swpDepletionNotice">
          ⚠️ <strong>High Withdrawal Rate Alert:</strong> At ₹${formatINR(monthlyWithdrawal)}/month, your ${formatCompact(initialCorpus)} corpus will exhaust in ~${exhaustYr} years. For sustainable lifelong cashflow, consider a recommended withdrawal of ₹${formatINR(safeMonthly)}/month or increasing your initial corpus.
        </div>
      `
      if (existingNotice) {
        existingNotice.outerHTML = noticeHtml
      } else {
        const milestonesCard = document.getElementById('swpMilestonesCard') || (scheduleTableBody ? scheduleTableBody.parentElement.parentElement.parentElement : null)
        if (milestonesCard) milestonesCard.insertAdjacentHTML('beforeend', noticeHtml)
      }
    } else {
      if (existingNotice) existingNotice.remove()
    }
  }

  /* Schedule View Tab Switching (Year-wise vs Month-wise) */
  if (tabYearly && tabMonthly) {
    tabYearly.addEventListener('click', (e) => {
      e.preventDefault()
      activeScheduleView = 'yearly'
      tabYearly.classList.add('active')
      tabMonthly.classList.remove('active')
      if (yearlyWrap) yearlyWrap.style.display = 'block'
      if (monthlyWrap) monthlyWrap.style.display = 'none'
      if (monthFilterBar) monthFilterBar.style.display = 'none'
    })

    tabMonthly.addEventListener('click', (e) => {
      e.preventDefault()
      activeScheduleView = 'monthly'
      tabMonthly.classList.add('active')
      tabYearly.classList.remove('active')
      if (yearlyWrap) yearlyWrap.style.display = 'none'
      if (monthlyWrap) monthlyWrap.style.display = 'block'
      if (monthFilterBar) monthFilterBar.style.display = 'flex'
    })
  }

  const state = {
    corpus: 5000000,
    withdrawal: 35000,
    rate: 9,
    years: 20
  }

  const compute = () => {
    const corpusAmt = state.corpus
    const withdrawalAmt = state.withdrawal
    const rate = state.rate
    const yearsCount = state.years

    const sim = simulateSWP(corpusAmt, withdrawalAmt, rate, yearsCount)
    const finalBalance = sim.finalBalance
    const totalWithdrawn = sim.totalWithdrawn

    // Only update input box if not currently focused by user
    if (document.activeElement !== corpusVal) {
      corpusVal.value = '₹' + formatINR(corpusAmt)
    }
    if (document.activeElement !== withdrawalVal) {
      withdrawalVal.value = '₹' + formatINR(withdrawalAmt)
    }
    if (document.activeElement !== retVal) {
      retVal.value = rate + '%'
    }
    if (document.activeElement !== yearsVal) {
      yearsVal.value = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
    }

    investedOut.textContent = formatCompact(corpusAmt)
    withdrawnOut.textContent = formatCompact(totalWithdrawn)
    balanceOut.textContent = formatCompact(finalBalance)

    // Update Ratio Breakdown Bar
    const barWithdrawn = document.getElementById('swpBarWithdrawn')
    const barRemaining = document.getElementById('swpBarRemaining')
    const ratioWithdrawnText = document.getElementById('swpRatioWithdrawnText')
    const ratioRemainingText = document.getElementById('swpRatioRemainingText')

    const totalDelivered = totalWithdrawn + finalBalance
    if (totalDelivered > 0) {
      const withPct = Math.min(100, Math.max(0, Math.round((totalWithdrawn / totalDelivered) * 100)))
      const remPct = 100 - withPct
      if (barWithdrawn) barWithdrawn.style.width = withPct + '%'
      if (barRemaining) barRemaining.style.width = remPct + '%'
      if (ratioWithdrawnText) ratioWithdrawnText.textContent = `Cashflow Payouts: ${withPct}% (${formatCompact(totalWithdrawn)})`
      if (ratioRemainingText) ratioRemainingText.textContent = `Remaining Wealth: ${remPct}% (${formatCompact(finalBalance)})`
    }

    if (statusPill) {
      if (finalBalance >= corpusAmt) {
        const netGain = finalBalance + totalWithdrawn - corpusAmt
        statusPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          <span>Perpetual Growth: +${formatCompact(netGain)} Total Gain</span>
        `
        statusPill.className = 'multiplier-pill'
      } else if (finalBalance > 0) {
        statusPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Safe Payout: ${formatCompact(finalBalance)} Remaining</span>
        `
        statusPill.className = 'multiplier-pill'
      } else {
        const exhaustYr = (sim.exhaustedMonth / 12).toFixed(1)
        statusPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/></svg>
          <span>Corpus Lasts ~${exhaustYr} Years</span>
        `
        statusPill.className = 'multiplier-pill warning'
      }
    }

    // Dynamic Guidance Banner Update
    const swpGuidanceText = document.getElementById('swpGuidanceText')
    if (swpGuidanceText) {
      swpGuidanceText.innerHTML = `<strong>Customized SWP Plan for:</strong> Total Corpus: <strong>₹${formatINR(corpusAmt)}</strong> with <strong>₹${formatINR(withdrawalAmt)}/month Payout</strong> over <strong>${yearsCount} Years</strong> @ <strong>${rate}% Expected Return</strong>. Total Withdrawn: <strong>₹${formatINR(totalWithdrawn)}</strong> | Ending Balance: <strong>₹${formatINR(finalBalance)}</strong>. <em>(Modify inputs above to recalculate)</em>`
    }

    // Sync sliders smoothly without clipping
    if (corpus) {
      if (corpusAmt < parseFloat(corpus.min)) corpus.min = Math.floor(corpusAmt * 0.5)
      if (corpusAmt > parseFloat(corpus.max)) corpus.max = Math.ceil(corpusAmt * 1.5)
      corpus.value = corpusAmt
      updateSliderFill(corpus)
    }
    if (withdrawal) {
      if (withdrawalAmt < parseFloat(withdrawal.min)) withdrawal.min = Math.floor(withdrawalAmt * 0.5)
      if (withdrawalAmt > parseFloat(withdrawal.max)) withdrawal.max = Math.ceil(withdrawalAmt * 1.5)
      withdrawal.value = withdrawalAmt
      updateSliderFill(withdrawal)
    }
    if (ret) {
      if (rate < parseFloat(ret.min)) ret.min = Math.floor(rate * 0.5)
      if (rate > parseFloat(ret.max)) ret.max = Math.ceil(rate * 1.5)
      ret.value = rate
      updateSliderFill(ret)
    }
    if (years) {
      if (yearsCount < parseFloat(years.min)) years.min = 1
      if (yearsCount > parseFloat(years.max)) years.max = Math.ceil(yearsCount * 1.5)
      years.value = yearsCount
      updateSliderFill(years)
    }

    /* ---------- Update Report & Summary Tables ---------- */
    const rptCorpus = document.getElementById('swpRptCorpus')
    const rptWith = document.getElementById('swpRptWithdrawal')
    const rptYrs = document.getElementById('swpRptYears')
    const rptRet = document.getElementById('swpRptReturn')
    if (rptCorpus) rptCorpus.textContent = formatINR(corpusAmt)
    if (rptWith) rptWith.textContent = formatINR(withdrawalAmt)
    if (rptYrs) rptYrs.textContent = yearsCount
    if (rptRet) rptRet.textContent = rate

    const sumInv = document.getElementById('swpSumInvestment')
    const sumWith = document.getElementById('swpSumWithdrawal')
    const sumGrowth = document.getElementById('swpSumGrowth')
    const sumCurVal = document.getElementById('swpSumCurrentValue')
    const sumEnded = document.getElementById('swpSumEndedIn')

    const totalGrowth = totalWithdrawn + finalBalance - corpusAmt
    if (sumInv) sumInv.textContent = formatINR(corpusAmt)
    if (sumWith) sumWith.textContent = formatINR(totalWithdrawn)
    if (sumGrowth) sumGrowth.textContent = formatINR(Math.max(0, totalGrowth))
    if (sumCurVal) sumCurVal.textContent = formatINR(finalBalance)
    if (sumEnded) {
      if (sim.exhaustedMonth && sim.exhaustedMonth < yearsCount * 12) {
        const exYr = (sim.exhaustedMonth / 12).toFixed(1)
        sumEnded.textContent = exYr + ' Years (Depleted)'
      } else {
        sumEnded.textContent = yearsCount + (yearsCount === 1 ? ' Year' : ' Years')
      }
    }

    drawChart(sim, yearsCount, canvas)
    updateScheduleTable(corpusAmt, withdrawalAmt, rate, yearsCount, sim)
  }

  /* Range Selector for Chart (1Y, 3Y, 5Y, Full Horizon) */
  let chartRangeMonths = 60; // 5 Years default matching reference design
  const swpRangeWrap = document.getElementById('swpChartRange');
  if (swpRangeWrap) {
    swpRangeWrap.querySelectorAll('.proj-range-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        swpRangeWrap.querySelectorAll('.proj-range-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.months;
        chartRangeMonths = val === 'all' ? 'all' : parseInt(val, 10);
        compute();
      });
    });
  }

  /* ---------- Canvas Projected Multi-Series Chart ---------- */
  const drawChart = (sim, totalYears, cvs) => {
    if (!cvs || !sim || !sim.pts) return
    const tooltipEl = document.getElementById('swpChartTooltip')
    const fullMonths = Math.round(totalYears * 12)
    const targetMonths = chartRangeMonths === 'all' ? fullMonths : Math.min(fullMonths, chartRangeMonths)

    const chartData = []
    for (let m = 1; m <= targetMonths; m++) {
      const pt = sim.pts[m - 1] || sim.pts[sim.pts.length - 1]
      if (!pt) continue
      chartData.push({
        month: m,
        label: `${m} Month`,
        subLabel: `Yr ${(m / 12).toFixed(1)}`,
        barVal: pt.beginningBalance,
        line1Val: pt.monthlyPayout,
        line2Val: pt.endingBalance,
        line3Val: pt.monthlyGrowth
      })
    }

    if (window.renderProjectedChart) {
      window.renderProjectedChart(cvs, tooltipEl, {
        data: chartData,
        titles: {
          bar: 'Balance at Beginning of Month',
          line1: 'Monthly SWP',
          line2: 'Balance at End of Month',
          line3: 'Monthly Growth'
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
      const targetVal = btn.dataset.value
      const targetInput = document.getElementById(targetId)
      if (targetInput) {
        targetInput.value = targetVal
        btn.parentElement.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        compute()
      }
    })
  })

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

  setupManualInput(corpusVal, 'corpus', (v) => '₹' + formatINR(v))
  setupManualInput(withdrawalVal, 'withdrawal', (v) => '₹' + formatINR(v))
  setupManualInput(retVal, 'rate', (v) => v + '%')
  setupManualInput(yearsVal, 'years', (v) => v + (v === 1 ? ' Year' : ' Years'))

  /* Quick Pill Clicks */
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = btn.dataset.target
      const targetVal = parseFloat(btn.dataset.value)
      if (targetId === 'swpCorpus') {
        state.corpus = targetVal
      } else if (targetId === 'swpWithdrawal') {
        state.withdrawal = targetVal
      } else if (targetId === 'swpReturn') {
        state.rate = targetVal
      } else if (targetId === 'swpYears') {
        state.years = targetVal
      }
      btn.parentElement.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      compute()
    })
  })

  corpus.addEventListener('input', () => {
    state.corpus = parseFloat(corpus.value)
    corpusVal.value = '₹' + formatINR(state.corpus)
    compute()
  })

  withdrawal.addEventListener('input', () => {
    state.withdrawal = parseFloat(withdrawal.value)
    withdrawalVal.value = '₹' + formatINR(state.withdrawal)
    compute()
  })

  ret.addEventListener('input', () => {
    state.rate = parseFloat(ret.value)
    retVal.value = state.rate + '%'
    compute()
  })

  years.addEventListener('input', () => {
    state.years = parseFloat(years.value)
    yearsVal.value = state.years + (state.years === 1 ? ' Year' : ' Years')
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
          calculatorType: 'SWP',
          reportTitle: 'Systematic Withdrawal Plan (SWP) Cash Flow & Wealth Report',
          filename: `Milestone_SWP_Report_${state.years}Yrs.pdf`,
          buttonEl: downloadPdfBtn,
          chartCanvasId: 'swpChart',
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
