#!/usr/bin/env node
/**
 * One-time script to generate the curated display car registry.
 * Run: node scripts/generateRegistry.js
 * Output: data/displayCarRegistry.json
 */
const fs = require("fs");
const path = require("path");

// Real-world car specifications for all models in the dataset.
// Format: [brand, model, bodyType, fuelType, transmission, seating, engineCc, mileageKmpl, evRangeKm, launchYear, priceMin, priceMax, segment, country]
const RAW = [
  // --- BMW (6 models) ---
  ["BMW","3 Series","Sedan","Petrol","Automatic",5,1998,16.8,null,2023,4690000,6890000,"Premium","Germany"],
  ["BMW","5 Series","Sedan","Petrol","Automatic",5,1998,15.9,null,2024,6990000,7690000,"Luxury","Germany"],
  ["BMW","7 Series","Sedan","Petrol","Automatic",5,2998,10.5,null,2023,13900000,19500000,"Luxury","Germany"],
  ["BMW","X1","SUV","Petrol","Automatic",5,1498,15.5,null,2023,4590000,5290000,"Premium","Germany"],
  ["BMW","X3","SUV","Petrol","Automatic",5,1998,14.1,null,2024,6190000,7490000,"Premium","Germany"],
  ["BMW","X5","SUV","Petrol","Automatic",5,2998,12.7,null,2023,8290000,10490000,"Luxury","Germany"],

  // --- Mahindra (5 models) ---
  ["Mahindra","Bolero","SUV","Diesel","Manual",7,1493,16.0,null,2023,980000,1120000,"Budget","India"],
  ["Mahindra","Scorpio","SUV","Diesel","Manual",7,2184,15.4,null,2023,1399000,2140000,"Mid-Range","India"],
  ["Mahindra","Thar","SUV","Diesel","Manual",4,2184,15.2,null,2023,1072000,1690000,"Mid-Range","India"],
  ["Mahindra","XUV300","SUV","Petrol","Manual",5,1197,17.0,null,2023,799000,1350000,"Budget","India"],
  ["Mahindra","XUV700","SUV","Diesel","Automatic",7,2184,16.0,null,2023,1399000,2650000,"Mid-Range","India"],

  // --- Ferrari (4 models) ---
  ["Ferrari","296 GTB","Coupe","Petrol","Automatic",2,2992,null,null,2022,57200000,60000000,"Ultra Luxury","Italy"],
  ["Ferrari","Purosangue","SUV","Petrol","Automatic",4,6496,null,null,2023,101000000,105000000,"Ultra Luxury","Italy"],
  ["Ferrari","Roma","Coupe","Petrol","Automatic",4,3855,null,null,2021,38000000,42000000,"Ultra Luxury","Italy"],
  ["Ferrari","SF90","Coupe","Hybrid","Automatic",2,3990,null,null,2021,75000000,80000000,"Ultra Luxury","Italy"],

  // --- Hyundai (6 models) ---
  ["Hyundai","Alcazar","SUV","Diesel","Automatic",7,1493,18.8,null,2024,1690000,2140000,"Mid-Range","South Korea"],
  ["Hyundai","Creta","SUV","Petrol","Automatic",5,1497,16.8,null,2024,1100000,2000000,"Mid-Range","South Korea"],
  ["Hyundai","Tucson","SUV","Diesel","Automatic",5,1997,18.5,null,2023,2775000,3389000,"Premium","South Korea"],
  ["Hyundai","Venue","SUV","Petrol","Manual",5,1197,17.5,null,2023,770000,1270000,"Budget","South Korea"],
  ["Hyundai","Verna","Sedan","Petrol","Automatic",5,1497,20.6,null,2024,1094000,1754000,"Mid-Range","South Korea"],
  ["Hyundai","i20","Hatchback","Petrol","Manual",5,1197,20.3,null,2023,699000,1150000,"Budget","South Korea"],

  // --- Honda (5 models) ---
  ["Honda","Accord","Sedan","Hybrid","Automatic",5,1993,23.1,null,2023,4600000,4800000,"Premium","Japan"],
  ["Honda","Amaze","Sedan","Petrol","CVT",5,1199,18.6,null,2024,799000,1170000,"Budget","Japan"],
  ["Honda","CR-V","SUV","Petrol","CVT",5,1997,14.6,null,2023,3490000,3890000,"Premium","Japan"],
  ["Honda","City","Sedan","Petrol","CVT",5,1498,17.8,null,2024,1150000,1530000,"Mid-Range","Japan"],
  ["Honda","Civic","Sedan","Petrol","CVT",5,1799,16.5,null,2023,3200000,3450000,"Premium","Japan"],

  // --- Rolls-Royce (3 models) ---
  ["Rolls-Royce","Cullinan","SUV","Petrol","Automatic",5,6749,7.0,null,2023,69500000,105000000,"Ultra Luxury","United Kingdom"],
  ["Rolls-Royce","Ghost","Sedan","Petrol","Automatic",5,6749,8.2,null,2023,69500000,80000000,"Ultra Luxury","United Kingdom"],
  ["Rolls-Royce","Phantom","Sedan","Petrol","Automatic",5,6749,7.8,null,2023,95000000,110000000,"Ultra Luxury","United Kingdom"],

  // --- Porsche (5 models) ---
  ["Porsche","911","Coupe","Petrol","Automatic",4,2981,10.3,null,2023,17500000,33500000,"Ultra Luxury","Germany"],
  ["Porsche","Cayenne","SUV","Petrol","Automatic",5,2995,11.0,null,2024,12900000,19500000,"Luxury","Germany"],
  ["Porsche","Macan","SUV","Petrol","Automatic",5,1984,13.0,null,2024,8390000,13400000,"Luxury","Germany"],
  ["Porsche","Panamera","Sedan","Petrol","Automatic",4,2894,11.5,null,2024,15500000,24000000,"Luxury","Germany"],
  ["Porsche","Taycan","Sedan","Electric","Automatic",4,null,null,490,2023,14700000,23900000,"Luxury","Germany"],

  // --- Toyota (5 models) ---
  ["Toyota","Camry","Sedan","Hybrid","Automatic",5,2487,19.1,null,2023,4600000,4800000,"Premium","Japan"],
  ["Toyota","Corolla","Sedan","Petrol","CVT",5,1798,14.0,null,2021,1700000,2100000,"Mid-Range","Japan"],
  ["Toyota","Fortuner","SUV","Diesel","Automatic",7,2755,14.2,null,2024,3340000,5190000,"Premium","Japan"],
  ["Toyota","Innova Hycross","MPV","Hybrid","Automatic",7,1987,21.1,null,2024,1990000,3060000,"Mid-Range","Japan"],
  ["Toyota","Urban Cruiser","SUV","Petrol","Manual",5,1197,20.0,null,2023,780000,1200000,"Budget","Japan"],

  // --- Tesla (4 models) ---
  ["Tesla","Model 3","Sedan","Electric","Automatic",5,null,null,510,2024,4490000,5290000,"Premium","USA"],
  ["Tesla","Model S","Sedan","Electric","Automatic",5,null,null,650,2023,11000000,14500000,"Luxury","USA"],
  ["Tesla","Model X","SUV","Electric","Automatic",7,null,null,580,2023,12000000,15500000,"Luxury","USA"],
  ["Tesla","Model Y","SUV","Electric","Automatic",5,null,null,530,2024,5100000,6100000,"Premium","USA"],

  // --- Bentley (3 models) ---
  ["Bentley","Bentayga","SUV","Petrol","Automatic",5,3996,9.0,null,2023,42500000,60000000,"Ultra Luxury","United Kingdom"],
  ["Bentley","Continental GT","Coupe","Petrol","Automatic",4,5950,8.5,null,2023,39000000,47000000,"Ultra Luxury","United Kingdom"],
  ["Bentley","Flying Spur","Sedan","Petrol","Automatic",5,5950,8.8,null,2023,38500000,46000000,"Ultra Luxury","United Kingdom"],

  // --- Kia (4 models) ---
  ["Kia","Carens","MPV","Petrol","Automatic",7,1497,16.5,null,2024,1070000,1900000,"Mid-Range","South Korea"],
  ["Kia","EV6","SUV","Electric","Automatic",5,null,null,528,2023,6095000,6595000,"Premium","South Korea"],
  ["Kia","Seltos","SUV","Petrol","Automatic",5,1497,16.8,null,2024,1100000,2030000,"Mid-Range","South Korea"],
  ["Kia","Sonet","SUV","Petrol","Manual",5,1197,18.2,null,2023,790000,1530000,"Budget","South Korea"],

  // --- Audi (6 models) ---
  ["Audi","A4","Sedan","Petrol","Automatic",5,1984,17.4,null,2023,4350000,4800000,"Premium","Germany"],
  ["Audi","A6","Sedan","Petrol","Automatic",5,1984,14.1,null,2023,5490000,6290000,"Premium","Germany"],
  ["Audi","A8","Sedan","Petrol","Automatic",5,2995,12.0,null,2023,10100000,13000000,"Luxury","Germany"],
  ["Audi","Q3","SUV","Petrol","Automatic",5,1984,17.0,null,2023,4400000,5000000,"Premium","Germany"],
  ["Audi","Q5","SUV","Petrol","Automatic",5,1984,14.2,null,2024,6510000,6730000,"Premium","Germany"],
  ["Audi","Q7","SUV","Petrol","Automatic",7,2995,11.2,null,2024,8480000,8830000,"Luxury","Germany"],

  // --- Maruti Suzuki (7 models) ---
  ["Maruti Suzuki","Alto","Hatchback","Petrol","Manual",5,796,22.1,null,2023,370000,510000,"Budget","India"],
  ["Maruti Suzuki","Baleno","Hatchback","Petrol","CVT",5,1197,22.4,null,2024,655000,975000,"Budget","India"],
  ["Maruti Suzuki","Brezza","SUV","Petrol","Automatic",5,1462,19.8,null,2024,830000,1410000,"Budget","India"],
  ["Maruti Suzuki","Ertiga","MPV","Petrol","Automatic",7,1462,20.3,null,2024,860000,1280000,"Budget","India"],
  ["Maruti Suzuki","Fronx","SUV","Petrol","Automatic",5,1197,21.5,null,2024,770000,1350000,"Budget","India"],
  ["Maruti Suzuki","Grand Vitara","SUV","Hybrid","Automatic",5,1490,19.4,null,2024,1088000,1990000,"Mid-Range","India"],
  ["Maruti Suzuki","Swift","Hatchback","Petrol","Manual",5,1197,24.8,null,2024,600000,875000,"Budget","India"],

  // --- Mercedes-Benz (6 models) ---
  ["Mercedes-Benz","A-Class","Sedan","Petrol","Automatic",5,1332,17.8,null,2023,4200000,4400000,"Premium","Germany"],
  ["Mercedes-Benz","C-Class","Sedan","Petrol","Automatic",5,1496,15.6,null,2024,5700000,6200000,"Premium","Germany"],
  ["Mercedes-Benz","E-Class","Sedan","Petrol","Automatic",5,1991,14.2,null,2024,7500000,8600000,"Luxury","Germany"],
  ["Mercedes-Benz","GLA","SUV","Petrol","Automatic",5,1332,16.8,null,2023,4790000,5490000,"Premium","Germany"],
  ["Mercedes-Benz","GLE","SUV","Diesel","Automatic",5,2925,14.3,null,2024,8700000,10300000,"Luxury","Germany"],
  ["Mercedes-Benz","S-Class","Sedan","Petrol","Automatic",5,2999,10.8,null,2023,16000000,21000000,"Luxury","Germany"],

  // --- Lamborghini (3 models) ---
  ["Lamborghini","Aventador","Coupe","Petrol","Automatic",2,6498,5.0,null,2022,60000000,65000000,"Ultra Luxury","Italy"],
  ["Lamborghini","Huracan","Coupe","Petrol","Automatic",2,5204,7.0,null,2023,37000000,44000000,"Ultra Luxury","Italy"],
  ["Lamborghini","Urus","SUV","Petrol","Automatic",5,3996,8.0,null,2023,33100000,40000000,"Ultra Luxury","Italy"],

  // --- Skoda (3 models — representative; CSV might have more but these are the Indian market ones) ---
  // Note: Dataset may not have Skoda but we'll handle it in case
  // Actually looking at the CSV, there's no Skoda. Let me skip.

  // --- Volkswagen (no models in CSV) ---
  // Same - no VW in the CSV data

  // --- Tata (6 models) ---
  ["Tata","Altroz","Hatchback","Petrol","Manual",5,1199,22.3,null,2024,670000,1080000,"Budget","India"],
  ["Tata","Harrier","SUV","Diesel","Automatic",5,1956,16.4,null,2024,1500000,2620000,"Mid-Range","India"],
  ["Tata","Nexon","SUV","Petrol","Manual",5,1199,17.4,null,2024,800000,1450000,"Budget","India"],
  ["Tata","Punch","SUV","Petrol","Manual",5,1199,18.8,null,2024,600000,990000,"Budget","India"],
  ["Tata","Safari","SUV","Diesel","Automatic",7,1956,14.5,null,2024,1600000,2800000,"Mid-Range","India"],
  ["Tata","Tiago","Hatchback","Petrol","Manual",5,1199,23.8,null,2023,550000,780000,"Budget","India"],
];

// Column mapping
const COLS = ["brand","model","bodyType","fuelType","transmission","seating","engineCc","mileageKmpl","evRangeKm","launchYear","priceMinInr","priceMaxInr","segment","country"];

function buildRegistry() {
  const brandMap = {};

  for (const row of RAW) {
    const obj = {};
    COLS.forEach((col, i) => { obj[col] = row[i]; });

    const brandKey = obj.brand;
    if (!brandMap[brandKey]) {
      brandMap[brandKey] = {};
    }

    const modelKey = obj.model;
    if (!brandMap[brandKey][modelKey]) {
      brandMap[brandKey][modelKey] = {
        id: `${obj.brand.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${obj.model.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        brand: obj.brand,
        model: obj.model,
        defaultBodyType: obj.bodyType,
        defaultFuelType: obj.fuelType,
        defaultTransmission: obj.transmission,
        seating: obj.seating,
        engineCc: obj.engineCc,
        mileageKmpl: obj.mileageKmpl,
        evRangeKm: obj.evRangeKm,
        launchYear: obj.launchYear,
        priceMinInr: obj.priceMinInr,
        priceMaxInr: obj.priceMaxInr,
        segment: obj.segment,
        country: obj.country,
        imageUrl: null,
      };
    }
  }

  // Flatten to array
  const cars = [];
  for (const brand of Object.keys(brandMap)) {
    for (const model of Object.keys(brandMap[brand])) {
      cars.push(brandMap[brand][model]);
    }
  }

  return {
    version: "1.0.0",
    source: "curated",
    lastUpdated: new Date().toISOString().split("T")[0],
    totalModels: cars.length,
    cars,
  };
}

// Generate and write
const registry = buildRegistry();
const outPath = path.join(__dirname, "..", "data", "displayCarRegistry.json");
fs.writeFileSync(outPath, JSON.stringify(registry, null, 2), "utf-8");
console.log(`✅ Generated displayCarRegistry.json with ${registry.totalModels} car models.`);
console.log(`   Path: ${outPath}`);
