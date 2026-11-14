(() => {
  'use strict';

  /* ======================================================================
     EDIT PER CLIENT
     ====================================================================== */
  const CONFIG = {
    name: 'Junaid Cafe',
    whatsapp: '15550100199',        // country code + number, no "+" or spaces
    email: 'hello@junaidcafe.com',
    phone: '+1 (555) 010-0199',
    currency: '$',
    deliveryFee: 3.99,              // 0 to disable
    freeDeliveryOver: 30,           // 0 to disable
    taxPercent: 0,                  // e.g. 8 for 8% tax
    fiverrUrl: 'https://www.fiverr.com/',
    storageKey: 'junaid-cafe-cart-v2'
  };

  // Sunday first (matches Date#getDay)
  const HOURS = [
    ['9am', '9pm'], ['8am', '10pm'], ['8am', '10pm'], ['8am', '10pm'],
    ['8am', '10pm'], ['8am', '12am'], ['8am', '12am']
  ];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'];
  const CAT_ICON = { Burgers: 'burger', Pizza: 'pizza', Sides: 'fries', Drinks: 'cup', Desserts: 'cake' };

  const PRODUCTS = [
    { id: 1,  cat: 'Burgers',  name: 'Classic Smash Burger',  price: 11.5, rating: 4.9, photo: '1568901346375-23c9450c58cd', badge: 'Best seller', featured: true,
      desc: 'Double smashed beef patty, cheddar, pickles and house sauce on a toasted brioche bun.' },
    { id: 2,  cat: 'Burgers',  name: 'Crispy Chicken Burger', price: 10.5, rating: 4.8, photo: '1571091718767-18b5b1457add',
      desc: 'Buttermilk fried chicken, slaw, spicy mayo and crisp lettuce.' },
    { id: 3,  cat: 'Burgers',  name: 'BBQ Bacon Burger',      price: 12.9, rating: 4.8, photo: '1550547660-d9450f859349', badge: "Chef's pick",
      desc: 'Smoky BBQ glaze, crispy bacon, onion rings and melted cheese.' },
    { id: 4,  cat: 'Burgers',  name: 'Triple Club Sandwich',  price: 9.5,  rating: 4.7, photo: '1528735602780-2552fd46c7af',
      desc: 'Toasted bread layered with grilled chicken, egg, tomato and cheese.' },
    { id: 5,  cat: 'Pizza',    name: 'Margherita Pizza',      price: 13,   rating: 4.8, photo: '1513104890138-7c749659a591', veg: true,
      desc: 'San Marzano tomato, fresh mozzarella and basil on a thin crust.' },
    { id: 6,  cat: 'Pizza',    name: 'Pepperoni Pizza',       price: 14.5, rating: 4.9, photo: '1565299624946-b28f40a0ae38', badge: 'Popular',
      desc: 'Loaded with spicy pepperoni and bubbling mozzarella.' },
    { id: 7,  cat: 'Sides',    name: 'Truffle Fries',         price: 6.5,  rating: 4.9, photo: '1630384060421-cb20d0e0649d', veg: true, badge: 'Popular',
      desc: 'Golden fries tossed with parmesan, herbs and truffle oil.' },
    { id: 8,  cat: 'Sides',    name: 'Loaded Nachos',         price: 8.5,  rating: 4.7, photo: '1513456852971-30c0b8199d4d', veg: true,
      desc: 'Crunchy chips, molten cheese, jalapenos and fresh salsa.' },
    { id: 9,  cat: 'Sides',    name: 'Garden Fresh Salad',    price: 7.5,  rating: 4.6, photo: '1540189549336-e6e99c3679fe', veg: true,
      desc: 'Crisp greens, cherry tomatoes, cucumber and lemon vinaigrette.' },
    { id: 10, cat: 'Drinks',   name: 'Cappuccino',            price: 4.2,  rating: 4.9, photo: '1495474472287-4d71bcdd2085',
      desc: 'Rich espresso with velvety steamed milk and latte art.' },
    { id: 11, cat: 'Drinks',   name: 'Iced Latte',            price: 4.8,  rating: 4.8, photo: '1517701604599-bb29b565090c', badge: 'New',
      desc: 'Double espresso over ice with cold milk. Smooth and refreshing.' },
    { id: 12, cat: 'Drinks',   name: 'Fresh Mint Lemonade',   price: 4.5,  rating: 4.7, photo: '1556679343-c7306c1976bc', veg: true,
      desc: 'Squeezed lemons, cool mint and sparkling water.' },
    { id: 13, cat: 'Desserts', name: 'Chocolate Lava Cake',   price: 7.5,  rating: 4.9, photo: '1624353365286-3f8d62daad51', badge: 'Must try', featured: true,
      desc: 'Warm molten chocolate center served with vanilla ice cream.' },
    { id: 14, cat: 'Desserts', name: 'Fudge Brownie',         price: 5.5,  rating: 4.7, photo: '1606313564200-e75d5e30476c', veg: true,
      desc: 'Dense, fudgy and finished with a chocolate drizzle.' },
    { id: 15, cat: 'Desserts', name: 'Fluffy Pancake Stack',  price: 8,    rating: 4.8, photo: '1567620905732-2d1ec7ab7445', veg: true,
      desc: 'Buttermilk pancakes with maple syrup, berries and whipped cream.' }
  ];

  /* ======================================================================
     Helpers
     ====================================================================== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const byId = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const money = (n) => CONFIG.currency + (Math.round(n * 100) / 100).toFixed(2);
  const photo = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ico = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

  const state = { cart: loadCart(), cat: 'All', query: '', type: 'Delivery' };

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
      const clean = {};
      for (const [id, qty] of Object.entries(raw)) {
        if (PRODUCTS.some((p) => p.id === Number(id)) && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, 50);
      }
      return clean;
    } catch { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.cart)); } catch { /* storage unavailable */ }
  }

  /* Re-render a region but keep keyboard focus on the equivalent control */
  function keepFocus(root, render) {
    const a = document.activeElement;
    const inside = a && root.contains(a) && a.dataset ? { action: a.dataset.action, id: a.dataset.id } : null;
    render();
    if (!inside) return;
    const same = root.querySelector(`[data-action="${inside.action}"][data-id="${inside.id}"]`);
    (same || root.querySelector('[data-action="inc"]') || root.querySelector('[data-action="add"]') || root.querySelector('button'))?.focus();
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }

  /* ======================================================================
     Static page bits
     ====================================================================== */
  function initPage() {
    $('#year').textContent = new Date().getFullYear();
    $$('[data-phone]').forEach((el) => { el.textContent = CONFIG.phone; });
    $$('[data-email]').forEach((el) => { el.textContent = CONFIG.email; });
    $$('[data-tel]').forEach((a) => { a.href = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, ''); });
    $$('[data-mail]').forEach((a) => { a.href = 'mailto:' + CONFIG.email; });
    $$('[data-wa]').forEach((a) => { a.href = 'https://wa.me/' + CONFIG.whatsapp; });
    $$('[data-fiverr]').forEach((a) => { a.href = CONFIG.fiverrUrl; });
    $$('[data-free-over]').forEach((el) => {
      el.textContent = CONFIG.freeDeliveryOver ? money(CONFIG.freeDeliveryOver).replace(/\.00$/, '') : 'any order';
    });

    const today = new Date().getDay();
    $('#today-hours').textContent = `Open today · ${HOURS[today][0]} – ${HOURS[today][1]}`;
    $('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) =>
      `<div${d === today ? ' class="is-today" aria-current="date"' : ''}><dt>${DAYS[d]}</dt><dd>${HOURS[d][0]} – ${HOURS[d][1]}</dd></div>`
    ).join('');

    // header state + mobile menu
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('#menu-toggle');
    const mnav = $('#mnav');
    const setMenu = (open) => {
      mnav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      document.body.classList.toggle('menu-open', open);
      document.documentElement.classList.toggle('lock', open);
    };
    toggle.addEventListener('click', () => setMenu(mnav.hidden));
    mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); toggle.focus(); } });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    // a failed photo falls back to the category icon underneath it
    document.addEventListener('error', (e) => {
      const t = e.target;
      if (t instanceof HTMLImageElement && t.closest('.media, .thumb')) t.hidden = true;
    }, true);
  }

  /* ======================================================================
     Menu
     ====================================================================== */
  function renderTabs() {
    $('#tabs').innerHTML = CATEGORIES.map((c) =>
      `<button class="tab" type="button" data-cat="${c}" aria-pressed="${c === state.cat}">${CAT_ICON[c] ? ico(CAT_ICON[c]) : ''}${c}</button>`
    ).join('');
  }

  function actionHTML(p) {
    const qty = state.cart[p.id] || 0;
    if (!qty) return `<button class="add" type="button" data-action="add" data-id="${p.id}" aria-label="Add ${esc(p.name)} to cart">${ico('plus')} Add</button>`;
    return `<div class="stepper" role="group" aria-label="${esc(p.name)} quantity">
      <button class="dec" type="button" data-action="dec" data-id="${p.id}" aria-label="Remove one ${esc(p.name)}">${ico('minus')}</button>
      <span class="stepper__n" aria-live="polite">${qty}</span>
      <button class="inc" type="button" data-action="inc" data-id="${p.id}" aria-label="Add one ${esc(p.name)}">${ico('plus')}</button>
    </div>`;
  }

  function cardHTML(p) {
    const chips = (p.badge ? `<span class="chip chip--hot">${esc(p.badge)}</span>` : '') + (p.veg ? '<span class="chip chip--veg">Veg</span>' : '');
    const fb = ico(CAT_ICON[p.cat], 'media__fb');
    return `<article class="card${p.featured ? ' card--feature' : ''}">
      <div class="media">${fb}<img src="${photo(p.photo, 640, 533)}" width="640" height="533" alt="${esc(p.name)}" loading="lazy" decoding="async"><div class="chips">${chips}</div></div>
      <div class="card__body">
        <h3 class="card__name">${esc(p.name)}</h3>
        <p class="card__rate">${ico('star', 'i--fill')}<span>${p.rating.toFixed(1)}</span></p>
        <p class="card__desc">${esc(p.desc)}</p>
        <div class="card__buy">
          <p class="card__price">${money(p.price)}</p>
          <div data-act-for="${p.id}">${actionHTML(p)}</div>
        </div>
      </div>
    </article>`;
  }

  function renderMenu() {
    const q = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) =>
      (state.cat === 'All' || p.cat === state.cat) && (!q || `${p.name} ${p.desc} ${p.cat}`.toLowerCase().includes(q))
    );
    $('#grid').innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="empty">${ico('search')}<p><strong>No dishes found</strong></p><p>${q ? `Nothing matches “${esc(state.query.trim())}”.` : 'This category is empty.'}</p><button class="btn btn--quiet" type="button" data-action="reset">Show full menu</button></div>`;
    $('#menu-status').textContent = list.length ? `${list.length} dishes shown` : 'No dishes found';
  }

  function paintActions(id) {
    const p = byId(id);
    $$(`[data-act-for="${id}"]`).forEach((box) => keepFocus(box, () => { box.innerHTML = actionHTML(p); }));
  }

  /* ======================================================================
     Cart
     ====================================================================== */
  const dlg = $('#cart');
  const form = $('#order-form');

  function totals() {
    let sub = 0, qty = 0;
    for (const [id, q] of Object.entries(state.cart)) {
      const p = byId(id);
      if (p) { sub += p.price * q; qty += q; }
    }
    const tax = sub * CONFIG.taxPercent / 100;
    const free = CONFIG.freeDeliveryOver > 0 && sub >= CONFIG.freeDeliveryOver;
    const fee = state.type === 'Delivery' && sub > 0 && !free ? CONFIG.deliveryFee : 0;
    return { sub, qty, tax, fee, free, total: sub + tax + fee };
  }

  function change(id, delta) {
    const p = byId(id);
    if (!p) return;
    const next = Math.max(0, Math.min(50, (state.cart[p.id] || 0) + delta));
    if (next) state.cart[p.id] = next; else delete state.cart[p.id];
    saveCart();
    paintActions(p.id);
    renderCart();
    if (delta > 0 && !dlg.open) toast(`Added ${p.name}`);
  }

  function renderCart() {
    const t = totals();

    // badges and floating bar
    const badge = $('#cart-badge');
    badge.hidden = !t.qty;
    badge.textContent = t.qty;
    $('#cart-open').setAttribute('aria-label', t.qty ? `Open cart, ${t.qty} ${t.qty === 1 ? 'item' : 'items'}` : 'Open cart, empty');
    $('#cart-bar').hidden = !t.qty;
    $('#bar-count').textContent = t.qty;
    $('#bar-total').textContent = money(t.sub);

    // dialog content
    $('#cart-empty').hidden = t.qty > 0;
    $('#cart-filled').hidden = t.qty === 0;
    $('#cart-foot').hidden = t.qty === 0;
    if (!t.qty) return;

    const lines = $('#lines');
    keepFocus(lines, () => {
      lines.innerHTML = Object.keys(state.cart).map((id) => {
        const p = byId(id);
        if (!p) return '';
        const q = state.cart[id];
        return `<li>
          <div class="thumb">${ico(CAT_ICON[p.cat], 'media__fb')}<img src="${photo(p.photo, 112, 112)}" width="56" height="56" alt="" loading="lazy"></div>
          <div><strong>${esc(p.name)}</strong><small>${money(p.price)} each</small></div>
          <div class="stepper" role="group" aria-label="${esc(p.name)} quantity">
            <button class="dec" type="button" data-action="dec" data-id="${p.id}" aria-label="Remove one ${esc(p.name)}">${ico('minus')}</button>
            <span class="stepper__n">${q}</span>
            <button class="inc" type="button" data-action="inc" data-id="${p.id}" aria-label="Add one ${esc(p.name)}">${ico('plus')}</button>
          </div>
        </li>`;
      }).join('');
    });

    $('#t-sub').textContent = money(t.sub);
    $('#t-tax-row').hidden = !CONFIG.taxPercent;
    $('#t-tax').textContent = money(t.tax);
    $('#t-fee-row').hidden = state.type !== 'Delivery' || !CONFIG.deliveryFee;
    $('#t-fee').textContent = t.fee ? money(t.fee) : 'Free';
    $('#t-total').textContent = money(t.total);

    const hint = $('#free-hint');
    const showHint = state.type === 'Delivery' && CONFIG.freeDeliveryOver > 0 && CONFIG.deliveryFee > 0;
    hint.hidden = !showHint;
    if (showHint) {
      hint.textContent = t.free
        ? 'You unlocked free delivery.'
        : `Add ${money(CONFIG.freeDeliveryOver - t.sub)} more for free delivery.`;
    }
  }

  function openCart() {
    renderCart();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('lock');
  }
  function closeCart() {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
    document.documentElement.classList.remove('lock');
  }

  const WHERE = {
    Delivery: { label: 'Delivery address', ph: 'Street, apartment, city', auto: 'street-address' },
    Pickup:   { label: 'Pickup time (optional)', ph: 'e.g. 6:30 pm', auto: 'off' },
    'Dine-in': { label: 'Table number', ph: 'e.g. 7', auto: 'off' }
  };
  function applyType() {
    const w = WHERE[state.type];
    $('#where-label').textContent = w.label;
    const input = $('#f-where');
    input.placeholder = w.ph;
    input.setAttribute('autocomplete', w.auto);
    clearError('where');
    renderCart();
  }

  /* ---------- Validation ---------- */
  const fields = { name: $('#f-name'), phone: $('#f-phone'), where: $('#f-where') };
  function showError(key, msg) {
    const err = $('#e-' + key);
    err.textContent = msg;
    err.hidden = false;
    fields[key].setAttribute('aria-invalid', 'true');
  }
  function clearError(key) {
    const err = $('#e-' + key);
    err.hidden = true;
    err.textContent = '';
    fields[key].removeAttribute('aria-invalid');
  }
  function validate() {
    Object.keys(fields).forEach(clearError);
    const errors = {};
    if (!fields.name.value.trim()) errors.name = 'Please enter your name.';
    const phone = fields.phone.value.trim();
    if (phone && phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
    if (state.type !== 'Pickup' && !fields.where.value.trim()) {
      errors.where = state.type === 'Delivery' ? 'Please enter your delivery address.' : 'Please enter your table number.';
    }
    const keys = Object.keys(errors);
    keys.forEach((k) => showError(k, errors[k]));
    if (keys.length) fields[keys[0]].focus();
    return keys.length === 0;
  }

  /* ---------- Send ---------- */
  function buildMessage() {
    const t = totals();
    const name = fields.name.value.trim();
    const phone = fields.phone.value.trim();
    const where = fields.where.value.trim();
    const note = $('#f-note').value.trim();
    const whereLabel = state.type === 'Delivery' ? 'Address' : state.type === 'Dine-in' ? 'Table' : 'Pickup time';
    const lines = Object.keys(state.cart).map((id) => {
      const p = byId(id);
      return p ? `${state.cart[id]} x ${p.name} - ${money(p.price * state.cart[id])}` : '';
    }).filter(Boolean);

    return [
      `*NEW ORDER - ${CONFIG.name}*`,
      '--------------------',
      ...lines,
      '--------------------',
      `Subtotal: ${money(t.sub)}`,
      t.tax ? `Tax: ${money(t.tax)}` : null,
      state.type === 'Delivery' ? `Delivery: ${t.fee ? money(t.fee) : 'Free'}` : null,
      `*TOTAL: ${money(t.total)}*`,
      '',
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      `Order type: ${state.type}`,
      where ? `${whereLabel}: ${where}` : null,
      note ? `Notes: ${note}` : null,
      '',
      'Please confirm my order. Thank you!'
    ].filter((l) => l !== null).join('\n');
  }

  function send(channel) {
    if (!totals().qty) return;
    if (!validate()) return;
    const msg = buildMessage();
    const plain = msg.replace(/\*/g, '');
    let url;
    if (channel === 'wa') url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    else if (channel === 'mail') url = `mailto:${CONFIG.email}?subject=${encodeURIComponent('New order from ' + fields.name.value.trim())}&body=${encodeURIComponent(plain)}`;
    else url = `sms:${CONFIG.phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(plain)}`;

    if (channel === 'wa') {
      const w = window.open(url, '_blank');
      if (w) w.opener = null; else window.location.href = url; // popup blocked
    } else {
      window.location.href = url;
    }
    toast(channel === 'wa' ? 'Opening WhatsApp with your order' : 'Opening your messaging app');
  }

  /* ======================================================================
     Events
     ====================================================================== */
  function bind() {
    $('#tabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      state.cat = b.dataset.cat;
      $$('.tab').forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
      renderMenu();
    });

    $('#q').addEventListener('input', (e) => { state.query = e.target.value; renderMenu(); });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'add' || action === 'inc') change(id, 1);
      else if (action === 'dec') change(id, -1);
      else if (action === 'reset') {
        state.cat = 'All'; state.query = ''; $('#q').value = '';
        renderTabs(); renderMenu();
      } else if (action === 'clear') {
        state.cart = {}; saveCart();
        PRODUCTS.forEach((p) => paintActions(p.id));
        renderCart();
      } else if (action === 'browse') {
        closeCart();
        $('#menu').scrollIntoView();
      }
    });

    $('#cart-open').addEventListener('click', openCart);
    $('#cart-bar').addEventListener('click', openCart);
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) closeCart();
    });
    dlg.addEventListener('close', () => document.documentElement.classList.remove('lock'));

    $$('input[name="type"]').forEach((r) => r.addEventListener('change', () => { state.type = r.value; applyType(); }));
    Object.keys(fields).forEach((k) => fields[k].addEventListener('input', () => clearError(k)));

    form.addEventListener('submit', (e) => { e.preventDefault(); send('wa'); });
    $$('[data-send]').forEach((b) => b.addEventListener('click', () => send(b.dataset.send)));
  }

  /* ======================================================================
     Init
     ====================================================================== */
  initPage();
  renderTabs();
  renderMenu();
  renderCart();
  bind();
})();
