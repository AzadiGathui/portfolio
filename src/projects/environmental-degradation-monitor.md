---
title: "Measuring encroachment on Kenya's protected areas from space"
tagline: Satellite change detection with deep learning
client: Zindua School (Capstone project)
industry: Geospatial AI
role: Data Scientist
timeline: Jun – Oct 2026
platform: Streamlit web app (Python)
deliverables: Land-cover segmentation model, change-detection pipeline, Kenya evaluation, interactive app
order: 2
coverImage: /assets/images/projects/edm/cover-header.jpg
thumbnail: /assets/images/projects/edm/thumbnail-placeholder.png
ogImage: /assets/images/projects/edm/cover-header.jpg
description: An end-to-end pipeline that segments Sentinel-2 imagery with a U-Net, compares 2016 with 2025 and measures new built-up land inside Kenya's protected areas, plus an honest evaluation of how well it works in Kenya.
permalink: /projects/environmental-degradation-monitor/
---

<div class="article-body">

<h2 id="overview">Overview</h2>

Nairobi National Park was gazetted in 1946 as Kenya's first national park, and it sits at the edge of a city of millions. Karura Forest, a few kilometres from the city centre, is where Wangari Maathai's 1998–99 campaign against forest allocation became a landmark of land-rights activism. Both are protected, and both are surrounded by growth.

The pressure is not unique to Nairobi. A global study found that 32.8% of protected land is under intense human pressure (Jones et al., *Science*, 2018). In Kenya, aerial surveys recorded an average 68% decline in wildlife between 1977 and 2016 (Ogutu et al., *PLOS ONE*, 2016). Protecting land needs monitoring it, and rangers cannot watch every boundary on foot.

Satellites already photograph all of it. The hard part is turning two photographs into one answer.

**The goal:** for a chosen protected area, measure how much land inside its boundary, and in a 100 m margin around it, became built-up between 2016 and 2025.

I built the whole pipeline: downloading imagery, segmenting it with a U-Net, comparing two years and reporting the area in square kilometres on an interactive map. Then I tested it on real Kenyan imagery and found that it does not yet work well enough to trust. This page covers both halves.

<blockquote class="pull-quote">A model can be right about India and wrong about Nairobi.</blockquote>

<h2 id="pipeline">The pipeline</h2>

The system has five stages. Each is a separate module in the app, so one can be replaced without touching the others.

<table>
  <thead><tr><th>Stage</th><th>What happens</th><th>Built with</th></tr></thead>
  <tbody>
    <tr><td>1. Download</td><td>Fetch a true-colour Sentinel-2 composite for each year, at the native 10 m resolution</td><td>sentinelhub, Copernicus Data Space</td></tr>
    <tr><td>2. Segment</td><td>Classify every pixel into one of 7 land-cover classes, for both years</td><td>TensorFlow / Keras U-Net</td></tr>
    <tr><td>3. Compare</td><td>Find pixels that were not built-up in 2016 and are built-up in 2025</td><td>NumPy, rasterio</td></tr>
    <tr><td>4. Measure</td><td>Intersect the change with protected areas plus a 100 m buffer; sum the area</td><td>geopandas, shapely</td></tr>
    <tr><td>5. Present</td><td>Show both years, the change layer and the headline figure on one map</td><td>Streamlit, folium</td></tr>
  </tbody>
</table>

### Narrowing the question

The first version let a user pick any county and any dates. It was flexible and hard to trust: different dates and areas meant different image sizes, and larger areas had to be downloaded at a coarser resolution than the model was trained on.

So I narrowed it. The tool now answers one question, **2016 → 2025**, with a full-year, least-cloud composite at each end. It covers two protected areas, each small enough to download in a single request at 10 m: Nairobi National Park (126 km²) and Karura Forest Reserve (10 km²). Larger areas such as the Mau complex and the Maasai Mara need tiled downloads, which are left for later. A smaller promise that holds is worth more than a bigger one that does not.

<h2 id="data">The data</h2>

<table>
  <thead><tr><th>Layer</th><th>Source</th><th>Used for</th></tr></thead>
  <tbody>
    <tr><td>Training chips</td><td>Sen-2 LULC (Sawant et al., Mendeley Data): 64×64 px RGB chips with 7-class masks</td><td>Training the model: 149,600 train, 32,079 validation, 32,079 test pairs</td></tr>
    <tr><td>Satellite imagery</td><td>Copernicus Sentinel-2 L2A, via the Copernicus Data Space Ecosystem</td><td>Full-year least-cloud composites for 2016 and 2025</td></tr>
    <tr><td>Protected areas</td><td>UNEP-WCMC and IUCN, World Database on Protected Areas (WDPA) polygons</td><td>Deciding where a change counts as encroachment</td></tr>
    <tr><td>Reference land cover</td><td>UNDP GeoHub 10 m annual land use / land cover, 9 classes, four UTM tiles</td><td>Independent check on the model in Kenya (see below)</td></tr>
    <tr><td>Waterways</td><td>HOTOSM Kenya waterways (HDX)</td><td>Riparian buffers (gathered, not yet used)</td></tr>
  </tbody>
</table>

### The training data is not from Kenya

No labelled chip dataset for Kenya with pixel-level masks was available, so the model was trained on the Sen-2 LULC chips, which cover India. That kept the training clean: no Kenyan chip was seen in training. It also set up the project's central question. A model that learned Indian fields and towns is being asked to read Kenyan ones.

### The 100 m buffer

A building rarely appears exactly on a boundary line. I drew a 100 m buffer around each protected area, in a metric projection (UTM zone 37S) so the distance is in real metres. The app then reports land lost inside the boundary and in the buffer separately.

<figure>
  <img src="/assets/images/projects/edm/protected-area-buffers.png" alt="Outlines of Nairobi National Park, 126 square kilometres, and Karura Forest Reserve, 10 square kilometres, each filled green with a red outline 100 metres outside the boundary">
  <figcaption>The two protected areas in scope, each with its 100 m buffer.</figcaption>
</figure>

<h2 id="model">The model</h2>

The segmentation model is a U-Net: an encoder that compresses the image into features, a decoder that rebuilds a full-resolution map, and skip connections that carry fine detail across. Skip connections matter here because edges, such as where a road ends and a field begins, are what the model has to get right.

I scaled the standard design down to fit 64×64 px chips. The first draft was a 5-level, 1024-filter network sized for 256×256 images, far too large for chips this small.

<div class="pj-row">
  <div class="stat-card">
    <span class="label label--accent">Architecture</span>
    <p class="stat-card__value">32 → 256 filters</p>
    <p class="caption">Four encoder levels, three decoder levels with skip connections, about 1.9 million parameters</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Output</span>
    <p class="stat-card__value">7 classes</p>
    <p class="caption">Water, dense forest, sparse forest, barren land, built up, agriculture, fallow land</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Training data</span>
    <p class="stat-card__value">149,600 chips</p>
    <p class="caption">The full Sen-2 LULC training split: 64×64 px RGB, 7 classes</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Test mean IoU</span>
    <p class="stat-card__value">0.49</p>
    <p class="caption">On 32,079 held-out chips. A first CPU baseline on 1,200 chips scored 0.24</p>
  </div>
</div>

### Class imbalance

The classes are badly unbalanced. Agriculture and built-up dominate the pixel counts, and water and dense forest are rare. Plain cross-entropy would learn to favour the big classes, so the loss combines two corrections: **inverse-frequency class weights** estimated from 5,000 training masks, and a **Dice loss** term that optimises overlap directly.

<table>
  <thead><tr><th>Class</th><th>Loss weight</th></tr></thead>
  <tbody>
    <tr><td>Water</td><td>2.82</td></tr>
    <tr><td>Dense forest</td><td>2.48</td></tr>
    <tr><td>Fallow land</td><td>0.71</td></tr>
    <tr><td>Sparse forest</td><td>0.53</td></tr>
    <tr><td>Barren land</td><td>0.28</td></tr>
    <tr><td>Built up</td><td>0.11</td></tr>
    <tr><td>Agriculture</td><td>0.06</td></tr>
  </tbody>
</table>

### Why mean IoU, not accuracy

Pixel accuracy flatters an unbalanced problem. A model that predicts "agriculture" everywhere scores 49% accuracy on the test split, but only 0.07 mean Intersection over Union (IoU). Mean IoU averages the overlap score across all classes, so a class the model ignores drags the number down. It was the training metric and the early-stopping signal.

### From a CPU baseline to the full dataset

The first model trained on 1,200 chips on a CPU, because TensorFlow on native Windows cannot use the GPU. It reached 0.24. The second run used all 149,600 training chips on a GPU, and doubled that.

Getting the GPU busy took one fix. Decoding each TIFF mask inside the training loop left the GPU idle for 60–100 ms per batch while the actual computation took 5–15 ms. Converting every mask to a NumPy array once, up front, made reads about 100× faster and removed the bottleneck. Training ran for 38 epochs, with early stopping restoring the best weights from epoch 34.

<figure>
  <img src="/assets/images/projects/edm/training-curves.png" alt="Two line charts over 38 epochs. Loss falls from about 1.05 to 0.56 for training and 0.65 for validation. Mean IoU rises from about 0.27 to 0.53 for training and 0.49 for validation, flattening after epoch 30.">
  <figcaption>Loss (left) and mean IoU (right). Validation levels off near 0.49 while training keeps a small lead: a modest generalisation gap, not a collapse.</figcaption>
</figure>

### Results on the held-out test set

The test mean IoU is **0.493**, with a pixel accuracy of 0.80. The built-up class, which the whole alert depends on, reaches **0.623**.

<figure>
  <img src="/assets/images/projects/edm/confusion-matrix.png" alt="Two confusion matrices: raw pixel counts, dominated by agriculture, and a row-normalised version showing recall per class, strongest for agriculture and weakest for water">
  <figcaption>Confusion matrix on the test split: raw counts (left), and recall per true class (right). Agriculture has the highest recall and water the lowest.</figcaption>
</figure>

<figure>
  <img src="/assets/images/projects/edm/india-test-predictions.png" alt="Four rows of three panels: a satellite chip, its ground-truth land-cover mask, and the model's prediction. The predictions closely follow the ground truth, including clusters of built-up pixels.">
  <figcaption>Test chips: image, ground truth, prediction. On data like its training set, the model follows the labels closely.</figcaption>
</figure>

On the data it was trained for, the model works. The next question is whether that carries over to Kenya.

<h2 id="inference">From chips to a whole scene</h2>

The model reads 64×64 px chips. A Nairobi National Park scene is about 2,260 × 1,480 px, so it cannot be fed in whole. The app tiles it with a sliding window:

1. Pad the image so its size divides evenly by the stride.
2. Cut overlapping 64×64 chips with a stride of 48 px, so neighbouring chips share a 16 px margin.
3. Run the model on batches of 32 chips.
4. Add each chip's class probabilities into an array the size of the full scene.
5. Average where chips overlap, then take the most likely class at every pixel.

The overlap is there to hide seams. Averaging with neighbours smooths the joins, though it does not remove them entirely, as the evaluation below shows. The output is a single-band GeoTIFF where each pixel holds a class index from 0 to 6. On a CPU, a full park takes about 30 seconds to segment.

<h2 id="change-detection">Detecting change</h2>

The change rule is deliberately simple: a pixel counts as new built-up if it is built-up in 2025 **and** was not built-up in 2016.

The two masks are first aligned: the second is warped onto the first's exact pixel grid with nearest-neighbour sampling, because class labels are categories and must not be blended. The changed pixels become polygons, which are intersected with each protected area grown by its 100 m buffer. The app splits the result into land lost **inside the boundary** and **in the buffer**, and reports what the changed pixels used to be.

<h2 id="app">The app</h2>

The interface is a Streamlit app with one job: let someone run the analysis without writing code.

1. Choose a protected area.
2. Press **Run analysis**. There is no date picker, by design.

A strip of four metrics sits above an interactive map: protected land lost, how much of it is inside the boundary, how much is in the buffer, and the total new built-up land in the scene. The map has toggleable layers for both years' imagery and segmentation, the change in red and the protected-area outline. Expandable tables show what the changed pixels used to be.

<!-- TODO: add a screenshot of the running app here -->

Two decisions shaped how it feels to use:

- **Everything is cached.** Downloads and masks are stored under a hash of the area, dates and layer, so a repeat run is instant.
- **A credential-free demo.** Pre-downloaded imagery is copied into the cache on launch, so both protected areas work without a Copernicus account. Any other imagery needs free Copernicus credentials, supplied as environment variables or Streamlit secrets.

<details class="expandable">
  <summary class="expandable__trigger">Run it locally</summary>
  <div class="expandable__body">

```
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Imagery downloads on first run with free Copernicus Data Space credentials (see `.env.example`). The notebooks, a write-up of each stage and the saved models are on <a href="https://github.com/AzadiGathui/environmental-degradation-monitor" target="_blank" rel="noopener">GitHub<span class="visually-hidden"> (opens in a new tab)</span></a>.

  </div>
</details>

### What it reports

Run on the two protected areas, the app reports the following.

<div class="pj-row">
  <div class="stat-card">
    <span class="label label--accent">Nairobi National Park</span>
    <p class="stat-card__value">2.03 km²</p>
    <p class="caption">Protected land lost, 2016 → 2025: 1.92 km² inside the boundary, 0.11 km² in the 100 m buffer</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Karura Forest Reserve</span>
    <p class="stat-card__value">0.19 km²</p>
    <p class="caption">Protected land lost, 2016 → 2025: 0.13 km² inside the boundary, 0.06 km² in the 100 m buffer</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Built-up IoU, India test</span>
    <p class="stat-card__value">0.62</p>
    <p class="caption">How well the model finds built-up land on data like its training set</p>
  </div>
  <div class="stat-card">
    <span class="label label--accent">Built-up IoU, Kenya</span>
    <p class="stat-card__value">0.06</p>
    <p class="caption">The same model against an independent map of the two parks. The figures above are estimates, not findings.</p>
  </div>
</div>

<h2 id="evaluation">Does it work in Kenya?</h2>

The test score of 0.49 describes how well the model reproduces the data it was trained on. It says nothing about the question that matters: how well does it read real Kenyan imagery?

There is no hand-labelled Kenyan ground truth. So I used an independent map as a stand-in: UNDP's 10 m annual land-cover product for 2025. It comes from the same satellite at the same resolution, but from a completely different model. Agreement with it is a fair external check, though not a perfect one, because the two products use different class definitions.

<table>
  <thead><tr><th>UNDP class</th><th>Mapped to model class</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Water</td><td>Water</td><td>Direct match</td></tr>
    <tr><td>Trees</td><td>Dense forest</td><td>Closest forest class</td></tr>
    <tr><td>Flooded vegetation</td><td>Water</td><td>Rare; a wet surface reads closest to water</td></tr>
    <tr><td>Crops</td><td>Agriculture</td><td>Direct match</td></tr>
    <tr><td><strong>Built area</strong></td><td><strong>Built up</strong></td><td><strong>Direct 1:1 match: the class the tool depends on</strong></td></tr>
    <tr><td>Bare ground</td><td>Barren land</td><td>Direct match</td></tr>
    <tr><td>Rangeland</td><td>Fallow land</td><td>No grassland class exists; fallow is nearest</td></tr>
    <tr><td>Snow, ice, clouds</td><td>Ignored</td><td>Not a land-cover target</td></tr>
  </tbody>
</table>

Because two rows are imperfect matches, the mean IoU is held down by definitions as well as by model error. So the honest headline is built-up, which maps one-to-one.

<table>
  <thead><tr><th>Class</th><th>India test split</th><th>Nairobi National Park</th><th>Karura Forest Reserve</th></tr></thead>
  <tbody>
    <tr><td>Water</td><td>0.243</td><td>0.001</td><td>0.012</td></tr>
    <tr><td>Dense forest</td><td>0.337</td><td>0.115</td><td>0.582</td></tr>
    <tr><td>Sparse forest</td><td>0.418</td><td>0.000</td><td>0.000</td></tr>
    <tr><td>Barren land</td><td>0.485</td><td>0.000</td><td>0.000</td></tr>
    <tr><td><strong>Built up</strong></td><td><strong>0.623</strong></td><td><strong>0.060</strong></td><td><strong>0.060</strong></td></tr>
    <tr><td>Agriculture</td><td>0.846</td><td>0.001</td><td>0.000</td></tr>
    <tr><td>Fallow land</td><td>0.499</td><td>0.388</td><td>0.038</td></tr>
    <tr><td>Mean (classes present)</td><td>0.493</td><td>0.081</td><td>0.099</td></tr>
  </tbody>
</table>

**Built-up IoU falls from 0.62 to 0.06.** That is the domain-shift penalty, in the one number every encroachment figure rests on.

The maps show where. Land-cover colours follow this legend.

<figure>
  <img src="/assets/images/projects/edm/class-legend.png" alt="Legend: water blue, dense forest dark green, sparse forest mid green, barren land tan, built up red, agriculture amber, fallow land pale green">
</figure>

### Karura Forest Reserve

<div class="pj-row">
  <figure>
    <img src="/assets/images/projects/edm/karura-prediction.png" alt="The model's land-cover prediction for Karura: dark green forest in the centre and west, surrounded by pale green and scattered red">
    <figcaption>Model prediction</figcaption>
  </figure>
  <figure>
    <img src="/assets/images/projects/edm/karura-reference.png" alt="The UNDP reference for Karura: dark green forest surrounded by solid red built-up land on every side">
    <figcaption>UNDP reference, remapped</figcaption>
  </figure>
</div>

The model finds the forest, with a dense-forest IoU of 0.58. What it misses is the city around it: the reference shows built-up land on every side, and the model calls much of it something else.

<figure>
  <img src="/assets/images/projects/edm/karura-agreement.png" alt="A built-up agreement map for Karura: the forest is black, the surrounding area is mostly blue, with a few small green and red patches">
  <figcaption>Built-up agreement: green where both call it built-up, red where only the model does, blue where only the reference does. Blue dominates.</figcaption>
</figure>

### Nairobi National Park

<div class="pj-row">
  <figure>
    <img src="/assets/images/projects/edm/nairobi-np-prediction.png" alt="The model's land-cover prediction for Nairobi National Park: mostly pale green and tan, with a faint grid of square tiles and red patches in the south">
    <figcaption>Model prediction</figcaption>
  </figure>
  <figure>
    <img src="/assets/images/projects/edm/nairobi-np-reference.png" alt="The UNDP reference for Nairobi National Park: a large pale green rangeland area, with red built-up patches around its edges and amber farmland in the south">
    <figcaption>UNDP reference, remapped</figcaption>
  </figure>
</div>

<figure>
  <img src="/assets/images/projects/edm/nairobi-np-agreement.png" alt="A built-up agreement map for Nairobi National Park: large blue areas around the edges, red patches in the south, almost no green">
  <figcaption>Built-up agreement. Blue (built-up land in the reference that the model misses) covers the areas around the park's edges. Red marks false alarms in the south, where the reference sees farmland.</figcaption>
</figure>

A faint grid of 64 px tiles is visible in the prediction: the chip-by-chip approach leaves marks even with overlap.

### What this means for the numbers

Two things follow.

1. **The square-kilometre figures are estimates with large, unmeasured error.** In both parks the blue misses outweigh the red false alarms, so the model mostly under-calls built-up land. But change is the *difference* of two noisy maps, and differencing amplifies noise, so errors can run in either direction.
2. **This is the strongest argument for fine-tuning on Kenyan imagery.** Closing the built-up gap is worth more than any other change to the project.

<h2 id="next">What I would do next</h2>

1. **Fine-tune on Kenyan labels.** The UNDP tiles are already reprojected, and one function generates a chip-and-label pair for any downloaded image. The 9 UNDP classes need mapping to the model's 7, as above.
2. **Check the model's input.** The downloaded composites are saved as raw reflectance scaled to 0–255 with no brightness gain, and the 2025 images in the evaluation look nearly black. Comparing their brightness with the training chips is a cheap test, and may explain part of the gap.
3. **Mask clouds** using Sentinel-2's own scene classification band, so cloud is never read as bare ground or built-up land.
4. **Add the near-infrared band.** Vegetation and built-up land separate far better with it, but the model has to be retrained on 4-band input.
5. **Report confidence.** Compare class probabilities instead of hard labels, flag a pixel only when the model is confident in both years, and show a score with every alert.
6. **Validate against something real,** such as high-resolution imagery or field reports, before treating any figure as a finding.
7. **Add the time dimension.** Feed the U-Net's features into an LSTM or GRU to read several dates instead of two, and add tiled downloads so larger areas such as the Mau complex and the Maasai Mara fit.

<h2 id="limitations">Limitations</h2>

- **Domain shift is the dominant risk.** Trained on Indian RGB chips, the model's built-up IoU drops from 0.62 to about 0.06 in Kenya.
- **No true ground truth.** The Kenyan check uses another model's map, which has errors of its own and different class definitions.
- **Differencing amplifies noise.** Two independent segmentations compared pixel by pixel turn small errors into false change.
- **Cloud cover.** There is no cloud mask yet, so cloud can be read as built-up or bare land.
- **A narrow definition of change.** The rule only catches land turning built-up. It misses clearing for farming, logging and degradation that never becomes a building.
- **Small scope.** Two protected areas, one pair of years, RGB bands only.

<h2 id="references">References and acknowledgements</h2>

**Data**

- Sawant, S., Garg, R. D., Meshram, V., Mistry, S. (2023). Sen-2 LULC. Mendeley Data, V3. <a href="https://doi.org/10.17632/f4ky6ks248.3" target="_blank" rel="noopener">doi:10.17632/f4ky6ks248.3<span class="visually-hidden"> (opens in a new tab)</span></a>
- UNDP GeoHub. 10 m Annual Land Use Land Cover (9-class).
- UNEP-WCMC and IUCN. World Database on Protected Areas (WDPA).
- HOTOSM. Kenya waterways, via the Humanitarian Data Exchange.
- Contains modified Copernicus Sentinel data (2016, 2025), accessed through the Copernicus Data Space Ecosystem.

**Context**

- Jones, K. R., Venter, O., Fuller, R. A., Allan, J. R., Maxwell, S. L., Negret, P. J., Watson, J. E. M. (2018). One-third of global protected land is under intense human pressure. *Science*, 360(6390), 788–791. <a href="https://doi.org/10.1126/science.aap9565" target="_blank" rel="noopener">doi:10.1126/science.aap9565<span class="visually-hidden"> (opens in a new tab)</span></a>
- Ogutu, J. O., Piepho, H.-P., Said, M. Y., et al. (2016). Extreme wildlife declines and concurrent increase in livestock numbers in Kenya: what are the causes? *PLOS ONE*, 11(9). <a href="https://doi.org/10.1371/journal.pone.0163249" target="_blank" rel="noopener">doi:10.1371/journal.pone.0163249<span class="visually-hidden"> (opens in a new tab)</span></a>

**Method**

- Ronneberger, O., Fischer, P., Brox, T. (2015). U-Net: Convolutional Networks for Biomedical Image Segmentation. *MICCAI 2015*.

**Libraries**

TensorFlow / Keras · rasterio · geopandas · shapely · sentinelhub · NumPy · Pillow · folium · Streamlit

**Source code**

<a href="https://github.com/AzadiGathui/environmental-degradation-monitor" target="_blank" rel="noopener">github.com/AzadiGathui/environmental-degradation-monitor<span class="visually-hidden"> (opens in a new tab)</span></a>

**Acknowledgements**

This project was completed as a capstone at <a href="https://zinduaschool.com" target="_blank" rel="noopener">Zindua School<span class="visually-hidden"> (opens in a new tab)</span></a>, Nairobi.

</div>
