---
title: Accessible healthcare financing
headline: Supporting caregiver proactivity.
sidebar: false
tagline: Mobile web app research & design
client: Jireh Innovations Ltd.
industry: Healthcare Fintech
role: UX Researcher & Designer
timeline: Apr 2025 – Sep 2026
platform: Installable web app (PWA), Android first
deliverables: B2C web app, B2B admin dashboards, user research & usability testing
team:
  - name: Terach Franchi
    role: CEO
    url: https://www.linkedin.com/in/terachfranchi/
    photo: /assets/images/projects/jh/team/terach-franchi.png
  - name: Sheila Sharon
    role: Engineer
    url: https://www.linkedin.com/in/devsheilasharon/
    photo: /assets/images/projects/jh/team/sheila-sharon.png
  - name: Athman Gude
    role: Product manager
    url: https://www.linkedin.com/in/athmangude/
    photo: /assets/images/projects/jh/team/athman-gude.png
  - name: Gloria Kerubo
    role: Business development
    url: https://www.linkedin.com/in/gloria-kerubo-2b9a88312/
    photo: /assets/images/projects/jh/team/gloria-kerubo.png
  - name: Helina Mbuthia Muhia
    role: Marketing
    url: https://www.linkedin.com/in/helina-mbuthia-muhia-99b087166/
    photo: /assets/images/projects/jh/team/helina-mbuthia-muhia.png
research:
  question: How might we reward caregivers for being proactive?
  figure:
    src: /assets/images/projects/jh/research-circle.png
    alt: "A caregiver, Henry J., at the centre of his Circle, joined by four members: one marked New!, one Waiting and one Declined"
    width: 288
  timeline:
    - title: Read what exists
      points:
        - Healthcare financing, health records and Kenya's demographic data
        - Human-centred design in Kenyan healthcare
        - How community groups buy together
    - title: Visit partner facilities
      points:
        - My first week, at the counter where bills are paid
        - Tried the app while actually sick, and the selfie check failed
    - title: Run focus groups
      points:
        - With the people we were designing for
        - Who pays for whom, and what makes a PIN feel safe
    - title: Boil it down
      points:
        - One question the product answers
        - Four findings that shaped every screen
  findings:
    - title: Paying for someone else is the default.
      detail: Parents for their children, adults for their elderly parents. The bill is rarely your own.
    - title: Payment happens under pressure, on 3G and a low-end phone.
      detail: At a counter, often when someone is unwell. Heavy screens and dropped connections cost trust before it is earned.
    - title: Money questions come before everything else.
      detail: "Where can we use Jireh next time? What can I do with the cashback I've earned? The long Home screen answers these up front."
    - title: People share an ID, selfie or PIN only when they know why.
      detail: Every request has to explain itself, and nothing is switched on until the person chooses it.
  sources:
    - title: "Community Group Buying: the 'US military vs the Red Army'"
      image: /assets/images/projects/jh/research-src-news.png
      alt: "Article from Tech Buzz China Insider, with a photo of people sorting parcels on a street"
      url: https://techbuzzchina.substack.com/p/community-group-buying-the-us-military
    - title: Secondary Analysis of Electronic Health Records
      image: /assets/images/projects/jh/research-src-mit.png
      alt: "Book cover: MIT Critical Data, Secondary Analysis of Electronic Health Records"
      url: https://link.springer.com/book/10.1007/978-3-319-43742-2
    - title: Human-Centred Design as a Lever for Accessible Kenyan Healthcare
      image: /assets/images/projects/jh/research-src-design.png
      alt: "Article header: a health worker in a mask and hair net writing at a desk"
    - title: "Kenya Demographic and Health Survey 2022: Key Indicators Report"
      image: /assets/images/projects/jh/research-src-dhs.png
      alt: "Report cover: Kenya Demographic and Health Survey 2022, Key Indicators Report"
      url: https://dhsprogram.com/pubs/pdf/PR143/PR143.pdf
    - title: "Integrating Human-Centered Design and Social Science Research: Lessons from Project RISE"
      image: /assets/images/projects/jh/research-src-rise.png
      alt: "Paper title: Integrating human-centered design and social science research to improve service delivery and empower community health workers"
      url: https://chwcentral.org/resources/integrating-human-centered-design-and-social-science-research-to-improve-service-delivery-and-empower-community-health-workers-lessons-from-project-rise/
    - title: Translating UX Goals into Analytics Measurement Plans
      image: /assets/images/projects/jh/research-src-nng.png
      alt: "Article from Nielsen Norman Group: Translating UX Goals into Analytics Measurement Plans"
      url: https://www.nngroup.com/articles/ux-goals-analytics/
    - title: Visiting partner facilities in my first week
      image: /assets/images/projects/jh/research-visit.jpg
      alt: "Two women in purple tops smiling for a selfie in a busy street with market stalls"
    - title: Focus group discussions with our target audience
      image: /assets/images/projects/jh/research-focus-group.jpg
      alt: "People sitting in a circle on benches under trees, in a focus group discussion"
    - title: Trying to use the app when I was actually sick. It didn't work.
      image: /assets/images/projects/jh/research-selfie-fail.png
      alt: "A phone screen asking whether a selfie is clear enough, over a photo of a young woman"
    - title: "Healthy Perspectives: Creating a Meaningful Financial Experience in Healthcare (video)"
      image: /assets/images/projects/jh/research-src-flywire.png
      alt: "Flywire video page: Healthy Perspectives, creating a meaningful financial experience in healthcare"
      url: https://www.flywire.com/resources/healthy-perspectives-creating-a-meaningful-financial-experience-in-healthcare
order: 1
coverImage: /assets/images/projects/jh/cover.jpg
coverPosition: 50% 20%
mockupImage: /assets/images/projects/jh/home-cashback.png
thumbnail: /assets/images/projects/jh/thumbnail.png
thumbnailKind: phone
ogImage: /assets/images/projects/jh/home-cashback.png
description: UX research and design for Jireh, a mobile-first web app where Kenyans pay medical bills with M-Pesa, cashback and 0% interest loans backed by people they trust.
permalink: /projects/jireh-health/
---

<div class="article-body">

{% chapter { label: "The challenge", title: "In Kenya, a medical bill is a family fundraiser.", id: "overview", toc: "Challenge", lede: "Most care is paid for at a hospital counter, often for someone else, often with less on M-Pesa than the invoice says." } %}

{% filter oneLine %}{% include "partials/jireh/trio.njk" %}{% endfilter %}

The gap is covered by phone calls to family and by borrowing on terms nobody has time to read. Jireh turns that informal support into structure; my job was to make it feel as simple as sending money on M-Pesa, the bar every Kenyan user compares us to.

{% chapter { label: "Research", title: "The research that shaped my decisions.", id: "research", toc: "Research", lede: "I started with what had been written, then spent my first week at partner facilities and ran focus groups with the people we were designing for." } %}

{% filter oneLine %}{% include "partials/study/research.njk" %}{% endfilter %}

{% chapter { label: "Principles", title: "Four rules, one for each finding", id: "principles", toc: "Principles", lede: "What we learned became what every screen answers to." } %}

<div class="panel">
<div class="pj-row pj-row--4 pj-row--rules">
  <div class="stat-card"><span class="label label--accent">From finding 01</span><p class="stat-card__value">Pay for others as easily as for yourself.</p><p class="caption"><a href="#circle">The Circle</a></p></div>
  <div class="stat-card"><span class="label label--accent">From finding 02</span><p class="stat-card__value">One decision per screen, from one shared system.</p><p class="caption"><a href="#fast-track">Fast Track</a> and the <a href="#system">icon system</a></p></div>
  <div class="stat-card"><span class="label label--accent">From finding 03</span><p class="stat-card__value">Every shilling is visible.</p><p class="caption"><a href="#home">Home</a></p></div>
  <div class="stat-card"><span class="label label--accent">From finding 04</span><p class="stat-card__value">Earn every request, and never lose progress.</p><p class="caption"><a href="#onboarding">Onboarding</a></p></div>
</div>
</div>

{% chapter { label: "Pay for others as easily as for yourself", title: "A Circle of family and friends backs a small interest-free credit line", id: "circle", toc: "Circle", lede: "The hard part was explaining shared responsibility without sounding like a debt collector." } %}

{% filter oneLine %}{% include "partials/jireh/circle-collage.njk" %}{% endfilter %}

{% phones "Circle screens" %}
  {% phone { src: "/assets/images/projects/jh/circle-home.png", alt: "My Jireh Circle: Azadi G. at the centre with James K., Amina L. and Kamau G. around her and an Invite button, then a Dependants row below", title: "Your Circle", caption: "Members drawn around you to visualise a 'circle of support' with 1:1 relationships." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-member.png", alt: "Add to your Circle: first and last name, a phone number that will receive the invite, relationship, and a choice of custom SMS or voice note", title: "Invite members only", caption: "Circle members are adults you trust to repay. Two of them unlock borrowing, and they are the only people invited, by SMS or voice note." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-dependant.png", alt: "Add a dependant: anyone whose medical bills you manage, such as children and elderly parents, with name and relationship only", title: "Pay for your dependants, no invite needed", caption: "Dependants, such as children and elderly parents, are people whose bills you manage. Add them by name and pay straight away; they never take on any of the risk." } %}
  {% phone { src: "/assets/images/projects/jh/circle-how-it-works.png", alt: "How Circles work: grow together with people you trust, what a complete Circle unlocks, then the shared risk", title: "Benefit before risk", caption: "What a complete Circle unlocks, then the shared risk, before anyone is invited." } %}
{% endphones %}

{% chapter { label: "One decision per screen", title: "One bill can be split across several sources.", id: "fast-track", toc: "Fast Track", lede: "At the counter, a payer enters the facility's payment number and the bill, then chooses where the money comes from: cashback, a 0% interest loan, M-Pesa or any mix." } %}

{% filter oneLine %}{% include "partials/jireh/split-collage.njk" %}{% endfilter %}

{% phones "Fast Track screens" %}
  {% phone { src: "/assets/images/projects/jh/counter-payment-no.png", alt: "Enter the facility's payment number JH·482·913; Cana Hospital, Outpatient Cashier and a 5% cashback rate are shown to confirm", step: "Step 1", title: "Simple ID", caption: "A payment no. identifies the hospital, counter and cashback rate." } %}
  {% phone { src: "/assets/images/projects/jh/counter-invoice.png", alt: "Invoice details: invoice number, who you are paying for, a KES 3,450 bill and a note that it could earn up to KES 173 cashback", step: "Step 2", title: "Demonstrate future value", caption: "A cashback estimate appears as soon as the amount is entered." } %}
  {% phone { src: "/assets/images/projects/jh/counter-split.png", alt: "Select how you want to pay: allocation bar full at KES 3,450 of 3,450, from a Jireh Medical Loan and cashback, with M-Pesa available to add", step: "Step 3", caption: "Each source can still be edited or removed." } %}
  {% phone { src: "/assets/images/projects/jh/counter-loan.png", alt: "Loan sheet: KES 1,600 remaining to allocate, KES 3,200 available to borrow, KES 80 cashback on repayment and a 30-day repayment period", step: "Step 4", title: "Borrow the gap", caption: "What's left to cover, and what repaying earns." } %}
  {% phone { src: "/assets/images/projects/jh/counter-review.png", alt: "Confirm payment: paying for Amina Otieno at Cana Hospital, KES 3,450, from KES 1,850 cashback and a KES 1,600 loan due 29 Oct", step: "Step 5", title: "Review in plain words"} %}
  {% phone { src: "/assets/images/projects/jh/counter-pin.png", alt: "PIN sheet over the payment summary, with Cancel and Confirm PIN buttons", step: "Step 6", title: "Confirm with a PIN", caption: "The sheet opens over the summary, so the bill stays in view." } %}
  {% phone { src: "/assets/images/projects/jh/counter-result.png", alt: "Transaction result: KES 3,450 paid to Cana Hospital, split into a KES 1,600 loan and KES 1,850 from the Care Fund, with a View receipt button", step: "Step 7", title: "Proof for the cashier", caption: "A large result the payer can turn around and show." } %}
{% endphones %}

{% chapter { label: "Every shilling is visible", title: "A simplified overview of your benefits.", id: "home", toc: "Home", lede: "Users hold two kinds of money with Jireh: cashback they've earned and credit they can borrow." } %}

{% annotated "The Home screen, section by section" %}
{% region { src: "/assets/images/projects/jh/home/nav.png", alt: "The Jireh Health logo, a Need help? link and a notification bell", w: 320, x: -16, edge: "first" } %}
{% region { src: "/assets/images/projects/jh/home/search.png", alt: "A search field reading Find care near me, with a Filter button", w: 290, x: 0, side: "l", note: "Answering the question ‘Where can we use Jireh Health?’" } %}
{% region { src: "/assets/images/projects/jh/home/balances.png", alt: "Cashback and Loans tabs above two cards. Cashback shows a balance of 3,250.00 with Redeem and Share buttons; Loans shows 4,000 to repay and 2,000 available to borrow, with Repay and Raise my limit buttons", w: 488, x: 0, side: "l", note: "Every shilling is visible, and each card has its own colour so you know which one you’re in." } %}
{% region { src: "/assets/images/projects/jh/home/promos.png", alt: "Discounts and Offers: 30% off consultation up to KES 100, and a vaccine discount up to KES 200", w: 428, x: -140, side: "r", note: "Highlighting partner discounts" } %}
{% region { src: "/assets/images/projects/jh/home/requests.png", alt: "Payment Requests: two pending requests, Kisima Diagnostic Centre for KES 600 and Cana Hospital for KES 500, each with Send Payment and delete buttons", w: 508, x: 0, side: "l", note: "Users can submit requests for paying out-of-network providers." } %}
{% region { src: "/assets/images/projects/jh/home/circle.png", alt: "Your Circle: four members and an add button, with a New! badge on one, and a note that John joined your Circle", w: 292, x: 0, side: "r", note: "All interactions from your Circle are immediately visible." } %}
{% region { src: "/assets/images/projects/jh/home/history.png", alt: "Payments History: a payment card showing cashback received, a loan repayment due in 5 days, and a Pay now button", w: 288, x: 0, side: "l", note: "Never miss a due date." } %}
{% region { src: "/assets/images/projects/jh/home/pinned.png", alt: "A Pay Medical Bill button pinned above the tab bar: Pay, Circle, Explore and Profile", w: 320, x: -16, edge: "last", side: "r", note: '“Pay Medical Bill” stays pinned above the tab bar.' } %}
{% endannotated %}

{% chapter { label: "Earn every request", title: "People share an ID or a PIN once they know why.", id: "onboarding", toc: "Onboarding", lede: "Identity checks come only when they're needed. The app routes by what's missing, not a fixed order, so leaving halfway always brings you back to the right step." } %}

{% phones "Onboarding screens" %}
  {% phone { src: "/assets/images/projects/jh/onboarding-phone.png", alt: "Enter your phone number: a Kenyan number field and a ticked checkbox agreeing to Jireh Health's Privacy Policy", step: "Clarity", caption: "Consent is a clear checkbox, not fine print." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-details.png", alt: "Fill in these details to match your National ID: first and last name (required), National ID number and how you heard about us", step: "Progressive disclosure", caption: "Only the name is required. The National ID step can be skipped until it's needed to pay." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-pin.png", alt: "Create your PIN: you will use this PIN to confirm all payments, with create and confirm PIN fields", step: "Clarity", title: "Create a PIN", caption: "Says what the PIN protects, then confirms it on the same screen." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-jireh-plus.png", alt: "Limit calculator: upgrade to access KES 1,500 as 0% interest medical loans, with four steps from checking your limit to a one-off KES 499 fee", step: "Ease in", title: "Unlock loans", caption: "Starts with the benefit you'd unlock, then the requirements to get there; four steps, with the fee last." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-permissions.png", alt: "Never miss an alert when you install the app: toggles for alerts, installing the app and sharing location, each with its benefit", step: "Trust your users", title: "Permissions", caption: "Each request says what it's for, and nothing is switched on until the payer chooses it." } %}
{% endphones %}

{% chapter { label: "One shared system", title: "Adapting an open-source icon system to fit our brand", id: "system", toc: "Design system", lede: "Starting from CRED's open-source NeoPop, I set a grid of my own and a foundation of base shapes, so every new icon starts from the same place." } %}

{% filter oneLine %}{% include "partials/jireh/system.njk" %}{% endfilter %}

{% chapter { label: "Outcome", title: "Results", id: "results", toc: "Results" } %}

These numbers belong to a team. I was its designer, working from the acceptance criteria that [Athman Gude](https://www.linkedin.com/in/athmangude/), our product manager, defined, through to handoff to engineering, with [Sheila Sharon](https://www.linkedin.com/in/devsheilasharon/) as the engineer and [Terach Franchi](https://www.linkedin.com/in/terachfranchi/) as CEO.

Reaching 1,800+ users across 4 facilities took business development and marketing as much as design: [Gloria Kerubo](https://www.linkedin.com/in/gloria-kerubo-2b9a88312/) helped bring in users and new partners, and [Helina Mbuthia Muhia](https://www.linkedin.com/in/helina-mbuthia-muhia-99b087166/) worked in marketing.

<div class="panel">
<div class="pj-row pj-row--4" data-count>
  <div class="stat-card">
    <span class="label label--accent">Reach</span>
    <p class="stat-card__value">1,800+ users</p>
    <p class="caption">Served across 4 facilities</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Sign-up time</span>
    <p class="stat-card__value">5.2 → 2.1 min</p>
    <p class="caption">Median completion time after the onboarding redesign, down 59%</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">New surfaces</span>
    <p class="stat-card__value">80+ each</p>
    <p class="caption">Monthly active users on Discovery/Explore and the Profile Hub within four months of launch</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Platform</span>
    <p class="stat-card__value">396 → 770</p>
    <p class="caption">Monthly active users over the same four months</p>
  </div>
</div>
</div>

<blockquote class="pull-quote">The strength of the team is each individual member. The strength of each member is the team.<cite>Phil Jackson</cite></blockquote>

</div>
