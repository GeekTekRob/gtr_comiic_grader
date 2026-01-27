/**
 * Response Formatter
 * Standardizes responses across all AI providers
 */

import {
  parseAIResponse,
  validateGradingResponse,
  formatFinalReport,
  getGradeLabel,
} from '../logic/gradeValidator.js';

/**
 * Format AI response into standardized grading report
 * @param {object} aiResult - Result from AI provider
 * @returns {object} - Formatted grading report
 */
export function formatGradingReport(aiResult) {
  if (!aiResult.success) {
    return {
      success: false,
      error: aiResult.error,
      provider: aiResult.provider,
      timestamp: aiResult.timestamp,
    };
  }

  try {
    // Parse the AI response
    const parsed = parseAIResponse(aiResult.response);

    // Validate the response
    const validation = validateGradingResponse(parsed);

    // Format final report
    const finalReport = formatFinalReport(validation);

    return {
      success: true,
      provider: aiResult.provider,
      timestamp: aiResult.timestamp,
      grade: finalReport.grade,
      gradeLabel: finalReport.gradeLabel,
      analysis: finalReport.analysis,
      suggestions: finalReport.suggestions,
      metadata: finalReport.metadata,
      rawResponse: aiResult.response,
    };
  } catch (error) {
    console.error('Error formatting response:', error);
    return {
      success: false,
      error: `Failed to format response: ${error.message}`,
      provider: aiResult.provider,
      timestamp: aiResult.timestamp,
      rawResponse: aiResult.response,
    };
  }
}

/**
 * Format multiple AI responses for comparison
 * @param {object[]} aiResults - Array of AI results
 * @returns {object[]} - Array of formatted reports
 */
export function formatMultipleReports(aiResults) {
  return aiResults.map((result) => formatGradingReport(result));
}

/**
 * Export report as JSON
 * @param {object} report - Formatted grading report
 * @returns {string} - JSON string
 */
export function exportAsJSON(report) {
  return JSON.stringify(report, null, 2);
}

/**
 * Export report as Markdown
 * @param {object} report - Formatted grading report
 * @returns {string} - Markdown formatted report
 */
export function exportAsMarkdown(report) {
  if (!report.success) {
    return `# Grading Report - Error\n\n**Provider:** ${report.provider}\n**Error:** ${report.error}\n**Timestamp:** ${report.timestamp}`;
  }

  return `# Comic Book Grading Report

**Provider:** ${report.provider}  
**Timestamp:** ${report.timestamp}

## Grade

**${report.grade}** - ${report.gradeLabel}

## Analysis

### Defects
${report.analysis.defects}

### Page Quality
${report.analysis.pageQuality}

### Restoration
${report.analysis.restoration}

## Suggestions

### Repair/Improvement
${report.suggestions.repair}

### Prevention
${report.suggestions.prevention}

## Metadata

- Grade was capped: ${report.metadata.gradeWasCapped}
- Original grade: ${report.metadata.originalGrade}
- Page quality cap: ${report.metadata.pageQualityCap}
${report.metadata.warnings.length > 0 ? `\n### Warnings\n${report.metadata.warnings.map((w) => `- ${w}`).join('\n')}` : ''}
${report.metadata.errors.length > 0 ? `\n### Errors\n${report.metadata.errors.map((e) => `- ${e}`).join('\n')}` : ''}
`;
}

/**
 * Export report as plain text
 * @param {object} report - Formatted grading report
 * @returns {string} - Plain text formatted report
 */
export function exportAsText(report) {
  if (!report.success) {
    return `GRADING REPORT - ERROR\n\nProvider: ${report.provider}\nError: ${report.error}\nTimestamp: ${report.timestamp}`;
  }

  return `GRADING REPORT
================

Provider: ${report.provider}
Timestamp: ${report.timestamp}

GRADE: ${report.grade} - ${report.gradeLabel}

GRADING ANALYSIS
----------------

Defects:
${report.analysis.defects}

Page Quality:
${report.analysis.pageQuality}

Restoration:
${report.analysis.restoration}

SUGGESTIONS
-----------

Repair/Improvement:
${report.suggestions.repair}

Prevention:
${report.suggestions.prevention}

METADATA
--------

Grade was capped: ${report.metadata.gradeWasCapped}
Original grade: ${report.metadata.originalGrade}
Page quality cap: ${report.metadata.pageQualityCap}

${report.metadata.warnings.length > 0 ? `Warnings:\n${report.metadata.warnings.map((w) => `- ${w}`).join('\n')}\n` : ''}
${report.metadata.errors.length > 0 ? `Errors:\n${report.metadata.errors.map((e) => `- ${e}`).join('\n')}` : ''}
`;
}

/**
 * Create HTML formatted report
 * @param {object} report - Formatted grading report
 * @returns {string} - HTML formatted report
 */
export function exportAsHTML(report) {
  const style = `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
      .container { max-width: 900px; margin: 0 auto; }
      h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
      h2 { color: #34495e; margin-top: 25px; }
      .grade-box { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-size: 24px;
        font-weight: bold;
        margin: 20px 0;
      }
      .metadata { background: #ecf0f1; padding: 15px; border-radius: 5px; margin-top: 20px; }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      .error { background: #f8d7da; border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; }
      .section { margin: 20px 0; }
      .provider { color: #7f8c8d; font-size: 12px; }
    </style>
  `;

  const content = !report.success
    ? `<div class="error"><strong>Error:</strong> ${report.error}</div>`
    : `
    <div class="grade-box">
      ${report.grade} - ${report.gradeLabel}
    </div>

    <div class="section">
      <h2>Grading Analysis</h2>
      <h3>Defects</h3>
      <p>${report.analysis.defects}</p>
      
      <h3>Page Quality</h3>
      <p>${report.analysis.pageQuality}</p>
      
      <h3>Restoration</h3>
      <p>${report.analysis.restoration}</p>
    </div>

    <div class="section">
      <h2>Suggestions</h2>
      <h3>Repair/Improvement</h3>
      <p>${report.suggestions.repair}</p>
      
      <h3>Prevention</h3>
      <p>${report.suggestions.prevention}</p>
    </div>

    <div class="metadata">
      <h3>Metadata</h3>
      <p><strong>Grade was capped:</strong> ${report.metadata.gradeWasCapped}</p>
      <p><strong>Original grade:</strong> ${report.metadata.originalGrade}</p>
      <p><strong>Page quality cap:</strong> ${report.metadata.pageQualityCap}</p>
      
      ${report.metadata.warnings.length > 0 ? `
      <div>
        <h4>Warnings</h4>
        ${report.metadata.warnings.map((w) => `<div class="warning">${w}</div>`).join('')}
      </div>
      ` : ''}

      ${report.metadata.errors.length > 0 ? `
      <div>
        <h4>Errors</h4>
        ${report.metadata.errors.map((e) => `<div class="error">${e}</div>`).join('')}
      </div>
      ` : ''}
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comic Grading Report</title>
  ${style}
</head>
<body>
  <div class="container">
    <h1>Comic Book Grading Report</h1>
    <p class="provider">Provider: ${report.provider} | Timestamp: ${report.timestamp}</p>
    ${content}
  </div>
</body>
</html>
  `;
}
