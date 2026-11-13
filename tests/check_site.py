#!/usr/bin/env python3
"""Check the built personal site, including content and locally served assets."""
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
errors = []

class Document(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('src', 'href', 'poster'):
            value = attrs.get(key, '')
            if value:
                self.check(value)
        for candidate in attrs.get('srcset', '').split(','):
            if candidate.strip():
                self.check(candidate.strip().split()[0])

    def check(self, value):
        url = urlsplit(unescape(value))
        if url.scheme or url.netloc or not url.path:
            return
        path = root / unquote(url.path).lstrip('/') if url.path.startswith('/') else current.parent / unquote(url.path)
        if path.is_dir():
            path /= 'index.html'
        if not path.exists():
            errors.append(f'{current.relative_to(root)}: missing {value}')

pages = list(root.rglob('*.html'))
assert pages, f'No HTML found in {root}'
for current in pages:
    Document().feed(current.read_text())

required = {
    'index.html': ['Riccardo', 'Ciucci', 'Richard Bach', 'prof_pic_color', 'linkedin.com/in/riccardo-ciucci', 'ninja-keys'],
    'cv/index.html': ['Computer Science, AI curriculum', 'Information Engineering', '110/110', '100/100 cum laude', 'IT Staff', 'Chief administrator', 'Bronze medal', 'Silver medal', 'Certificate in Advanced English', 'Docker Networking', 'Native speaker', 'Computational mathematics', '/assets/pdf/CV-Riccardo-Ciucci.pdf'],
    'blog/index.html': ['Building a small MVC library in PHP', 'Sorting'],
    'blog/2025/sorting-algorithms-overview/index.html': ['bubble-tot', 'cocktailshaker-tot', 'merge-tot', '/assets/js/projects/sorting.js'],
    'blog/2024/calculate-pi-in-the-browser/index.html': ['/assets/js/projects/pi.js', '/assets/js/projects/pi-worker.js'],
    'repositories/index.html': ['Richie314', 'github-stats-extended.vercel.app'],
}
for name, markers in required.items():
    path = root / name
    if not path.exists():
        errors.append(f'Missing page: {name}')
        continue
    content = unescape(path.read_text())
    for marker in markers:
        if marker.lower() not in content.lower():
            errors.append(f'{name}: missing preserved content {marker!r}')
for name in ('assets/css/tailwind.css', 'assets/css/main.css', 'assets/css/al-folio-cv.css', 'assets/js/theme.js'):
    if not (root / name).is_file():
        errors.append(f'Missing runtime asset: {name}')
for page in pages:
    if 'polyfill.io' in page.read_text():
        errors.append(f'Obsolete polyfill service in {page}')
# Profile metadata is valid JSON-LD and stays outside the visible article.
import json
home = (root / 'index.html').read_text()
profile_script = re.search(r'<script\b(?=[^>]*id="person-profile")[^>]*>(.*?)</script>', home, re.S)
if not profile_script:
    errors.append('Homepage person metadata is missing')
else:
    profile = json.loads(profile_script[1])
    if profile.get('@type') != 'Person' or profile.get('name') != 'Riccardo Ciucci':
        errors.append('Person metadata must identify the site owner')
    if profile.get('url') != 'https://ciucci.dev/' or profile.get('subjectOf', {}).get('url') != 'https://ciucci.dev/cv/':
        errors.append('Profile metadata must link to the canonical homepage and CV')
    if not {'Embedded systems', 'Computer engineering', 'Computer science', 'Arduino', 'ESP32'} <= set(profile.get('knowsAbout', [])):
        errors.append('Profile metadata is missing documented technical areas')
    if 'jobs and internships' not in profile.get('description', ''):
        errors.append('Profile metadata is missing the stated career interests')
    if profile_script.start() > home.index('</head>'):
        errors.append('Profile metadata must remain in the document head')

# Protect addresses in CV, social icons, and the search palette at build time.
for page in pages:
    content = unescape(page.read_text())
    if 'mailto:' in content.lower() or 'riccardo@ciucci.dev' in unquote(content):
        errors.append(f'Unprotected email in {page.relative_to(root)}')
for name in ('index.html', 'cv/index.html'):
    content = (root / name).read_text()
    if 'al-email-protect' not in content or 'email-protect.js' not in content:
        errors.append(f'{name}: email copy controls are missing')
cv_html = (root / 'cv/index.html').read_text()
if cv_html.index('>General Information<') > cv_html.index('>Experience<'):
    errors.append('CV general information must precede experience')

class Trophies(HTMLParser):
    images = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img' and 'data-fallback' in attrs:
            self.images.append(attrs)

trophies = Trophies()
trophies.feed((root / 'repositories/index.html').read_text())
if len(trophies.images) != 6:
    errors.append('Expected light/dark trophy cards at three responsive sizes')
for image in trophies.images:
    if 'github-profile-repo.vercel.app' not in image['src'] or 'trophy.ryglcloud.net' not in image['data-fallback']:
        errors.append('Trophy primary or fallback instance missing')

# The sitemap must use the public domain even when built for local preview.
import xml.etree.ElementTree as ET
sitemap = ET.parse(root / 'sitemap.xml')
urls = {node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
for path in ('/', '/cv/', '/blog/', '/repositories/', '/blog/2026/php-mvc/', '/blog/2025/sorting-algorithms-overview/', '/blog/2024/calculate-pi-in-the-browser/', '/blog/2025/star-wars-intro-maker/', '/blog/2026/malus-law/'):
    if 'https://ciucci.dev' + path not in urls:
        errors.append(f'Sitemap is missing {path}')
if any(not url.startswith('https://ciucci.dev/') for url in urls):
    errors.append('Sitemap contains a noncanonical URL')
if 'Sitemap: https://ciucci.dev/sitemap.xml' not in (root / 'robots.txt').read_text():
    errors.append('robots.txt does not advertise the sitemap')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'Passed: {len(pages)} pages, local assets, responsive images, and preserved personal content.')
