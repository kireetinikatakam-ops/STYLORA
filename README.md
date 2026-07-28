# STYLORA — AI Virtual Style Fit & Personal Color Studio

STYLORA is a next-generation AI fashion studio and circular wardrobing platform. Powered by Gemini AI models and 4D WebGL cloth simulation, STYLORA allows users to virtually try on clothing, analyze body silhouettes, receive personal seasonal color diagnostics, and track circular sustainability metrics.

---

## ✨ Key Features

### 👗 1. AI Virtual Try-On & Fit Studio
* **Dual Upload Support**: Upload your own full-body photo alongside any custom outfit or dress photo.
* **Interactive Morph Slider**: Compare original photos with AI-fitted garments using a smooth split-view range slider.
* **Gemini 3.1 Flash Fashion Image Generator**: Create custom high-fashion garments from text prompts with resolution options (**1K**, **2K**, and **4K**).
* **AI Tailoring Diagnostic**: Provides quantitative match scores, silhouette harmony breakdowns, alteration advice, drape mechanics, and undertone contrast analysis.

### 🧵 2. 4D WebGL Cloth Physics Engine
* **Real-time GPU Rendering**: Smooth 60 FPS Three.js / WebGL canvas simulating tension, gravity, and runway wind velocity.
* **Multi-Fabric Simulation**: Realistic drapery mechanics for Silk, Satin, Denim, Velvet, Linen, and Cashmere.

### 🎨 3. Personal Color Analysis & Live Draping
* **Seasonal Diagnostics**: Determine undertones and seasonal color profiles (*Summer Cool, Autumn Warm, Spring Light, Winter Deep*).
* **Live Digital Drape**: Test best-wear swatches directly over uploaded selfies in real time.
* **AI Palette Outfit Generation**: Generate haute-couture outfits matching your personal color palette in 1K, 2K, or 4K resolution.

### 📐 4. Body Shape & Proportional Styling Diagnostic
* **Geometric Analysis**: Input shoulder, bust, waist, and hip ratios to determine body silhouette types (*Hourglass, Pear, Rectangle, Inverted Triangle, Apple*).
* **Styling Guidance**: Recommendations for ideal hemlines, necklines, and structural tailoring.

### 🌿 5. Circular Sustainability Dashboard
* **Scroll-Triggered Counters**: Animated metric reveals powered by **GSAP** & **ScrollTrigger** tracking money saved, water conserved, CO₂ offset, textile waste diverted, and Green Points.
* **Campus Leaderboard**: Animated progress bars tracking university circular fashion milestones.

### 🧥 6. Smart Closet & P2P Marketplace
* Digitized wardrobing, weather-adaptive outfit curation, pre-loved resale, and rental listings.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Motion (`motion/react`)
* **Animations & Physics**: GSAP + ScrollTrigger, Three.js / WebGL Canvas
* **Backend**: Express.js with Vite Middleware (Full-Stack CJS Bundle)
* **AI Integration**: `@google/genai` TypeScript SDK
  * `gemini-3.1-flash-image` (Generative outfit creation with 1K, 2K, and 4K resolution)
  * `gemini-3.6-flash` (Structured Virtual Fit Diagnostic & Tailoring Analysis)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18 or higher
* **Package Manager**: npm or bun

### Environment Variables
Configure your `.env` file (refer to `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

### Production Build
Build the Vite client bundle and CJS Express server:
```bash
npm run build
npm start
```

---

## 📄 License
MIT License. Created for high-fashion digital experiences and AI circular sustainability.
