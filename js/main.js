/* ============================================================
   Milestone Financial — shared site interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initMobileMenu()
  initReveal()
  initCounters()
  initFaq()
  initBackToTop()
  initYear()
  initContactForm()
  initSummaryDashboard()
})

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar')
  if (!navbar) return

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle')
  const links = document.getElementById('navLinks')
  if (!toggle || !links) return

  const hamburgerSvg = `<svg class="nav-toggle-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
  const closeSvg = `<svg class="nav-toggle-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`

  // Ensure initial SVG icon is rendered
  if (!toggle.querySelector('svg')) {
    toggle.innerHTML = hamburgerSvg
  }

  const setOpen = (open) => {
    links.classList.toggle('open', open)
    toggle.classList.toggle('is-active', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.innerHTML = open ? closeSvg : hamburgerSvg
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation()
    setOpen(!links.classList.contains('open'))
  })

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })

  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false)
    }
  })
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal')
  if (!items.length) return

  // Stagger siblings inside the same parent for a cascading effect.
  items.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'))
    const idx = siblings.indexOf(el)
    el.style.transitionDelay = `${(idx % 4) * 90}ms`
  })

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  items.forEach((el) => io.observe(el))
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]')
  if (!counters.length) return

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10)
    const suffix = el.dataset.suffix || ''
    const duration = 1600
    const start = performance.now()

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(target * eased)
      el.textContent = value.toLocaleString('en-IN') + suffix
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target)
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  counters.forEach((el) => io.observe(el))
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  // 1. Native <details class="faq-item"> (index, services, calculators)
  const detailsItems = document.querySelectorAll('details.faq-item')
  if (detailsItems.length) {
    detailsItems.forEach((item) => {
      // Ensure all start closed
      item.removeAttribute('open')

      item.addEventListener('toggle', () => {
        if (item.open) {
          // Close other open siblings in the same container for clean accordion UX
          const parent = item.parentElement
          if (parent) {
            parent.querySelectorAll('details.faq-item[open]').forEach((other) => {
              if (other !== item) other.removeAttribute('open')
            })
          }
        }
      })
    })
  }

  // 2. Custom <div class="faq-item"> (goal-planner)
  const divItems = document.querySelectorAll('div.faq-item')
  if (divItems.length) {
    divItems.forEach((item) => {
      const q = item.querySelector('.faq-q')
      const a = item.querySelector('.faq-a')
      if (!q || !a) return

      // Ensure starts closed
      item.classList.remove('open')
      q.setAttribute('aria-expanded', 'false')
      a.style.maxHeight = '0px'

      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')

        // Close all items
        divItems.forEach((other) => {
          other.classList.remove('open')
          const oQ = other.querySelector('.faq-q')
          const oA = other.querySelector('.faq-a')
          if (oQ) oQ.setAttribute('aria-expanded', 'false')
          if (oA) oA.style.maxHeight = '0px'
        })

        // Open only clicked one
        if (!isOpen) {
          item.classList.add('open')
          q.setAttribute('aria-expanded', 'true')
          a.style.maxHeight = a.scrollHeight + 'px'
        }
      })
    })
  }
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('toTop')
  if (!btn) return

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500)
  }, { passive: true })

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year')
  if (el) el.textContent = new Date().getFullYear()
}

/* ---------- Contact form validation & email submission ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm')
  if (!form) return

  const msg = document.getElementById('formMsg')
  const name = form.querySelector('#name')
  const phone = form.querySelector('#phone')
  const email = form.querySelector('#email')
  const interest = form.querySelector('#interest')
  const message = form.querySelector('#message')
  const submitBtn = form.querySelector('button[type="submit"]')

  const setError = (input, invalid) => {
    input.classList.toggle('invalid', invalid)
    return !invalid
  }

  const validate = () => {
    let ok = true

    ok = setError(name, name.value.trim().length < 3) && ok
    ok = setError(phone, !/^[6-9]\d{9}$/.test(phone.value.trim())) && ok

    if (email.value.trim()) {
      ok = setError(email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) && ok
    } else {
      email.classList.remove('invalid')
    }

    return ok
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!validate()) {
      msg.className = 'form-msg error'
      msg.textContent = 'Please provide a valid name and 10-digit mobile number.'
      return
    }

    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Request Free Consultation'
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = 'Sending Request...'
    }

    msg.className = 'form-msg loading'
    msg.textContent = 'Sending your details...'

    const payload = {
      "Name": name.value.trim(),
      "Phone": phone.value.trim(),
      "Email": email.value.trim() || 'Not provided',
      "Service Requested": interest && interest.value ? interest.value : 'General Inquiry',
      "Message / Goals": message && message.value.trim() ? message.value.trim() : 'No additional message',
      "_subject": `New Inquiry from ${name.value.trim()} - Milestone Financial`,
      "_replyto": email.value.trim() || 'info@milestonefinancial.in',
      "_cc": "chetanhiramani@gmail.com,info@milestonefinancial.in",
      "_template": "table",
      "_captcha": "false",
      "_autoresponse": `Hello ${name.value.trim()},\n\nThank you for reaching out to Mr. Chetan Kumar Patel at Milestone Financial. We have received your inquiry regarding "${interest && interest.value ? interest.value : 'Mutual Fund Planning'}" and will connect with you within 24 hours.\n\nWarm regards,\nMilestone Financial\nPhone: +91 98254 45975 / +91 98244 21676\nOffice: Ratnakar Nine Square, Vastrapur, Ahmedabad`
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/munjashah3@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalBtnText
      }

      if (response.ok || data.success === 'true' || data.success === true) {
        const firstName = name.value.trim().split(' ')[0]
        msg.className = 'form-msg success'
        msg.innerHTML = `<strong>Thank you${firstName ? ' ' + firstName : ''} for reaching out!</strong><br />Your request has been received. Chetan Patel will connect with you within 24 hours.`
        showSuccessModal(firstName)
        form.reset()
      } else {
        throw new Error(data.message || 'Submission error')
      }
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalBtnText
      }
      // Fallback: standard submission if AJAX is blocked
      form.submit()
    }
  })

  // Clear the error state as the user types
  form.querySelectorAll('input, textarea, select').forEach((input) => {
    input.addEventListener('input', () => input.classList.remove('invalid'))
  })
}

/* ---------- Centered Success Modal Popup (Auto-closes in 5s) ---------- */
let modalAutoCloseTimer = null

function showSuccessModal(firstName) {
  let modal = document.getElementById('successModal')
  if (!modal) {
    const wrapper = document.createElement('div')
    wrapper.id = 'successModal'
    wrapper.className = 'submission-modal-overlay'
    wrapper.setAttribute('role', 'dialog')
    wrapper.setAttribute('aria-modal', 'true')
    wrapper.innerHTML = `
      <div class="submission-modal-card">
        <button type="button" class="submission-modal-close" id="closeSuccessModal" aria-label="Close">&times;</button>
        <div class="submission-modal-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="submission-modal-title" id="modalTitle">Thank you for choosing me!</h3>
        <p class="submission-modal-body" id="modalBody">Your consultation request has been received. Chetan Patel will connect with you within 24 hours.</p>
        <button type="button" class="submission-modal-action" id="modalOkBtn">Got it</button>
        <div class="submission-modal-bar"></div>
      </div>
    `
    document.body.appendChild(wrapper)
    modal = wrapper
  }

  const titleEl = modal.querySelector('#modalTitle')
  if (titleEl) {
    titleEl.innerHTML = `Thank you${firstName ? ' <span class="gold">' + firstName + '</span>' : ''} for choosing me!`
  }

  // Reset countdown progress bar
  const bar = modal.querySelector('.submission-modal-bar')
  if (bar) {
    bar.style.animation = 'none'
    void bar.offsetWidth // Force reflow
    bar.style.animation = 'modal-countdown 5s linear forwards'
  }

  modal.classList.add('active')

  const closeModal = () => {
    if (modalAutoCloseTimer) {
      clearTimeout(modalAutoCloseTimer)
      modalAutoCloseTimer = null
    }
    modal.classList.remove('active')
  }

  const closeBtn = modal.querySelector('#closeSuccessModal')
  const okBtn = modal.querySelector('#modalOkBtn')

  if (closeBtn) closeBtn.onclick = closeModal
  if (okBtn) okBtn.onclick = closeModal

  // Click on background backdrop to close
  modal.onclick = (e) => {
    if (e.target === modal) closeModal()
  }

  // Escape key closes modal
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal()
      document.removeEventListener('keydown', onKeyDown)
    }
  }
  document.addEventListener('keydown', onKeyDown)

  // 5 seconds automatic close
  if (modalAutoCloseTimer) clearTimeout(modalAutoCloseTimer)
  modalAutoCloseTimer = setTimeout(() => {
    closeModal()
  }, 5000)
}

/* ---------- Wealth Showdown Tab Switcher ---------- */
function switchShowdownTab(type) {
  const tabSip = document.getElementById('showdownTabSip')
  const tabSwp = document.getElementById('showdownTabSwp')
  const btnSip = document.getElementById('tabBtnSip')
  const btnSwp = document.getElementById('tabBtnSwp')

  if (!tabSip || !tabSwp || !btnSip || !btnSwp) return

  if (type === 'sip') {
    tabSip.style.display = 'block'
    tabSwp.style.display = 'none'
    btnSip.classList.add('active')
    btnSwp.classList.remove('active')
  } else {
    tabSip.style.display = 'none'
    tabSwp.style.display = 'block'
    btnSip.classList.remove('active')
    btnSwp.classList.add('active')
  }
}

/* ---------- Authentic Client Summary Filter & Controls ---------- */
function initSummaryDashboard() {
  const filterContainer = document.getElementById('summaryTimeFilters')
  if (!filterContainer) return

  const buttons = filterContainer.querySelectorAll('.sfp-btn')
  const aumDayVal = document.getElementById('aumDayVal')
  const aumMomVal = document.getElementById('aumMomVal')
  const invDayVal = document.getElementById('invDayVal')
  const invMomVal = document.getElementById('invMomVal')
  const sipAvgVal = document.getElementById('sipAvgVal')
  const sipMomVal = document.getElementById('sipMomVal')

  const filterData = {
    '3': {
      aumDay: '₹1.80 Lakh (0.08%)',
      aumMom: '₹65.90 Lakh (3.11%)',
      invDay: '₹1.14 Lakh (0.08%)',
      invMom: '₹29.56 Lakh (2.07%)',
      sipAvg: '₹2,125',
      sipMom: '₹71,500 (2.84%)'
    },
    '7': {
      aumDay: '₹4.15 Lakh (0.19%)',
      aumMom: '₹65.90 Lakh (3.11%)',
      invDay: '₹2.70 Lakh (0.19%)',
      invMom: '₹29.56 Lakh (2.07%)',
      sipAvg: '₹2,125',
      sipMom: '₹71,500 (2.84%)'
    },
    '10': {
      aumDay: '₹6.20 Lakh (0.28%)',
      aumMom: '₹65.90 Lakh (3.11%)',
      invDay: '₹4.05 Lakh (0.28%)',
      invMom: '₹29.56 Lakh (2.07%)',
      sipAvg: '₹2,125',
      sipMom: '₹71,500 (2.84%)'
    },
    '15': {
      aumDay: '₹9.45 Lakh (0.43%)',
      aumMom: '₹65.90 Lakh (3.11%)',
      invDay: '₹6.20 Lakh (0.43%)',
      invMom: '₹29.56 Lakh (2.07%)',
      sipAvg: '₹2,125',
      sipMom: '₹71,500 (2.84%)'
    },
    '30': {
      aumDay: '₹18.80 Lakh (0.86%)',
      aumMom: '₹65.90 Lakh (3.11%)',
      invDay: '₹12.40 Lakh (0.85%)',
      invMom: '₹29.56 Lakh (2.07%)',
      sipAvg: '₹2,125',
      sipMom: '₹71,500 (2.84%)'
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      const days = btn.dataset.days
      const d = filterData[days]
      if (d) {
        if (aumDayVal) aumDayVal.textContent = d.aumDay
        if (aumMomVal) aumMomVal.textContent = d.aumMom
        if (invDayVal) invDayVal.textContent = d.invDay
        if (invMomVal) invMomVal.textContent = d.invMom
        if (sipAvgVal) sipAvgVal.textContent = d.sipAvg
        if (sipMomVal) sipMomVal.textContent = d.sipMom
      }
    })
  })

  // Privacy Eye Toggle (Masks / Unmasks figures)
  const eyeBtn = document.getElementById('toggleSummaryEye')
  let isMasked = false
  if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
      isMasked = !isMasked
      const aumVal = document.getElementById('summaryAumVal')
      const invVal = document.getElementById('summaryInvVal')
      const sipVal = document.getElementById('summarySipVal')

      if (isMasked) {
        if (aumVal) aumVal.textContent = '₹••.•• Cr'
        if (invVal) invVal.textContent = '₹••.•• Cr'
        if (sipVal) sipVal.textContent = '₹••.•• Lakh'
        eyeBtn.title = 'Show Figures'
      } else {
        if (aumVal) aumVal.textContent = '₹21.87 Cr'
        if (invVal) invVal.textContent = '₹14.57 Cr'
        if (sipVal) sipVal.textContent = '₹25.89 Lakh'
        eyeBtn.title = 'Hide Figures'
      }
    })
  }

  // Fullscreen / Expand button
  const expandBtn = document.getElementById('expandSummaryBtn')
  const summaryCard = document.querySelector('.client-summary-card')
  if (expandBtn && summaryCard) {
    expandBtn.addEventListener('click', () => {
      summaryCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}


