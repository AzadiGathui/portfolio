---
title: "Predicting Threat Status for Kenya's Data Deficient Species"
tagline: Machine learning for biodiversity conservation
client: Zindua School (Academic Project)
industry: Conservation / Data Science
role: Data Scientist
deliverables: Data wrangling pipeline, exploratory analysis, Random Forest classification model, species-level predictions
order: 6
coverImage: /assets/images/projects/iucn/eda_category_distribution.png
thumbnail: /assets/images/projects/iucn/model_kenya_by_class.png
ogImage: /assets/images/projects/iucn/model_kenya_by_class.png
description: A machine learning project predicting IUCN Red List threat categories for Kenya's 335 Data Deficient species using Random Forest classification trained on 35,000+ species.
permalink: /projects/iucn-dd-species/
---

<div class="article-body">

<h2 id="overview">Overview</h2>

The <a href="https://www.iucnredlist.org/" target="_blank" rel="noopener">IUCN Red List</a> is the world's most comprehensive inventory of species' conservation status. It classifies species from **Least Concern** through to **Extinct** — but a critical subset are labelled **Data Deficient (DD)**: species where available information is too poor to even assign a threat category.

This is not a safe status. A DD classification often reflects under-resourced field research rather than genuine absence of threat. Left unaddressed, these species fall through the cracks of conservation policy.

<figure>
  <img src="/assets/images/projects/iucn/eda_category_distribution.png" alt="Distribution of IUCN Red List categories across all 39,024 species in the dataset">
  <figcaption>Distribution of IUCN Red List categories. Least Concern dominates, while Data Deficient (far right) represents 9.3% of the dataset — species with insufficient information to classify.</figcaption>
</figure>

**The goal:** Train a classification model on species with known threat status, then use it to predict whether Kenya's 335 Data Deficient species are likely to be Threatened or Non-Threatened — surfacing candidates for urgent field research.

---

<h2 id="the-dataset">The Dataset</h2>

Data was sourced from the IUCN Red List bulk download, comprising **8 CSV files** covering different aspects of species records:

<table>
  <thead><tr><th>File</th><th>Rows</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>simple_summary</td><td>41,949</td><td>Core taxonomy, Red List category, population trend</td></tr>
    <tr><td>all_other_fields</td><td>41,949</td><td>Extended metadata fields</td></tr>
    <tr><td>habitats</td><td>109,594</td><td>Habitat type associations per species</td></tr>
    <tr><td>threats</td><td>88,999</td><td>Threat codes and stresses per species</td></tr>
    <tr><td>research_needed</td><td>82,263</td><td>Research priority codes</td></tr>
    <tr><td>conservation_needed</td><td>50,414</td><td>Conservation action codes</td></tr>
    <tr><td>usetrade</td><td>18,524</td><td>Human use and trade records</td></tr>
    <tr><td>countries</td><td>431,396</td><td>Country-level occurrence records</td></tr>
  </tbody>
</table>

### Missingness & Deduplication

Before analysis, the data needed cleaning. Initial inspection revealed significant missing values across several fields.

<figure>
  <img src="/assets/images/projects/iucn/initial_missingness.png" alt="Missingness matrix showing gaps across fields before cleaning">
  <figcaption>Initial missingness matrix. Several fields — including population trend, habitat associations, and threat data — have substantial gaps, particularly for Data Deficient species.</figcaption>
</figure>

The primary join key (`internalTaxonId`) had **2,925 duplicated rows**, retained as first occurrences and removed. After deduplication:

<figure>
  <img src="/assets/images/projects/iucn/resolved_missingness.png" alt="Missingness matrix after cleaning and deduplication">
  <figcaption>Missingness after cleaning. The dataset was consolidated to <strong>39,024 unique species</strong>, with 7 processed output files prepared for downstream analysis.</figcaption>
</figure>

---

<h2 id="eda">Exploratory Data Analysis</h2>

### Red List Category Imbalance

For modelling purposes, the 13 IUCN categories were collapsed into three simplified groups:

- **Threatened** — Vulnerable, Endangered, Critically Endangered
- **Non-Threatened** — Least Concern, Near Threatened, Lower Risk/\*
- **Extinct** — Extinct, Extinct in the Wild, Regionally Extinct

Data Deficient species were excluded from training and reserved as prediction targets.

<figure>
  <img src="/assets/images/projects/iucn/eda_simplified_categories.png" alt="Simplified Red List category groupings — Threatened vs Non-Threatened vs Extinct">
  <figcaption>Simplified groupings used for binary classification. Non-Threatened (Least Concern + Near Threatened) vastly outnumbers Threatened, creating a class imbalance problem addressed later with SMOTE.</figcaption>
</figure>

### Taxonomic Signals

Not all taxonomic groups face equal risk. Threat rates vary substantially by phylum and class — making taxonomy a potentially powerful predictor.

<figure>
  <img src="/assets/images/projects/iucn/eda_species_by_phylum.png" alt="Species count and threat rate by phylum">
  <figcaption>Species count (left) and threat rate (right) by phylum. Chordata dominates in species count, but some smaller phyla show disproportionately high threat rates.</figcaption>
</figure>

<figure>
  <img src="/assets/images/projects/iucn/eda_category_by_class.png" alt="Red List category proportions by taxonomic class — stacked bar chart">
  <figcaption>Simplified Red List category proportions within each taxonomic class. Classes like AMPHIBIA and CYCADOPSIDA have markedly higher threatened fractions than ACTINOPTERYGII (fish) or INSECTA.</figcaption>
</figure>

### Geographic Range

Species occurring in fewer countries tend to have narrower ranges, making them more vulnerable to localised threats and habitat loss.

<figure>
  <img src="/assets/images/projects/iucn/eda_country_count.png" alt="Country count distribution and boxplot comparing threatened vs non-threatened species">
  <figcaption>Distribution of country occurrences per species (left) and boxplot by threat status (right). Threatened species occur in significantly fewer countries on average — range size is a meaningful signal.</figcaption>
</figure>

### Habitat Specialisation

Similarly, species dependent on fewer habitat types have less adaptive buffer against environmental change.

<figure>
  <img src="/assets/images/projects/iucn/eda_habitat_count.png" alt="Habitat count distribution and boxplot by threat category">
  <figcaption>Habitat count distribution (left) and boxplot by category (right). Habitat specialists — those relying on 1–2 habitat types — skew toward Threatened status.</figcaption>
</figure>

### Threat Documentation

Species with more documented threats are, unsurprisingly, more likely to be classified as Threatened. But this also reveals a critical bias:

<figure>
  <img src="/assets/images/projects/iucn/eda_threat_count.png" alt="Documented threat count distribution and boxplot by category">
  <figcaption>Threat count by species. Threatened species have substantially more documented threats. However, Data Deficient species have only <strong>35.4%</strong> threat documentation coverage, versus 63.8% for non-DD species — meaning the model may underestimate risk for poorly documented DD species.</figcaption>
</figure>

### Data Availability for DD Species

A key challenge: Data Deficient species are deficient not just in their Red List assessment, but in the features the model relies on.

<figure>
  <img src="/assets/images/projects/iucn/eda_data_availability.png" alt="Data availability comparison between DD and non-DD species across all feature sources">
  <figcaption>Feature data availability for DD (orange) vs non-DD (blue) species. Countries (100%) and habitats (97%) are well covered. Threats (35.4%), uses (17.8%), and conservation records (20.2%) are sparse for DD species — a systematic bias that predictions must be interpreted against.</figcaption>
</figure>

---

<h2 id="features">Feature Engineering</h2>

Eight candidate features were selected based on EDA findings and data availability across DD species:

<table>
  <thead><tr><th>Feature</th><th>Type</th><th>Source</th><th>Rationale</th></tr></thead>
  <tbody>
    <tr><td>className</td><td>Categorical</td><td>simple_summary</td><td>Taxonomic group is a proxy for ecological vulnerability</td></tr>
    <tr><td>populationTrend</td><td>Categorical</td><td>simple_summary</td><td>Declining trend strongly associated with threatened status</td></tr>
    <tr><td>n_countries</td><td>Numeric</td><td>countries (count)</td><td>Proxy for range size</td></tr>
    <tr><td>n_habitats</td><td>Numeric</td><td>habitats (count)</td><td>Habitat breadth / specialisation</td></tr>
    <tr><td>n_threats</td><td>Numeric</td><td>threats (count)</td><td>Documented threat burden</td></tr>
    <tr><td>n_uses</td><td>Numeric</td><td>usetrade (count)</td><td>Human exploitation pressure</td></tr>
    <tr><td>n_conservation</td><td>Numeric</td><td>conservation_needed (count)</td><td>Level of conservation attention</td></tr>
    <tr><td>n_research</td><td>Numeric</td><td>research_needed (count)</td><td>Documented knowledge gaps</td></tr>
  </tbody>
</table>

`className` and `populationTrend` were one-hot encoded, producing **52 total features** (6 numeric + 46 binary). The dataset was split 80/20 into training (28,163 species) and test (7,041 species) sets.

---

<h2 id="class-imbalance">Handling Class Imbalance</h2>

Non-Threatened species significantly outnumber Threatened ones — a ratio that would bias a naïve classifier toward the majority class. SMOTE (Synthetic Minority Over-sampling Technique) was applied to the training set to generate synthetic Threatened examples and balance the distribution before fitting.

<figure>
  <img src="/assets/images/projects/iucn/model_smote.png" alt="Class distribution before and after SMOTE oversampling">
  <figcaption>Training set class distribution before (left) and after (right) SMOTE. The synthetic samples bring Threatened species up to parity with Non-Threatened, allowing the model to learn from both classes equally.</figcaption>
</figure>

---

<h2 id="modelling">Model Training + Evaluation</h2>

Two classifiers were trained and evaluated: **Logistic Regression** and **Random Forest**.

<table>
  <thead>
    <tr><th>Model</th><th>Test Accuracy</th><th>Test F1 (weighted)</th><th>5-Fold CV F1</th></tr>
  </thead>
  <tbody>
    <tr><td>Logistic Regression</td><td>83.4%</td><td>83.7%</td><td>84.0% ± 0.5%</td></tr>
    <tr><td><strong>Random Forest</strong></td><td><strong>87.5%</strong></td><td><strong>87.6%</strong></td><td><strong>90.1% ± 1.8%</strong></td></tr>
  </tbody>
</table>

Random Forest outperformed Logistic Regression on all metrics and was selected for final predictions.

<figure>
  <img src="/assets/images/projects/iucn/model_logreg_confusion.png" alt="Logistic Regression confusion matrix on test set">
  <figcaption>Logistic Regression confusion matrix. The model achieves reasonable recall for Threatened species (87%) but with lower precision (72%) — it over-predicts threat status.</figcaption>
</figure>

<figure>
  <img src="/assets/images/projects/iucn/model_rf_confusion.png" alt="Random Forest confusion matrix on test set">
  <figcaption>Random Forest confusion matrix. Higher precision (79%) and similar recall (87%) for Threatened species — a better balance, with fewer false alarms.</figcaption>
</figure>

### Feature Importance

<figure>
  <img src="/assets/images/projects/iucn/model_feature_importance.png" alt="Top 20 most important features in the Random Forest model">
  <figcaption>Top 20 Random Forest feature importances. Numeric count features — particularly <code>n_countries</code>, <code>n_habitats</code>, and <code>n_threats</code> — dominate. Population trend categories and taxonomic class are the most informative categorical signals.</figcaption>
</figure>

---

<h2 id="results">Results: Kenya's Data Deficient Species</h2>

**335 species** occurring in Kenya were identified as Data Deficient. Using the Random Forest model, each was assigned a predicted threat status.

<figure>
  <img src="/assets/images/projects/iucn/model_kenya_labelled_baseline.png" alt="Baseline distribution of known threat status for Kenya species with Red List categories">
  <figcaption>Known threat status distribution for Kenya species that already have Red List categories (i.e. non-DD). This provides a reference baseline for interpreting the DD predictions.</figcaption>
</figure>

<figure>
  <img src="/assets/images/projects/iucn/model_kenya_predictions.png" alt="Random Forest and Logistic Regression predictions for Kenya's 335 Data Deficient species">
  <figcaption>Prediction distributions for Kenya's 335 DD species from both models. The Random Forest (right) predicts <strong>291 Non-Threatened (86.9%)</strong> and <strong>44 Threatened (13.1%)</strong>. Logistic Regression is more conservative, flagging 79 as Threatened (23.6%).</figcaption>
</figure>

The 44 RF-predicted Threatened species span multiple taxonomic classes — with fish (ACTINOPTERYGII), invertebrates, and mammals most represented among the flagged species.

<figure>
  <img src="/assets/images/projects/iucn/model_kenya_by_class.png" alt="Per-class breakdown of predicted Threatened vs Non-Threatened for Kenya's DD species">
  <figcaption>Predicted threat status by taxonomic class for Kenya's 335 Data Deficient species. Each panel shows both models' outputs side by side, highlighting where they agree and diverge. Fish and invertebrate classes show the highest absolute counts of predicted-Threatened species.</figcaption>
</figure>

---

<h2 id="limitations">Limitations</h2>

These predictions are best treated as **research prioritisation hypotheses**, not definitive assessments.

- **Sparse data bias:** DD species are data-deficient by definition. With only 35% threat documentation coverage (vs 64% for non-DD), the model sees a less complete picture and may systematically underestimate risk.
- **SMOTE caveats:** Synthetic oversampling generates plausible but artificial training examples. Edge cases near class boundaries may not reflect real ecological patterns.
- **Collapsed categories:** Binary Threatened / Non-Threatened classification loses meaningful nuance — a Vulnerable and a Critically Endangered species are treated identically.
- **Count features only:** Threat *type* and habitat *type* were reduced to simple counts. Qualitative differences (e.g., habitat destruction vs invasive species) are invisible to the model.
- **No external validation:** Predictions have not been validated against expert assessments or field surveys. They should prompt investigation, not replace it.

---

<h2 id="references">References + Acknowledgements</h2>

**Data Source**

IUCN Red List of Threatened Species. Version 2024-2. <a href="https://www.iucnredlist.org" target="_blank" rel="noopener">www.iucnredlist.org</a>. Downloaded November 2024.

**Methods**

- Chawla, N.V., Bowyer, K.W., Hall, L.O., & Kegelmeyer, W.P. (2002). SMOTE: Synthetic Minority Over-sampling Technique. *Journal of Artificial Intelligence Research*, 16, 321–357.
- Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5–32.

**Libraries**

pandas · scikit-learn · imbalanced-learn · matplotlib · seaborn

**Acknowledgements**

This project was completed as part of the Machine Learning module at <a href="https://zinduaschool.com" target="_blank" rel="noopener">Zindua School</a>, Nairobi. Thanks to the IUCN Red List team for making bulk species data publicly available to researchers.

</div>
