import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { SaveReport } from './SaveReport';

export function GradeReport({ report, comicName, issueNumber, coverImage }) {
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage);
      setCoverUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverImage]);

  if (!report || !report.success) {
    return (
      <div className="report error">
        <h2>Grading Error</h2>
        <p>{report?.error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  const { grade, gradeLabel, analysis, suggestions, metadata } = report;

  return (
    <div className="report success">
      <div className="report-export-header">
        <SaveReport report={report} comicName={comicName} issueNumber={issueNumber} coverImage={coverImage} />
      </div>

      <div className="report-banner">
        <div className="report-banner-left">
          {coverUrl && (
            <div className="report-cover-mini">
               <img src={coverUrl} alt="Comic Cover" />
            </div>
          )}
          <div className="report-meta">
              <h1>{comicName}</h1>
              <h2>Issue #{issueNumber}</h2>
          </div>
        </div>

        <div className="report-banner-right">
             <div className="grade-box">
                 <span className="grade-number">{grade}</span>
                 <span className="grade-label">{gradeLabel}</span>
             </div>
             <div className="provider-badge-small">{report.provider}</div>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Grading Analysis</h3>

        <div className="analysis-item">
          <h4>Defects</h4>
          <div className="md-content"><Markdown>{analysis.defects}</Markdown></div>
        </div>

        <div className="analysis-item">
          <h4>Page Quality</h4>
          <div className="md-content"><Markdown>{analysis.pageQuality}</Markdown></div>
        </div>

        <div className="analysis-item">
          <h4>Restoration</h4>
          <div className="md-content"><Markdown>{analysis.restoration}</Markdown></div>
        </div>
      </div>

      <div className="suggestions-section">
        <h3>Suggestions</h3>

        <div className="suggestion-item">
          <h4>Repair / Improvement</h4>
          <div className="md-content"><Markdown>{suggestions.repair}</Markdown></div>
        </div>

        <div className="suggestion-item">
          <h4>Prevention</h4>
          <div className="md-content"><Markdown>{suggestions.prevention}</Markdown></div>
        </div>
      </div>

      {metadata.warnings && metadata.warnings.length > 0 && (
        <div className="warnings-section">
          <h4>⚠️ Warnings</h4>
          <ul>
            {metadata.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.gradeWasCapped && (
        <div className="grade-cap-info">
          <strong>Grade Adjustment:</strong> Original grade {metadata.originalGrade} was capped to{' '}
          {grade} based on page quality designation (cap: {metadata.pageQualityCap})
        </div>
      )}

      <div className="report-footer">
        <small>Provided by: {report.provider} | {new Date(report.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}
