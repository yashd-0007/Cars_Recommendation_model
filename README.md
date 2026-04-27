# DreamDrive – AI Car Recommendation System

## About the Project
DreamDrive is a sophisticated full-stack web application designed to simplify the car-buying journey. By leveraging a custom AI/ML recommendation engine and a curated display-data backend, it provides personalized vehicle suggestions based on a user's financial profile, lifestyle, and technical preferences.

## Key Original Features
- **AI-Powered Recommendation Engine**: Integrated with a Python FastAPI ML service that analyzes 900+ car variants to find mathematically optimal matches.
- **Sophisticated Display-Data Service**: A custom Node.js middleware layer that performs fuzzy matching and specs normalization to ensure UI-safe data presentation.
- **Comprehensive Admin Suite**: A built-in dashboard for system-wide moderation, booking management, and activity analytics.
- **Interactive Test Drive Booking**: Seamless flow from car discovery to dealership-linked booking management.
- **Resilient Image Resolution**: A multi-layered fallback system ensuring every car has a visual representation (Model Image → Brand Identity → SVG Placeholder).
- **Advanced EMI Suite**: Real-time financial modeling with interactive charts to visualize long-term car ownership costs.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.
- **Backend (Node.js)**: Express, Prisma ORM, JWT Authentication.
- **AI Service (Python)**: FastAPI, Scikit-learn (for recommendation logic).
- **Data**: Curated JSON Registry & Cleaned CSV Dataset.

## Architecture
The project follows a modern micro-service inspired architecture:
1. **Frontend (Vite)**: Handles the premium, animated user experience.
2. **Main API (Node.js)**: Manages business logic, authentication, and the "Display-Data" normalization layer.
3. **ML Service (Python)**: Specialized endpoint for high-performance recommendation scoring.

## Setup Instructions
```bash
# Install dependencies
npm install

# Start both Frontend & Backend concurrently
npm run dev
```

## Data Originality & Attributions
- **Car Dataset**: Derived from public automotive datasets, cleaned and normalized specifically for the DreamDrive logic.
- **Display Registry**: Manually curated model-to-spec mapping used for the display-data service.
- **UI Components**: Custom-built using Shadcn UI primitives, tailored with a unique premium "Golden Gradient" design system.

## Future Roadmap
- Integration with real-time car pricing APIs.
- Collaborative filtering for user-based community recommendations.
- VR/AR 360° car interior previews.

