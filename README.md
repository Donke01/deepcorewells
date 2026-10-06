# Deep Core Wells

Professional water well drilling services website — deepcorewells.com

Based in Kitale, Kenya (Mega Centre, 3rd Floor, Makasembo Road). We drill countrywide.

## Deploy
Static site served with `serve`. On Railway: New Project → Deploy from GitHub repo.

## Inner pages and SEO
`services`, `projects`, `areas`, the county pages (`borehole-drilling-*`), `faq`, `contact`, `privacy`,
`sitemap.xml` and `robots.txt` are generated from `index.html` and `js/assistant.js`:

    python3 tools/extract_css.py && python3 tools/build_pages.py

Run that after adding a project card or changing the header/footer on the homepage, then commit.
