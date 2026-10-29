---
title: Accessible healthcare financing
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
  - name: Athman Gude
    role: Product manager
    url: https://www.linkedin.com/in/athmangude/
  - name: Sheila Sharon
    role: Engineer
    url: https://www.linkedin.com/in/devsheilasharon/
  - name: Helina Mbuthia Muhia
    role: Marketing
    url: https://www.linkedin.com/in/helina-mbuthia-muhia-99b087166/
  - name: Gloria Kerubo
    role: Business development
    url: https://www.linkedin.com/in/gloria-kerubo-2b9a88312/
order: 1
coverImage: /assets/images/projects/jh/cover.jpg
coverPosition: 50% 20%
mockupImage: /assets/images/projects/jh/home-cashback.png
thumbnail: /assets/images/projects/jh/thumbnail.png
thumbnailKind: phone
ogImage: /assets/images/projects/jh/home-cashback.png
description: UX research and design for Jireh, a mobile-first web app where Kenyan pay medical bills with M-Pesa, cashback and 0% interest loans backed by people they trust.
permalink: /projects/jireh-health/
---

<div class="article-body">

<h2 id="overview">Tuning informal support into structure</h2>

Most people in Kenya pay for care the moment they receive it: at a hospital counter, often for someone else, often with less on M-Pesa than the invoice says. The gap is covered by phone calls to family and by borrowing on terms nobody has time to read.

Jireh turns that informal support into structure; and my job was to make that feel as simple as sending money on M-Pesa, the bar every Kenyan user compares us to.

Four constraints shaped every screen:
- Screens had to load fast and survive a dropped connection mid-payment to account for **3G and low-end Android.**
- Every request for a National ID, selfie or PIN had to explain itself.
- The default journey is **paying for someone else.**
- Heavy screens and downloads cost users before we'd **earned their trust.**

<h2 id="principles">Principles</h2>

- **Every shilling is visible.**
- **One decision per screen.**
- **Never lose progress** on a multi-step flow.
- A **shared design system**, so no screen builds its own layout.

<h2 id="fast-track">One bill can be split across several sources at the counter</h2>

{% phones "Fast Track screens" %}
  {% phone { src: "/assets/images/projects/jh/counter-payment-no.png", alt: "Enter the facility's payment number JH·482·913; Cana Hospital, Outpatient Cashier and a 5% cashback rate are shown to confirm", step: "Step 1", title: "Simple ID", caption: "A payment no. identifies the hospital, counter and cashback rate." } %}
  {% phone { src: "/assets/images/projects/jh/counter-invoice.png", alt: "Invoice details: invoice number, who you are paying for, a KES 3,450 bill and a note that it could earn up to KES 173 cashback", step: "Step 2", title: "Demonstrate future value", caption: "A cashback estimate appears as soon as the amount is entered." } %}
  {% phone { src: "/assets/images/projects/jh/counter-split.png", alt: "Select how you want to pay: allocation bar full at KES 3,450 of 3,450, from a Jireh Medical Loan and cashback, with M-Pesa available to add", step: "Step 3", caption: "Each source can still be edited or removed." } %}
  {% phone { src: "/assets/images/projects/jh/counter-loan.png", alt: "Loan sheet: KES 1,600 remaining to allocate, KES 3,200 available to borrow, KES 80 cashback on repayment and a 30-day repayment period", step: "Step 4", title: "Borrow the gap", caption: "What's left to cover, and what repaying earns." } %}
  {% phone { src: "/assets/images/projects/jh/counter-review.png", alt: "Confirm payment: paying for Amina Otieno at Cana Hospital, KES 3,450, from KES 1,850 cashback and a KES 1,600 loan due 29 Oct", step: "Step 5", title: "Review in plain words"} %}
  {% phone { src: "/assets/images/projects/jh/counter-pin.png", alt: "PIN sheet over the payment summary, with Cancel and Confirm PIN buttons", step: "Step 4", title: "Confirm with a PIN", caption: "The sheet opens over the summary, so the bill stays in view." } %}
  {% phone { src: "/assets/images/projects/jh/counter-result.png", alt: "Transaction result: KES 3,450 paid to Cana Hospital, split into a KES 1,600 loan and KES 1,850 from the Care Fund, with a View receipt button", step: "Step 6", title: "Proof for the cashier", caption: "A large result the payer can turn around and show." } %}
{% endphones %}

<h2 id="home">A simplified overview of your benefits</h2>

Users hold two kinds of money with Jireh: cashback they've earned and credit they can borrow.
- Each card has its own colour, so people know which one they're in without reading.
- "Pay Medical Bill" is always pinned above the tab bar for easy access.

{% phones "Home screens" %}
  {% phone { src: "/assets/images/projects/jh/home-cashback.png", alt: "Home with the Cashback card selected: KES 3,200 cashback earned, Redeem and Share buttons, and discounts and offers below", title: "Cashback", caption: "What's been earned and what you can do with it i.e. Redeem and Share." } %}
  {% phone { src: "/assets/images/projects/jh/home-loans.png", alt: "Home with the Loans card selected: KES 1,600 available to borrow, Raise my limit and Repay buttons", title: "Loans", caption: "What's available to borrow." } %}
{% endphones %}

<h2 id="circle">A Circle of relatives and friends backs a small interest-free credit line</h2>

The hard part was explaining shared responsibility without sounding like a debt collector.
A Circle holds two kinds of people:
- **Circle members** are adults you trust to repay:
	- two of them unlock borrowing
	- the only people who receive an invite to join your Circle
- **Dependants**, such as children and elderly parents, are people whose medical bills you manage. You add them by name and can pay for them straight away, and they never take on any of the risk.

{% phones "Circle screens" %}
  {% phone { src: "/assets/images/projects/jh/circle-home.png", alt: "My Jireh Circle: the user's photo at the centre with four Circle members around them, and a Dependants row below", title: "Your Circle", caption: "Members drawn around you to visualise a 'circle of support' with 1:1 relationships." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-member.png", alt: "Add to your Circle: first and last name, a phone number that will receive the invite, relationship, and a choice of custom SMS or voice note", title: "Invite members only", caption: "...by SMS or voice note." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-dependant.png", alt: "Add a dependant: anyone whose medical bills you manage, such as children and elderly parents, with name and relationship only", title: "Pay for your dependants, no invite needed" } %}
  {% phone { src: "/assets/images/projects/jh/circle-how-it-works.png", alt: "How Circles work: grow together with people you trust, what a complete Circle unlocks, then the shared risk", title: "Benefit before risk", caption: "What a complete Circle unlocks, then the shared risk, before anyone is invited." } %}
{% endphones %}

<blockquote class="pull-quote">Designing the Circle meant designing around trust between people, as much as trust in the product.</blockquote>

<h2 id="onboarding">People take a PIN more seriously when they know what it protects.</h2>

Identity checks come only when they're needed:
- national ID step can be skipped until needed
- the app routes by what's missing rather than a fixed order
- leaving halfway always brings you back to the right step.
- each request say what it's for, and nothing is switched on until the payer chooses it.

{% phones "Onboarding screens" %}
  {% phone { src: "/assets/images/projects/jh/onboarding-phone.png", alt: "Enter your phone number: a Kenyan number field and a ticked checkbox agreeing to Jireh Health's Privacy Policy", step: "Clarity", caption: "Consent is a clear checkbox, not fine print." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-details.png", alt: "Fill in these details to match your National ID: first and last name (required), National ID number and how you heard about us", step: "Progressive disclosure", caption: "Only the name is required; the ID number is needed only to pay." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-pin.png", alt: "Create your PIN: you will use this PIN to confirm all payments, with create and confirm PIN fields", step: "Clarity", title: "Create a PIN", caption: "Says what the PIN protects, then confirms it on the same screen." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-jireh-plus.png", alt: "Limit calculator: upgrade to access KES 1,500 as 0% interest medical loans, with four steps from checking your limit to a one-off KES 499 fee", step: "Ease in", title: "Unlock loans", caption: "Starts with the benefit you'd unlock, then the requirements to get there; four steps, with the fee last." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-permissions.png", alt: "Never miss an alert when you install the app: toggles for alerts, installing the app and sharing location, each with its benefit", step: "Trust your users", title: "Permissions", caption: "Each switch says what it's for, and all start off." } %}
{% endphones %}

<h2 id="ask-jireh">Ask Jireh</h2>

The newest feature is an AI assistant, answering questions about payments, loan limits, Circles, cashback, and points people to nearby facilities.
- Before the first chat, the user is asked to accept the AI chat terms, with Decline being just as easy.
- After that, the chat opens by name with suggested topics, so **nobody faces an empty box**
- Past chats are one tap away and never deleted.
- Wellness answers carry a fixed disclaimer.

{% phones "Ask Jireh screens" %}
  {% phone { src: "/assets/images/projects/jh/ask-consent.png", alt: "Accept AI chat terms: a checkbox agreeing to Ask Jireh Health's Terms of Service and Privacy Policy, with Decline and Accept and continue buttons" } %}
  {% phone { src: "/assets/images/projects/jh/ask-home.png", alt: "Ask Jireh: a greeting that invites questions about your health records, a message box, suggested topics such as paying a bill and 0% interest loans, and a link to past chats", title: "Ask anything", caption: "Suggested topics for a first question, and past chats one tap away." } %}
  {% phone { src: "/assets/images/projects/jh/ask-home.png", alt: "-", title: "Preserving context", caption: "Many users first hear from Jireh by SMS, so links in those messages open the chat with the SMS already shown." } %}
{% endphones %}

<h2 id="testing">Testing with patients</h2>

To test in person, I split the client app off into a standalone prototype. It runs in the browser on fake data and uses the same components as production, so what people test is what ships. A facilitator panel can drop a participant at any point in the journey (before their name, before ID, fully onboarded) and reset between sessions.

<h2 id="results">Results</h2>

These numbers belong to a team. I was its designer, working from the acceptance criteria that [Athman Gude](https://www.linkedin.com/in/athmangude/), our product manager, defined, through to handoff to engineering, with [Sheila Sharon](https://www.linkedin.com/in/devsheilasharon/) as the engineer and [Terach Franchi](https://www.linkedin.com/in/terachfranchi/) as CEO.

Reaching 1,800+ users across 4 facilities took business development and marketing as much as design: [Gloria Kerubo](https://www.linkedin.com/in/gloria-kerubo-2b9a88312/) helped bring in users and new partners, and [Helina Mbuthia Muhia](https://www.linkedin.com/in/helina-mbuthia-muhia-99b087166/) worked in marketing.

<div class="pj-row">
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

<blockquote class="pull-quote">The strength of the team is each individual member. The strength of each member is the team.</blockquote> - Phil Jackson

</div>
