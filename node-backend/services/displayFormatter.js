/**
 * DreamDrive Display Formatter
 * Server-side formatting for prices, mileage, engine specs.
 * Replaces fragile frontend denormalization with authoritative formatting.
 */

/**
 * Format price in Indian Rupee notation
 * @param {number} price - Price in INR
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  if (!price || price <= 0) return "N/A";

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

/**
 * Format mileage based on fuel type
 * @param {number|null} mileageKmpl - Mileage in kmpl (for ICE/hybrid)
 * @param {number|null} evRangeKm - EV range in km
 * @param {string} fuelType - Fuel type for context
 * @returns {string} Formatted mileage string
 */
function formatMileage(mileageKmpl, evRangeKm, fuelType) {
  const isElectric = fuelType && (
    fuelType.toLowerCase() === "electric" ||
    fuelType.toLowerCase() === "ev"
  );

  if (isElectric) {
    if (evRangeKm && evRangeKm > 0) {
      return `${Math.round(evRangeKm)} km range`;
    }
    return "N/A";
  }

  if (mileageKmpl && mileageKmpl > 0) {
    // Sanity: real-world mileage is 5-50 kmpl
    if (mileageKmpl < 3 || mileageKmpl > 60) return "N/A";
    return `${mileageKmpl.toFixed(1)} kmpl`;
  }

  return "N/A";
}

/**
 * Format engine capacity
 * @param {number|null} engineCc - Engine displacement in cc
 * @param {string} fuelType - Fuel type for context
 * @returns {string} Formatted engine string
 */
function formatEngine(engineCc, fuelType) {
  const isElectric = fuelType && (
    fuelType.toLowerCase() === "electric" ||
    fuelType.toLowerCase() === "ev"
  );

  if (isElectric) return "Electric Motor";
  if (!engineCc || engineCc <= 0) return "N/A";

  // Sanity: real engines are 600-8500 cc
  if (engineCc < 500 || engineCc > 9000) return "N/A";

  return `${Math.round(engineCc).toLocaleString("en-IN")} cc`;
}

/**
 * Format seating capacity with sanity check
 * @param {number} seating
 * @returns {string}
 */
function formatSeating(seating) {
  if (!seating || seating < 2 || seating > 9) return "N/A";
  return `${seating} Seater`;
}

/**
 * Sanitize a complete car object — final safety pass
 * Catches impossible values and replaces with N/A
 * @param {Object} car - Car display object
 * @returns {Object} Sanitized car object
 */
function sanitizeCarObject(car) {
  const sanitized = { ...car };

  // Price sanity (Indian market: ₹3L to ₹15Cr)
  if (sanitized.priceMinInr && (sanitized.priceMinInr < 300000 || sanitized.priceMinInr > 150000000)) {
    sanitized.priceMinInr = null;
  }
  if (sanitized.priceMaxInr && (sanitized.priceMaxInr < 300000 || sanitized.priceMaxInr > 150000000)) {
    sanitized.priceMaxInr = null;
  }

  // Pre-format prices
  sanitized.priceFormatted = {
    min: formatPrice(sanitized.priceMinInr),
    max: formatPrice(sanitized.priceMaxInr),
  };

  // Pre-format specs
  sanitized.mileageFormatted = formatMileage(
    sanitized.mileageKmpl,
    sanitized.evRangeKm,
    sanitized.fuelType
  );
  sanitized.engineFormatted = formatEngine(sanitized.engineCc, sanitized.fuelType);
  sanitized.seatingFormatted = formatSeating(sanitized.seating);

  // Launch year sanity
  if (sanitized.launchYear && (sanitized.launchYear < 2010 || sanitized.launchYear > 2027)) {
    sanitized.launchYear = null;
  }

  return sanitized;
}

module.exports = {
  formatPrice,
  formatMileage,
  formatEngine,
  formatSeating,
  sanitizeCarObject,
};
