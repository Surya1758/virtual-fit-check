# SocialStitch AI: Virtual Fit Check Case Study
### *Solving the ₹18 Lakh Cr E-Commerce Returns Crisis through 3D Parametric Fit Check & Generative UGC*

This repository contains the interactive, high-fidelity pitch deck and case study single-page web application for **SocialStitch AI** (conceptualized as Virtual Fit Check - VFC). Designed specifically for the Indian fashion e-commerce market, this application demonstrates the technology, financial blueprint (unit economics), and platform-wide savings projections for key players like Myntra, Ajio, and Meesho.

---

## 🚀 Key Features

1. **3D Parametric Mannequin (Interactive Trial Room):**
   - Live SVG-morphing mannequin that dynamically shapes itself based on user Height, Chest, Waist, and Hip inputs.
   - Live **Tension Heatmap overlay** showing tight (red), optimal (green), and loose (cyan) fit zones in real-time.
   - Dynamic garment sizing table evaluating individual dimension clearances.
   - **Zero-Click Auto-Cart Selection:** Automatically determines the best size, pre-selects it, and triggers a slide-in shopping bag checkout drawer.

2. **Generative UGC Synthesis (How it Works):**
   - Dynamic 3-step pipeline flow representing how user metrics are converted to a 3D SMPL mesh, synthesized using Conditional try-on diffusion (IDM-VTON), and injected as lifestyle social proof.
   - A macOS-style live terminal logs console simulating active GPU processing queues and image latencies.

3. **Dual Financial Blueprint (Unit Economics Toggle):**
   - **Our Business (SaaS Model):** Outlines SaaS metrics (₹20k CAC, ₹1.4L LTV, 7:1 LTV:CAC, ~100-day payback period).
   - **Customer (Fashion Platform):** Outlines the retailer's benefit (CAC drops to ₹380, LTV climbs to ₹3.75k, 9.8:1 LTV:CAC, ~15-day integration payback).

4. **India Market Savings Simulator:**
   - Platform-wide calculator displaying annual reverse logistics shipping & margin rescue savings:
     - **Myntra:** ₹735 Cr/year saved.
     - **Ajio:** ₹288 Cr/year saved.
     - **Meesho:** ₹547 Cr/year saved.
     - **Combined Annual Impact:** **₹3,970 Cr** total value created.
   - Real-time interactive ROI calculator slider tool for custom orders, AOVs, return rates, and shipping costs.

---

## 🛠️ Local Setup

Simply clone the repository and open the index file:
```bash
git clone https://github.com/Surya1758/virtual-fit-check.git
cd virtual-fit-check
open index.html
```

Or run a local static server to preview:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

---

## 📄 Case Study Context
Read the complete business analysis and technical implementation roadmap in the [socialstitch_case_study.md](socialstitch_case_study.md) markdown file located in this repository.

---

*Crafted by Surya Prakash Gupta. Let's collaborate to redefine digital fashion sizing.*
