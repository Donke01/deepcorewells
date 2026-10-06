/* Deep Core Wells borehole assistant: a small FAQ chat that answers general borehole questions.
   It never gives prices; price questions and anything it cannot answer go to WhatsApp or the quote form. */
(function () {
  'use strict';
  var PHONE = '254706716310';
  var WA = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent("Hello Deep Core Wells, I'd like to ask about a borehole.");

  var KB = [
    { id: 'price', q: 'How much does a borehole cost?',
      k: ['price', 'cost', 'costs', 'charge', 'charges', 'how much', 'budget', 'expensive', 'cheap', 'afford', 'bei', 'pesa', 'gharama', 'shillings', 'ksh', 'kes', 'quotation', 'quote', 'rate', 'rates', 'payment', 'pay', 'deposit'],
      a: "I can't give prices here. Every borehole is priced for its site, depth and the pump you need. Our consultation is free and our quotes are clear and in writing.", cta: ['quote', 'wa'] },
    { id: 'what', q: 'What is a borehole?',
      k: ['what is a borehole', 'what is borehole', 'borehole mean', 'define', 'meaning', 'kisima', 'well vs', 'difference between well'],
      a: "A borehole is a narrow, deep hole drilled into the ground to reach an aquifer, the layer of rock or sand that holds underground water. The hole is lined with casing, and a pump brings the water up to a tank or tap. Unlike a hand-dug well, it reaches much deeper water that is more reliable through dry seasons." },
    { id: 'survey', q: 'What is a geological survey?',
      k: ['survey', 'hydrogeological', 'geological', 'geophysical', 'resistivity', 'ves', 'find water', 'where to drill', 'locate', 'site', 'dowsing', 'water finding', 'detect'],
      a: "Before we drill, we carry out a geological (hydrogeological) survey on your land. We measure the ground with survey instruments to see the rock layers and where water is most likely to be, then pick the best drilling point. The survey report is also needed for the drilling permit." },
    { id: 'depth', q: 'How deep will my borehole be?',
      k: ['deep', 'depth', 'how far', 'metres', 'meters', 'meter', 'metre', 'how low', 'kina'],
      a: "It depends on the ground in your area, and the survey tells us before we start. The boreholes on this site range from about 100 m to 300 m deep, for example Keyo Village at 100 m and Duka Moja, Narok at 300 m. Many in the Eldoret and Turbo area are around 140 to 160 m." },
    { id: 'permit', q: 'Which permits do I need?',
      k: ['permit', 'permits', 'licence', 'license', 'wra', 'warma', 'wrma', 'nema', 'approval', 'authorisation', 'authorization', 'legal', 'law', 'government', 'eia', 'registration', 'kibali'],
      a: "Drilling a borehole needs approvals from WRA and NEMA. For more details on what your site needs, chat with us on WhatsApp.", cta: ['wa'] },
    { id: 'process', q: 'What are the steps?',
      k: ['step', 'steps', 'process', 'procedure', 'how do you drill', 'how is it done', 'stages', 'start', 'begin', 'what happens'],
      a: "1. Geological survey to find the water.\n2. Permits.\n3. Drilling, with casing put in to keep the hole open.\n4. Air-lift to flush the borehole clean and get the water flowing.\n5. Pump installation, sized to how much water the borehole gives.\n6. Testing: the water is analysed by government labs.\n7. Clean water, ready at your tap." },
    { id: 'time', q: 'How long does it take?',
      k: ['how long', 'long does', 'time', 'days', 'weeks', 'duration', 'when can', 'fast', 'quick', 'soon', 'muda', 'siku'],
      a: "Drilling can take from 1 day, depending on the depth and the location. For a timeline for your site, ask us on WhatsApp.", cta: ['wa'] },
    { id: 'airlift', q: 'What is an air-lift?',
      k: ['air lift', 'airlift', 'air-lift', 'flush', 'flushing', 'development', 'compressor', 'blow'],
      a: "After drilling, compressed air is blown down the borehole. It forces the water out, washes away mud and cuttings, and gets the water flowing clean. It also gives a first look at how much water the borehole produces." },
    { id: 'yield', q: 'How much water will I get?',
      k: ['yield', 'how much water', 'litres', 'liters', 'flow', 'capacity', 'output', 'enough water', 'per hour', 'maji mengi'],
      a: "That's called the yield, and every borehole is different. We measure it on site with a pumping test after drilling. The pump is then sized to that yield, so it lasts and doesn't over-pump the borehole." },
    { id: 'dry', q: 'What if there is no water?',
      k: ['dry', 'no water', 'fail', 'failed', 'risk', 'sure', 'chance'],
      a: "Nobody can see underground with certainty, which is why we always survey first. The survey shows where water is most likely and how deep, which greatly reduces the risk of a dry borehole. Ask us on WhatsApp about your site and we'll talk you through it honestly.", cta: ['wa'] },
    { id: 'quality', q: 'Is the water safe to drink?',
      k: ['safe', 'drink', 'drinking', 'quality', 'test', 'testing', 'lab', 'laboratory', 'analysis', 'salty', 'salt', 'fluoride', 'clean', 'treatment', 'treat', 'iron', 'colour', 'smell', 'taste', 'report'],
      a: "We test it. A sample of your water is analysed by government labs and you get an official water analysis report. If the report shows anything that needs fixing, such as salt, fluoride or iron, we can supply water treatment so the water is safe to drink." },
    { id: 'pump', q: 'Which pump do I need?',
      k: ['pump', 'pumps', 'submersible', 'motor', 'power', 'electricity', 'kplc', 'generator', 'install', 'installation'],
      a: "Usually a submersible pump, set deep inside the borehole. We choose it based on the measured yield, the depth and how high the water has to be lifted to your tank. A pump sized correctly lasts longer and keeps the borehole healthy." },
    { id: 'tower', q: 'Do you build water towers?',
      k: ['tower', 'tank', 'stand', 'storage', 'elevated', 'steel', 'reservoir'],
      a: "Yes. We fabricate and install steel tank stands (water towers), so your tank sits high enough to give good pressure to your taps." },
    { id: 'care', q: 'How do I look after my borehole?',
      k: ['stopped working', 'not working', 'no longer', 'maintain', 'maintenance', 'service', 'servicing', 'repair', 'broken', 'care', 'look after', 'problem', 'low pressure', 'stopped', 'fix'],
      a: "Keep the borehole head covered and protected, and don't let surface water or animals near it. Don't run the pump harder than the borehole's tested yield, and watch for changes in water colour or flow. If something changes, contact us early.", cta: ['wa'] },
    { id: 'where', q: 'Where do you work?',
      k: ['where', 'area', 'areas', 'county', 'counties', 'location', 'come to', 'near me', 'nairobi', 'kisumu', 'eldoret', 'nakuru', 'turkana', 'narok', 'kitui', 'mombasa', 'region', 'kenya', 'travel'],
      a: "We drill across Kenya. Our projects include sites in Uasin Gishu, Nandi, Kisumu, Narok, Turkana, Kitui and Naivasha. Our office is at Mega Centre, 3rd Floor, Makasembo Road, Kitale." },
    { id: 'who', q: 'Who drills for clients?',
      k: ['home', 'farm', 'school', 'business', 'church', 'hospital', 'dispensary', 'estate', 'institution', 'commercial', 'domestic', 'irrigation', 'livestock', 'community'],
      a: "We drill for homes, farms, schools, businesses and communities. Recent projects include several schools, a dispensary, an estate and a milk plant. You can see them under Recent work on this page." },
    { id: 'licensed', q: 'Are you licensed?',
      k: ['licensed', 'registered', 'certified', 'qualified', 'trust', 'legit', 'genuine', 'experience', 'why you', 'why choose'],
      a: "Yes. We are licensed and work in line with WRA and NEMA requirements. We survey before we drill, give clear quotes in writing up front, and offer a free consultation and water testing." },
    { id: 'contact', q: 'How do I contact you?',
      k: ['contact', 'call', 'phone', 'number', 'email', 'office', 'visit', 'hours', 'open', 'talk', 'speak', 'whatsapp', 'reach'],
      a: "Call or WhatsApp 0706 716 310, or email info@deepcorewells.com. Our office is at Mega Centre, 3rd Floor, Makasembo Road, Kitale, open Monday to Saturday, 8 am to 4 pm.", cta: ['wa', 'quote'] },
    { id: 'hi', q: '',
      k: ['hello', 'hi', 'hey', 'habari', 'hujambo', 'mambo', 'good morning', 'good afternoon', 'good evening', 'sasa', 'niaje'],
      a: "Hello! Ask me anything about boreholes: surveys, depth, permits, drilling, pumps or water testing." },
    { id: 'thanks', q: '',
      k: ['thank', 'thanks', 'asante', 'great', 'ok', 'okay', 'cool', 'nice'],
      a: "You're welcome. When you're ready, we're one message away.", cta: ['wa', 'quote'] }
  ];
  var CHIPS = ['survey', 'depth', 'permit', 'process', 'quality', 'price'];

  function norm(t) { return (' ' + t.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' '); }
  function match(text) {
    var t = norm(text), best = null, score = 0;
    KB.forEach(function (e) {
      var sc = 0;
      e.k.forEach(function (k) {
        var kk = ' ' + k + ' ';
        if (t.indexOf(kk) > -1) sc += k.indexOf(' ') > -1 ? 3 : 2;
        else if (k.length > 4 && t.indexOf(k) > -1) sc += 1;
      });
      if (e.id === 'price' && sc && !/how much water|litres|liters|per hour|yield/.test(t)) sc += 3;
      if (e.id === 'price' && /how much water|litres|liters|per hour|yield/.test(t) && !/cost|price|pay|bei|charge|ksh|shilling/.test(t)) sc = 0;               /* price always wins: never answer a price question with anything else */
      if ((e.id === 'hi' || e.id === 'thanks') && t.split(' ').length > 6) sc = Math.min(sc, 1);
      if (sc > score) { score = sc; best = e; }
    });
    return score >= 2 ? best : null;
  }

  var css = '' +
    '.dcw-chat-btn{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:121;width:52px;height:52px;border-radius:50%;border:0;background:#1F6F95;color:#fff;display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.28);cursor:pointer;transition:opacity .35s ease,transform .35s ease}' +
    '.dcw-chat-btn svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.dcw-chat-btn .dot{position:absolute;top:2px;right:2px;width:12px;height:12px;border-radius:50%;background:#E8A33D;border:2px solid #fff}' +
    '.dcw-chat{position:fixed;left:16px;bottom:calc(80px + env(safe-area-inset-bottom,0px));z-index:122;width:min(370px,calc(100vw - 24px));height:min(540px,calc(100svh - 120px));background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(20,33,42,.3);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px) scale(.98);pointer-events:none;transition:opacity .2s ease,transform .2s ease;font-family:Inter,system-ui,sans-serif}' +
    '.dcw-chat.open{opacity:1;transform:none;pointer-events:auto}' +
    '@media (max-width:480px){.dcw-chat{right:12px;left:12px;width:auto}}' +
    '.dcw-head{display:flex;align-items:center;gap:10px;padding:14px 14px 12px;background:#E3EEF3;border-bottom:1px solid #C7D8E0}' +
    '.dcw-head b{display:block;font-family:Oswald,sans-serif;text-transform:uppercase;letter-spacing:.05em;font-size:.98rem;color:#14212A}' +
    '.dcw-head span{display:block;font-size:.74rem;color:#56636B}' +
    '.dcw-head .av{width:36px;height:36px;border-radius:50%;background:#fff;display:grid;place-items:center;flex:none}' +
    '.dcw-head .av svg{width:24px;height:24px}' +
    '.dcw-x{margin-left:auto;border:0;background:none;font-size:1.6rem;line-height:1;color:#56636B;cursor:pointer;width:36px;height:36px}' +
    '.dcw-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F7FAFB}' +
    '.dcw-m{max-width:86%;padding:10px 12px;border-radius:14px;font-size:.9rem;line-height:1.45;white-space:pre-line;color:#14212A}' +
    '.dcw-m.bot{background:#fff;border:1px solid #E3EAEE;border-bottom-left-radius:4px;align-self:flex-start}' +
    '.dcw-m.me{background:#1F6F95;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.dcw-cta{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}' +
    '.dcw-cta a,.dcw-cta button{font:600 .78rem/1 Inter,system-ui,sans-serif;border-radius:999px;padding:.55rem .8rem;text-decoration:none;cursor:pointer;border:0}' +
    '.dcw-cta .wa{background:#25D366;color:#fff}.dcw-cta .q{background:#E8A33D;color:#160f06}' +
    '.dcw-typing{align-self:flex-start;display:flex;gap:4px;padding:12px;background:#fff;border:1px solid #E3EAEE;border-radius:14px}' +
    '.dcw-typing i{width:6px;height:6px;border-radius:50%;background:#93A1A9;animation:dcwB 1s infinite}' +
    '.dcw-typing i:nth-child(2){animation-delay:.15s}.dcw-typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes dcwB{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-4px);opacity:1}}' +
    '.dcw-chips{display:flex;gap:6px;overflow-x:auto;padding:10px 12px 0;background:#fff;scrollbar-width:none}' +
    '.dcw-chips::-webkit-scrollbar{display:none}' +
    '.dcw-chips button{flex:none;border:1px solid #C7D8E0;background:#fff;color:#1F6F95;border-radius:999px;padding:.45rem .75rem;font:500 .78rem Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap}' +
    '.dcw-form{display:flex;gap:8px;padding:10px 12px 12px;background:#fff}' +
    '.dcw-form input{flex:1;min-width:0;border:1px solid #D6E2E8;background:#F5F8FA;border-radius:999px;padding:.7rem .95rem;font:16px Inter,system-ui,sans-serif;color:#14212A}' +
    '.dcw-form input:focus{outline:2px solid #1F6F95;background:#fff}' +
    '.dcw-form button{flex:none;width:42px;height:42px;border-radius:50%;border:0;background:#1F6F95;display:grid;place-items:center;cursor:pointer}' +
    '.dcw-form button svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.dcw-note{margin:0;padding:0 14px 10px;background:#fff;font-size:.68rem;color:#93A1A9;text-align:center}' +
    'html.qd-lock .dcw-chat-btn,html.qd-lock .dcw-chat{display:none}' +
    '@media (prefers-reduced-motion:reduce){.dcw-chat-btn{animation:none}.dcw-chat{transition:none}}' +
    'html:not(.fabs-on) .dcw-chat-btn,html:not(.fabs-on) .wa-fab{opacity:0;transform:translateY(18px) scale(.85);pointer-events:none}' +
    '.wa-fab{transition:opacity .35s ease,transform .35s ease}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var mark = '<svg viewBox="0 18 212 170" aria-hidden="true"><path d="M64 70 H66 A12 12 0 0 1 78 82 V140 A30 30 0 0 0 138 140 V60 A26 26 0 0 1 164 34 H174 A12 12 0 0 1 186 46 V58" fill="none" stroke="#E8A33D" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 70 H64" stroke="#B4502A" stroke-width="16" stroke-linecap="round"/><path d="M186 70 C186 70 174 84 174 93 a12 12 0 0 0 24 0 C198 84 186 70 186 70 Z" fill="#3FA9D6"/></svg>';
  var btn = document.createElement('button');
  btn.className = 'dcw-chat-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Ask about boreholes'); btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9.5L4 20z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/></svg><span class="dot"></span>';
  var box = document.createElement('div');
  box.className = 'dcw-chat'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Borehole assistant');
  box.innerHTML = '<div class="dcw-head"><span class="av">' + mark + '</span><div><b>Borehole assistant</b><span>Answers about boreholes, any time</span></div><button class="dcw-x" type="button" aria-label="Close">&times;</button></div>' +
    '<div class="dcw-log" aria-live="polite"></div><div class="dcw-chips"></div>' +
    '<form class="dcw-form"><input type="text" placeholder="Ask about boreholes..." aria-label="Your question" autocomplete="off" maxlength="300"><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
    '<p class="dcw-note">Automatic answers. For prices and bookings, chat with our team.</p>';
  document.body.appendChild(btn); document.body.appendChild(box);
  var log = box.querySelector('.dcw-log'), chips = box.querySelector('.dcw-chips'), input = box.querySelector('input'), started = false;

  function ctaRow(list) {
    var d = document.createElement('div'); d.className = 'dcw-cta';
    (list || []).forEach(function (c) {
      if (c === 'wa') { var a = document.createElement('a'); a.className = 'wa'; a.href = WA; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Chat on WhatsApp'; d.appendChild(a); }
      if (c === 'quote') { var b = document.createElement('button'); b.type = 'button'; b.className = 'q'; b.textContent = 'Get a free quote';
        b.addEventListener('click', function () { close(); var q = document.querySelector('[data-quote]'); if (q) q.click(); }); d.appendChild(b); }
    });
    return d;
  }
  function add(text, who, cta) {
    var m = document.createElement('div'); m.className = 'dcw-m ' + who; m.textContent = text;
    if (cta && cta.length) m.appendChild(ctaRow(cta));
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function renderChips(used) {
    chips.innerHTML = '';
    CHIPS.filter(function (id) { return id !== used; }).forEach(function (id) {
      var e = KB.filter(function (x) { return x.id === id; })[0]; if (!e) return;
      var c = document.createElement('button'); c.type = 'button'; c.textContent = e.q;
      c.addEventListener('click', function () { ask(e.q); }); chips.appendChild(c);
    });
  }
  function reply(text) {
    var e = match(text), t = document.createElement('div');
    t.className = 'dcw-typing'; t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); log.scrollTop = log.scrollHeight;
    setTimeout(function () {
      t.remove();
      if (e) { add(e.a, 'bot', e.cta); renderChips(e.id); }
      else { add("I'm not sure about that one. Our team can answer it directly on WhatsApp, or you can ask me about surveys, depth, permits, drilling, pumps or water testing.", 'bot', ['wa']); renderChips(); }
    }, 450 + Math.min(700, text.length * 12));
  }
  function ask(text) { text = (text || '').trim(); if (!text) return; add(text, 'me'); reply(text); }
  function open() {
    box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); var d = btn.querySelector('.dot'); if (d) d.remove();
    if (!started) { started = true; add("Hi! I'm the Deep Core Wells assistant. Ask me anything about boreholes, or tap a question below.", 'bot'); renderChips(); }
    if (matchMedia('(hover:hover)').matches) setTimeout(function () { input.focus(); }, 150);
  }
  function close() { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () { box.classList.contains('open') ? close() : open(); });
  box.querySelector('.dcw-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  box.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  (function fabs() {
    var root = document.documentElement, foot = document.getElementById('why-us') || document.querySelector('.site-foot'), q = false;
    function upd() { q = false; var near = !document.getElementById('why-us') || foot.getBoundingClientRect().top < innerHeight * 0.85; /* inner pages: always shown */
      root.classList.toggle('fabs-on', near || box.classList.contains('open')); }
    addEventListener('scroll', function () { if (!q) { q = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd); upd();
  })();
  window.dcwAssistantMatch = match; /* exposed for testing */
})();
