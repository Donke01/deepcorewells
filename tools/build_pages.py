"""Build the inner pages (services, projects, areas, FAQ, contact, privacy), sitemap.xml and robots.txt.

Everything is taken from index.html and js/assistant.js, so the pages stay in step with the homepage:
  python3 tools/extract_css.py && python3 tools/build_pages.py
Run both again after adding a project or changing the header/footer on the homepage.
"""
import re, json, html, datetime
from collections import OrderedDict

SITE = 'https://deepcorewells.com'
ROOT = __file__.rsplit('/tools/', 1)[0]
idx = open(f'{ROOT}/index.html').read()
assistant = open(f'{ROOT}/js/assistant.js').read()
TODAY = datetime.date.today().isoformat()

NAV = [('/services', 'Services'), ('/projects', 'Projects'), ('/areas', 'Areas we serve'), ('/faq', 'FAQ'), ('/contact', 'Contact')]
FOOT_NAV = NAV + [('/privacy', 'Privacy policy')]

# ---------- pieces lifted from the homepage ----------
def grab(pattern, flags=re.S):
    m = re.search(pattern, idx, flags)
    assert m, pattern
    return m.group(0)

head_nav = grab(r'<header class="site-head" id="siteHead">.*?</header>')
footer = grab(r'<footer class="site-foot".*?</footer>')
wa_fab = grab(r'<a class="wa-fab".*?</a>')
fonts = grab(r'<link href="https://fonts.googleapis.com/css2[^>]*>')
icons = '\n'.join(re.findall(r'<link rel="(?:icon|apple-touch-icon)"[^>]*>', idx))
ld_business = grab(r'<script type="application/ld\+json">.*?</script>')

def nav_html(active):
    items = ''.join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a></li>' for h, t in NAV)
    items += '<li><a href="/contact#quote" class="nav-cta">Free Quote</a></li>'
    h = re.sub(r'<ul class="nav-links" id="navLinks">.*?</ul>', f'<ul class="nav-links" id="navLinks">{items}</ul>', head_nav, flags=re.S)
    return h.replace('href="#top"', 'href="/"')

def footer_html():
    links = ''.join(f'<a href="{h}">{t}</a>' for h, t in FOOT_NAV)
    f = re.sub(r'<nav aria-label="Footer">.*?</nav>', f'<nav aria-label="Footer">{links}</nav>', footer, flags=re.S)
    return f.replace(' id="contact"', '')

# ---------- data ----------
cards = []
for m in re.finditer(r'<article class="pc[ "][^>]*>.*?</article>', idx, re.S):
    c = m.group(0)
    name = html.unescape(re.search(r'<h3>(.*?)</h3>', c).group(1))
    place = re.search(r'<p class="pc-place">(.*?)</p>', c)
    place = html.unescape(place.group(1)) if place else ''
    depth = re.search(r'<b>(\d+) m</b>', c)
    cards.append({'name': name, 'place': place, 'depth': int(depth.group(1)) if depth else None, 'html': c})

COUNTY_OF = [  # place keyword -> county (from the place names on each card)
    ('Kisumu', 'Kisumu'), ('Muhoroni', 'Kisumu'), ('Narok', 'Narok'), ('Nandi', 'Nandi'), ('Mosop', 'Nandi'),
    ('Turkana', 'Turkana'), ('Kitui', 'Kitui'), ('Mwingi', 'Kitui'), ('Naivasha', 'Nakuru'), ('Nakuru', 'Nakuru'),
    ('Uasin Gishu', 'Uasin Gishu'), ('Eldoret', 'Uasin Gishu'), ('Turbo', 'Uasin Gishu'), ('Simat', 'Uasin Gishu'),
]
def county(card):
    text = card['place'] + ' ' + card['name']
    for k, v in COUNTY_OF:
        if k in text:
            return v
    return None

areas = OrderedDict()
for c in cards:
    k = county(c)
    if k:
        areas.setdefault(k, []).append(c)
areas = OrderedDict(sorted(areas.items(), key=lambda kv: -len(kv[1])))
TOWNS = {'Uasin Gishu': 'Eldoret, Turbo and Simat', 'Kisumu': 'Muhoroni and Katito', 'Nandi': 'Mosop',
         'Narok': 'Duka Moja', 'Turkana': 'Kakuma', 'Kitui': 'Mwingi', 'Nakuru': 'Naivasha'}
def slug(c): return 'borehole-drilling-' + c.lower().replace(' ', '-')

faq = []
for m in re.finditer(r"\{ id: '(\w+)', q: '([^']*)',\s*k: \[.*?\],\s*a: \"(.*?)\"", assistant, re.S):
    i, q, a = m.groups()
    if q:
        a = a.replace('\\n', '\n')
        if i == 'price':  # the chat answer speaks as the assistant; the FAQ page speaks as the company
            a = "Every borehole is priced for its own site, depth and the pump it needs, so we quote each one individually. Our consultation is free and our quotes are clear and in writing."
        faq.append((i, q, a))

services = []
for m in re.finditer(r'<article class="svc[^"]*">.*?</article>', idx, re.S):
    t = m.group(0)
    services.append({'name': re.search(r'<h3>(.*?)</h3>', t).group(1), 'line': re.search(r'<p>(.*?)</p>', t).group(1),
                     'img': re.search(r'src="([^"]+)"', t).group(1)})
FAQ_FOR = {'Borehole drilling': ['what', 'process', 'time', 'depth'], 'Geological survey': ['survey', 'dry'],
           'Pump installation': ['pump', 'yield'], 'Water treatment': ['quality'], 'Borehole testing': ['airlift', 'yield'],
           'Water tower fabrication': ['tower']}
faq_by_id = {i: (q, a) for i, q, a in faq}

# ---------- page shell ----------
def page(path, title, desc, h1, lead, body, crumbs, extra_ld=None, img='/images/brand/og-share.jpg'):
    url = SITE + path
    bc = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": n + 1, "name": name, "item": SITE + href} for n, (href, name) in enumerate([('/', 'Home')] + crumbs)]}
    lds = [bc] + (extra_ld or [])
    crumb_html = ' <span aria-hidden="true">/</span> '.join(
        [f'<a href="/">Home</a>'] + [f'<a href="{h}">{html.escape(n)}</a>' if k < len(crumbs) - 1 else f'<span aria-current="page">{html.escape(n)}</span>' for k, (h, n) in enumerate(crumbs)])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
{icons}
<meta name="theme-color" content="#E3EEF3">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Deep Core Wells">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}{img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{fonts}
<link rel="stylesheet" href="/css/pages.css">
<link rel="stylesheet" href="/css/inner.css">
{ld_business}
{''.join(f'<script type="application/ld+json">{json.dumps(x, separators=(",", ":"))}</script>' for x in lds)}
</head>
<body class="inner">
{nav_html(crumbs[0][0])}
<main id="top">
  <section class="pg-hero"><div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">{crumb_html}</nav>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div></section>
{body}
  <section class="pg-cta"><div class="wrap"><div class="cta">
    <div><h3>Ready for your own water?</h3><p>Free consultation, anywhere in Kenya.</p></div>
    <div class="cta-act"><a class="cta-btn" href="/contact#quote">Get a free quote</a><a class="cta-call" href="tel:+254706716310">or call 0706 716 310</a></div>
  </div></div></section>
</main>
{footer_html()}
{wa_fab}
<script>
(function(){{var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');if(!t||!l)return;
t.addEventListener('click',function(){{var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);t.setAttribute('aria-label',o?'Close menu':'Open menu');}});}})();
(function(){{var h=document.getElementById('siteHead');function f(){{if(h)h.classList.toggle('solid',scrollY>10);}}addEventListener('scroll',f,{{passive:true}});f();}})();
(function(){{var v=document.getElementById('baView'),r=document.getElementById('baRange');if(!v||!r)return;var s=function(){{v.style.setProperty('--x',r.value+'%');}};r.addEventListener('input',s);s();}})();
document.querySelectorAll('.soc[href="#"]').forEach(function(a){{a.addEventListener('click',function(e){{e.preventDefault();}});}});
</script>
<script src="/js/assistant.js" defer></script>
</body>
</html>
'''

def write(name, text):
    open(f'{ROOT}/{name}', 'w').write(text)

pages = []
def add(path, *a, **k):
    write(path.strip('/') + '.html', page(path, *a, **k)); pages.append(path)

def grid(cs):
    return '<div class="proj-list">\n' + '\n'.join(c['html'] for c in cs) + '\n</div>'

depths = [c['depth'] for c in cards if c['depth']]

# ---------- services ----------
svc_body = '<section class="pg"><div class="wrap svc-list">'
for s in services:
    sid = re.sub(r'[^a-z]+', '-', s['name'].lower()).strip('-')
    qa = ''.join(f'<h3>{html.escape(faq_by_id[i][0])}</h3><p>{html.escape(faq_by_id[i][1]).replace(chr(10), "<br>")}</p>' for i in FAQ_FOR.get(s['name'], []) if i in faq_by_id)
    svc_body += f'''
  <article class="svc-row" id="{sid}">
    <figure><img src="/{s['img']}" alt="{html.escape(s['name'])} by Deep Core Wells" loading="lazy" decoding="async"></figure>
    <div><h2>{s['name']}</h2><p class="svc-line">{s['line']}</p>{qa}</div>
  </article>'''
svc_body += '\n</div></section>'
svc_ld = [{"@context": "https://schema.org", "@type": "Service", "serviceType": s['name'], "provider": {"@type": "LocalBusiness", "name": "Deep Core Wells", "url": SITE},
           "areaServed": {"@type": "Country", "name": "Kenya"}, "description": s['line']} for s in services]
add('/services', 'Borehole Drilling Services in Kenya | Deep Core Wells',
    'Borehole drilling, geological surveys, pump installation, water treatment, borehole testing and water tower fabrication across Kenya.',
    'Our services', 'Everything from finding the water to a working tap: survey, drilling, pump, testing, treatment and storage.',
    svc_body, [('/services', 'Services')], svc_ld)

# ---------- projects ----------
counties_n = len(areas)
proj_body = f'''<section class="pg"><div class="wrap">
  <ul class="proof"><li><b>230+</b><span>Projects completed</span></li><li><b>{max(depths)} m</b><span>Deepest borehole</span></li><li><b>{counties_n}</b><span>Counties</span></li></ul>
  {grid(cards)}
</div></section>'''
add('/projects', 'Borehole Projects Across Kenya | Deep Core Wells',
    f'Boreholes drilled by Deep Core Wells for schools, farms, estates and communities, from {min(depths)} m to {max(depths)} m deep, across {counties_n} counties.',
    'Recent projects', f'A selection of boreholes we have drilled, from {min(depths)} m to {max(depths)} m deep.',
    proj_body, [('/projects', 'Projects')])

# ---------- areas ----------
area_cards = ''.join(f'''<a class="area-card" href="/{slug(k)}"><b>{k} County</b><span>{TOWNS.get(k, "")}</span><i>{len(v)} project{"s" if len(v) != 1 else ""} shown</i></a>''' for k, v in areas.items())
add('/areas', 'Borehole Drilling Areas in Kenya | Deep Core Wells',
    'Deep Core Wells drills boreholes across Kenya, including Uasin Gishu, Nandi, Kisumu, Narok, Turkana, Kitui and Nakuru counties.',
    'Areas we serve', 'We drill boreholes across Kenya. These are counties where you can see our recent work.',
    f'<section class="pg"><div class="wrap"><div class="area-grid">{area_cards}</div><p class="note">Your county is not listed? We still come to you. <a href="/contact">Ask us</a>.</p></div></section>',
    [('/areas', 'Areas we serve')])
for k, v in areas.items():
    ds = [c['depth'] for c in v if c['depth']]
    rng = (f'{min(ds)} m to {max(ds)} m deep' if len(set(ds)) > 1 else f'{ds[0]} m deep') if ds else ''
    towns = TOWNS.get(k, '')
    lead = f'We drill boreholes in {k} County{", including " + towns if towns else ""}. Below {"are" if len(v) > 1 else "is"} {len(v)} of our projects in the county{", " + rng if rng else ""}.'
    body = f'''<section class="pg"><div class="wrap">
  {grid(v)}
  <div class="svc-mini"><h2>What we do in {k} County</h2><ul>{''.join(f'<li><a href="/services#{re.sub(r"[^a-z]+", "-", s["name"].lower()).strip("-")}">{s["name"]}</a></li>' for s in services)}</ul></div>
</div></section>'''
    add('/' + slug(k), f'Borehole Drilling in {k} County | Deep Core Wells',
        f'Borehole drilling in {k} County{", including " + towns if towns else ""}. Survey, drilling, pump installation and water testing by Deep Core Wells.',
        f'Borehole drilling in {k} County', lead, body, [('/areas', 'Areas we serve'), ('/' + slug(k), f'{k} County')])

# ---------- FAQ ----------
faq_body = '<section class="pg"><div class="wrap faq">' + ''.join(
    f'<details{" open" if n == 0 else ""}><summary>{html.escape(q)}</summary><p>{html.escape(a).replace(chr(10), "<br>")}</p></details>' for n, (i, q, a) in enumerate(faq)) + '</div></section>'
faq_ld = [{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for i, q, a in faq]}]
add('/faq', 'Borehole FAQ: Surveys, Depth, Permits | Deep Core Wells',
    'Answers about boreholes in Kenya: geological surveys, depth, WRA and NEMA permits, drilling time, pumps and water testing.',
    'Borehole questions', 'Straight answers about surveys, depth, permits, drilling, pumps and water quality.',
    faq_body, [('/faq', 'FAQ')], faq_ld)

# ---------- contact ----------
contact_body = '''<section class="pg"><div class="wrap contact-grid">
  <div class="c-info">
    <a class="c-big" href="tel:+254706716310"><span>Call</span><b>0706 716 310</b></a>
    <a class="c-big wa" href="https://wa.me/254706716310" target="_blank" rel="noopener"><span>WhatsApp</span><b>0706 716 310</b></a>
    <a class="c-big" href="mailto:info@deepcorewells.com"><span>Email</span><b>info@deepcorewells.com</b></a>
    <div class="c-big"><span>Office</span><b><a href="https://www.google.com/maps/search/?api=1&amp;query=Mega+Centre+Makasembo+Road+Kitale" target="_blank" rel="noopener">Mega Centre, 3rd Floor, Makasembo Road, Kitale</a></b><em>Open Monday to Saturday, 8 am to 4 pm</em></div>
  </div>
  <form class="c-form" id="quote" novalidate>
    <h2>Get a free quote</h2>
    <p>Tell us about your site. We'll get back to you within 24 hours.</p>
    <label for="q-name">Full name</label><input id="q-name" name="name" required autocomplete="name">
    <label for="q-phone">Phone</label><input id="q-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="07XX XXX XXX">
    <label for="q-loc">Site location</label><input id="q-loc" name="location" required placeholder="Town or county">
    <label for="q-svc">Service</label><select id="q-svc" name="service"><option>Borehole drilling</option><option>Geological survey</option><option>Pump installation</option><option>Water treatment</option><option>Borehole testing</option><option>Water tower fabrication</option></select>
    <label for="q-det">Details (optional)</label><textarea id="q-det" name="details" rows="3" placeholder="e.g. water for home and livestock"></textarea>
    <p class="c-err" id="q-err" role="alert"></p>
    <button type="submit" value="wa">Send on WhatsApp</button>
    <button type="submit" value="mail" class="alt">Send by email instead</button>
  </form>
</div></section>
<script>
(function(){var f=document.getElementById('quote'),e=document.getElementById('q-err');
f.addEventListener('submit',function(ev){ev.preventDefault();var how=(ev.submitter&&ev.submitter.value)||'wa',bad=[];
['name','phone','location'].forEach(function(n){var el=f.elements[n],ok=el.value.trim().length>(n==='phone'?8:1);el.classList.toggle('bad',!ok);if(!ok)bad.push(el);});
if(bad.length){e.textContent='Please fill in your name, phone and site location.';bad[0].focus();return;}e.textContent='';
var v=function(n){return f.elements[n].value.trim();};
var m='Hello Deep Core Wells, I would like a free quote.\\n\\nName: '+v('name')+'\\nPhone: '+v('phone')+'\\nSite: '+v('location')+'\\nService: '+v('service')+(v('details')?'\\nDetails: '+v('details'):'');
if(how==='mail')location.href='mailto:info@deepcorewells.com?subject='+encodeURIComponent('Free quote request: '+v('service'))+'&body='+encodeURIComponent(m);
else window.open('https://wa.me/254706716310?text='+encodeURIComponent(m),'_blank','noopener');});})();
</script>'''
add('/contact', 'Contact Deep Core Wells | Free Borehole Quote',
    'Call or WhatsApp 0706 716 310, email info@deepcorewells.com, or request a free borehole quote. Office at Mega Centre, Kitale.',
    'Contact us', 'Call, WhatsApp or email us, or send a quote request and we will get back to you within 24 hours.',
    contact_body, [('/contact', 'Contact')])

# ---------- privacy ----------
privacy_body = '''<section class="pg"><div class="wrap prose">
  <p><em>Last updated: ''' + datetime.date.today().strftime('%d %B %Y').lstrip('0') + '''</em></p>
  <h2>What this website collects</h2>
  <p>This website does not have user accounts and does not store your personal details on our servers.</p>
  <h2>Quote requests</h2>
  <p>When you fill in the quote form and press send, your details are put into a WhatsApp message or an email on your own device. Nothing is sent until you send that message yourself. We then receive it like any other WhatsApp message or email, and use it only to reply to your enquiry and prepare your quote.</p>
  <h2>Borehole assistant</h2>
  <p>The chat assistant runs in your browser. Your questions are not saved or sent to us.</p>
  <h2>Third-party services</h2>
  <p>The site loads fonts from Google Fonts, some project photos from Cloudinary, and a 3D graphics library from public content delivery networks. These providers may see your IP address when your browser loads those files, as with any website. Links to WhatsApp, Google Maps and social media take you to those services, which have their own privacy policies.</p>
  <h2>Storage on your device</h2>
  <p>The site remembers, for the current browser session only, that you have already seen the opening animation. It does not use advertising or tracking cookies.</p>
  <h2>Your questions</h2>
  <p>To ask what information we hold from your messages, or to have it deleted, contact us at <a href="mailto:info@deepcorewells.com">info@deepcorewells.com</a> or 0706 716 310.</p>
</div></section>'''
add('/privacy', 'Privacy Policy | Deep Core Wells', 'How the Deep Core Wells website handles your information.',
    'Privacy policy', 'How this website handles your information.', privacy_body, [('/privacy', 'Privacy policy')])

# ---------- sitemap + robots ----------
urls = ['/'] + pages
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'  <url><loc>{SITE}{u if u != "/" else "/"}</loc><lastmod>{TODAY}</lastmod><priority>{"1.0" if u == "/" else "0.8" if u in ("/services", "/projects", "/contact") else "0.6"}</priority></url>\n' for u in urls) + '</urlset>\n'
write('sitemap.xml', sm)
write('robots.txt', f'User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: {SITE}/sitemap.xml\n')
print('built', len(pages), 'pages:', ', '.join(pages))
print('areas:', {k: len(v) for k, v in areas.items()})
print('unmapped:', [c['name'] for c in cards if not county(c)])
