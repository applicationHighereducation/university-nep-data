import React, { useState, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page14 from '../pages/Page14';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: Overall Exit and Entry Data
  overallStudentsExitPercentage: string | number;
  overallStudentsMultipleEntryPercentage: string | number;
}

interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

// ====================================
// MAIN COMPONENT
// ====================================
const OverallExitEntryForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 for percentages
    overallStudentsExitPercentage: 0,
    overallStudentsMultipleEntryPercentage: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Overall Exit and Entry Data", description: "Overall student exit and multiple entry percentages", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value === '' ? 0 : value }));
  };

  // Function to get mobility assessment
  const getMobilityAssessment = (exitRate: number, entryRate: number): { status: string; color: string; description: string } => {
    const netMobility = entryRate - exitRate;
    
    if (Math.abs(netMobility) <= 2) {
      return {
        status: 'Balanced',
        color: '#17a2b8',
        description: 'Entry and exit rates are well balanced, indicating stable student flow.'
      };
    } else if (netMobility > 2) {
      return {
        status: 'Growth',
        color: '#28a745',
        description: 'More students entering than exiting, indicating institutional growth and attractiveness.'
      };
    } else {
      return {
        status: 'Contraction',
        color: '#dc3545',
        description: 'More students exiting than entering, may require attention to retention strategies.'
      };
    }
  };

  // Generic component for rendering percentage input
  const renderPercentageInput = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="number"
            className="input"
            value={formData[field]}
            onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
            min="0"
            max="100"
            step="0.01"
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#495057' }}>%</span>
        </div>
      </div>
    );
  };

  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = (): void => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSectionClick = (sectionId: number): void => {
    const maxAllowedSection = Math.max(...Array.from(completedSections), -1) + 1;
    if (sectionId <= maxAllowedSection) {
      setCurrentSection(sectionId);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Overall Exit and Entry Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page15';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page15';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values (0 for percentages)
      overallStudentsExitPercentage: 0,
      overallStudentsMultipleEntryPercentage: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: OVERALL EXIT AND ENTRY DATA
  const renderOverallExitEntryData = (): JSX.Element => {
    const exitRate = Number(formData.overallStudentsExitPercentage) || 0;
    const entryRate = Number(formData.overallStudentsMultipleEntryPercentage) || 0;
    const mobilityAssessment = getMobilityAssessment(exitRate, entryRate);

    return (
      <div className="form-section">
        <h2 className="section-title">Overall Exit and Entry Data</h2>
        <p className="section-description">Overall student exit and multiple entry percentages</p>

        <div className="form-grid">
          {renderPercentageInput(
            'Overall: Students who took Exit in the year - % of total enrolled',
            'overallStudentsExitPercentage'
          )}
          
          {renderPercentageInput(
            'Overall: Students who took Multiple Entry in the year - % of total enrolled',
            'overallStudentsMultipleEntryPercentage'
          )}
        </div>

        {/* Live analytics summary */}
        {(exitRate > 0 || entryRate > 0) && (
          <div style={{ marginTop: '25px' }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: '6px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '1.1rem' }}>
                📊 Live Student Mobility Analysis
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#856404' }}>Exit Rate</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#856404' }}>
                    {exitRate.toFixed(2)}%
                  </p>
                </div>
                
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#d1ecf1', 
                  border: '1px solid #bee5eb', 
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <strong style={{ color: '#0c5460' }}>Entry Rate</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#0c5460' }}>
                    {entryRate.toFixed(2)}%
                  </p>
                </div>
                
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: mobilityAssessment.color === '#28a745' ? '#d4edda' : 
                                   mobilityAssessment.color === '#dc3545' ? '#f8d7da' : '#d1ecf1',
                  border: `1px solid ${mobilityAssessment.color === '#28a745' ? '#c3e6cb' : 
                                      mobilityAssessment.color === '#dc3545' ? '#f5c6cb' : '#bee5eb'}`,
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <strong style={{ color: mobilityAssessment.color }}>Net Mobility</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: mobilityAssessment.color }}>
                    {(entryRate - exitRate).toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '12px', 
                padding: '8px 12px', 
                backgroundColor: mobilityAssessment.color === '#28a745' ? '#d4edda' : 
                                 mobilityAssessment.color === '#dc3545' ? '#f8d7da' : '#d1ecf1',
                border: `1px solid ${mobilityAssessment.color === '#28a745' ? '#c3e6cb' : 
                                    mobilityAssessment.color === '#dc3545' ? '#f5c6cb' : '#bee5eb'}`,
                borderRadius: '4px'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.9rem', 
                  color: mobilityAssessment.color,
                  fontWeight: '500'
                }}>
                  <strong>Status: {mobilityAssessment.status}</strong> - {mobilityAssessment.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => {
    const exitPercentage = Number(formData.overallStudentsExitPercentage) || 0;
    const multipleEntryPercentage = Number(formData.overallStudentsMultipleEntryPercentage) || 0;
    const netMobility = multipleEntryPercentage - exitPercentage;
    const mobilityAssessment = getMobilityAssessment(exitPercentage, multipleEntryPercentage);
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Exit Statistics</h4>
            <p><strong>Students Who Took Exit:</strong> {exitPercentage.toFixed(2)}% of total enrolled</p>
            <p><strong>Exit Rate Category:</strong> {
              exitPercentage <= 5 ? '🟢 Very Low' :
              exitPercentage <= 15 ? '🟡 Low' :
              exitPercentage <= 30 ? '🟠 Moderate' : '🔴 High'
            }</p>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '10px' }}>
              This represents the proportion of enrolled students who opted for exit provisions during the academic year.
            </p>
          </div>

          <div className="summary-card">
            <h4>Multiple Entry Statistics</h4>
            <p><strong>Students Who Took Multiple Entry:</strong> {multipleEntryPercentage.toFixed(2)}% of total enrolled</p>
            <p><strong>Entry Rate Category:</strong> {
              multipleEntryPercentage <= 5 ? '🔴 Very Low' :
              multipleEntryPercentage <= 15 ? '🟠 Low' :
              multipleEntryPercentage <= 30 ? '🟡 Moderate' : '🟢 High'
            }</p>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '10px' }}>
              This represents the proportion of enrolled students who utilized multiple entry provisions during the academic year.
            </p>
          </div>

          <div className="summary-card">
            <h4>Mobility Analysis</h4>
            <p><strong>Net Mobility Rate:</strong> {netMobility.toFixed(2)}%</p>
            <p><strong>Mobility Status:</strong> <span style={{ color: mobilityAssessment.color, fontWeight: 'bold' }}>
              {mobilityAssessment.status}
            </span></p>
            <p><strong>Absolute Mobility:</strong> {Math.abs(netMobility).toFixed(2)}%</p>
            <p><strong>Mobility Ratio:</strong> {
              exitPercentage > 0 ? `1:${(multipleEntryPercentage / exitPercentage).toFixed(2)}` : 'N/A'
            } (Entry:Exit)</p>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '10px' }}>
              {mobilityAssessment.description}
            </p>
          </div>

          <div className="summary-card">
            <h4>Key Performance Indicators</h4>
            <p><strong>Exit Flexibility:</strong> {
              exitPercentage > 0 ? '✅ Available' : '❌ Not Utilized'
            }</p>
            <p><strong>Multiple Entry Support:</strong> {
              multipleEntryPercentage > 0 ? '✅ Active' : '❌ Not Utilized'
            }</p>
            <p><strong>Student Choice Options:</strong> {
              (exitPercentage > 0 ? 1 : 0) + (multipleEntryPercentage > 0 ? 1 : 0)
            }/2 pathways active</p>
            <p><strong>Policy Effectiveness:</strong> {
              exitPercentage > 0 && multipleEntryPercentage > 0 ? '🟢 Comprehensive' :
              exitPercentage > 0 || multipleEntryPercentage > 0 ? '🟡 Partial' : '🔴 Inactive'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Comparative Assessment</h4>
            <p><strong>Dominant Flow:</strong> {
              Math.abs(netMobility) <= 1 ? 'Balanced mobility' :
              multipleEntryPercentage > exitPercentage ? 'Entry-dominant' : 'Exit-dominant'
            }</p>
            <p><strong>Flow Intensity:</strong> {
              Math.abs(netMobility) <= 2 ? 'Low' :
              Math.abs(netMobility) <= 10 ? 'Moderate' : 'High'
            }</p>
            <p><strong>Total Student Mobility:</strong> {(exitPercentage + multipleEntryPercentage).toFixed(2)}%</p>
            <p><strong>Retention Indicator:</strong> {
              exitPercentage <= 10 ? '🟢 Strong retention' :
              exitPercentage <= 25 ? '🟡 Moderate retention' : '🔴 Retention concerns'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Data Quality & Insights</h4>
            <p><strong>Data Completeness:</strong> {
              exitPercentage >= 0 && multipleEntryPercentage >= 0 ? '✅ Complete' : '❌ Incomplete'
            }</p>
            <p><strong>Logical Consistency:</strong> {
              exitPercentage >= 0 && multipleEntryPercentage >= 0 && 
              exitPercentage <= 100 && multipleEntryPercentage <= 100 ? '✅ Valid' : '❌ Invalid'
            }</p>
            <p><strong>Policy Impact:</strong> {
              exitPercentage > 0 || multipleEntryPercentage > 0 ? 'Measurable' : 'No impact recorded'
            }</p>
            <p><strong>Strategic Insight:</strong> {
              netMobility > 5 ? 'Focus on exit process optimization' :
              netMobility < -5 ? 'Focus on entry pathway enhancement' : 'Maintain current balance'
            }</p>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: mobilityAssessment.color === '#28a745' ? '#d4edda' : 
                             mobilityAssessment.color === '#dc3545' ? '#f8d7da' : '#d1ecf1',
            border: `1px solid ${mobilityAssessment.color === '#28a745' ? '#c3e6cb' : 
                                mobilityAssessment.color === '#dc3545' ? '#f5c6cb' : '#bee5eb'}`,
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: mobilityAssessment.color }}>
              Overall Assessment: {mobilityAssessment.status}
            </h4>
            <p style={{ margin: 0, color: mobilityAssessment.color, fontSize: '0.95rem' }}>
              {mobilityAssessment.description}
            </p>
          </div>
          
          <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
            Please review all the information above. If everything looks correct, proceed to the next step for final submission.
          </p>
        </div>
      </div>
    );
  };

  // SECTION 2: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Overall Exit and Entry Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your overall exit and entry data has been recorded.</p>
          <p>Redirecting to next form...</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Ready to Submit</h3>
          <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '30px', lineHeight: '1.6' }}>
            You have reviewed all your information. Click the "Submit Form" button below to finalize your submission.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              const formEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
              handleSubmit(formEvent);
            }}
            style={{ 
              padding: '15px 40px', 
              fontSize: '1.1rem',
              minWidth: '200px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            Submit Form
          </button>
        </div>
      )}
    </div>
  );

  // ====================================
  // MAIN RENDER FUNCTION
  // ====================================
  const renderSection = (): JSX.Element => {
    switch (currentSection) {
      case 0: return renderOverallExitEntryData();
      case 1: return renderReview();
      case 2: return renderSubmit();
      default: return <div>Section not found</div>;
    }
  };

  // ====================================
  // COMPONENT RETURN
  // ====================================
  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="container">
      <Header />
      <PageNavigationSubheader totalPages={21}/>

      <Page14
        progressPercentage={progressPercentage}
        sections={sections}
        currentSection={currentSection}
        completedSections={completedSections}
        handleSectionClick={handleSectionClick}
        handleSubmit={handleSubmit}
        handlePrevious={handlePrevious}
        handleNext={currentSection === sections.length - 1 && submitted ? handleNavigateToNextForm : handleNext}
        resetForm={resetForm}
        submitted={submitted}
        renderSection={renderSection}
        isLastSection={currentSection === sections.length - 1}
      />
    </div>
  );
};

export default OverallExitEntryForm;