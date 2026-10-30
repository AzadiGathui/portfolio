---
parent: data-science
order: 1
title: "Built a satellite land-cover change monitor (U-Net, Streamlit)"
start: 2026
link: /projects/environmental-degradation-monitor/
tags: [Python, U-Net, TensorFlow, Sentinel-2, Copernicus, Streamlit, GeoPandas]
images:
  - { src: /assets/images/projects/edm/karura-reference.png, alt: "Karura Forest: reference land-cover map" }
  - { src: /assets/images/projects/edm/karura-prediction.png, alt: "Karura Forest: the model's predicted land cover" }
  - { src: /assets/images/projects/edm/nairobi-np-prediction.png, alt: "Nairobi National Park: predicted land cover" }
  - { src: /assets/images/projects/edm/india-test-predictions.png, alt: "Test predictions on Indian imagery" }
---
Trained and evaluated a semantic segmentation model (5.78M parameters) for satellite land-cover classification, and built a complete Streamlit application around it:

- On-demand Sentinel-2 imagery retrieval for protected area shapefiles
- Mask-based change detection on an interactive Streamlit map
- Domain-shift evaluation (India vs Kenya)
- Datasets used:
  - Sentinel-2 imagery
  - [World Database on Protected Areas (polygons)](https://developers.google.com/earth-engine/datasets/catalog/WCMC_WDPA_current_polygons) by UNEP-WCMC
