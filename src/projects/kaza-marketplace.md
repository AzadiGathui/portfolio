---
title: "Kaza: Home Services Marketplace"
tagline: Connecting Kenyan homeowners to trusted service providers
client: Kaza Technologies Ltd.
industry: Home Services
role: Lead Product Designer
deliverables: UX Research, Interaction Design, Prototyping
order: 3
published: false
coverImage: https://placehold.co/1440x700/111111/e6e6e6?text=Kaza+Cover
thumbnail: https://placehold.co/400x300/1a1a1a/e6e6e6?text=Kaza
ogImage: https://placehold.co/1200x630/1a1a1a/e6e6e6?text=Kaza
description: "A marketplace connecting Kenyan homeowners to vetted home service providers: plumbers, electricians, cleaners, and more."
permalink: /projects/kaza-marketplace/
---

<h2 id="overview">Overview</h2>

<div class="article-body">
<p>Kaza is an on-demand home services platform built for the Kenyan market, designed to remove the friction between homeowners who need reliable help and skilled artisans who struggle to find steady work. The platform needed to build trust on both sides of the marketplace while accounting for the realities of low-bandwidth environments and feature-phone crossover use cases.</p>
<p>I led end-to-end product design across a 14-week engagement: from research and synthesis through to a high-fidelity prototype handed off to engineering.</p>
</div>

<div class="pj-row">
  <div class="stat-card">
    <span class="label label--accent">Timeline</span>
    <p class="stat-card__value">14 weeks</p>
    <p class="caption">Oct 2024 – Jan 2025</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Team</span>
    <p class="stat-card__value">5 people</p>
    <p class="caption">1 designer, 2 engineers, 1 PM, 1 researcher</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Platform</span>
    <p class="stat-card__value">Mobile-first</p>
    <p class="caption">Android + Progressive Web App</p>
  </div>
</div>

<h2 id="research">Research & Discovery</h2>

<span class="label label--accent">Research methods</span>

<div class="article-body">
<p>We conducted 18 in-depth interviews split evenly across two user groups: homeowners in Nairobi's middle-income estates and independent artisans operating through word-of-mouth networks. Sessions were conducted in Swahili and English, recorded with consent, and synthesised through affinity mapping. We supplemented qualitative findings with a competitive audit of 6 existing platforms operating in Sub-Saharan Africa.</p>
</div>

<div class="pj-reel">
  <img src="https://placehold.co/600x400/222222/e6e6e6?text=Affinity+Map" alt="Affinity mapping session">
  <img src="https://placehold.co/600x400/222222/e6e6e6?text=Interview+Notes" alt="Interview notes synthesis">
  <img src="https://placehold.co/600x400/222222/e6e6e6?text=Competitive+Audit" alt="Competitive audit matrix">
  <img src="https://placehold.co/600x400/222222/e6e6e6?text=User+Journey+Map" alt="User journey map">
</div>

<details class="expandable">
  <summary class="expandable__trigger">Key interview insights</summary>
  <div class="expandable__body">
    <div class="pj-text">
      <p><strong>Homeowners:</strong> The biggest barrier to booking home services was not price; it was fear of letting an unknown person into their home. Trust signals (verified ID, reviews, repeat bookings) were consistently cited as would-be deciding factors.</p>
      <p><strong>Artisans:</strong> Most skilled workers had smartphones but rarely used data-heavy apps. They relied on WhatsApp referral chains and personal networks. The idea of a formal booking system was initially met with skepticism: "what if I get a job far away and the app doesn't tell me the fare?"</p>
      <p><strong>Shared pain point:</strong> Both groups described the current process as a "trust lottery", with no accountability on either side once money changed hands.</p>
    </div>
  </div>
</details>

<h2 id="problem">Problem Definition</h2>

<div class="article-body">
<p>After synthesis, we reframed the challenge away from "how do we build a marketplace?" toward a more precise problem statement rooted in the trust deficit we kept encountering. The platform couldn't succeed by simply listing service providers; it needed to make trust legible and transferable at every touchpoint.</p>
</div>

<blockquote class="pull-quote">
  "I know a good plumber, but he's my plumber. I can't give him to an app."
  <cite>Homeowner, Karen estate, Nairobi</cite>
</blockquote>

<div class="pj-row">
  <figure>
    <img src="https://placehold.co/600x380/222222/e6e6e6?text=Problem+Framing" alt="Problem framing diagram">
    <figcaption>HMW statements generated from research synthesis across three opportunity areas: trust, logistics, and payment.</figcaption>
  </figure>
  <figure>
    <img src="https://placehold.co/600x380/2a2a2a/e6e6e6?text=Jobs+to+Be+Done" alt="Jobs to be done framework">
    <figcaption>JTBD framework applied to both sides of the marketplace, with homeowner and artisan jobs mapped in parallel.</figcaption>
  </figure>
</div>

<h2 id="ideation">Ideation & Concepts</h2>

<div class="article-body">
<p>Working from our "How Might We" statements, the team ran two structured design sprints. The first sprint focused on trust-building mechanics (the verification and review system). The second focused on the booking flow, specifically how to make scheduling feel lightweight on a slow mobile connection. We generated over 60 concepts before narrowing to three testable prototypes.</p>
</div>

<div class="pj-row">
  <img src="https://placehold.co/600x420/222222/e6e6e6?text=Wireframe+Home" alt="Homepage wireframe">
  <img src="https://placehold.co/600x420/222222/e6e6e6?text=Wireframe+Search" alt="Search flow wireframe">
  <img src="https://placehold.co/600x420/222222/e6e6e6?text=Wireframe+Profile" alt="Provider profile wireframe">
  <img src="https://placehold.co/600x420/222222/e6e6e6?text=Wireframe+Booking" alt="Booking flow wireframe">
</div>

<details class="expandable">
  <summary class="expandable__trigger">Key design decisions</summary>
  <div class="expandable__body">
    <div class="pj-text">
      <p><strong>Verified badge system:</strong> We explored 4 different trust signal patterns before settling on a tiered badge approach: Basic (phone verified), Verified (ID + background check), and Pro (50+ completed jobs). Testing showed users responded more to social proof (job count) than official-looking credentials.</p>
      <p><strong>Offline-tolerant booking:</strong> The booking confirmation was redesigned to queue locally and sync when data returned, a critical change after testing revealed 40% of target users experienced dropped connections mid-flow.</p>
      <p><strong>Flat rate quoting:</strong> An early concept for dynamic pricing was dropped after artisans expressed concern it would undercut their ability to negotiate. We replaced it with transparent flat rates set by the provider with a "request custom quote" escape hatch.</p>
    </div>
  </div>
</details>

<h2 id="solution">The Solution</h2>

<div class="article-body">
<p>The final design delivered a two-sided marketplace with distinct but mirrored experiences. Homeowners get a clean browse-and-book flow surfacing verified providers nearby, with real-time status updates via SMS fallback. Artisans get a lightweight job management dashboard optimised for single-thumb use on entry-level Android devices. A shared rating system closes the trust loop after every completed job.</p>
</div>

<div class="pj-row">
  <img src="https://placehold.co/600x500/1a1a1a/e6e6e6?text=Home+Screen" alt="Home screen mockup">
  <img src="https://placehold.co/600x500/1a1a1a/e6e6e6?text=Provider+Profile" alt="Provider profile mockup">
  <img src="https://placehold.co/600x500/1a1a1a/e6e6e6?text=Booking+Confirmation" alt="Booking confirmation mockup">
</div>

<div class="pj-reel">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Onboarding+1" alt="Onboarding screen 1">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Onboarding+2" alt="Onboarding screen 2">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Browse+Services" alt="Browse services screen">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Book+Provider" alt="Book provider screen">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Job+Tracker" alt="Job tracker screen">
  <img src="https://placehold.co/400x700/111111/e6e6e6?text=Review+Flow" alt="Review flow screen">
</div>

<h2 id="outcomes">Outcomes & Impact</h2>

<div class="article-body">
<p>The prototype was validated through two rounds of usability testing with 12 participants. The revised booking flow reduced average task completion time from 4m 12s to 1m 47s. Following a closed beta with 200 homeowners and 85 artisans in Westlands and Kilimani, Kaza reported a 73% rebooking rate within the first 30 days, exceeding the 40% target set at project kickoff.</p>
</div>

<div class="pj-row">
  <div class="stat-card">
    <span class="label label--accent">Task completion</span>
    <p class="stat-card__value">↓ 57%</p>
    <p class="caption">Reduction in booking flow time</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Rebooking rate</span>
    <p class="stat-card__value">73%</p>
    <p class="caption">Within first 30 days of beta</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">User satisfaction</span>
    <p class="stat-card__value">4.6/5</p>
    <p class="caption">Average post-task usability score</p>
  </div>
</div>
