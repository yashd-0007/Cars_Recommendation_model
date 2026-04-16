# DreamDrive – Car Recommendation System

## About the Project
DreamDrive is a smart web application that helps you find your perfect car. By taking your budget, income, and preferences into account, the app recommends the best cars for your lifestyle. The recommendations are powered by a custom AI/ML model trained on real-world car datasets.

## Features
- **Smart Recommendations**: Custom car suggestions based on your personal inputs.
- **Electric Cars Page**: Dedicated section to browse electric vehicles.
- **Top Recommended**: Hand-picked choices for quick browsing.
- **EMI Calculator**: Built-in tool to calculate your car loan payments.
- **Testimonials**: Reviews and feedback section.
- **Modern Navigation**: Sleek, responsive navbar with smooth dropdowns.
- **Responsive Design**: Works perfectly on mobile and desktop devices.

## Tech Stack
- **React + Vite**
- **JavaScript**
- **AI/ML Model** (trained using a car dataset, exported for live use)
- **GitHub Pages** (deployment)

## How It Works
1. **User enters details**: You provide your budget and preferences.
2. **Model processes input**: The AI model analyzes your data.
3. **Cars are shown**: Recommended cars are instantly presented.
4. **Smart Imaging**: Missing car images are securely handled via a smart image fallback system (Exact Model Image → Brand Logo → Safe Placeholder).

## Setup Instructions
To run this project locally, paste the following commands into your terminal:

```bash
# Clone the repository
git clone <your-repository-url>

# Install all project dependencies
npm install

# Start the local development server
npm run dev

# Build the project for production
npm run build

# Deploy the project
npm run deploy
```

## Deployment
DreamDrive is fully configured to be hosted online using **GitHub Pages**.

## Future Improvements
- Implement a more advanced ML version.
- Integrate real-time updating car data.
- Develop user login, saving, and personalization features.
