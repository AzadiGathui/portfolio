---
title: Onboarding for confidence, not just speed
headline: Onboarding for confidence, not just speed.
sidebar: false
tagline: Mobile onboarding research & design
client: Leja Ltd.
industry: B2B Fintech
role: Lead Product Designer
deliverables:
  - Onboarding prototype
  - Updated design system
team:
  - name: Angela Munde
    role: Designer
    url: https://www.linkedin.com/in/angelamunde/
    photo: /assets/images/projects/lji/team/angela-munde.png
  - name: Vincent Mzee
    role: Designer
    url: https://www.linkedin.com/in/vincent-mbindyo-8a4b68160/
    photo: /assets/images/projects/lji/team/vincent-mzee.png
  - name: Phena Mwema
    role: Frontend Android engineer
    url: https://www.linkedin.com/in/phena-mwema/
    photo: /assets/images/projects/lji/team/phena-mwema.png
  - name: Rebecca Kimani
    role: Product manager
    url: https://www.linkedin.com/in/rebecca-kimani-a3b0a3131/
    photo: /assets/images/projects/lji/team/rebecca-kimani.png
research:
  flow: true
  sources:
    - title: "The Dream Team! AKA Leja's designers"
      image: /assets/images/projects/lji/research/dream-team.jpg
      alt: "Three of Leja's designers posing close together outdoors at night"
    - title: "The IDEO team that worked with us for 6+ weeks"
      image: /assets/images/projects/lji/research/ideo-team.jpg
      alt: "Five people crowded into a selfie at a evening gathering, smiling"
    - title: "At the IDEO launch of the Financial Confidence playbook in NRB"
      image: /assets/images/projects/lji/research/playbook-launch.jpg
      alt: "A room of people standing and listening to a presenter beside a screen"
    - title: "Faster product-market fit for digital finance at the last mile"
      image: /assets/images/projects/lji/research/ideo-lmm-deck.png
      alt: "Title slide of an IDEO Last Mile Money deck with illustrated portraits of people"
      url: https://www.financialconfidence.design/
    - title: "Designing for Digital Confidence"
      image: /assets/images/projects/lji/research/designing-digital-confidence.png
      alt: "Slide titled Designing for Digital Confidence over illustrated smartphone users"
      url: https://www.financialconfidence.design/
    - title: "The Financial Agency of Women, Northern Kenya, March 2019"
      image: /assets/images/projects/lji/research/financial-agency-of-women.png
      alt: "Title slide of The Financial Agency of Women with a portrait of a woman in beaded jewellery"
    - title: "Women informal entrepreneurs in Kenya"
      image: /assets/images/projects/lji/research/women-informal-entrepreneurs.png
      alt: "Report cover: Women informal entrepreneurs in Kenya, a feminist analysis of economic empowerment"
    - title: "Introducing the Gender Evaluation Framework"
      image: /assets/images/projects/lji/research/gender-evaluation-framework.png
      alt: "The Gender Evaluation Framework: a grid of intent, capability, commitment and impact"
      url: https://medium.com/last-mile-money/introducing-the-gender-evaluation-framework-a-rubric-to-understand-venture-intent-capability-and-d49fe537b821
order: 3
coverImage: /assets/images/projects/lji/cover-shop.jpg
coverPosition: 50% 45%
mockupImage: /assets/images/projects/lj/phone-home.png
clientLogo: /assets/images/resume/leja/Leja logotype_WhitePink_RGB.svg
thumbnail: /assets/images/projects/lj/thumbnail.png
thumbnailKind: phone   # phone | print | book: how the artefact is laid on the homepage card and case-study cover
cardArtLift: -0.5   # squares the card's phone sits above the cover's bottom edge; negative is below it, over the caption's grey (half a square: clear of the text and the arrow). The same as Jireh's
ogImage: /assets/images/projects/lji/og-image.png
cardImage: /assets/images/home/card-market.jpg
cardPosition: 50% 30%
cardLabel: Researcher + Designer
cardTitle: Onboarding business owners for confidence, not just speed.
description: Six weeks of merchant testing and IDEO critique, through a gender lens, to make Leja's onboarding clearer, more trustworthy and more supportive for women who run small businesses in Kenya. Product design for Leja Ltd., a B2B fintech platform.
permalink: /projects/leja-business-app/
---

<!-- Everything on this page is the Figma's "Desktop" frame for this case study (node 630:7313). Screens and
     photos live in src/assets/images/projects/lji/; the Week 1, 4 and 5 phones are placeholders until their
     screens are ready: a phone with no src is the mockup with a plain screen. -->

<div class="article-body">

{% chapter { label: "The challenge", title: "Leja’s onboarding does not survive interruptions.", id: "overview", toc: "Challenge", lede: "Onboarding at the last mile needs to survive interruptions and dropping network over multi-step inputs." } %}

{% filter oneLine %}{% include "partials/study/research.njk" %}{% endfilter %}

{% chapter { label: "The experiment", title: "HMW redefine product success to include women’s success?", id: "experiment", toc: "Experiment", lede: "The accelerator used the <a href='https://medium.com/last-mile-money/introducing-the-gender-evaluation-framework-a-rubric-to-understand-venture-intent-capability-and-d49fe537b821'>Gender Evaluation Framework</a> from IDEO Last Mile Money and Mansi Gupta of Unconform." } %}

<div class="panel">
<div class="pj-row pj-row--4 pj-row--rules">
  <div class="stat-card"><span class="label label--accent">Intent</span><p class="stat-card__value">Did the research design carry a gender lens?</p></div>
  <div class="stat-card"><span class="label label--accent">Action</span><p class="stat-card__value">Did what we heard from women change the product?</p></div>
  <div class="stat-card"><span class="label label--accent">Commitment</span><p class="stat-card__value">Would women's success become part of product strategy and metrics?</p></div>
  <div class="stat-card"><span class="label label--accent">Impact</span><p class="stat-card__value">Could we reach and keep women, and tell whether Leja changed anything for them?</p></div>
</div>
</div>

{% chapter { label: "Week 1", title: "Matching best practices from other LMM projects.", id: "week-1", toc: "Week 1", lede: "IDEO LMM created the Financial Confidence Playbook as a design guide to make products more usable, intuitive and valuable to low-income people." } %}

{% phones "Playbook principles" %}
  {% phone { caption: "Allow users to explore before using." } %}
  {% phone { caption: "Reduce text and use visual cues." } %}
  {% phone { caption: "Design icons relevant to local users." } %}
  {% phone { caption: "Visualise analog financial artifacts to help users feel more confident about digital money." } %}
{% endphones %}

{% chapter { label: "Week 2", title: "Does a conversation beat a form?", id: "week-2", toc: "Week 2", lede: "The answers were mixed. Some people preferred a plain form for its simplicity; others valued the examples a conversation can carry." } %}

<div class="spread-grid">
  <img style="--at: 1 / 13" sizes="(max-width: 768px) 100vw, 888px" src="/assets/images/projects/lji/week2-methods.png" alt="A scatter of small white note cards, then sorted into two stacks; four printed phone screens, A to D, on paper with handwritten notes; and a WhatsApp chat in which a bot asks for a phone number, then a first, second and last name">
</div>

{% chapter { label: "Week 3", title: "Offering choice, clarity and options for support.", id: "week-3", toc: "Week 3", lede: "Most participants chose self-service, but help still mattered. People wanted to switch paths if self-service stalled, and asked how long an agent would take to arrive." } %}

{% phones "Support screens" %}
  {% phone { src: "/assets/images/projects/lji/week3-get-to-know-you.png", alt: "Help us get to know you: four choices, Create account yourself, Set up your account over call (selected), A Leja agent is with you now and Ask a Leja agent to come to you, then What does this mean? and Request to be called and Call now buttons" } %}
  {% phone { src: "/assets/images/projects/lji/week3-interests.png", alt: "What are you interested in? Four green cards: Taking a loan, Saving money, Tracking my spending and Buying shares, then What does this mean? and Back and Confirm request buttons" } %}
  {% phone { src: "/assets/images/projects/lji/week3-loan-video.png", alt: "Taking a loan: a green video panel with a play button, then What does this mean? says it is a 3 minute video and a representative can answer questions, with Back and Confirm buttons" } %}
{% endphones %}

{% chapter { label: "Week 4", title: "Does a local, recognisable guide...?", id: "week-4", toc: "Week 4", lede: "Recognising a character isn't evidence that her guidance works." } %}

{% phones "Guide screens" %}
  {% phone %}
  {% phone %}
  {% phone %}
{% endphones %}

{% chapter { label: "Week 5", title: "How much text is too much text?", id: "week-5", toc: "Week 5", lede: "A language review turned the feedback into simpler instructions and clearer checkpoints." } %}

{% phones "Language review screens" %}
  {% phone %}
  {% phone %}
  {% phone %}
{% endphones %}

{% chapter { label: "Week 6", title: "Creating a deterministic design pattern.", id: "week-6", toc: "Week 6", lede: "This wasn't AI; every prompt, branch, validation message and next step is authored in advance." } %}

<div class="spread-grid">
  <img style="--at: 1 / 13" sizes="(max-width: 768px) 100vw, 888px" src="/assets/images/projects/lji/week6-components.png" alt="Interface pieces from the prototype: a Set up in 3 easy steps card with a step bar and an Update my profile button; a Details submitted badge with a hand sign; a data privacy card with an Account deletion link; Under maintenance, Online and Offline status pills; How to get a loan, save money and buy shares tiles; an app bar with tabs; chips; a snackbar; a text field; Light, Dark and Auto segmented buttons; and a restaurant card">
</div>

</div>
