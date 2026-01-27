/**
 * Grade Validator
 * Ensures AI-generated grades conform to CGC standards and page quality caps
 */

import { applyGradeCap, validateGradeForPageQuality } from './gradeCaps.js';
import { parseRestoration, estimateGradeReduction } from './restoration.js';

const GRADE_LABELS = {
  10.0: 'Gem Mint (GM)',
  9.8: 'Near Mint/Mint (NM/M)',
  9.6: 'Near Mint Plus (NM+)',
  9.4: 'Near Mint (NM)',
  9.2: 'Near Mint Minus (NM-)',
  9.0: 'Very Fine/Near Mint (VF/NM)',
  8.5: 'Very Fine Plus (VF+)',
  8.0: 'Very Fine (VF)',
  7.5: 'Very Fine Minus (VF-)',
  7.0: 'Fine/Very Fine (FN/VF)',
  6.5: 'Fine Plus (FN+)',
  6.0: 'Fine (FN)',
  5.5: 'Fine Minus (FN-)',
  5.0: 'Very Good/Fine (VG/FN)',
  4.5: 'Very Good Plus (VG+)',
  4.0: 'Very Good (VG)',
  3.5: 'Very Good Minus (VG-)',
  3.0: 'Good/Very Good (GD/VG)',
  2.5: 'Good Plus (GD+)',
  2.0: 'Good (GD)',
  1.5: 'Fair/Good (FR/GD)',
  1.0: 'Fair (FR)',
  0.5: 'Poor (PR)',
};

/**
 * Parse grade from AI response text
 * @param {string} gradeText - Grade text from AI (e.g., "6.0" or "Fine (FN)")
 * @returns {number|null} - Parsed numerical grade
 */
export function parseGrade(gradeText) {
  if (!gradeText) return null;

  // Try to extract decimal number first
  const decimalMatch = gradeText.match(/(\d+\.?\d*)/);
  if (decimalMatch) {
    const grade = parseFloat(decimalMatch[1]);
    if (grade >= 0 && grade <= 10) {
      return Math.round(grade * 10) / 10; // Round to nearest 0.1
    }
  }

  return null;
}

/**
 * Get grade label for a numerical grade
 * @param {number} grade - Numerical grade (0-10)
 * @returns {string} - Formatted grade label
 */
export function getGradeLabel(grade) {
  // Find closest grade label
  const closestGrade = Math.round(grade * 10) / 10;
  return GRADE_LABELS[closestGrade] || `Grade ${grade}`;
}

/**
 * Validate and cap a grade based on page quality
 * @param {number} suggestedGrade - Grade suggested by AI
 * @param {string} pageQuality - Page quality designation
 * @returns {object} - { finalGrade, label, wasCapped, cap, validation }
 */
export function validateAndCapGrade(suggestedGrade, pageQuality) {
  const validation = validateGradeForPageQuality(suggestedGrade, pageQuality);
  const finalGrade = validation.cap;
  const label = getGradeLabel(finalGrade);

  return {
    finalGrade,
    label,
    wasCapped: !validation.isValid,
    cap: validation.cap,
    originalGrade: suggestedGrade,
    validation,
  };
}

/**
 * Parse AI response and extract structured grading data
 * @param {string} aiResponse - Full response text from AI
 * @returns {object} - Parsed grading data
 */
export function parseAIResponse(aiResponse) {
  const response = {
    grade: null,
    gradeLabel: null,
    defects: null,
    pageQuality: null,
    restoration: null,
    repair: null,
    prevention: null,
    rawResponse: aiResponse,
  };

  // Parse GRADE line
  const gradeMatch = aiResponse.match(/\*\*GRADE:\*\*\s*([^\n]+)/);
  if (gradeMatch) {
    response.grade = parseGrade(gradeMatch[1]);
    response.gradeLabel = gradeMatch[1].trim();
  }

  // Parse DEFECTS
  const defectsMatch = aiResponse.match(/\*\*Defects:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]*)*)/);
  if (defectsMatch) {
    response.defects = defectsMatch[1].trim();
  }

  // Parse PAGE QUALITY
  const pageQualityMatch = aiResponse.match(/\*\*Page Quality:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]*)*)/);
  if (pageQualityMatch) {
    response.pageQuality = pageQualityMatch[1].trim();
  }

  // Parse RESTORATION
  const restorationMatch = aiResponse.match(/\*\*Restoration:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]*)*)/);
  if (restorationMatch) {
    response.restoration = restorationMatch[1].trim();
  }

  // Parse REPAIR/IMPROVEMENT
  const repairMatch = aiResponse.match(/\*\*Repair\/Improvement:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]*)*)/);
  if (repairMatch) {
    response.repair = repairMatch[1].trim();
  }

  // Parse PREVENTION
  const preventionMatch = aiResponse.match(/\*\*Prevention:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]*)*)/);
  if (preventionMatch) {
    response.prevention = preventionMatch[1].trim();
  }

  return response;
}

/**
 * Validate complete grading response
 * @param {object} parsedResponse - Parsed response from parseAIResponse
 * @returns {object} - Validation result with potential corrections
 */
export function validateGradingResponse(parsedResponse) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    corrections: {},
    parsed: parsedResponse,
  };

  // Validate grade exists
  if (!parsedResponse.grade) {
    result.isValid = false;
    result.errors.push('No numerical grade found in response');
  }

  // Validate page quality exists
  if (!parsedResponse.pageQuality) {
    result.warnings.push('Page quality not clearly specified');
  }

  // Validate and cap grade
  if (parsedResponse.grade && parsedResponse.pageQuality) {
    const validation = validateAndCapGrade(parsedResponse.grade, parsedResponse.pageQuality);
    if (validation.wasCapped) {
      result.warnings.push(
        `Grade was capped from ${parsedResponse.grade} to ${validation.finalGrade} based on page quality "${parsedResponse.pageQuality}"`
      );
      result.corrections.grade = validation;
    }
  }

  // Validate restoration info
  if (parsedResponse.restoration) {
    const restoration = parseRestoration(parsedResponse.restoration);
    result.parsed.restorationAnalysis = restoration;
  }

  // Validate defects exist
  if (!parsedResponse.defects) {
    result.warnings.push('Defects section is empty or unclear');
  }

  // Validate suggestions exist
  if (!parsedResponse.repair && !parsedResponse.prevention) {
    result.warnings.push('Restoration or prevention suggestions are missing');
  }

  return result;
}

/**
 * Format final grading report
 * @param {object} validation - Result from validateGradingResponse
 * @returns {object} - Formatted final report
 */
export function formatFinalReport(validation) {
  const parsed = validation.parsed;
  const gradeCorrection = validation.corrections.grade;

  const finalGrade = gradeCorrection ? gradeCorrection.finalGrade : parsed.grade;
  const finalLabel = gradeCorrection ? gradeCorrection.label : getGradeLabel(parsed.grade);

  return {
    grade: finalGrade,
    gradeLabel: finalLabel,
    analysis: {
      defects: parsed.defects || 'Not specified',
      pageQuality: parsed.pageQuality || 'Unknown',
      restoration: parsed.restoration || 'None detected',
    },
    suggestions: {
      repair: parsed.repair || 'Standard archival storage recommended',
      prevention: parsed.prevention || 'Store in acid-free materials in controlled environment',
    },
    metadata: {
      gradeWasCapped: gradeCorrection ? true : false,
      originalGrade: parsed.grade,
      pageQualityCap: gradeCorrection ? gradeCorrection.cap : null,
      warnings: validation.warnings,
      errors: validation.errors,
    },
  };
}
