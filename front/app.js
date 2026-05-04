// ===== NOOR ALLAH — APP v3 =====

let currentItem = null;
let currentItemType = 'apt';
let bookingStep = 1;
let bookingData = {};
let selectedPayment = null;
let currentContractData = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Loader
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.style.overflow = '';
    initPage();
  }, 2200);
  document.body.style.overflow = 'hidden';
});

function initPage() {
  renderApartments(APARTMENTS);
  animateStats();
  initScroll();
  initNavScroll();
}

// ===== NAV =====
function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}
function toggleNav() {
  const nl = document.getElementById('navLinks');
  nl.classList.toggle('open');
  document.getElementById('ham').classList.toggle('open');
}
function closeNav() { document.getElementById('navLinks').classList.remove('open'); }

// ===== SCROLL REVEAL =====
function initScroll() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}
function observeNew() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.fade-up:not(.vis)').forEach(el => io.observe(el));
}

// ===== COUNTER =====
function animateStats() {
  [{ id:'statApts',target:120,s:'+' }, { id:'statClients',target:2500,s:'+' }, { id:'statCities',target:6,s:'' }].forEach(({ id, target, s }) => {
    const el = document.getElementById(id);
    if (!el) return;
    let v = 0; const step = target / 55;
    const t = setInterval(() => { v += step; if (v >= target) { v = target; clearInterval(t); } el.textContent = Math.floor(v) + s; }, 30);
  });
}

// ===== TABS =====
function switchMainTab(tab, btn) {
  currentItemType = tab;
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const ss = document.getElementById('searchSection');
  if (tab === 'apts') { renderApartments(APARTMENTS); if (ss) ss.style.display = ''; }
  else { renderLands(LANDS); if (ss) ss.style.display = 'none'; }
}

// ===== RENDER APARTMENTS =====
function renderApartments(list) {
  const grid = document.getElementById('aptGrid');
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><div style="font-size:3rem;margin-bottom:14px">🔍</div><p>لا توجد شقق مطابقة للبحث</p></div>`;
    return;
  }
  list.forEach((apt, i) => {
    const card = document.createElement('div');
    card.className = 'apt-card fade-up';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="ac-img">
        <img src="${apt.img}" alt="${apt.title}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'"/>
        <div class="ac-wm">نور الله 🏠</div>
        <div class="ac-overlay">
          <button class="btn-gold" style="padding:8px 20px;font-size:.83rem" onclick="openApt(${apt.id})">
            <i class="fas fa-eye"></i> عرض التفاصيل
          </button>
        </div>
        <div class="ac-badges">
          ${apt.badges.map(b => `<span class="badge ${b==='محجوزة'?'b-red':'b-gold'}">${b}</span>`).join('')}
        </div>
      </div>
      <div class="ac-body">
        <div class="ac-title">${apt.title}</div>
        <div class="ac-loc"><i class="fas fa-map-marker-alt"></i> ${apt.area}، ${apt.city}</div>
        <div class="ac-feats">
          <div class="acf"><span class="ico">🛏</span>${apt.rooms} غرف</div>
          <div class="acf"><span class="ico">📐</span>${apt.size}م²</div>
          <div class="acf"><span class="ico">👥</span>${apt.persons}</div>
          <div class="acf"><span class="ico">🚿</span>${apt.bathrooms}</div>
        </div>
        <div class="ac-foot">
          <div class="ac-price">${apt.price.toLocaleString()} جنيه <small>/ ${apt.priceUnit}</small></div>
          <div class="ac-rating"><i class="fas fa-star"></i> ${apt.rating} <span>(${apt.reviews})</span></div>
        </div>
      </div>`;
    card.addEventListener('click', (e) => { if (!e.target.closest('button')) openApt(apt.id); });
    grid.appendChild(card);
  });
  observeNew();
}

// ===== RENDER LANDS =====
function renderLands(list) {
  const grid = document.getElementById('aptGrid');
  grid.innerHTML = '';
  list.forEach((land, i) => {
    const card = document.createElement('div');
    card.className = 'apt-card fade-up';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="ac-img">
        <img src="${land.img}" alt="${land.title}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'"/>
        <div class="ac-wm">نور الله 🌿</div>
        <div class="ac-overlay">
          <button class="btn-gold" style="padding:8px 20px;font-size:.83rem" onclick="openLand(${land.id})">
            <i class="fas fa-eye"></i> عرض التفاصيل
          </button>
        </div>
        <div class="ac-badges">
          ${land.badges.map(b => `<span class="badge b-green">${b}</span>`).join('')}
        </div>
      </div>
      <div class="ac-body">
        <div class="ac-title">${land.title}</div>
        <div class="ac-loc"><i class="fas fa-map-marker-alt"></i> ${land.area}، ${land.city}</div>
        <div style="margin-bottom:12px">
          <div style="font-size:1.25rem;font-weight:900;color:var(--gold-lt)">${land.size} ${land.sizeUnit}</div>
          <div style="color:var(--muted);font-size:.8rem;margin-top:2px">${land.type}</div>
        </div>
        <div class="land-feats">${land.features.slice(0,3).map(f=>`<span class="lf">${f}</span>`).join('')}</div>
        <div class="ac-foot">
          <div class="ac-price">${land.price.toLocaleString()} جنيه <small>/ ${land.priceUnit}</small></div>
          <div class="ac-rating"><i class="fas fa-star"></i> ${land.rating} <span>(${land.reviews})</span></div>
        </div>
      </div>`;
    card.addEventListener('click', (e) => { if (!e.target.closest('button')) openLand(land.id); });
    grid.appendChild(card);
  });
  observeNew();
}

// ===== FILTER =====
function filterApartments() {
  const city = document.getElementById('filterCity').value;
  const type = document.getElementById('filterType').value;
  const persons = document.getElementById('filterPersons').value;
  let f = APARTMENTS;
  if (city) f = f.filter(a => a.city === city);
  if (type) f = f.filter(a => a.type === type);
  if (persons) f = f.filter(a => a.persons >= parseInt(persons));
  renderApartments(f);
  document.getElementById('listings').scrollIntoView({ behavior:'smooth', block:'start' });
  showToast(`تم العثور على ${f.length} شقة`, 'success');
}

// ===== OPEN APT MODAL =====
function openApt(id) {
  currentItemType = 'apt';
  currentItem = APARTMENTS.find(a => a.id === id);
  if (!currentItem) return;
  bookingStep = 1; bookingData = {}; selectedPayment = null;
  const content = document.getElementById('aptModalContent');
  content.innerHTML = `
    <div class="m-img-wrap">
      <img src="${currentItem.img}" alt="${currentItem.title}" class="m-img"/>
      <div class="m-img-wm">📍 نور الله — ${currentItem.city}</div>
    </div>
    <div class="m-body">
      <div class="m-header">
        <div>
          <div class="m-title">${currentItem.title}</div>
          <div class="m-loc"><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i> ${currentItem.area}، ${currentItem.city} <span class="badge b-gold">${currentItem.type}</span></div>
        </div>
        <div class="m-price">${currentItem.price.toLocaleString()} جنيه<small>/ ${currentItem.priceUnit}</small></div>
      </div>
      <p style="color:var(--muted);font-size:.88rem;line-height:1.8;margin-bottom:20px">${currentItem.description}</p>
      <div class="dg">
        <div class="di"><span class="ico">🛏</span><strong>${currentItem.rooms}</strong><span>غرف</span></div>
        <div class="di"><span class="ico">🚿</span><strong>${currentItem.bathrooms}</strong><span>حمامات</span></div>
        <div class="di"><span class="ico">📐</span><strong>${currentItem.size}</strong><span>م²</span></div>
        <div class="di"><span class="ico">👥</span><strong>${currentItem.persons}</strong><span>أشخاص</span></div>
      </div>
      <h4 style="margin-bottom:12px;font-size:.93rem;font-weight:800">المميزات</h4>
      <div class="am-grid">${currentItem.amenities.map(a=>`<div class="am">${a}</div>`).join('')}</div>
      ${currentItem.available
        ? `<div id="bookingSection">${renderBookingStep(1)}</div>`
        : `<div style="text-align:center;padding:22px;background:rgba(231,76,60,.07);border:1px solid rgba(231,76,60,.28);border-radius:12px">
             <div style="font-size:2rem;margin-bottom:8px">😔</div>
             <p style="color:var(--danger);font-weight:800">الشقة محجوزة حالياً</p>
             <a href="https://wa.me/201503244665" target="_blank" class="btn-wa" style="margin-top:14px;display:inline-flex"><i class="fab fa-whatsapp"></i> تواصل معنا</a>
           </div>`}
    </div>`;
  openModal('aptModal');
}

// ===== OPEN LAND MODAL =====
function openLand(id) {
  currentItemType = 'land';
  currentItem = LANDS.find(l => l.id === id);
  if (!currentItem) return;
  const content = document.getElementById('aptModalContent');
  content.innerHTML = `
    <div class="m-img-wrap">
      <img src="${currentItem.img}" alt="${currentItem.title}" class="m-img"/>
      <div class="m-img-wm">🌿 نور الله — ${currentItem.city}</div>
    </div>
    <div class="m-body">
      <div class="m-header">
        <div>
          <div class="m-title">${currentItem.title}</div>
          <div class="m-loc"><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i> ${currentItem.area}، ${currentItem.city} <span class="badge b-green">${currentItem.type}</span></div>
        </div>
        <div class="m-price">${currentItem.price.toLocaleString()} جنيه<small>/ ${currentItem.priceUnit}</small></div>
      </div>
      <p style="color:var(--muted);font-size:.88rem;line-height:1.8;margin-bottom:20px">${currentItem.description}</p>
      <div class="dg">
        <div class="di"><span class="ico">📐</span><strong>${currentItem.size}</strong><span>${currentItem.sizeUnit}</span></div>
        <div class="di"><span class="ico">🌿</span><strong>${currentItem.type}</strong><span>النوع</span></div>
        <div class="di"><span class="ico">⭐</span><strong>${currentItem.rating}</strong><span>التقييم</span></div>
        <div class="di"><span class="ico">💬</span><strong>${currentItem.reviews}</strong><span>تقييم</span></div>
      </div>
      <h4 style="margin-bottom:12px;font-size:.93rem;font-weight:800">🌱 مميزات الأرض</h4>
      <div class="land-feats" style="margin-bottom:22px">${currentItem.features.map(f=>`<span class="lf">${f}</span>`).join('')}</div>
      <div id="landInquirySection">
        <div class="com-box" style="margin-bottom:16px">
          <p>💼 <strong>عمولة نور الله:</strong> ${(currentItem.price*0.05).toLocaleString()} جنيه (5% من سعر البيع)</p>
          <p style="margin-top:5px;font-size:.76rem;opacity:.8">⚠️ العمولة تُدفع لنور الله أولاً قبل إتمام أي صفقة</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button class="btn-gold" style="width:100%" onclick="openLandInquiry()"><i class="fas fa-file-contract"></i> استفسار وحجز</button>
          <a href="https://wa.me/201503244665?text=${encodeURIComponent('استفسار عن أرض: '+currentItem.title+' - '+currentItem.city)}" target="_blank" class="btn-wa" style="width:100%"><i class="fab fa-whatsapp"></i> واتساب</a>
        </div>
      </div>
    </div>`;
  openModal('aptModal');
}

function openLandInquiry() {
  document.getElementById('landInquirySection').innerHTML = `
    <h4 style="margin-bottom:14px;font-size:.98rem;font-weight:800">📋 بيانات الاستفسار</h4>
    <div class="fg"><label>الاسم الكامل</label><input class="fc" type="text" id="landName" placeholder="اسمك بالكامل"/></div>
    <div class="fg"><label>رقم الهاتف</label><input class="fc" type="tel" id="landPhone" placeholder="01xxxxxxxxx"/></div>
    <div class="fg"><label>رسالتك</label><textarea class="fc" id="landMsg" rows="3" placeholder="أي تفاصيل إضافية..." style="resize:none"></textarea></div>
    <div class="com-box" style="margin-bottom:14px">
      <p>💼 <strong>تنبيه:</strong> عمولة نور الله <strong>${(currentItem.price*0.05).toLocaleString()} جنيه</strong> تُدفع عند إتمام الصفقة</p>
    </div>
    <button class="btn-gold" style="width:100%" onclick="submitLandInquiry()"><i class="fas fa-paper-plane"></i> إرسال الاستفسار</button>`;
}

function submitLandInquiry() {
  const name = document.getElementById('landName')?.value;
  const phone = document.getElementById('landPhone')?.value;
  if (!name?.trim() || !phone?.trim()) { showToast('من فضلك اكمل بياناتك', 'error'); return; }
  const msg = encodeURIComponent(`🌿 استفسار أرض - نور الله\n\nالعقار: ${currentItem.title}\nالموقع: ${currentItem.area}، ${currentItem.city}\nالمساحة: ${currentItem.size} ${currentItem.sizeUnit}\nالسعر: ${currentItem.price.toLocaleString()} جنيه\n\nالعميل: ${name}\nالهاتف: ${phone}\n\nتواصل للمتابعة ✅`);
  window.open(`https://wa.me/201503244665?text=${msg}`, '_blank');
  document.getElementById('landInquirySection').innerHTML = `<div class="success-box"><div class="success-icon">✅</div><h3>تم إرسال استفسارك!</h3><p>سيتواصل معك فريق نور الله قريباً.</p></div>`;
  showToast('تم إرسال الاستفسار بنجاح! 🎉', 'success');
}

// ===== BOOKING STEPS =====
function renderBookingStep(step) {
  const steps = ['التواريخ','بياناتك','الدفع'];
  const stepsHtml = steps.map((s,i) => `<div class="bk-step ${i+1===step?'active':''} ${i+1<step?'done':''}">${i+1<step?'✓':i+1} ${s}</div>`).join('');
  let panel = '';

  if (step === 1) {
    panel = `
      <div class="date-2">
        <div class="fg"><label>📅 تاريخ الوصول</label><input class="fc" type="date" id="checkIn" min="${new Date().toISOString().split('T')[0]}" onchange="calcPrice()"/></div>
        <div class="fg"><label>📅 تاريخ المغادرة</label><input class="fc" type="date" id="checkOut" min="${new Date().toISOString().split('T')[0]}" onchange="calcPrice()"/></div>
      </div>
      <div class="fg"><label>👥 عدد الأشخاص</label>
        <select class="fc" id="numPersons">
          ${Array.from({length:currentItem.persons},(_,i)=>`<option value="${i+1}">${i+1} ${i===0?'شخص':'أشخاص'}</option>`).join('')}
        </select>
      </div>
      <h4 style="margin-bottom:10px;font-size:.88rem;font-weight:800">🛋️ خدمات إضافية</h4>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        ${currentItem.extraServices.map((s,i)=>`
          <label style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--card2);border:1px solid var(--bdr);border-radius:8px;cursor:pointer;font-size:.8rem">
            <input type="checkbox" id="extra_${i}" onchange="calcPrice()" style="accent-color:var(--gold)"/>
            ${s.name} <span style="margin-right:auto;color:var(--gold);font-weight:800">+${s.price}</span>
          </label>`).join('')}
      </div>
      <div class="cbox" id="calcBox" style="display:none">
        <div class="crow"><span>سعر الليلة</span><span>${currentItem.price.toLocaleString()} جنيه</span></div>
        <div class="crow"><span>عدد الليالي</span><span id="calcNights">—</span></div>
        <div class="crow"><span>خدمات إضافية</span><span id="calcExtras">0</span></div>
        <div class="crow total"><span>الإجمالي</span><span id="calcTotal">—</span></div>
      </div>
      <button class="btn-gold" style="width:100%;margin-top:14px" onclick="goStep(2)">التالي <i class="fas fa-arrow-left"></i></button>`;
  } else if (step === 2) {
    panel = `
      <div class="fg"><label>الاسم الكامل</label><input class="fc" type="text" id="guestName" placeholder="اسمك بالكامل"/></div>
      <div class="fg"><label>رقم الهاتف</label><input class="fc" type="tel" id="guestPhone" placeholder="01xxxxxxxxx"/></div>
      <div class="fg">
        <label>🪪 صورة البطاقة الوطنية</label>
        <div class="upload-zone" onclick="document.getElementById('bookingIdCard').click()">
          <i class="fas fa-id-card"></i><p>اضغط لرفع صورة البطاقة</p>
          <input type="file" id="bookingIdCard" accept="image/*" style="display:none" onchange="showBookingId(this)"/>
        </div>
        <img id="bookingIdPreview" style="display:none;width:100%;border-radius:8px;margin-top:10px"/>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn-ghost" style="flex:1" onclick="goStep(1)"><i class="fas fa-arrow-right"></i> رجوع</button>
        <button class="btn-gold" style="flex:2" onclick="goStep(3)">التالي <i class="fas fa-arrow-left"></i></button>
      </div>`;
  } else if (step === 3) {
    const total = calcTotal();
    const commission = Math.round(total * COMMISSION_RATE);
    panel = `
      <div class="cbox" style="margin-bottom:14px">
        <div class="crow"><span>إيجار الشقة</span><span>${total.toLocaleString()} جنيه</span></div>
        <div class="crow total"><span>الإجمالي</span><span>${total.toLocaleString()} جنيه</span></div>
      </div>
      <div class="com-box">
        <p>💼 <strong>عمولة نور الله: ${commission.toLocaleString()} جنيه</strong> (5% من الإجمالي)</p>
        <p style="margin-top:5px;font-size:.76rem;opacity:.85">⚠️ العمولة تُدفع أولاً — بعدها يُرسل عقد إيجار رسمي</p>
      </div>
      <h4 style="margin-bottom:12px;font-size:.88rem;font-weight:800">اختر طريقة الدفع</h4>
      <div class="pay-grid">
        <div class="pay-opt" onclick="selectPayment('bank',this)"><div class="ico">🏦</div><span>تحويل بنكي</span></div>
        <div class="pay-opt" onclick="selectPayment('visa',this)"><div class="ico">💳</div><span>فيزا / ماستركارد</span></div>
        <div class="pay-opt" onclick="selectPayment('vodafone',this)"><div class="ico">📱</div><span>فودافون كاش</span></div>
      </div>
      <div id="paymentDetails" style="margin-bottom:14px"></div>
      <div style="display:flex;gap:10px">
        <button class="btn-ghost" style="flex:1" onclick="goStep(2)"><i class="fas fa-arrow-right"></i> رجوع</button>
        <button class="btn-gold" style="flex:2" onclick="confirmBooking()"><i class="fas fa-check-circle"></i> ادفع وأحجز</button>
      </div>`;
  }

  return `<div style="margin-top:20px"><h4 style="margin-bottom:13px;font-size:.93rem;font-weight:800">🗓️ احجز الشقة</h4><div class="bk-steps">${stepsHtml}</div>${panel}</div>`;
}

function goStep(step) {
  if (step === 2) {
    const ci = document.getElementById('checkIn')?.value;
    const co = document.getElementById('checkOut')?.value;
    if (!ci || !co) { showToast('من فضلك اختر تواريخ الحجز','error'); return; }
    if (new Date(co) <= new Date(ci)) { showToast('تاريخ المغادرة يجب أن يكون بعد الوصول','error'); return; }
    bookingData.checkIn = ci; bookingData.checkOut = co;
    bookingData.persons = document.getElementById('numPersons')?.value;
    bookingData.extras = currentItem.extraServices.filter((_,i) => document.getElementById(`extra_${i}`)?.checked).map(s=>s.name);
  }
  if (step === 3) {
    const name = document.getElementById('guestName')?.value;
    const phone = document.getElementById('guestPhone')?.value;
    if (!name?.trim()) { showToast('من فضلك اكتب اسمك','error'); return; }
    if (!phone?.trim() || phone.length < 10) { showToast('من فضلك ادخل رقم هاتف صحيح','error'); return; }
    bookingData.name = name; bookingData.phone = phone;
  }
  bookingStep = step;
  document.getElementById('bookingSection').innerHTML = renderBookingStep(step);
}

function calcTotal() {
  const ci = bookingData.checkIn || document.getElementById('checkIn')?.value;
  const co = bookingData.checkOut || document.getElementById('checkOut')?.value;
  if (!ci || !co) return 0;
  const nights = Math.max(1, Math.round((new Date(co)-new Date(ci))/86400000));
  let extras = 0;
  currentItem.extraServices.forEach((s,i) => { if (document.getElementById(`extra_${i}`)?.checked) extras += s.price; });
  return nights * currentItem.price + extras;
}

function calcPrice() {
  const ci = document.getElementById('checkIn')?.value;
  const co = document.getElementById('checkOut')?.value;
  const box = document.getElementById('calcBox');
  if (!ci || !co || new Date(co) <= new Date(ci)) { if (box) box.style.display='none'; return; }
  const nights = Math.round((new Date(co)-new Date(ci))/86400000);
  let extras = 0;
  currentItem.extraServices.forEach((s,i) => { if (document.getElementById(`extra_${i}`)?.checked) extras += s.price; });
  const total = nights * currentItem.price + extras;
  if (box) {
    box.style.display='block';
    document.getElementById('calcNights').textContent = `${nights} ليلة`;
    document.getElementById('calcExtras').textContent = `${extras.toLocaleString()} جنيه`;
    document.getElementById('calcTotal').textContent = `${total.toLocaleString()} جنيه`;
  }
}

function selectPayment(method, el) {
  document.querySelectorAll('.pay-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  selectedPayment = method;
  const d = document.getElementById('paymentDetails');
  if (method==='bank') d.innerHTML = `<div class="cbox"><p style="font-weight:800;margin-bottom:8px">بيانات التحويل:</p><p style="color:var(--muted);font-size:.86rem">البنك: بنك مصر</p><p style="color:var(--muted);font-size:.86rem">رقم الحساب: 1234567890</p><p style="color:var(--gold);font-size:.8rem;margin-top:8px">⚠️ أرسل صورة التحويل على واتساب</p></div>`;
  else if (method==='visa') d.innerHTML = `<div style="display:grid;gap:10px;margin-top:8px"><input class="fc" placeholder="رقم البطاقة" type="text" maxlength="16"/><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><input class="fc" placeholder="MM/YY" type="text" maxlength="5"/><input class="fc" placeholder="CVV" type="text" maxlength="3"/></div></div>`;
  else d.innerHTML = `<div class="cbox"><p style="font-weight:800;margin-bottom:8px">فودافون كاش:</p><p style="color:var(--muted);font-size:.86rem">أرسل المبلغ على: <strong style="color:var(--gold)">01503244665</strong></p><p style="color:var(--gold);font-size:.8rem;margin-top:8px">⚠️ أرسل صورة التحويل على واتساب</p></div>`;
}

// ===== CONFIRM → CONTRACT =====
function confirmBooking() {
  if (!selectedPayment) { showToast('من فضلك اختر طريقة الدفع','error'); return; }
  const total = calcTotal();
  const nights = Math.round((new Date(bookingData.checkOut)-new Date(bookingData.checkIn))/86400000);
  const commission = Math.round(total * COMMISSION_RATE);
  currentContractData = {
    contractNum: 'NR-' + Date.now().toString().slice(-8),
    contractDate: new Date().toLocaleDateString('ar-EG'),
    apt: currentItem, booking: bookingData, nights, total, commission,
    payment: selectedPayment==='bank'?'تحويل بنكي':selectedPayment==='visa'?'فيزا/ماستركارد':'فودافون كاش'
  };
  showContractModal(currentContractData);
}

function showContractModal(d) {
  document.getElementById('contractContent').innerHTML = `
    <div class="ct-header">
      <h2>📜 عقد إيجار — نور الله</h2>
      <p>يُرجى قراءة العقد بعناية قبل الموافقة</p>
    </div>
    <div class="ct-body">
      <div class="ct-num">رقم العقد: ${d.contractNum} | التاريخ: ${d.contractDate}</div>
      <div class="ct-parties">
        <div class="ct-party"><h5>🏢 الطرف الأول (الوسيط)</h5><p>شركة نور الله للتسويق العقاري<br/>رقم التواصل: 01503244665<br/>مسؤول عن إتمام الصفقة وضمان الحقوق</p></div>
        <div class="ct-party"><h5>👤 الطرف الثاني (المستأجر)</h5><p>${d.booking.name}<br/>رقم الهاتف: ${d.booking.phone}</p></div>
      </div>
      <div class="ct-sec"><h4>🏠 تفاصيل الوحدة</h4><p><strong>${d.apt.title}</strong> — ${d.apt.area}، ${d.apt.city}</p><p>المساحة: ${d.apt.size} م² | الغرف: ${d.apt.rooms} | الأشخاص المصرح: ${d.apt.persons}</p></div>
      <div class="ct-sec"><h4>📅 مدة الإيجار</h4><p>من: <strong>${d.booking.checkIn}</strong> إلى: <strong>${d.booking.checkOut}</strong> | ${d.nights} ليلة | ${d.booking.persons} أشخاص</p></div>
      <div class="ct-sec"><h4>💰 القيمة المالية</h4>
        <div class="cbox"><div class="crow"><span>إجمالي الإيجار</span><span>${d.total.toLocaleString()} جنيه</span></div><div class="crow"><span>عمولة نور الله (5%)</span><span style="color:var(--gold)">${d.commission.toLocaleString()} جنيه</span></div><div class="crow total"><span>المبلغ المدفوع</span><span>${d.total.toLocaleString()} جنيه</span></div></div>
        <p style="margin-top:7px;font-size:.8rem">طريقة الدفع: <strong>${d.payment}</strong></p>
      </div>
      <div class="ct-warn">
        <p>⚠️ <strong>بنود حماية الوسيط:</strong></p>
        <ul style="margin-top:7px;padding-right:18px">
          <li>لا يحق للمستأجر التواصل مع صاحب الوحدة مباشرةً لتجاوز نور الله</li>
          <li>في حالة التحايل على العمولة: غرامة مالية قدرها <strong>${(d.commission*3).toLocaleString()} جنيه</strong></li>
          <li>نور الله ضامنة لحقوق جميع الأطراف طوال مدة الإيجار</li>
          <li>الإلغاء قبل 48 ساعة — استرداد كامل. بعدها — لا استرداد</li>
        </ul>
      </div>
      <div class="ct-sec"><h4>✅ الشروط والأحكام</h4><ul><li>الالتزام بعدد الأشخاص المتفق عليه</li><li>الحفاظ على الوحدة ومحتوياتها</li><li>الإخلاء في الموعد المحدد</li><li>حظر الحفلات الصاخبة أو الأنشطة المخالفة للقانون</li></ul></div>
      <div class="ct-sign"><p>بضغطك على "أوافق وأحجز" تقر بموافقتك على جميع بنود هذا العقد</p><p style="font-size:.73rem;color:var(--muted);margin-top:5px">عقد رقمي معتمد من نور الله — رقم ${d.contractNum}</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px">
        <button class="btn-ghost" onclick="closeModal('contractModal')">❌ إلغاء</button>
        <button class="btn-gold" onclick="finalizeBooking()">✅ أوافق وأحجز</button>
      </div>
      <div style="margin-top:12px;text-align:center;display:flex;gap:10px;justify-content:center">
        <button class="btn-ghost" style="font-size:.78rem;padding:7px 14px" onclick="window.print()"><i class="fas fa-print"></i> طباعة</button>
        <button class="btn-ghost" style="font-size:.78rem;padding:7px 14px" onclick="downloadContract()"><i class="fas fa-download"></i> حفظ</button>
      </div>
    </div>`;
  closeModal('aptModal');
  openModal('contractModal');
}

function finalizeBooking() {
  const d = currentContractData;
  const msg = encodeURIComponent(`🏠 حجز جديد - نور الله\n\nرقم العقد: ${d.contractNum}\nالشقة: ${d.apt.title}\nالعميل: ${d.booking.name}\nالهاتف: ${d.booking.phone}\nمن: ${d.booking.checkIn} إلى: ${d.booking.checkOut}\nعدد الليالي: ${d.nights}\nطريقة الدفع: ${d.payment}\nالإجمالي: ${d.total.toLocaleString()} جنيه\nالعمولة: ${d.commission.toLocaleString()} جنيه\n\n✅ وافق على العقد رقمياً`);
  window.open(`https://wa.me/201503244665?text=${msg}`, '_blank');
  document.getElementById('contractContent').innerHTML = `<div class="ct-body"><div class="success-box"><div class="success-icon">🎉</div><h3>تم الحجز بنجاح!</h3><p>تم إرسال العقد على واتساب.<br/>رقم عقدك: <strong style="color:var(--gold)">${d.contractNum}</strong></p><div class="cbox" style="text-align:right;margin:16px 0"><div class="crow"><span>الشقة</span><span>${d.apt.title}</span></div><div class="crow total"><span>الإجمالي</span><span>${d.total.toLocaleString()} جنيه</span></div></div><button class="btn-gold" onclick="closeModal('contractModal')">إغلاق</button></div></div>`;
  showToast('تم الحجز! العقد أُرسل على واتساب 📄','success');
}

function downloadContract() {
  const d = currentContractData;
  const text = `عقد إيجار — نور الله\nرقم: ${d.contractNum}\nتاريخ: ${d.contractDate}\n\nالمستأجر: ${d.booking.name}\nالهاتف: ${d.booking.phone}\nالشقة: ${d.apt.title} — ${d.apt.city}\nمن: ${d.booking.checkIn}\nإلى: ${d.booking.checkOut}\nالإجمالي: ${d.total.toLocaleString()} جنيه\nالعمولة: ${d.commission.toLocaleString()} جنيه`;
  const blob = new Blob([text],{type:'text/plain;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `contract-${d.contractNum}.txt`; a.click();
  showToast('تم تحميل العقد ✅','success');
}

// ===== AUTH =====
function openAuth(tab) { openModal('authModal'); switchTab(tab); }
function switchTab(tab) {
  document.getElementById('loginPanel').style.display = tab==='login'?'block':'none';
  document.getElementById('registerPanel').style.display = tab==='register'?'block':'none';
  document.getElementById('loginTab').classList.toggle('active', tab==='login');
  document.getElementById('registerTab').classList.toggle('active', tab==='register');
}
function fakeLogin() { showToast('تم تسجيل الدخول بنجاح ✅','success'); closeModal('authModal'); }
function fakeRegister() { showToast('تم إنشاء الحساب بنجاح! 🎉','success'); closeModal('authModal'); }
function showIdPreview(input) {
  if (input.files?.[0]) { const r=new FileReader(); r.onload=e=>{const i=document.getElementById('idPreview');i.src=e.target.result;i.style.display='block';}; r.readAsDataURL(input.files[0]); }
}
function showBookingId(input) {
  if (input.files?.[0]) { const r=new FileReader(); r.onload=e=>{const i=document.getElementById('bookingIdPreview');i.src=e.target.result;i.style.display='block';}; r.readAsDataURL(input.files[0]); }
}

// ===== MODALS =====
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id); });

// ===== TOAST =====
function showToast(msg, type='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-size:1.1rem">${type==='success'?'✅':'❌'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.animation='slideL .3s ease reverse'; setTimeout(()=>t.remove(),300); }, 3500);
}
