#!/usr/bin/env node
/**
 * Updates displayCarRegistry.json with image URLs from the image resolver.
 * Run after generating model images.
 * 
 * Run: node scripts/updateRegistryImages.js
 */

const fs = require("fs");
const path = require("path");
const imageResolver = require("../services/imageResolver");
const { normalizeBrand, normalizeModel } = require("../services/normalizer");

// Initialize image resolver to scan directory
imageResolver.initialize();

// Load registry
const registryPath = path.join(__dirname, "..", "data", "displayCarRegistry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

let updated = 0;
let notFound = 0;

for (const car of registry.cars) {
  const imageUrl = imageResolver.resolveImage(car.brand, car.model);
  
  if (imageUrl) {
    car.imageUrl = imageUrl;
    updated++;
  } else {
    car.imageUrl = null;
    notFound++;
  }
}

// Write back
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");

console.log(`\n✅ Registry updated with image URLs`);
console.log(`   Updated: ${updated} models`);
console.log(`   Not found: ${notFound} models`);
console.log(`   Registry: ${registryPath}\n`);
