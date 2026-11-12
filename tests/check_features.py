#!/usr/bin/env python3
"""Build temporary feature probes without adding demo pages to the public site."""
import shutil
import subprocess
import tempfile
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='ciucci-features-') as temp:
    source = Path(temp) / 'source'
    source.mkdir()
    for name in ('_pages', '_data', '_bibliography', '_includes', '_layouts', '_plugins', '_sass', 'assets'):
        shutil.copytree(repo / name, source / name)
    (source / 'assets/bibliography').mkdir(exist_ok=True)
    (source / 'assets/bibliography/probe.bib').write_text('@article{probe, title={Feature probe}, author={Ciucci, Riccardo}, year={2026}}\n')
    probes = {
        'rich': '''chart:
  chartjs: true
  echarts: true
  plotly: true
  vega_lite: true
mermaid:
  enabled: true
tikzjax: true
pseudocode: true
map: true
code_diff: true
images:
  lightbox2: true
  photoswipe: true
  spotlight: true
  venobox: true
  slider: true
marimo: true
giscus_comments: true
''',
        'rtl': 'lang: ar\n',
        'distill': 'layout: distill\nauthors: []\nbibliography: probe.bib\n',
        'plain': '',
    }
    for name, front in probes.items():
        layout = '' if 'layout:' in front else 'layout: post\n'
        body = '# Feature probe\n\nMath: $$ x^2 $$\n\n'
        if name == 'rich':
            body += '{% al_email_protect_link "test@example.com" %}\n\n```chartjs\n{"type":"bar","data":{"labels":["a"],"datasets":[{"data":[1]}]}}\n```\n'
        (source / '_pages' / f'probe-{name}.md').write_text(f'---\n{layout}title: {name} feature probe\npermalink: /probe-{name}/\n{front}---\n{body}')
    override = Path(temp) / 'features.yml'
    override.write_text('''protect_email: true
enable_cookie_consent: true
analytics:
  cloudflare: 0123456789abcdef0123456789abcdef
newsletter:
  enabled: true
  endpoint: https://example.com/newsletter
giscus:
  repo: Richie314/richie314.github.io
  repo_id: test
  category: Comments
  category_id: test
''')
    out = Path(temp) / 'output'
    subprocess.run(['bundle', 'exec', 'jekyll', 'build', '--source', str(source), '--destination', str(out), '--config', f'{repo / "_config.yml"},{override}'], cwd=repo, check=True)
    rich = (out / 'probe-rich/index.html').read_text()
    for marker in ('chart.umd.min.js', 'echarts.min.js', 'plotly.min.js', 'mermaid.min.js', 'tikzjax.js', 'pseudocode.min.js', 'leaflet.min.js', 'diff2html-ui.min.js', 'marimo-snippets.js', 'email-protect.js', 'cookieconsent.umd.js', 'giscus.app/client.js', 'swiper@12.1.2', 'photoswipe', 'spotlight', 'venobox', 'lightbox', 'vega-lite', 'cloudflareinsights.com'):
        assert marker in rich, f'Feature failed to render: {marker}'
    rtl = (out / 'probe-rtl/index.html').read_text()
    assert 'dir="rtl"' in rtl and 'lang="ar"' in rtl and 'al_rtl/css/rtl.css' in rtl
    distill = (out / 'probe-distill/index.html').read_text()
    assert '<d-article>' in distill and 'template.v2.js' in distill
    plain = (out / 'probe-plain/index.html').read_text()
    assert 'marimo-snippets.js' not in plain and 'al_rtl/css/rtl.css' not in plain
    assert 'polyfill.io' not in rich + distill
    # Check that plugin runtime URLs are actually published, rather than only emitted.
    import re
    from urllib.parse import urlsplit, unquote
    for name in probes:
        html = (out / f'probe-{name}/index.html').read_text()
        for url in re.findall(r'(?:src|href)="(/assets/[^\"]+)"', html):
            assert (out / unquote(urlsplit(url).path).lstrip('/')).is_file(), f'Unpublished feature asset: {url}'
    print('Passed: charts, math/TikZ, maps, diffs, comments, cookie consent, email protection, RTL, marimo, Distill, and feature gating.')
