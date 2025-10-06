import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page13 from '../pages/Page13';
import { Header } from '@/components/Header';
import axios from 'axios';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: PG Exit and Entry Data
  pgStudentsAppearedFirstYear: string | number;
  pgStudentsOptedExit: string | number;
  pgStudentsEntering2ndYearAfter4YrHonours: string | number;
  pgStudentsEntering2ndYearAfterExit: string | number;
}

interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

interface ValidationError {
  field: string;
  message: string;
}

// ====================================
// MAIN COMPONENT
// ====================================
const PGExitEntryForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 for numbers
    pgStudentsAppearedFirstYear: 0,
    pgStudentsOptedExit: 0,
    pgStudentsEntering2ndYearAfter4YrHonours: 0,
    pgStudentsEntering2ndYearAfterExit: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "PG Exit and Entry Data", description: "Student exit and entry information for postgraduate programs", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const validateData = (updatedData: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const appeared = Number(updatedData.pgStudentsAppearedFirstYear) || 0;
    const exited = Number(updatedData.pgStudentsOptedExit) || 0;

    // Validation: Students who opted exit cannot exceed students who appeared
    if (exited > appeared && appeared > 0) {
      errors.push({
        field: 'pgStudentsOptedExit',
        message: 'Students who opted exit cannot exceed students who appeared in 1st year'
      });
    }

    return errors;
  };

  const updateFormData = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value === '' ? 0 : value };
      
      // Validate data and set errors
      const errors = validateData(updated);
      setValidationErrors(errors);
      
      return updated;
    });
  };

  const calculateExitPercentage = (): string => {
    const appeared = Number(formData.pgStudentsAppearedFirstYear) || 0;
    const exited = Number(formData.pgStudentsOptedExit) || 0;
    return appeared > 0 ? ((exited / appeared) * 100).toFixed(2) : '0.00';
  };

  // Check if a field has validation errors
  const hasError = (fieldName: string): boolean => {
    return validationErrors.some(error => error.field === fieldName);
  };

  // Get error message for a field
  const getErrorMessage = (fieldName: string): string => {
    const error = validationErrors.find(error => error.field === fieldName);
    return error ? error.message : '';
  };

  // Generic component for rendering number input
  const renderNumberInput = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
    const hasFieldError = hasError(field);
    const errorMessage = getErrorMessage(field);

    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className={`input ${hasFieldError ? 'input-error' : ''}`}
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
        />
        {hasFieldError && (
          <div style={{ 
            color: '#dc3545', 
            fontSize: '0.875rem', 
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>⚠️</span>
            {errorMessage}
          </div>
        )}
      </div>
    );
  };

  // Component for rendering percentage display (auto-calculated)
  const renderPercentageDisplay = (
    label: string,
    percentageValue: string
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: '8px' }}>(Auto-calculated)</span>
        </label>
        <input
          type="text"
          className="input"
          value={`${percentageValue}%`}
          readOnly
          style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
        />
      </div>
    );
  };

  //fetching



  //API Calls
  const insertData = async() => {
    try {
      const exit = calculateExitPercentage()
      const response = await axios.post('http://localhost:8000/api/page13/section1', {
        pg_appear_1yr_count: formData.pgStudentsAppearedFirstYear,
        pg_exit_1yr_percent: exit,
        pg_enter_2yr_after4yrhonour_count : formData.pgStudentsEntering2ndYearAfter4YrHonours,
        pg_enter_2yr_afterexit_count: formData.pgStudentsEntering2ndYearAfterExit
      }, {withCredentials: true})
    } catch (error) {
      console.log('Error while inserting data:', error)
    }
  }


  


  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = async() => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
    if(currentSection === 0){
      await insertData()
    }
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
    
    // Final validation before submission
    const errors = validateData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      alert('Please fix validation errors before submitting.');
      return;
    }
    
    console.log('PG Exit and Entry Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page14';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page14';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values (0 for numbers)
      pgStudentsAppearedFirstYear: 0,
      pgStudentsOptedExit: 0,
      pgStudentsEntering2ndYearAfter4YrHonours: 0,
      pgStudentsEntering2ndYearAfterExit: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
  };


  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/page13/get', {withCredentials: true});
      const existingData = response.data.data;
;
      console.log(existingData)
      if (existingData) {
        setFormData({
          pgStudentsAppearedFirstYear: existingData.pg_appear_1yr_count || 0,
          pgStudentsOptedExit: Math.round(
    (existingData.pg_exit_1yr_percent / 100) * existingData.pg_appear_1yr_count
  ) || 0,
          pgStudentsEntering2ndYearAfter4YrHonours: existingData.pg_enter_2yr_after4yrhons || 0,
          pgStudentsEntering2ndYearAfterExit: existingData.pg_enter_2yr_afterexit_count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: PG EXIT AND ENTRY DATA
  const renderPGExitEntryData = (): JSX.Element => {
    const exitPercentage = calculateExitPercentage();
    
    return (
      <div className="form-section">
        <h2 className="section-title">PG Exit and Entry Data</h2>
        <p className="section-description">Student exit and entry information for postgraduate programs</p>

        <div className="form-grid">
          {renderNumberInput(
            'PG: Students appeared in 1st year/2nd sem (2-yr PG) - Number',
            'pgStudentsAppearedFirstYear'
          )}
          
          {renderNumberInput(
            'PG: Students opted & provided Exit after 1st year (2-yr PG) - Number',
            'pgStudentsOptedExit'
          )}
          
          {renderPercentageDisplay(
            'PG: Students opted & provided Exit after 1st year (2-yr PG) - Percentage',
            exitPercentage
          )}
          
          {renderNumberInput(
            'PG: Students entering 2nd year of PG after 4-yr Honours - Number',
            'pgStudentsEntering2ndYearAfter4YrHonours'
          )}
          
          {renderNumberInput(
            'PG: Students entering 2nd year of PG after Exit (same/other HEI) - Number',
            'pgStudentsEntering2ndYearAfterExit'
          )}
        </div>

        {/* Data summary */}
        {(Number(formData.pgStudentsAppearedFirstYear) > 0 || 
          Number(formData.pgStudentsEntering2ndYearAfter4YrHonours) > 0 || 
          Number(formData.pgStudentsEntering2ndYearAfterExit) > 0) && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#e8f4fd', 
              border: '1px solid #bee5eb', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#0c5460'
            }}>
              <strong>📊 PG Program Summary:</strong>
              <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                <li>1st Year Students (2-yr PG): {formData.pgStudentsAppearedFirstYear || 0}</li>
                <li>Exit Rate: {exitPercentage}%</li>
                <li>2nd Year Entries (4-yr Honours): {formData.pgStudentsEntering2ndYearAfter4YrHonours || 0}</li>
                <li>2nd Year Entries (After Exit): {formData.pgStudentsEntering2ndYearAfterExit || 0}</li>
                <li>Total 2nd Year Entries: {
                  Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) + 
                  Number(formData.pgStudentsEntering2ndYearAfterExit || 0)
                }</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => {
    const exitPercentage = calculateExitPercentage();
    const totalSecondYearEntries = Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) + 
                                   Number(formData.pgStudentsEntering2ndYearAfterExit || 0);
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>First Year PG Program (2-yr)</h4>
            <p><strong>Students Appeared in 1st Year/2nd Sem:</strong> {formData.pgStudentsAppearedFirstYear || 0}</p>
            <p><strong>Students Opted & Provided Exit:</strong> {formData.pgStudentsOptedExit || 0}</p>
            <p><strong>Exit Percentage:</strong> {exitPercentage}%</p>
            <p><strong>Retention Rate:</strong> {
              Number(formData.pgStudentsAppearedFirstYear || 0) > 0 
                ? `${(100 - Number(exitPercentage)).toFixed(2)}%`
                : '0%'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Second Year Entry Pathways</h4>
            <p><strong>From 4-yr Honours Programs:</strong> {formData.pgStudentsEntering2ndYearAfter4YrHonours || 0}</p>
            <p><strong>After Exit (same/other HEI):</strong> {formData.pgStudentsEntering2ndYearAfterExit || 0}</p>
            <p><strong>Total Second Year Entries:</strong> {totalSecondYearEntries}</p>
            <p><strong>Entry Pathway Distribution:</strong> {
              totalSecondYearEntries > 0 
                ? `${((Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) / totalSecondYearEntries) * 100).toFixed(1)}% Honours, ${((Number(formData.pgStudentsEntering2ndYearAfterExit || 0) / totalSecondYearEntries) * 100).toFixed(1)}% Exit`
                : 'No entries recorded'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Program Flow Analysis</h4>
            <p><strong>Exit Flexibility Utilization:</strong> {
              Number(exitPercentage) > 0 ? `${exitPercentage}% students used exit option` : 'No exits recorded'
            }</p>
            <p><strong>Alternative Entry Usage:</strong> {
              Number(formData.pgStudentsEntering2ndYearAfterExit || 0) > 0 ? 'Students re-entering after exit' : 'No re-entries'
            }</p>
            <p><strong>Honours Integration:</strong> {
              Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) > 0 ? 'Honours students entering PG' : 'No Honours entries'
            }</p>
            <p><strong>Program Accessibility:</strong> {
              totalSecondYearEntries > 0 ? 'Multiple entry pathways available' : 'Limited entry data'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Data Validation Status</h4>
            <p><strong>Validation Errors:</strong> {validationErrors.length === 0 ? '✅ No errors' : `❌ ${validationErrors.length} error(s)`}</p>
            <p><strong>Data Consistency:</strong> {
              Number(formData.pgStudentsOptedExit || 0) <= Number(formData.pgStudentsAppearedFirstYear || 0) || Number(formData.pgStudentsAppearedFirstYear || 0) === 0
                ? '✅ Consistent' 
                : '❌ Inconsistent'
            }</p>
            <p><strong>Entry Data Completeness:</strong> {
              Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) > 0 || Number(formData.pgStudentsEntering2ndYearAfterExit || 0) > 0
                ? '✅ Entry data provided'
                : '⚠️ No entry data'
            }</p>
            <p><strong>Exit Data Completeness:</strong> {
              Number(formData.pgStudentsAppearedFirstYear || 0) > 0 && Number(formData.pgStudentsOptedExit || 0) >= 0
                ? '✅ Exit data provided'
                : '⚠️ Incomplete exit data'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Key Performance Indicators</h4>
            <p><strong>PG Retention Rate:</strong> {
              Number(exitPercentage) <= 20 ? '🟢 Excellent' :
              Number(exitPercentage) <= 40 ? '🟡 Good' :
              Number(exitPercentage) <= 60 ? '🟠 Average' : '🔴 Needs Attention'
            } ({(100 - Number(exitPercentage)).toFixed(1)}%)</p>
            <p><strong>Alternative Entry Success:</strong> {
              Number(formData.pgStudentsEntering2ndYearAfterExit || 0) > 0 ? '🟢 Active' : '⚪ Not Available'
            }</p>
            <p><strong>Honours-PG Integration:</strong> {
              Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) > 0 ? '🟢 Active' : '⚪ Not Available'
            }</p>
            <p><strong>Program Flexibility:</strong> {
              (Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) > 0 ? 1 : 0) +
              (Number(formData.pgStudentsEntering2ndYearAfterExit || 0) > 0 ? 1 : 0) >= 2 
                ? '🟢 High' 
                : (Number(formData.pgStudentsEntering2ndYearAfter4YrHonours || 0) > 0 || Number(formData.pgStudentsEntering2ndYearAfterExit || 0) > 0)
                  ? '🟡 Moderate' 
                  : '🔴 Limited'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Student Mobility Summary</h4>
            <p><strong>Total Student Flow:</strong> {
              Number(formData.pgStudentsAppearedFirstYear || 0) + totalSecondYearEntries
            } students tracked</p>
            <p><strong>Exit Students:</strong> {formData.pgStudentsOptedExit || 0}</p>
            <p><strong>New Entries:</strong> {totalSecondYearEntries}</p>
            <p><strong>Net Program Growth:</strong> {
              totalSecondYearEntries - Number(formData.pgStudentsOptedExit || 0) >= 0 
                ? `+${totalSecondYearEntries - Number(formData.pgStudentsOptedExit || 0)} students`
                : `${totalSecondYearEntries - Number(formData.pgStudentsOptedExit || 0)} students`
            }</p>
            <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#6c757d' }}>
              Mobility enables flexible academic pathways and student choice
            </p>
          </div>
        </div>

        {/* Validation errors display */}
        {validationErrors.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: '4px',
            color: '#721c24'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>⚠️ Validation Errors</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
            <p style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>
              Please fix these errors before proceeding to submission.
            </p>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
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
          <h3>PG Exit and Entry Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your PG exit and entry data has been recorded.</p>
          <p>Redirecting to next form...</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Ready to Submit</h3>
          <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '30px', lineHeight: '1.6' }}>
            You have reviewed all your information. Click the "Submit Form" button below to finalize your submission.
          </p>
          
          {validationErrors.length > 0 && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              backgroundColor: '#f8d7da', 
              border: '1px solid #f5c6cb', 
              borderRadius: '4px',
              color: '#721c24'
            }}>
              <strong>⚠️ Cannot submit: Please fix validation errors first</strong>
            </div>
          )}
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              const formEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
              handleSubmit(formEvent);
            }}
            disabled={validationErrors.length > 0}
            style={{ 
              padding: '15px 40px', 
              fontSize: '1.1rem',
              minWidth: '200px',
              background: validationErrors.length > 0 ? '#6c757d' : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              opacity: validationErrors.length > 0 ? 0.6 : 1,
              cursor: validationErrors.length > 0 ? 'not-allowed' : 'pointer'
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
      case 0: return renderPGExitEntryData();
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

      <Page13
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

export default PGExitEntryForm;