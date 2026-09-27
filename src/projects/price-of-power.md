---
title: The Price of Power
tagline: Energy & Affordability
client: Independent
industry: Energy & Data Visualisation
role: Researcher & Designer
deliverables: Interactive data visualisation (Tableau Public)
order: 1
coverImage: /assets/images/projects/ren/Olkaria 1AU.jpg
mockupImage: /assets/images/projects/ren/bills.png
thumbnail: /assets/images/projects/ren/bills.png
ogImage: /assets/images/projects/ren/bills.png
description: An exploration into your monthly Kenya Power electricity bill, equitable distribution and the renewable energy transition.
permalink: /projects/price-of-power/
---

<!-- Click-to-load: Tableau's scripts are about 1.6 MB, so they only download
     when a visitor asks for the interactive version. Until then, a local preview
     image (optimised by the image pipeline) and a direct link are shown. -->
<div class="tableau-facade" id="tableau-facade">
  <img src="/assets/images/projects/ren/price-of-power-dashboard-preview.png" alt="Preview of the Price of Power dashboard: the title, and a collage of 2025 news headlines about Kenya's energy sector" class="tableau-facade__preview">
  <div class="tableau-facade__actions">
    <button type="button" class="tableau-facade__button" id="tableau-load" hidden>Load interactive dashboard</button>
    <a href="https://public.tableau.com/app/profile/azadi.gathui/viz/shared/3XGQZ5DYM" target="_blank" rel="noopener">Open in Tableau Public<span class="visually-hidden"> (opens in a new tab)</span></a>
  </div>
  <p class="tableau-facade__note">The interactive version loads about 1.6 MB from Tableau Public.</p>
</div>
<div class="tableauPlaceholder" id="viz1769839218089" style="position: relative" tabindex="-1" hidden>
  <object class="tableauViz" style="display: none">
    <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
    <param name="embed_code_version" value="3" />
    <param name="path" value="shared&#47;3XGQZ5DYM" />
    <param name="toolbar" value="yes" />
    <param name="static_image" value="https://public.tableau.com/static/images/3X/3XGQZ5DYM/1.png" />
    <param name="animate_transition" value="yes" />
    <param name="display_static_image" value="yes" />
    <param name="display_spinner" value="yes" />
    <param name="display_overlay" value="yes" />
    <param name="display_count" value="yes" />
    <param name="language" value="en-US" />
  </object>
</div>
<script type="text/javascript">
  // Progressive enhancement: the button only appears when JavaScript runs.
  (function () {
    var button = document.getElementById("tableau-load");
    var facade = document.getElementById("tableau-facade");
    var divElement = document.getElementById("viz1769839218089");
    button.hidden = false;
    button.addEventListener("click", function () {
      facade.hidden = true;
      divElement.hidden = false; // un-hide first: the sizing below measures its width
      // --- Tableau's original embed code, unchanged, now run on click ---
      var vizElement = divElement.getElementsByTagName("object")[0];
      if (divElement.offsetWidth > 800) {
        vizElement.style.width = "1366px";
        vizElement.style.height = "5027px";
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = "1366px";
        vizElement.style.height = "5027px";
      } else {
        vizElement.style.width = "100%";
        vizElement.style.height = "4877px";
      }
      var scriptElement = document.createElement("script");
      scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
      // move keyboard/screen-reader focus to where the dashboard is appearing
      divElement.focus();
    });
  })();
</script>
