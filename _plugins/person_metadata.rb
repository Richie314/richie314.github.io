# Publish factual profile metadata without changing the visible About page.
require "json"

Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.output_ext == ".html" && page.data["permalink"] == "/"

  profile = page.site.data["person"]
  next unless profile.is_a?(Hash)

  root = page.site.config["url"].to_s.sub(%r{/$}, "") + page.site.config["baseurl"].to_s.sub(%r{/$}, "")
  metadata = profile.merge(
    "@context" => "https://schema.org",
    "@id" => "#{root}/#person",
    "url" => "#{root}/",
    "mainEntityOfPage" => "#{root}/",
    "subjectOf" => {
      "@type" => "WebPage",
      "name" => "Curriculum vitae",
      "url" => "#{root}/cv/",
    }
  )
  # Escape HTML delimiters so data can never terminate its script element.
  json = JSON.generate(metadata).gsub("<", '\u003c').gsub(">", '\u003e').gsub("&", '\u0026')
  script = %(<script type="application/ld+json" id="person-profile">#{json}</script>)
  page.output = page.output.sub(%r{</head>}i) { "#{script}\n</head>" }
end
