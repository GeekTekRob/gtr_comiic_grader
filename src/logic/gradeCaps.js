/**
 * Grade Cap Validation Logic
 * Enforces CGC page quality caps based on paper condition
 */

const PAGE_QUALITY_CAPS = {
  'White Pages': 10.0,
  'Off-White to White': 9.9,
  'Light Tan to Off-White': 8.5,
  'Tan to Off-White': 7.5,
  'Slightly Brittle': 6.5,
  'Brittle': 3.5,
  'Unknown': 10.0, // Default if not specified
};

/**
 * Apply grade cap based on page quality
 * @param {number} suggestedGrade - Grade suggested by AI
 * @param {string} pageQuality - Page quality designation
 * @returns {number} - Capped grade
 */
export function applyGradeCap(suggestedGrade, pageQuality) {
  const cap = PAGE_QUALITY_CAPS[pageQuality] || PAGE_QUALITY_CAPS['Unknown'];
  return Math.min(suggestedGrade, cap);
}

/**
 * Get the cap applied for a given page quality
 * @param {string} pageQuality - Page quality designation
 * @returns {number} - Maximum possible grade for this page quality
 */
export function getPageQualityCap(pageQuality) {
  return PAGE_QUALITY_CAPS[pageQuality] || PAGE_QUALITY_CAPS['Unknown'];
}

/**
 * Check if a grade is valid for the given page quality
 * @param {number} grade - Grade to validate
 * @param {string} pageQuality - Page quality designation
 * @returns {object} - { isValid: boolean, cap: number, difference: number }
 */
export function validateGradeForPageQuality(grade, pageQuality) {
  const cap = getPageQualityCap(pageQuality);
  const isValid = grade <= cap;
  const difference = grade - cap;

  return {
    isValid,
    cap,
    difference: isValid ? 0 : difference,
    message: isValid
      ? `Grade ${grade} is valid for "${pageQuality}" pages (cap: ${cap})`
      : `Grade ${grade} exceeds the cap for "${pageQuality}" pages (cap: ${cap}). Reduced by ${Math.abs(difference)} points.`,
  };
}

/**
 * List all page quality designations and their caps
 * @returns {object} - All page qualities and their caps
 */
export function getAllPageQualityCaps() {
  return { ...PAGE_QUALITY_CAPS };
}
