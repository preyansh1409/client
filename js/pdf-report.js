/* ============================================================
   Milestone Financial Distribution Pvt. Ltd.
   Client-Side Official PDF Report Generator
   ============================================================ */

window.generateCalculatorPDF = function (options) {
  const {
    calculatorType = 'SIP',        // 'SIP', 'SWP', 'Lump Sum', 'Goal Planner'
    reportTitle = 'Investment Report',
    filename = 'Milestone_Financial_Report.pdf',
    buttonEl = null,
    chartCanvasId = null,
    reportSectionSelector = '.calc-report-section',
    milestonesSelector = '.milestones-card',
    customSummaryData = null
  } = options;

  // Set loading state on button
  let originalBtnHtml = '';
  if (buttonEl) {
    originalBtnHtml = buttonEl.innerHTML;
    buttonEl.classList.add('loading');
    buttonEl.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <span>Preparing PDF...</span>
    `;
  }

  // Create an isolated off-screen iframe to guarantee 100% immune rendering
  // against host page scrolling, zoom level, window width, or conflicting CSS
  const iframe = document.createElement('iframe');
  iframe.id = 'milestonePdfRenderIframe';
  iframe.style.cssText = 'position: fixed; left: 0; top: 0; width: 780px; height: 1800px; z-index: -99999; border: none; opacity: 0; pointer-events: none;';
  document.body.appendChild(iframe);

  const cleanup = () => {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
    if (buttonEl) {
      buttonEl.classList.remove('loading');
      buttonEl.innerHTML = originalBtnHtml;
    }
  };

  try {
    const doc = iframe.contentWindow.document;
    doc.open();

    // Helper to ensure currency formatting
    const fmt = (v) => {
      if (!v) return '';
      v = v.trim();
      return v.startsWith('₹') ? v : '₹' + v;
    };

    // 1. Current timestamp & Statement Ref
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeFormatted = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const calcTypeClean = calculatorType.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const refCode = 'MFD-' + (calcTypeClean || 'INV') + '-' + Math.floor(100000 + Math.random() * 900000);

    // 2. High-Res Canvas Snapshot
    let chartImgUrl = '';
    if (chartCanvasId) {
      const canvas = document.getElementById(chartCanvasId);
      if (canvas && canvas.toDataURL) {
        try {
          chartImgUrl = canvas.toDataURL('image/png', 1.0);
        } catch (e) {
          console.warn('Canvas snapshot skipped:', e);
        }
      }
    }

    // 3. Extract Milestone Table Headers & Rows
    let milestoneThsHtml = '';
    const tableThs = document.querySelectorAll('#swpYearlyViewWrap thead th, #milestoneTable thead th, .milestones-card table:first-of-type thead th');
    if (tableThs && tableThs.length > 0) {
      const thLen = tableThs.length;
      milestoneThsHtml = Array.from(tableThs).map((th, i) => {
        const widthPct = (100 / thLen).toFixed(1) + '%';
        return `<th style="width: ${widthPct}; background: #c8962c; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 4px; text-align: center; border: 1px solid #c8962c;">${th.textContent.trim()}</th>`;
      }).join('');
    } else {
      milestoneThsHtml = `
        <th style="width: 18%; background: #c8962c; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 4px; text-align: center; border: 1px solid #c8962c;">Horizon</th>
        <th style="width: 26%; background: #c8962c; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 4px; text-align: center; border: 1px solid #c8962c;">Total Invested</th>
        <th style="width: 26%; background: #c8962c; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 4px; text-align: center; border: 1px solid #c8962c;">Compounded Gain</th>
        <th style="width: 30%; background: #c8962c; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 4px; text-align: center; border: 1px solid #c8962c;">Estimated Corpus</th>
      `;
    }

    let milestoneRowsHtml = '';
    const swpRows = document.querySelectorAll('#swpScheduleTableBody tr');
    const genericRows = document.querySelectorAll('#milestoneTableBody tr, .milestones-card table:first-of-type tbody tr');
    const milestoneTrs = (swpRows && swpRows.length > 0) ? swpRows : genericRows;

    if (milestoneTrs && milestoneTrs.length > 0) {
      milestoneRowsHtml = Array.from(milestoneTrs).map((tr, idx) => {
        const tds = Array.from(tr.querySelectorAll('td')).map((td, i) => {
          const isLast = (i === tr.querySelectorAll('td').length - 1);
          const isGold = td.classList.contains('gold-td') || (i === tr.querySelectorAll('td').length - 2);
          const color = isLast ? '#b45309' : (isGold ? '#c98a00' : '#1e293b');
          const weight = (isLast || isGold) ? '700' : '600';
          return `<td style="font-size: 9px; font-weight: ${weight}; padding: 5.5px 6px; text-align: center; border: 1px solid #e2e8f0; color: ${color}; word-break: break-word; line-height: 1.3;">${td.textContent.trim()}</td>`;
        }).join('');
        const bg = (idx % 2 === 0) ? '#ffffff' : '#f8fafc';
        return `<tr style="background: ${bg};">${tds}</tr>`;
      }).join('');
    }

    // 4. Construct Tables per Calculator Type
    let tablesHtml = '';
    const normType = calculatorType.toLowerCase();

    if (normType.includes('lump') || normType.includes('ls')) {
      // LUMP SUM
      const amount = (document.getElementById('lsRptAmount')?.textContent || '5,00,000').trim();
      const amountFmt = fmt(amount);
      const mode = (document.getElementById('lsRptMode')?.textContent || 'One-Time Lump Sum').trim();
      const years = (document.getElementById('lsRptYears')?.textContent || '10').replace(/[^0-9]/g, '');
      const returnRate = (document.getElementById('lsRptReturn')?.textContent || '12').replace(/[^0-9.]/g, '');

      const invested = fmt((document.getElementById('lsSumInvestment')?.textContent || amountFmt).trim());
      const growth = fmt((document.getElementById('lsSumGrowth')?.textContent || '10,52,470').trim());
      const maturity = fmt((document.getElementById('lsSumMaturity')?.textContent || '15,52,470').trim());
      const multiplier = (document.getElementById('lsSumMultiplier')?.textContent || '3.1x').trim();
      const completedIn = (document.getElementById('lsSumCompletedIn')?.textContent || (years + ' Years')).trim();

      tablesHtml = `
        <!-- Lump Sum Parameters Table -->
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            Lump Sum Investment Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Lumpsum Investment Amount</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Investment Mode</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Time Period (In Year)</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Expected Return Rate (P.A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${amountFmt}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${mode}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${years} Years</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${returnRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Lump Sum Wealth Summary Table -->
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            Lump Sum Wealth Summary
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Investment</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Growth (Profit)</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Final Maturity Value</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Wealth Multiplier</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Completed In</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${invested}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${growth}</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${maturity}</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #c8962c;">${multiplier}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${completedIn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (normType.includes('swp')) {
      // SWP
      const corpus = (document.getElementById('swpRptCorpus')?.textContent || document.getElementById('swpRptAmount')?.textContent || '50,00,000').trim();
      const corpusFmt = fmt(corpus);
      const withdrawal = (document.getElementById('swpRptWithdrawal')?.textContent || '35,000').trim();
      const withdrawalFmt = fmt(withdrawal);
      const years = (document.getElementById('swpRptYears')?.textContent || '20').replace(/[^0-9]/g, '');
      const returnRate = (document.getElementById('swpRptReturn')?.textContent || '9').replace(/[^0-9.]/g, '');

      const invested = fmt((document.getElementById('swpSumInvestment')?.textContent || corpusFmt).trim());
      const withdrawn = fmt((document.getElementById('swpSumWithdrawal')?.textContent || '84,00,000').trim());
      const growth = fmt((document.getElementById('swpSumGrowth')?.textContent || '1,06,40,000').trim());
      const currentValue = fmt((document.getElementById('swpSumCurrentValue')?.textContent || '72,40,000').trim());
      const endedIn = (document.getElementById('swpSumEndedIn')?.textContent || (years + ' Years')).trim();

      tablesHtml = `
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            SWP Cash Flow Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Lumpsum Investment Amount</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Monthly SWP Withdrawal</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Time Period (In Year)</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Expected Return Rate (P.A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${corpusFmt}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${withdrawalFmt} /mo</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${years} Years</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${returnRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            SWP Cash Flow & Portfolio Summary
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Investment</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Withdrawal</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Growth</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Current Value</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Ended In</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${invested}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #c8962c;">${withdrawn}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${growth}</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${currentValue}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${endedIn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (normType.includes('goal')) {
      // GOAL PLANNER
      const goalName = (document.getElementById('goalRptName')?.textContent || "Child's Higher Education").trim();
      const presentCost = fmt((document.getElementById('goalRptPresentCost')?.textContent || '30,00,000').trim());
      const years = (document.getElementById('goalRptYears')?.textContent || '10').replace(/[^0-9]/g, '');
      const returnRate = (document.getElementById('goalRptReturn')?.textContent || '12').replace(/[^0-9.]/g, '');
      const futureCost = fmt((document.getElementById('goalRptFutureCost')?.textContent || '53,72,543').trim());

      const sipMonthly = (document.getElementById('goalSumSipMonthly')?.textContent || '₹23,124 /mo').trim();
      const sipInvested = fmt((document.getElementById('goalSumSipInvested')?.textContent || '27,74,880').trim());
      const sipGain = fmt((document.getElementById('goalSumSipGain')?.textContent || '25,97,663').trim());
      const sipMaturity = fmt((document.getElementById('goalSumSipMaturity')?.textContent || futureCost).trim());

      const lumpOneTime = fmt((document.getElementById('goalSumLumpOneTime')?.textContent || '17,29,788').trim());
      const lumpInvested = fmt((document.getElementById('goalSumLumpInvested')?.textContent || '17,29,788').trim());
      const lumpGain = fmt((document.getElementById('goalSumLumpGain')?.textContent || '36,42,755').trim());
      const lumpMaturity = fmt((document.getElementById('goalSumLumpMaturity')?.textContent || futureCost).trim());

      const stepMonthly = (document.getElementById('goalSumStepMonthly')?.textContent || '₹15,920 /mo (Yr 1)').trim();
      const stepInvested = fmt((document.getElementById('goalSumStepInvested')?.textContent || '25,28,400').trim());
      const stepGain = fmt((document.getElementById('goalSumStepGain')?.textContent || '28,44,143').trim());
      const stepMaturity = fmt((document.getElementById('goalSumStepMaturity')?.textContent || futureCost).trim());

      tablesHtml = `
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            Goal Planning Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Selected Goal</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Goal Cost (Today)</th>
                <th style="width: 15%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Time Horizon</th>
                <th style="width: 15%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Expected Return</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Target Future Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 700; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #0b244d;">${goalName}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${presentCost}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${years} Years</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${returnRate}%</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${futureCost}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            Investment Options Comparison
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 30%; background: #0b244d; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Strategy Plan</th>
                <th style="width: 23%; background: #0b244d; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Required Installment</th>
                <th style="width: 23%; background: #0b244d; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Principal</th>
                <th style="width: 24%; background: #0b244d; color: #ffffff; font-size: 9px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Final Maturity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 9.5px; font-weight: 700; padding: 6px 5px; text-align: left; padding-left: 8px; border: 1px solid #e2e8f0; color: #0b244d;">Regular Monthly SIP</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${sipMonthly}</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${sipInvested}</td>
                <td style="font-size: 9.5px; font-weight: 800; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${sipMaturity}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="font-size: 9.5px; font-weight: 700; padding: 6px 5px; text-align: left; padding-left: 8px; border: 1px solid #e2e8f0; color: #0b244d;">One-Time Lump Sum</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${lumpOneTime}</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${lumpInvested}</td>
                <td style="font-size: 9.5px; font-weight: 800; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${lumpMaturity}</td>
              </tr>
              <tr>
                <td style="font-size: 9.5px; font-weight: 700; padding: 6px 5px; text-align: left; padding-left: 8px; border: 1px solid #e2e8f0; color: #0b244d;">Step-Up SIP (+10%/yr)</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${stepMonthly}</td>
                <td style="font-size: 9.5px; font-weight: 600; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${stepInvested}</td>
                <td style="font-size: 9.5px; font-weight: 800; padding: 6px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${stepMaturity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      // DEFAULT: SIP CALCULATOR
      const amount = (document.getElementById('sipRptAmount')?.textContent || '5,000').trim();
      const amountFmt = fmt(amount);
      const freq = (document.getElementById('sipRptFrequency')?.textContent || 'Monthly').trim();
      const years = (document.getElementById('sipRptYears')?.textContent || '10').replace(/[^0-9]/g, '');
      const returnRate = (document.getElementById('sipRptReturn')?.textContent || '12').replace(/[^0-9.]/g, '');

      const invested = fmt((document.getElementById('sipSumInvestment')?.textContent || '6,00,000').trim());
      const growth = fmt((document.getElementById('sipSumGrowth')?.textContent || '5,61,695').trim());
      const maturity = fmt((document.getElementById('sipSumMaturity')?.textContent || '11,61,695').trim());
      const multiplier = (document.getElementById('sipSumMultiplier')?.textContent || '1.9x').trim();
      const completedIn = (document.getElementById('sipSumCompletedIn')?.textContent || (years + ' Years')).trim();

      tablesHtml = `
        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            SIP Investment Parameters
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Monthly Investment Amount</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Investment Frequency</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Time Period (In Year)</th>
                <th style="width: 25%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Expected Return Rate (P.A)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${amountFmt}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${freq}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${years} Years</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${returnRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; background: #ffffff;">
          <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
            SIP Wealth Summary
          </div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
            <thead>
              <tr>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Investment</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Total Growth (Wealth Gain)</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Expected Maturity Value</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Wealth Multiplier</th>
                <th style="width: 20%; background: #0b244d; color: #ffffff; font-size: 9.5px; font-weight: 700; padding: 7px 5px; text-align: center; border: 1px solid #0b244d;">Completed In</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${invested}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${growth}</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #15803d;">${maturity}</td>
                <td style="font-size: 10.5px; font-weight: 800; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #c8962c;">${multiplier}</td>
                <td style="font-size: 10px; font-weight: 600; padding: 8px 5px; text-align: center; border: 1px solid #e2e8f0; color: #1e293b;">${completedIn}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // 5. Build Complete Self-Contained Printable Document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle}</title>
      </head>
      <body style="margin: 0; padding: 18px 22px; width: 740px; background: #ffffff; color: #0f172a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.45; box-sizing: border-box;">
        <!-- ================= PAGE 1: EXECUTIVE SUMMARY ================= -->
        <!-- HEADER -->
        <div style="border-bottom: 3px solid #0b244d; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
          <div style="flex: 1;">
            <div style="font-size: 16px; font-weight: 900; color: #0b244d; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.02em;">
              MILESTONE FINANCIAL DISTRIBUTION PVT LTD
            </div>
            <div style="display: inline-block; font-size: 10px; font-weight: 700; color: #15803d; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 7px; border-radius: 4px; margin-bottom: 4px;">
              AMFI-Registered Mutual Fund Distributor &bull; ARN: 111197
            </div>
            <div style="font-size: 9px; color: #334155; line-height: 1.4;">
              <strong>Office:</strong> A-1003-1004, 10th Floor, Ratnakar Nine Square, Vastrapur, Ahmedabad - 380015
            </div>
            <div style="font-size: 9px; font-weight: 600; color: #0b244d; margin-top: 3px;">
              <span><strong>Mob:</strong> +91 98254 45975, +91 98244 21676</span>
              <span style="margin-left: 12px;"><strong>Email:</strong> info@milestonefinancial.in</span>
              <span style="margin-left: 12px;"><strong>Web:</strong> milestonefinancial.in</span>
            </div>
          </div>
          <div style="text-align: right; min-width: 120px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="115" height="78" fill="none">
              <g transform="translate(95, 8)">
                <rect x="0" y="0" width="130" height="130" rx="3" fill="#0b244d" />
                <rect x="10" y="10" width="110" height="110" fill="#ffffff" />
                <path d="M20 20 H110 V110 H20 Z" fill="#0b244d" />
                <rect x="30" y="30" width="70" height="70" fill="#ffffff" />
                <rect x="36" y="30" width="18" height="70" fill="#0b244d" />
                <rect x="58" y="30" width="14" height="42" fill="#15803d" />
                <rect x="76" y="30" width="18" height="70" fill="#0b244d" />
              </g>
              <text x="160" y="174" text-anchor="middle" font-family="'Inter', 'Arial Black', sans-serif" font-weight="900" font-size="28" fill="#0b244d" letter-spacing="3">MILESTONE</text>
              <text x="160" y="202" text-anchor="middle" font-family="'Georgia', serif" font-weight="700" font-size="14" fill="#0b244d">Financial Distribution Pvt. Ltd.</text>
            </svg>
          </div>
        </div>

        <!-- METADATA STRIP -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 12px; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em;">
            ${reportTitle}
          </span>
          <span style="font-size: 9.5px; font-weight: 600; color: #64748b;">
            Ref: ${refCode} &bull; Date: ${dateFormatted} (${timeFormatted})
          </span>
        </div>

        <!-- PARAMETERS & SUMMARY TABLES -->
        ${tablesHtml}

        <!-- TRAJECTORY CHART -->
        ${chartImgUrl ? `
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; background: #ffffff;">
            <div style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 6px;">
              📈 Growth Trajectory Visualizer
            </div>
            <img src="${chartImgUrl}" style="width: 100%; height: auto; max-height: 205px; object-fit: contain; display: block;" />
          </div>
        ` : ''}

        <!-- ================= PAGE 2: MILESTONES & REGULATORY NOTICE ================= -->
        ${milestoneRowsHtml ? `
          <div style="page-break-before: always; padding-top: 10px;">
            <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #0b244d; padding-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #0b244d; text-transform: uppercase; letter-spacing: 0.02em;">
                MILESTONE FINANCIAL DISTRIBUTION &bull; SCHEDULE &amp; MILESTONE PROJECTIONS
              </span>
              <span style="font-size: 9.5px; font-weight: 600; color: #64748b;">Ref: ${refCode}</span>
            </div>

            <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; margin-bottom: 14px; background: #ffffff;">
              <div style="font-size: 11px; font-weight: 800; color: #c8962c; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
                ⭐ Schedule &amp; Projected Accumulation Roadmap
              </div>
              <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
                <thead>
                  <tr>
                    ${milestoneThsHtml}
                  </tr>
                </thead>
                <tbody>
                  ${milestoneRowsHtml}
                </tbody>
              </table>
            </div>

            <div style="padding: 10px 14px; background: #f8fafc; border-left: 3.5px solid #c8962c; border-radius: 0 6px 6px 0; font-size: 8.5px; line-height: 1.45; color: #475569; margin-top: 14px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px;">
                <strong>* Important Regulatory Notice:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns. The figures and calculations provided in this statement are for mathematical illustration purposes only and do not represent a guaranteed return.
              </p>
              <p style="margin: 0;">
                Prepared by <strong>Milestone Financial Distribution Pvt. Ltd.</strong> (AMFI-Registered Mutual Fund Distributor &bull; ARN: 111197). For personalized asset allocation, goal reviews, or tax optimization, please contact Chetan Kumar Patel (+91 98254 45975, +91 98244 21676) &bull; info@milestonefinancial.in.
              </p>
            </div>

            <div style="text-align: center; font-size: 8px; color: #94a3b8; margin-top: 10px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
              Milestone Financial Distribution Pvt. Ltd. &bull; Ratnakar Nine Square, Vastrapur, Ahmedabad 380015 &bull; info@milestonefinancial.in
            </div>
          </div>
        ` : `
          <div style="padding: 10px 14px; background: #f8fafc; border-left: 3.5px solid #c8962c; border-radius: 0 6px 6px 0; font-size: 8.5px; line-height: 1.45; color: #475569; margin-top: 14px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
            <p style="margin: 0 0 4px;">
              <strong>* Important Regulatory Notice:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns. The figures and calculations provided in this statement are for mathematical illustration purposes only and do not represent a guaranteed return.
            </p>
            <p style="margin: 0;">
              Prepared by <strong>Milestone Financial Distribution Pvt. Ltd.</strong> (AMFI-Registered Mutual Fund Distributor &bull; ARN: 111197). For personalized asset allocation, goal reviews, or tax optimization, please contact Chetan Kumar Patel (+91 98254 45975, +91 98244 21676) &bull; info@milestonefinancial.in.
            </p>
          </div>
          <div style="text-align: center; font-size: 8px; color: #94a3b8; margin-top: 10px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            Milestone Financial Distribution Pvt. Ltd. &bull; Ratnakar Nine Square, Vastrapur, Ahmedabad 380015 &bull; info@milestonefinancial.in
          </div>
        `}
      </body>
      </html>
    `;

    doc.write(fullHtml);
    doc.close();

    // Small delay to ensure all inline elements and SVG are rendered
    setTimeout(() => {
      if (typeof html2pdf !== 'undefined') {
        // CRITICAL FIX: html2canvas reads the PARENT window's scroll position
        // even when rendering iframe content. We must force parent to (0,0)
        // to prevent left/top clipping on the rendered canvas.
        const savedScrollX = window.pageXOffset || window.scrollX || 0;
        const savedScrollY = window.pageYOffset || window.scrollY || 0;
        window.scrollTo(0, 0);

        const opt = {
          margin: [6, 6, 6, 6],
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: 780,
            windowWidth: 780
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
          },
          pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf().set(opt).from(doc.body).save().then(() => {
          window.scrollTo(savedScrollX, savedScrollY);
          cleanup();
        }).catch(err => {
          console.error('html2pdf generation error:', err);
          window.scrollTo(savedScrollX, savedScrollY);
          cleanup();
          window.print();
        });
      } else {
        cleanup();
        window.print();
      }
    }, 250);

  } catch (error) {
    console.error('Error in generateCalculatorPDF:', error);
    cleanup();
    window.print();
  }
};

