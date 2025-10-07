import React, { useState, FormEvent, useEffect } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page11 from '../pages/Page11';
import { Header } from '@/components/Header';
import axios from 'axios';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: ABC Registration Overview
  totalStudentsHei: string | number;
  studentsRegisteredAbc: string | number;
  studentsRegisteredAbcPercentage: string | number;
  studentsWithUploadsAbc: string | number;
  studentsWithUploadsAbcPercentage: string | number;
  
  // Section 2: Credits & Upload Status
  abcStudentsWithoutUploads: string | number;
  abcStudentsWithoutUploadsPercentage: string | number;
  externalMoocsCreditsViaAbc: string | number;
  externalMoocsCreditsManual: string | number;
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
const ABCRegistrationForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 for numbers
    totalStudentsHei: 0,
    studentsRegisteredAbc: 0,
    studentsRegisteredAbcPercentage: 0,
    studentsWithUploadsAbc: 0,
    studentsWithUploadsAbcPercentage: 0,
    abcStudentsWithoutUploads: 0,
    abcStudentsWithoutUploadsPercentage: 0,
    externalMoocsCreditsViaAbc: 0,
    externalMoocsCreditsManual: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "ABC Registration Overview", description: "Student registration and upload statistics", fields: [] },
    { id: 1, title: "Credits & Upload Status", description: "Upload status and external credits information", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // AUTO-CALCULATION EFFECTS
  // ====================================
  
  // Auto-calculate: Students registered on ABC - Percentage
  useEffect(() => {
    const totalStudents = Number(formData.totalStudentsHei) || 0;
    const registeredStudents = Number(formData.studentsRegisteredAbc) || 0;
    
    if (totalStudents > 0) {
      const percentage = (registeredStudents / totalStudents) * 100;
      setFormData(prev => ({
        ...prev,
        studentsRegisteredAbcPercentage: Number(percentage.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        studentsRegisteredAbcPercentage: 0
      }));
    }
  }, [formData.totalStudentsHei, formData.studentsRegisteredAbc]);

  // Auto-calculate: Students with uploads - % of registered
  useEffect(() => {
    const registeredStudents = Number(formData.studentsRegisteredAbc) || 0;
    const studentsWithUploads = Number(formData.studentsWithUploadsAbc) || 0;
    
    if (registeredStudents > 0) {
      const percentage = (studentsWithUploads / registeredStudents) * 100;
      setFormData(prev => ({
        ...prev,
        studentsWithUploadsAbcPercentage: Number(percentage.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        studentsWithUploadsAbcPercentage: 0
      }));
    }
  }, [formData.studentsRegisteredAbc, formData.studentsWithUploadsAbc]);

  // Auto-calculate: ABC-registered students without uploads - % of registered
  useEffect(() => {
    const registeredStudents = Number(formData.studentsRegisteredAbc) || 0;
    const studentsWithoutUploads = Number(formData.abcStudentsWithoutUploads) || 0;
    
    if (registeredStudents > 0) {
      const percentage = (studentsWithoutUploads / registeredStudents) * 100;
      setFormData(prev => ({
        ...prev,
        abcStudentsWithoutUploadsPercentage: Number(percentage.toFixed(2))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        abcStudentsWithoutUploadsPercentage: 0
      }));
    }
  }, [formData.studentsRegisteredAbc, formData.abcStudentsWithoutUploads]);

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const validateData = (updatedData: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const totalStudents = Number(updatedData.totalStudentsHei) || 0;
    const registeredStudents = Number(updatedData.studentsRegisteredAbc) || 0;
    const studentsWithUploads = Number(updatedData.studentsWithUploadsAbc) || 0;
    const externalViaAbc = Number(updatedData.externalMoocsCreditsViaAbc) || 0;
    const externalManual = Number(updatedData.externalMoocsCreditsManual) || 0;

    // Validation: Registered students cannot exceed total students
    if (registeredStudents > totalStudents && totalStudents > 0) {
      errors.push({
        field: 'studentsRegisteredAbc',
        message: 'Registered students cannot exceed total students in HEI'
      });
    }

    // Validation: Students with uploads cannot exceed registered students
    if (studentsWithUploads > registeredStudents && registeredStudents > 0) {
      errors.push({
        field: 'studentsWithUploadsAbc',
        message: 'Students with uploads cannot exceed registered students'
      });
    }

    // Validation: External credits via ABC cannot exceed registered students
    if (externalViaAbc > registeredStudents && registeredStudents > 0) {
      errors.push({
        field: 'externalMoocsCreditsViaAbc',
        message: 'External credits via ABC cannot exceed registered students'
      });
    }

    // Validation: External credits manual cannot exceed total students
    if (externalManual > totalStudents && totalStudents > 0) {
      errors.push({
        field: 'externalMoocsCreditsManual',
        message: 'External credits (manual) cannot exceed total students'
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
    required = false,
    readonly = false
  ): JSX.Element => {
    const hasFieldError = hasError(field);
    const errorMessage = getErrorMessage(field);
    
    return (
      <div className="form-group">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className={`input ${hasFieldError ? 'input-error' : ''} ${readonly ? 'input-readonly' : ''}`}
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          onFocus={(e) => {
            if (!readonly && Number(e.target.value) === 0) {
              e.target.value = '';
            }
          }}
          onBlur={(e) => {
            if (!readonly && e.target.value === '') {
              updateFormData(field, 0);
            }
          }}
          min="0"
          readOnly={readonly}
          style={readonly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
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
        {readonly && (
          <div style={{ 
            color: '#6c757d', 
            fontSize: '0.75rem', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            Auto-calculated
          </div>
        )}
      </div>
    );
  };

  // Generic component for rendering decimal input (for percentages)
  const renderDecimalInput = (
    label: string,
    field: keyof FormData,
    required = false,
    readonly = false
  ): JSX.Element => {
    return (
      <div className="form-group">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className={`input ${readonly ? 'input-readonly' : ''}`}
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          onFocus={(e) => {
            if (!readonly && Number(e.target.value) === 0) {
              e.target.value = '';
            }
          }}
          onBlur={(e) => {
            if (!readonly && e.target.value === '') {
              updateFormData(field, 0);
            }
          }}
          min="0"
          max="100"
          step="0.01"
          readOnly={readonly}
          style={readonly ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
        />
        {readonly && (
          <div style={{ 
            color: '#6c757d', 
            fontSize: '0.75rem', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            Auto-calculated
          </div>
        )}
      </div>
    );
  };

  //API Handling

  const insertData = async() => {
    try {
      const response = await axios.post('/api/page11/insert', {
        total : formData.totalStudentsHei,
        registeredStudents: formData.studentsRegisteredAbc,
        uploadedStudents : formData.studentsWithUploadsAbc,
        moocCnt: formData.externalMoocsCreditsViaAbc,
        moocManualCnt: formData.externalMoocsCreditsManual
      }, {withCredentials: true})
    } catch (error) {
      console.log('Error while inserting data: ', error)
    }
  }


  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await axios.get('/api/page11/get', {withCredentials: true})
        const existingData = response.data.data
        console.log(existingData)
        console.log()

        setFormData({
          totalStudentsHei: existingData.total_students,
          studentsRegisteredAbc: existingData.registered_count,
          studentsWithUploadsAbc: existingData.upload_count,
          externalMoocsCreditsViaAbc: existingData.mooc_abc_count,
          externalMoocsCreditsManual: existingData.mooc_manual_count,
          abcStudentsWithoutUploads: Number(existingData.registered_count)-Number(existingData.upload_count),
          studentsRegisteredAbcPercentage: Number(),
          abcStudentsWithoutUploadsPercentage: Number(),
          studentsWithUploadsAbcPercentage: Number()
        })
      } catch (error) {
        console.log('Error while fetching already existing data: ', error)
      }
    }

    fetchData()
  }, [])
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Final validation before submission
    const errors = validateData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      alert('Please fix validation errors before submitting.');
      return;
    }

    await insertData()
    
    console.log('ABC Registration Form submitted:', formData);
    setSubmitted(true);
    

    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page12';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page12';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values (0 for numbers)
      totalStudentsHei: 0,
      studentsRegisteredAbc: 0,
      studentsRegisteredAbcPercentage: 0,
      studentsWithUploadsAbc: 0,
      studentsWithUploadsAbcPercentage: 0,
      abcStudentsWithoutUploads: 0,
      abcStudentsWithoutUploadsPercentage: 0,
      externalMoocsCreditsViaAbc: 0,
      externalMoocsCreditsManual: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: ABC REGISTRATION OVERVIEW
  const renderAbcRegistrationOverview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">ABC Registration Overview</h2>
      <p className="section-description">Student registration and upload statistics</p>

      <div className="form-grid">
        {renderNumberInput('Total students in HEI - Number', 'totalStudentsHei', true)}
        <div></div>
        
        {renderNumberInput('Students registered on ABC - Number', 'studentsRegisteredAbc', true)}
        {renderDecimalInput('Students registered on ABC - Percentage', 'studentsRegisteredAbcPercentage', false, true)}
        
        {renderNumberInput('Students with Results/DMCs/Course Credits uploaded on ABC - Number', 'studentsWithUploadsAbc')}
        {renderDecimalInput('Students with Results/DMCs/Course Credits uploaded on ABC - % of registered', 'studentsWithUploadsAbcPercentage', false, true)}
      </div>
    </div>
  );

  // SECTION 1: CREDITS & UPLOAD STATUS
  const renderCreditsUploadStatus = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Credits & Upload Status</h2>
      <p className="section-description">Upload status and external credits information</p>

      <div className="form-grid">
        {renderNumberInput('ABC - registered students without uploads - Number', 'abcStudentsWithoutUploads')}
        {renderDecimalInput('ABC-registered students without uploads - % of registered', 'abcStudentsWithoutUploadsPercentage', false, true)}
        
        {renderNumberInput('Students whose external/MOOCs credits counted via ABC - Number', 'externalMoocsCreditsViaAbc')}
        {renderNumberInput('Students whose external/MOOCs credits counted manually - Number', 'externalMoocsCreditsManual')}
      </div>
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>HEI Overview</h4>
          <p><strong>Total Students:</strong> {formData.totalStudentsHei || 0}</p>
          <p><strong>ABC Registered:</strong> {formData.studentsRegisteredAbc || 0}</p>
          <p><strong>Registration Rate:</strong> {formData.studentsRegisteredAbcPercentage ? `${formData.studentsRegisteredAbcPercentage}%` : '0%'}</p>
        </div>

        <div className="summary-card">
          <h4>Upload Statistics</h4>
          <p><strong>Students with Uploads:</strong> {formData.studentsWithUploadsAbc || 0}</p>
          <p><strong>Upload Rate:</strong> {formData.studentsWithUploadsAbcPercentage ? `${formData.studentsWithUploadsAbcPercentage}%` : '0%'}</p>
          <p><strong>Without Uploads:</strong> {formData.abcStudentsWithoutUploads || 0}</p>
          <p><strong>Non-Upload Rate:</strong> {formData.abcStudentsWithoutUploadsPercentage ? `${formData.abcStudentsWithoutUploadsPercentage}%` : '0%'}</p>
        </div>

        <div className="summary-card">
          <h4>External Credits</h4>
          <p><strong>Via ABC:</strong> {formData.externalMoocsCreditsViaAbc || 0}</p>
          <p><strong>Manual Process:</strong> {formData.externalMoocsCreditsManual || 0}</p>
          <p><strong>Total External Credits:</strong> {
            (Number(formData.externalMoocsCreditsViaAbc) || 0) + (Number(formData.externalMoocsCreditsManual) || 0)
          }</p>
        </div>

        <div className="summary-card">
          <h4>Data Validation Status</h4>
          <p><strong>Validation Errors:</strong> {validationErrors.length === 0 ? '✅ No errors' : `❌ ${validationErrors.length} error(s)`}</p>
          <p><strong>Basic Information:</strong> {
            formData.totalStudentsHei && formData.studentsRegisteredAbc ? '✅ Complete' : '❌ Incomplete'
          }</p>
          <p><strong>Upload Data:</strong> {
            Number(formData.studentsWithUploadsAbc) >= 0 ? '✅ Complete' : '❌ Incomplete'
          }</p>
          <p><strong>External Credits:</strong> {
            Number(formData.externalMoocsCreditsViaAbc) >= 0 || Number(formData.externalMoocsCreditsManual) >= 0 ? '✅ Complete' : '❌ Incomplete'
          }</p>
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

  // SECTION 3: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>ABC Registration Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your ABC registration data has been recorded.</p>
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
      case 0: return renderAbcRegistrationOverview();
      case 1: return renderCreditsUploadStatus();
      case 2: return renderReview();
      case 3: return renderSubmit();
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

      <Page11
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

export default ABCRegistrationForm;