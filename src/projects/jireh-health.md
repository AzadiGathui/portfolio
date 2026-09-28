---
title: Accessible healthcare financing
tagline: Mobile web app research & design
client: Jireh Innovations Ltd.
industry: Healthcare Fintech
role: UX Researcher & Designer
timeline: Sept 2024 – present
platform: Installable web app (PWA), Android first
deliverables: B2C web app, B2B admin dashboards, user research & usability testing
order: 7
coverImage: /assets/images/projects/jh/cover.jpg
coverPosition: 50% 20%
mockupImage: /assets/images/projects/jh/home-cashback.png
mockupFrame: phone
thumbnail: /assets/images/projects/jh/thumbnail.png
ogImage: /assets/images/projects/jh/home-cashback.png
description: UX research and design for Jireh, a mobile-first web app where Kenyan patients pay medical bills with M-Pesa, cashback and 0% interest loans backed by people they trust.
permalink: /projects/jireh-health/
---

<div class="article-body">

<h2 id="overview">Overview</h2>

Most people in Kenya pay for care the moment they receive it: at a hospital counter, often for someone else, often with less on M-Pesa than the invoice says. The gap is covered by phone calls to family and by borrowing on terms nobody has time to read.

Jireh turns that informal support into structure. A **Circle** of relatives and friends backs a small interest-free credit line, **cashback** builds up from every payment, and **one payment flow** lets patients mix these sources at the counter. My job was to make that feel as simple as sending money on M-Pesa, the bar every Kenyan user compares us to.

Four constraints shaped every screen:

- **3G and low-end Android.** Screens had to load fast and survive a dropped connection mid-payment.
- **Money, ID and health in one app.** Every request for a National ID, selfie or PIN had to explain itself.
- **Paying for someone else.** The payer and the patient are separate throughout.
- **Data costs money.** Heavy screens and surprise downloads cost users before we'd earned their trust.

<h2 id="principles">Principles</h2>

- **Every shilling is visible.** Amounts always show the currency and use tabular figures. During a payment, allocated vs. owed is always on screen.
- **One decision per screen.** Long flows are split into steps, each with one question and one primary action within thumb reach.
- **Money moves only on a PIN.** The PIN sheet opens over the payment summary, so who is being paid and how much stay in view.
- **Never lose progress.** Multi-step forms save as people type, so a refresh or a dropped connection resumes where they were.

A shared design system holds these rules in place across more than a hundred screens: semantic colour tokens, one heading ramp, and three page shells (journey, sign-in and status), so no screen builds its own chrome.

<h2 id="fast-track">Paying at the counter</h2>

Fast Track happens in the most stressful place: a queue at a hospital cashier. Each partner facility shows a payment number at its counter, or the patient can search for the hospital instead. Entering it brings up the hospital, the desk and the cashback rate before any money is involved; then the patient adds the invoice, the amount and who they're paying for.

The wallet step is where Jireh differs from a checkout page: **one bill can be split across several sources**, and a bar fills as the patient allocates. The loan drawer shows what's left to cover, asks for a repayment period and states the cashback earned on repaying, so the loan becomes something to plan around. After submitting, the app always lands on the status screen, so a nervous second tap can't pay twice.

{% phones "Fast Track screens" %}
  {% phone { src: "/assets/images/projects/jh/counter-payment-no.png", alt: "Enter the facility's payment number JH·482·913; Cana Hospital, Outpatient Cashier and a 5% cashback rate are shown to confirm", step: "Step 1", title: "Find the counter", caption: "The payment number brings up the hospital, desk and cashback rate first." } %}
  {% phone { src: "/assets/images/projects/jh/counter-invoice.png", alt: "Invoice details: invoice number, who you are paying for, a KES 3,450 bill and a note that it could earn up to KES 173 cashback", step: "Step 2", title: "Invoice and patient", caption: "A cashback estimate appears as soon as the amount is entered." } %}
  {% phone { src: "/assets/images/projects/jh/counter-loan.png", alt: "Loan sheet: KES 1,600 remaining to allocate, KES 3,200 available to borrow, KES 80 cashback on repayment and a 30-day repayment period", step: "Step 3", title: "Borrow the gap", caption: "What's left to cover, and what repaying earns." } %}
  {% phone { src: "/assets/images/projects/jh/counter-split.png", alt: "Select how you want to pay: allocation bar full at KES 3,450 of 3,450, from a Jireh Medical Loan and cashback, with M-Pesa available to add", step: "Step 3", title: "Fully allocated", caption: "Each source can still be edited or removed." } %}
  {% phone { src: "/assets/images/projects/jh/counter-review.png", alt: "Confirm payment: paying for Amina Otieno at Cana Hospital, KES 3,450, from KES 1,850 cashback and a KES 1,600 loan due 29 Oct", step: "Step 4", title: "Review in plain words", caption: "“I am paying for… I am paying at…”, and no transaction fees." } %}
  {% phone { src: "/assets/images/projects/jh/counter-pin.png", alt: "PIN sheet over the payment summary, with Cancel and Confirm PIN buttons", step: "Step 4", title: "Confirm with a PIN", caption: "The sheet opens over the summary, so the bill stays in view." } %}
  {% phone { src: "/assets/images/projects/jh/counter-result.png", alt: "Transaction result: KES 3,450 paid to Cana Hospital, split into a KES 1,600 loan and KES 1,850 from the Care Fund, with a View receipt button", step: "Step 5", title: "Proof for the cashier", caption: "A large result the patient can turn around and show." } %}
{% endphones %}

<h2 id="home">Home</h2>

Patients hold two kinds of money with Jireh: cashback they've earned and credit they can borrow. Home shows both as cards side by side, with a toggle to switch between them, and each card has its own colour (purple for cashback, teal for loans), so people know which one they're in without reading. The next step sits directly under each balance, and "Pay Medical Bill" is always pinned above the tab bar.

{% phones "Home screens" %}
  {% phone { src: "/assets/images/projects/jh/home-cashback.png", alt: "Home with the Cashback card selected: KES 3,200 cashback earned, Redeem and Share buttons, and discounts and offers below", title: "Cashback", caption: "What's been earned, with Redeem and Share right under it." } %}
  {% phone { src: "/assets/images/projects/jh/home-loans.png", alt: "Home with the Loans card selected: KES 1,600 available to borrow, Raise my limit and Repay buttons", title: "Loans", caption: "What's available to borrow, with Raise my limit and Repay." } %}
{% endphones %}

<h2 id="circle">Circle</h2>

A Jireh loan is backed by a Circle, not a credit score. The hard part was explaining shared responsibility without sounding like a debt collector. The Circle screen draws people around you rather than listing them, and the explainer leads with what you get before the shared risk.

A Circle holds two kinds of people. **Circle members** are adults you trust to repay: two of them unlock borrowing, and they are the only people who receive an invite, as a custom SMS or a recorded voice note for anyone without a data bundle. **Dependants**, such as children and elderly parents, are people whose medical bills you manage. You add them by name and can pay for them straight away, and they never receive an invite or take on any of the risk.

{% phones "Circle screens" %}
  {% phone { src: "/assets/images/projects/jh/circle-home.png", alt: "My Jireh Circle: the user's photo at the centre with four Circle members around them, and a Dependants row below", title: "Your Circle", caption: "Members drawn around you, with your dependants below." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-member.png", alt: "Add to your Circle: first and last name, a phone number that will receive the invite, relationship, and a choice of custom SMS or voice note", title: "Invites go to members only", caption: "Only Circle members get an invite, by SMS or voice note. Anyone else you pay for is added as a dependant." } %}
  {% phone { src: "/assets/images/projects/jh/circle-add-dependant.png", alt: "Add a dependant: anyone whose medical bills you manage, such as children and elderly parents, with name and relationship only", title: "Pay for others, no invite", caption: "A name and a relationship; nothing is sent to them." } %}
  {% phone { src: "/assets/images/projects/jh/circle-how-it-works.png", alt: "How Circles work: grow together with people you trust, what a complete Circle unlocks, then the shared risk", title: "Benefit before risk", caption: "What a complete Circle unlocks, then the shared risk, before anyone is invited." } %}
{% endphones %}

<blockquote class="pull-quote">Designing the Circle meant designing around trust between people, as much as trust in the product.</blockquote>

<h2 id="onboarding">Onboarding</h2>

Sign-up has no password: a phone number, an SMS code, your name as it appears on your ID, then a PIN. The PIN screen says what it's for, because people take a PIN more seriously when they know what it protects.

Identity checks come only when they're needed. The National ID step can be skipped, and the app routes by what's missing rather than a fixed order, so leaving halfway always brings you back to the right step. Unlocking loans turns the remaining requirements into a checklist that ticks off over time, and a failed selfie match goes to a person for review instead of a dead end. Permissions follow the same rule: alerts, installing the app and sharing location each say what they're for, and nothing is switched on until the patient chooses it.

{% phones "Onboarding screens" %}
  {% phone { src: "/assets/images/projects/jh/onboarding-phone.png", alt: "Enter your phone number: a Kenyan number field and a ticked checkbox agreeing to Jireh Health's Privacy Policy", step: "Step 1", title: "Phone number", caption: "Consent is a clear checkbox, not fine print." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-otp.png", alt: "Enter your One-Time-PIN: six code boxes, a link to change the phone number and a resend countdown", step: "Step 2", title: "SMS code", caption: "The number it was sent to, a way to change it, and a resend timer." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-details.png", alt: "Fill in these details to match your National ID: first and last name (required), National ID number and how you heard about us", step: "Step 3", title: "Details as on your ID", caption: "Only the name is required; the ID number is needed only to pay." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-pin.png", alt: "Create your PIN: you will use this PIN to confirm all payments, with create and confirm PIN fields", step: "Step 4", title: "Create a PIN", caption: "Says what the PIN protects, then confirms it on the same screen." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-jireh-plus.png", alt: "Limit calculator: upgrade to access KES 1,500 as 0% interest medical loans, with four steps from checking your limit to a one-off KES 499 fee", step: "Later", title: "Unlock loans", caption: "Starts with the limit you'd unlock; four steps, with the fee last." } %}
  {% phone { src: "/assets/images/projects/jh/onboarding-permissions.png", alt: "Never miss an alert when you install the app: toggles for alerts, installing the app and sharing location, each with its benefit", step: "Later", title: "Permissions", caption: "Each switch says what it's for, and all start off." } %}
{% endphones %}

<h2 id="invoice">Paying from an invoice</h2>

Not every bill is paid in person, or at a facility in the Jireh network. The invoice route names its three steps up front: the facility's payment details, a photo of the bill, then how to pay. Patients can upload several pages at once, and consent for Jireh to use their medical data is asked right beside the upload it covers. While the invoice is checked, the screen says how long it takes and what comes next, instead of showing a spinner. On the review screen every detail has its own edit button, so a wrong amount or Paybill is fixed in place. Repaying is just as calm: Paybill and account numbers have copy buttons, and an overdue loan is one clear state with one action.

{% phones "Invoice and repayment screens" %}
  {% phone { src: "/assets/images/projects/jh/invoice-how-to-pay.png", alt: "How to pay: three steps to pay at a care provider, fill in facility details, upload a photo of your invoice, and choose how you want to pay", title: "What's about to happen", caption: "Three steps named before the first one starts." } %}
  {% phone { src: "/assets/images/projects/jh/invoice-facility.png", alt: "Facility details: facility type, the care provider's phone number, M-Pesa account type, Paybill number and an optional account number", step: "Step 1", title: "The facility's details", caption: "Paybill and account number, with the account field only when it's needed." } %}
  {% phone { src: "/assets/images/projects/jh/invoice-upload.png", alt: "Upload invoice: three uploaded invoice pages, an Add a photo button and a consent checkbox for Jireh to use medical data", step: "Step 2", title: "Upload", caption: "Several pages at once, with consent for medical data right beside them." } %}
  {% phone { src: "/assets/images/projects/jh/invoice-processing.png", alt: "Processing your invoice: an update expected in 15 minutes, with the next step, confirm invoice details", title: "Processing, not a spinner", caption: "How long it takes, and what comes next." } %}
  {% phone { src: "/assets/images/projects/jh/invoice-review.png", alt: "Review invoice details: the invoice pages, who you are paying for, the facility, the total bill and the M-Pesa payment details, each with an edit button", step: "Step 3", title: "Review and confirm", caption: "Every detail can be edited in place before choosing how to pay." } %}
  {% phone { src: "/assets/images/projects/jh/loans.webp", alt: "All loans with total to repay, Paybill number and account number with copy buttons", title: "Repaying", caption: "Copy buttons for the Paybill and account numbers." } %}
  {% phone { src: "/assets/images/projects/jh/loan-detail.webp", alt: "Loan details with repaid vs total and an overdue warning with a repay button", title: "Overdue, calmly", caption: "A clear state and one action, without alarm-red screens." } %}
{% endphones %}

<h2 id="ask-jireh">Ask Jireh</h2>

The newest feature is an assistant in the centre of the tab bar. It answers questions about payments, loan limits, Circles and cashback, and points people to nearby facilities. Before the first chat, a sheet asks the patient to accept the AI chat terms, with Decline as a full-size choice beside Accept. After that, the chat opens by name with suggested topics, so nobody faces an empty box, and past chats are one tap away. Wellness answers carry a fixed disclaimer, and when someone types too fast it says so plainly: *"Give me a moment, you have been chatting fast."* Many patients first hear from Jireh by SMS, so links in those messages open the chat with the SMS already shown.

{% phones "Ask Jireh screens" %}
  {% phone { src: "/assets/images/projects/jh/ask-consent.png", alt: "Accept AI chat terms: a checkbox agreeing to Ask Jireh Health's Terms of Service and Privacy Policy, with Decline and Accept and continue buttons", title: "Consent first", caption: "The terms are agreed with a checkbox, and declining is just as easy." } %}
  {% phone { src: "/assets/images/projects/jh/ask-home.png", alt: "Ask Jireh: a greeting that invites questions about your health records, a message box, suggested topics such as paying a bill and 0% interest loans, and a link to past chats", title: "Ask anything", caption: "Suggested topics for a first question, and past chats one tap away." } %}
{% endphones %}

<h2 id="testing">Testing with patients</h2>

To test in person, I split the patient app off into a standalone prototype. It runs in the browser on fake data and uses the same components as production, so what people test is what ships. A facilitator panel can drop a participant at any point in the journey (before their name, before ID, fully onboarded) and reset between sessions.

</div>
