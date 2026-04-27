/**
 * Content Service
 * Provides curated Expert Reviews and Features Explained data mapped by car displayId.
 * Fallbacks to dynamically generated dataset-driven content for cars without curated overrides.
 */

const displayDataService = require("./displayDataService");

// ─── Priority 1: Curated Overrides ──────────────────────────────────────────────

const expertReviewsDB = {
  1: { // Curated example for ID 1
    title: "The Ultimate Compact SUV Champion?",
    expertName: "AutoCar India Expert",
    source: "AutoCar Curated",
    summary: "A massive leap forward in design and features. It offers a premium cabin, multiple powertrain options, and segment-leading safety.",
    rating: 4.5,
    sections: {
      design: "The futuristic split headlamp setup and connected LED tail lamps give it a distinct road presence. The sloping roofline adds a sporty character.",
      performance: "The 1.2L turbo-petrol is punchy but slightly unrefined at higher RPMs. The 1.5L diesel remains the pick of the lot for highway cruising.",
      comfort: "Plush ride quality that handles bad roads with ease. The new two-spoke steering and digital displays elevate the cabin experience.",
      features: "Packed with tech: 10.25-inch screens, 360-degree camera, ventilated seats, and premium JBL audio.",
      verdict: "It remains the benchmark in the compact SUV segment, blending safety, style, and tech brilliantly."
    }
  },
  2: {
    title: "A Tech Fest on Wheels",
    expertName: "MotorOctane Team",
    source: "MotorOctane Curated",
    summary: "One of the most tech-loaded SUVs in its class, offering ADAS, huge screens, and potent engines.",
    rating: 4.2,
    sections: {
      design: "Aggressive front fascia with striking DRLs. It looks proportionate and modern.",
      performance: "Both petrol and diesel engines are refined and powerful. The automatic transmissions are smooth but could be quicker.",
      comfort: "Spacious cabin with excellent legroom. The panoramic sunroof makes it feel airy.",
      features: "Level 2 ADAS works well in Indian conditions. The infotainment is crisp and responsive.",
      verdict: "A brilliant family SUV that offers immense value and peace of mind."
    }
  }
};

const featuresExplainedDB = {
  1: [
    {
      videoId: "m9-kY-GiaQk", 
      title: "Detailed Walkaround & Features Explained",
      channel: "Faisal Khan",
      description: "A deep dive into all the variants and new features."
    },
    {
      videoId: "a4K3aHhG1wQ",
      title: "Ownership Review - Hidden Features",
      channel: "Gagan Choudhary",
      description: "Long-term ownership review highlighting hidden tech."
    }
  ],
  2: [
    {
      videoId: "V3z3lE0Qv1A",
      title: "ADAS and Safety Features Tested",
      channel: "MotorBeam",
      description: "Testing the advanced driver assistance systems in real-world traffic."
    }
  ]
};

// ─── Priority 2: Generators ─────────────────────────────────────────────────────

const formatPrice = (price) => {
  if (!price) return "TBA";
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
};

const generateExpertReview = (car) => {
  const isEV = car.fuelType && car.fuelType.toLowerCase().includes('electric');
  const isLuxury = car.priceMinInr > 4000000;
  
  return {
    title: `The ${car.brand} ${car.model}: Redefining the ${car.segment || car.bodyType || 'market'}?`,
    expertName: "DreamDrive Auto Desk",
    source: "DreamDrive Editorial",
    summary: `The ${car.brand} ${car.model} (${car.variant}) offers a highly compelling package. Priced from ${formatPrice(car.priceMinInr)}, it aims to set new standards in its class with its ${car.fuelType} powertrain and robust engineering.`,
    rating: car.score > 0 ? (car.score * 5).toFixed(1) : "4.0",
    sections: {
      overview: `Designed to cater to modern sensibilities, the ${car.model} strikes a fine balance between aesthetic appeal and everyday functionality. As a core offering from ${car.brand}, it continues to build on the brand's legacy of reliability and innovation.`,
      design: `Road presence is a strong suit. The ${car.bodyType || 'vehicle'}'s silhouette gives it a confident and proportional stance, while the signature ${car.brand} styling cues are unmistakably prominent in the front fascia.`,
      comfort: `Inside, the cabin is thoughtfully laid out. With seating for ${car.seating || 5}, space management is highly efficient. ${isLuxury ? 'Premium materials, soft-touch plastics, and excellent NVH levels elevate the luxury experience.' : 'The focus remains firmly on durability, ergonomics, and delivering a comfortable ride for the whole family.'}`,
      performance: isEV 
        ? `The electric powertrain delivers instant, silent torque, making city overtakes effortless and highway cruising smooth. It promises an estimated range of ${car.evRangeKm || 'N/A'} km.`
        : `Under the hood, the ${car.engineCc ? car.engineCc + 'cc' : ''} ${car.fuelType} engine paired with a ${car.transmission} gearbox provides linear and predictable power delivery. It offers a claimed efficiency of ${car.mileageKmpl || 'N/A'} kmpl.`,
      practicality: `In terms of real-world usability, the ${car.model} shines. Boot space is competitive for the segment, and the ground clearance is well-tuned for varied road conditions.`,
      verdict: `If you are in the market for a feature-rich, sensible, and capable vehicle, the ${car.brand} ${car.model} is very hard to ignore. It offers excellent value and a well-rounded ownership experience.`
    }
  };
};

const generateFeaturesExplained = (car) => {
  return [
    {
      title: "Powertrain & Efficiency",
      description: `Powered by a refined ${car.fuelType} setup coupled with a ${car.transmission} transmission. ${car.mileageKmpl ? 'It delivers an impressive ' + car.mileageKmpl + ' kmpl, ensuring fewer stops at the pump.' : ''}${car.evRangeKm ? 'It provides a reliable EV range of ' + car.evRangeKm + ' km on a single charge.' : ''}`
    },
    {
      title: "Space & Practicality",
      description: `Designed as a versatile ${car.bodyType || 'vehicle'}, it comfortably accommodates ${car.seating || 5} passengers with ample cabin space and smart storage solutions throughout the interior.`
    },
    {
      title: "Value Proposition & Segment",
      description: `Positioned aggressively in the ${car.segment || 'competitive'} segment, pricing starts at ${formatPrice(car.priceMinInr)}, making it a strong contender and an excellent value-for-money proposition.`
    },
    {
      title: "Brand Heritage",
      description: `As a ${car.brand} vehicle, it inherits the brand's signature build quality, extensive service network, and historically strong resale value.`
    }
  ];
};

// ─── Service Methods ────────────────────────────────────────────────────────────

const getExpertReview = (carId) => {
  // 1. Curated Priority
  if (expertReviewsDB[carId]) {
    return expertReviewsDB[carId];
  }
  
  // 2. Generated Fallback
  const car = displayDataService.getCarById(carId);
  if (car) {
    return generateExpertReview(car);
  }
  
  return null;
};

const getFeaturesExplained = (carId) => {
  // 1. Curated Videos Priority
  if (featuresExplainedDB[carId]) {
    return { type: "videos", content: featuresExplainedDB[carId] };
  }
  
  // 2. Generated Features Fallback
  const car = displayDataService.getCarById(carId);
  if (car) {
    return { type: "generated", content: generateFeaturesExplained(car) };
  }
  
  return null;
};

const getAvailableExpertReviewCarIds = () => {
  // Now ALL cars have an expert review
  return displayDataService.getAllCars().map(c => c.displayId);
};

const getAvailableFeaturesCarIds = () => {
  // Now ALL cars have features explained
  return displayDataService.getAllCars().map(c => c.displayId);
};

module.exports = {
  getExpertReview,
  getFeaturesExplained,
  getAvailableExpertReviewCarIds,
  getAvailableFeaturesCarIds
};
