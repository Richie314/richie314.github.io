# Site-specific presentation fixes around the gem-owned theme.
require "nokogiri"
require "cgi"
require "al_email_protect"

module CiucciRendering
  # The CV gem prepends Experience regardless of the data's section order.
  def ciucci_cv_general_first(html)
    fragment = Nokogiri::HTML.fragment(html)
    cv = fragment.at_css(".cv")
    heading = cv&.css("h3")&.find { |node| node.text.strip == "General Information" }
    return html unless heading

    card = heading.parent
    anchor = card.previous_element
    cv.prepend_child(card.unlink)
    cv.prepend_child(anchor.unlink) if anchor&.name == "a" && anchor["id"] == "general-information"
    fragment.to_html
  end

  module_function

  def protect_email(html)
    html = html.gsub(AlEmailProtect::ANCHOR) do |markup|
      anchor = Nokogiri::HTML.fragment(markup).at_css("a")
      address = AlEmailProtect.decode_target(CGI.unescapeHTML(anchor["href"].sub(/\Amailto:/i, "")))
      parts = AlEmailProtect.split_address(address)
      next markup unless parts

      local, domain = parts
      anchor["href"] = "#"
      anchor["class"] = [anchor["class"], "al-email-protect"].compact.join(" ")
      anchor["data-eu"] = local
      anchor["data-ed"] = domain
      anchor.remove_attribute("target")
      anchor["title"] = "Copy email address"
      if anchor.text.include?("@")
        anchor.inner_html = "#{AlEmailProtect.escape(local)}<span class=\"al-email-sep\"> [at] </span>#{AlEmailProtect.domain_markup(domain)}"
      end
      anchor.to_html
    end

    # The search gem embeds its email action as JS rather than an HTML link.
    # Route it through the same accessible click-to-copy runtime as social links.
    targets = []
    html = html.gsub(/window\.open\(\s*["']mailto:([^"']+)["']\s*,\s*["']_blank["']\s*\)/) do |original|
      parts = AlEmailProtect.split_address(AlEmailProtect.decode_target(Regexp.last_match(1)))
      next original unless parts

      id = "search-email-#{targets.length}"
      targets << %(<a id="#{id}" href="#" class="al-email-protect" data-eu="#{AlEmailProtect.escape(parts[0])}" data-ed="#{AlEmailProtect.escape(parts[1])}" hidden tabindex="-1" aria-hidden="true"></a>)
      %(document.getElementById("#{id}").click())
    end
    html.sub(%r{</body>}i) { targets.join + "</body>" }
  end
end

Liquid::Template.register_filter(CiucciRendering)
Jekyll::Hooks.register [:pages, :documents], :post_render do |document|
  next unless document.output_ext == ".html"

  # Adjust the gem-owned related-posts heading without copying its template.
  document.output = document.output.gsub(
    ">Enjoy Reading This Article?</h2>",
    ">Enjoyed reading this article?</h2>"
  )
  next unless AlEmailProtect.enabled?(document.site)

  document.output = CiucciRendering.protect_email(document.output)
end
