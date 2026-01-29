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

  // Clean up the input
  gradeText = gradeText.toString().trim();
  
  console.log('[parseGrade] Parsing grade text:', gradeText);

  // Try to extract decimal number first
  const decimalMatch = gradeText.match(/(\d+\.?\d*)/);
  if (decimalMatch) {
    const grade = parseFloat(decimalMatch[1]);
    console.log('[parseGrade] Extracted number:', grade);
    if (grade >= 0 && grade <= 10) {
      const rounded = Math.round(grade * 10) / 10; // Round to nearest 0.1
      console.log('[parseGrade] Final grade:', rounded);
      return rounded;
    }
  }

  // If no number found, return null
  console.log('[parseGrade] No valid grade number found');
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

  console.log('[Parser] Parsing AI response, first 500 chars:', aiResponse.substring(0, 500));

  // Parse GRADE line - more flexible pattern
  // Matches: **GRADE:** [number] [label] or GRADE: [number] [label]
  let gradeMatch = aiResponse.match(/\*?\*?GRADE:\*?\*?\s*([^\n]+)/i);
  if (!gradeMatch) {
    // Try alternative: just look for a line with a number between 0-10 followed by a grade name
    gradeMatch = aiResponse.match(/^[\s*-]*(?:GRADE[:\s]*)?(\d+\.?\d*)\s+([^\n]+)$/mi);
    if (gradeMatch) {
      response.grade = parseGrade(gradeMatch[1]);
      response.gradeLabel = `${gradeMatch[1]} ${gradeMatch[2]}`.trim();
    }
  } else {
    response.grade = parseGrade(gradeMatch[1]);
    response.gradeLabel = gradeMatch[1].trim();
  }

  console.log('[Parser] Parsed grade:', { grade: response.grade, gradeLabel: response.gradeLabel });

  // Parse DEFECTS - more flexible, handles various formatting
  let defectsMatch = aiResponse.match(/\*?\*?Defects?:\*?\*?\s*([^\n]+(?:\n(?![\s*]*\*?\*?[A-Z])[^\n]*)*)/i);
  if (defectsMatch) {
    response.defects = defectsMatch[1].trim();
  } else {
    // Try finding after "Defects" with or without bullets
    defectsMatch = aiResponse.match(/(?:^|\n)[\s*-]*Defects?[:\s]*(.+?)(?=\n[\s*-]*(?:Page Quality|Restoration|Repair|Prevention)|\n[\s*-]*\*\*)/is);
    if (defectsMatch) {
      response.defects = defectsMatch[1].trim();
    }
  }

  // Parse PAGE QUALITY - more flexible
  let pageQualityMatch = aiResponse.match(/\*?\*?Page Quality:\*?\*?\s*([^\n]+(?:\n(?![\s*]*\*?\*?[A-Z])[^\n]*)*)/i);
  if (pageQualityMatch) {
    response.pageQuality = pageQualityMatch[1].trim();
  } else {
    pageQualityMatch = aiResponse.match(/(?:^|\n)[\s*-]*Page Quality[:\s]*(.+?)(?=\n[\s*-]*(?:Restoration|Repair|Prevention)|\n[\s*-]*\*\*)/is);
    if (pageQualityMatch) {
      response.pageQuality = pageQualityMatch[1].trim();
    }
  }

  // Parse RESTORATION - more flexible
  let restorationMatch = aiResponse.match(/\*?\*?Restoration:\*?\*?\s*([^\n]+(?:\n(?![\s*]*\*?\*?[A-Z])[^\n]*)*)/i);
  if (restorationMatch) {
    response.restoration = restorationMatch[1].trim();
  } else {
    restorationMatch = aiResponse.match(/(?:^|\n)[\s*-]*Restoration[:\s]*(.+?)(?=\n[\s*-]*(?:Repair|Prevention)|\n[\s*-]*\*\*)/is);
    if (restorationMatch) {
      response.restoration = restorationMatch[1].trim();
    }
  }

  // Parse REPAIR/IMPROVEMENT - more flexible including inline Prevention stop
  let repairMatch = aiResponse.match(/\*?\*?Repair(?:\/Improvement)?:\*?\*?\s*([\s\S]+?)(?=\s*(?:\n\s*)*\*?\*?Prevention:|\n\s*\*?\*?[A-Z][a-z]+:|$)/i);
  
  if (repairMatch) {
    response.repair = repairMatch[1].trim();
  }

  // Parse PREVENTION - more flexible
  let preventionMatch = aiResponse.match(/\*?\*?Prevention:\*?\*?\s*([\s\S]+?)(?=\n\s*\*?\*?[A-Z][a-z]+:|$)/i);
  if (preventionMatch) {
    response.prevention = preventionMatch[1].trim();
  }

  console.log('[Parser] Parsing complete:', {
    hasGrade: !!response.grade,
    hasDefects: !!response.defects,
    hasPageQuality: !!response.pageQuality,
    hasRestoration: !!response.restoration,
    hasRepair: !!response.repair,
    hasPrevention: !!response.prevention,
  });

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
