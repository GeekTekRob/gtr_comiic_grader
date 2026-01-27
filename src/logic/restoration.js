/**
 * Restoration Grading Logic
 * Categorizes and grades restoration/conservation work on comics
 */

const QUALITY_LEVELS = {
  A: 'Professional/Highest Quality',
  B: 'Good Quality',
  C: 'Fair/Noticeable Quality',
};

const QUANTITY_LEVELS = {
  1: 'Minimal',
  2: 'Small',
  3: 'Moderate',
  4: 'Extensive',
  5: 'Very Extensive',
};

const CONSERVATION_TYPES = [
  'Tear Seals',
  'De-acidification',
  'Paper Reinforcement',
  'Wheat Glue Application',
  'Rice Paper Backing',
];

const RESTORATION_TYPES = [
  'Color Touch',
  'Piece Fill',
  'Regluing',
  'Spine Repair',
  'Edge Reinforcement',
  'Staple Replacement',
];

/**
 * Parse restoration text and extract quality and quantity
 * @param {string} restorationText - Text describing restoration work
 * @returns {object} - { type, quality, quantity, description }
 */
export function parseRestoration(restorationText) {
  if (!restorationText || restorationText.toLowerCase().includes('none')) {
    return {
      type: 'None',
      quality: null,
      quantity: null,
      description: 'No restoration or conservation detected',
      impact: 'None',
    };
  }

  const text = restorationText.toLowerCase();
  let type = 'Restoration';
  let quality = null;
  let quantity = null;

  // Detect conservation vs restoration
  if (
    CONSERVATION_TYPES.some((t) => text.includes(t.toLowerCase())) ||
    text.includes('conservation') ||
    text.includes('rice paper') ||
    text.includes('wheat glue')
  ) {
    type = 'Conservation';
    quality = 'A'; // Conservation is always quality A by definition
  }

  // Detect quality level
  if (text.includes('quality a') || text.includes('professional') || text.includes('highest')) {
    quality = 'A';
  } else if (text.includes('quality b') || text.includes('good')) {
    quality = 'B';
  } else if (text.includes('quality c') || text.includes('fair') || text.includes('noticeable')) {
    quality = 'C';
  }

  // Detect quantity level
  if (
    text.includes('minimal') ||
    text.includes('small amount') ||
    text.includes('quantity 1')
  ) {
    quantity = 1;
  } else if (text.includes('quantity 2') || text.includes('small ')) {
    quantity = 2;
  } else if (text.includes('quantity 3') || text.includes('moderate')) {
    quantity = 3;
  } else if (text.includes('quantity 4') || text.includes('extensive')) {
    quantity = 4;
  } else if (text.includes('quantity 5') || text.includes('very extensive')) {
    quantity = 5;
  }

  return {
    type,
    quality: quality || 'Unknown',
    quantity: quantity || 'Unknown',
    description: restorationText,
    impact: calculateRestorationImpact(type, quality, quantity),
  };
}

/**
 * Calculate the grade impact of restoration work
 * @param {string} type - Type of work (Conservation or Restoration)
 * @param {string|null} quality - Quality level (A, B, C)
 * @param {number|null} quantity - Quantity level (1-5)
 * @returns {string} - Grade impact assessment
 */
export function calculateRestorationImpact(type, quality, quantity) {
  if (type === 'None') {
    return 'No impact';
  }

  if (type === 'Conservation') {
    return 'Minimal to no grade impact (professional archival work)';
  }

  if (type === 'Restoration') {
    if (quality === 'A') {
      if (quantity <= 2) return 'Minimal grade impact (high-quality, limited work)';
      if (quantity <= 3) return 'Small grade impact (high-quality work, moderate extent)';
      return 'Moderate grade impact (high-quality work, extensive)';
    }

    if (quality === 'B') {
      if (quantity <= 2) return 'Moderate grade impact (good quality, limited work)';
      if (quantity <= 3) return 'Significant grade impact (good quality, moderate extent)';
      return 'Major grade impact (good quality, extensive)';
    }

    if (quality === 'C') {
      if (quantity <= 2) return 'Significant grade impact (fair quality, limited work)';
      if (quantity <= 3) return 'Major grade impact (fair quality, moderate extent)';
      return 'Severe grade impact (fair quality, extensive)';
    }
  }

  return 'Unknown impact';
}

/**
 * Get all restoration type definitions
 * @returns {object} - Restoration types, qualities, and quantities
 */
export function getRestorationDefinitions() {
  return {
    types: {
      conservation: CONSERVATION_TYPES,
      restoration: RESTORATION_TYPES,
    },
    qualities: QUALITY_LEVELS,
    quantities: QUANTITY_LEVELS,
  };
}

/**
 * Estimate grade reduction based on restoration
 * @param {string} type - Type of work
 * @param {string} quality - Quality level
 * @param {number} quantity - Quantity level
 * @returns {number} - Estimated grade reduction (0-3 points)
 */
export function estimateGradeReduction(type, quality, quantity) {
  if (type === 'None' || type === 'Conservation') {
    return 0;
  }

  // Restoration grade impact matrix
  const impactMatrix = {
    A: { 1: 0.5, 2: 1, 3: 1.5, 4: 2, 5: 2.5 },
    B: { 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 3 },
    C: { 1: 1.5, 2: 2, 3: 2.5, 4: 3, 5: 3 },
  };

  return impactMatrix[quality]?.[quantity] || 0;
}
