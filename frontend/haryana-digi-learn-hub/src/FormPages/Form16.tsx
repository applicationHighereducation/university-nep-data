import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page16 from '../pages/Page16';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: R&D Cell Details
  hasRDCell: 'Yes' | 'No' | '';
  yearOfEstablishment: string;
  researchActivitiesNumber: string | number;
  workshopsNumber: string | number;
  researchProposalsNumber: string | number;
  rdcDocumentPdf: File | null;
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

interface UploadedFile {
  file: File;
  selected: boolean;
}

// ====================================
// MAIN COMPONENT
// ====================================
const RnDCellForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    hasRDCell: '',
    yearOfEstablishment: '',
    researchActivitiesNumber: 0,
    workshopsNumber: 0,
    researchProposalsNumber: 0,
    rdcDocumentPdf: null,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "R&D Cell Details", description: "Research and Development Cell information and activities", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const validateData = (updatedData: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validation: hasRDCell is required
    if (!updatedData.hasRDCell) {
      errors.push({
        field: 'hasRDCell',
        message: 'Please select whether you have an R&D Cell'
      });
    }

    return errors;
  };

  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
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

  // ====================================
  // FILE UPLOAD HANDLERS
  // ====================================
  const handleFileSelect = (file: File): void => {
    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValid = fileName.endsWith('.pdf');
    
    if (!isValid) {
      alert('Invalid file type. Please upload only PDF files.');
      return;
    }

    setUploadedFile({ file, selected: true });
  };

  const handleFileRemove = (): void => {
    setUploadedFile(null);
    updateFormData('rdcDocumentPdf', null);
    
    // Reset the file input
    const fileInput = document.getElementById('file-upload-rdc') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileUpload = (): void => {
    if (uploadedFile && uploadedFile.selected) {
      setUploadedFile({ ...uploadedFile, selected: false });
      updateFormData('rdcDocumentPdf', uploadedFile.file);
      alert(`File "${uploadedFile.file.name}" uploaded successfully!`);
    }
  };

  // ====================================
  // YEAR PICKER COMPONENT
  // ====================================
  const YearPicker: React.FC<{
    value: string;
    onChange: (year: string) => void;
  }> = ({ value, onChange }) => {
    const currentYear = new Date().getFullYear();
    const [searchTerm, setSearchTerm] = useState('');
    const startYear = 1500;
    
    // Generate years array (only up to current year)
    const years = Array.from(
      { length: currentYear - startYear + 1 }, 
      (_, i) => currentYear - i
    );

    // Filter years based on search
    const filteredYears = searchTerm 
      ? years.filter(year => year.toString().includes(searchTerm))
      : years;

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        marginTop: '4px',
        maxHeight: '300px',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: 'white', 
          padding: '10px',
          borderBottom: '1px solid #ced4da'
        }}>
          <input
            type="text"
            placeholder="Search year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
            autoFocus
          />
        </div>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {filteredYears.length > 0 ? (
            filteredYears.map(year => (
              <div
                key={year}
                onClick={() => {
                  onChange(year.toString());
                  setShowYearPicker(false);
                  setSearchTerm('');
                }}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  backgroundColor: value === year.toString() ? '#e7f3ff' : 'white',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (value !== year.toString()) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== year.toString()) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {year}
              </div>
            ))
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#6c757d' }}>
              No years found
            </div>
          )}
        </div>
      </div>
    );
  };

  // ====================================
  // COMPONENT RENDERERS
  // ====================================
  
  // Component for rendering Yes/No radio buttons
  const renderYesNoRadio = (
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name={field}
              value="Yes"
              checked={formData[field] === 'Yes'}
              onChange={(e) => updateFormData(field, e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name={field}
              value="No"
              checked={formData[field] === 'No'}
              onChange={(e) => updateFormData(field, e.target.value)}
              style={{ marginRight: '8px' }}
            />
            No
          </label>
        </div>
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

  // Component for rendering year picker input
  const renderYearPickerInput = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="input"
            value={formData[field] as string}
            onClick={() => setShowYearPicker(true)}
            readOnly
            placeholder={`Select year (1500 - ${new Date().getFullYear()})`}
            style={{ cursor: 'pointer' }}
          />
          {showYearPicker && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999
                }}
                onClick={() => setShowYearPicker(false)}
              />
              <YearPicker 
                value={formData[field] as string}
                onChange={(year) => updateFormData(field, year)}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  // Component for rendering number input (clears on focus)
  const renderNumberInput = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className="input"
          value={
            typeof formData[field] === 'string' || typeof formData[field] === 'number'
              ? (formData[field] === 0 ? '' : formData[field])
              : ''
          }
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : Number(e.target.value))}
          onFocus={(e) => {
            if (formData[field] === 0) {
              updateFormData(field, '');
            }
          }}
          onBlur={(e) => {
            if (e.target.value === '') {
              updateFormData(field, 0);
            }
          }}
          min="0"
          placeholder="Enter number"
        />
      </div>
    );
  };

  // Component for PDF upload
  const renderPdfUpload = (): JSX.Element => {
    const fileSelected = uploadedFile && uploadedFile.selected;
    const fileUploaded = uploadedFile && !uploadedFile.selected;

    return (
      <div className="form-group form-group-full">
        <label className="label">R&D Cell Activities Document (Upload PDF)</label>
        
        

        {/* File Selection/Upload Section */}
        {!uploadedFile ? (
          // No file selected - show choose file button
          <div>
            <input
              type="file"
              id="file-upload-rdc"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="file-upload-rdc"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            >
              📁 Choose PDF File
            </label>
          </div>
        ) : fileSelected ? (
          // File selected but not uploaded yet - show file info with upload/remove buttons
          <div style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <div>
                  <div style={{ fontWeight: '500', color: '#856404' }}>
                    {uploadedFile.file.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    {(uploadedFile.file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleFileUpload}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                📤 Upload
              </button>
              <button
                type="button"
                onClick={handleFileRemove}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ) : (
          // File uploaded - show success message with remove button
          <div style={{
            padding: '12px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: '500', color: '#155724' }}>
                  {uploadedFile.file.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  {(uploadedFile.file.size / 1024).toFixed(2)} KB - Uploaded Successfully
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFileRemove}
              style={{
                padding: '6px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              🗑️ Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = (): void => {
    // Check if hasRDCell is selected
    if (currentSection === 0 && !formData.hasRDCell) {
      setValidationErrors([{
        field: 'hasRDCell',
        message: 'Please select whether you have an R&D Cell'
      }]);
      return;
    }

    // If user selected "No" for R&D Cell, redirect to next form
    if (currentSection === 0 && formData.hasRDCell === 'No') {
      window.location.href = '/form/page17';
      return;
    }

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
    
    // Final validation before submission
    const errors = validateData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      alert('Please fix validation errors before submitting.');
      return;
    }
    
    console.log('R&D Cell Form submitted:', formData);
    console.log('Uploaded PDF:', uploadedFile);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page17';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page17';
  };

  const resetForm = (): void => {
    setFormData({
      hasRDCell: '',
      yearOfEstablishment: '',
      researchActivitiesNumber: 0,
      workshopsNumber: 0,
      researchProposalsNumber: 0,
      rdcDocumentPdf: null,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
    setUploadedFile(null);
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: R&D CELL DETAILS
  const renderRnDCellDetails = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">R&D Cell Details</h2>
      <p className="section-description">Research and Development Cell information and activities</p>

      <div className="form-grid">
        {renderYesNoRadio('R&D Cell established?', 'hasRDCell', true)}
        
        {formData.hasRDCell === 'Yes' && (
          <>
            {renderYearPickerInput('Year of establishment', 'yearOfEstablishment')}
            
            {renderNumberInput('Research activities by RDC - Number', 'researchActivitiesNumber')}
            
            {renderNumberInput(
              'Workshops by RDC (projects, industry linkages, publications, consultancy) - Number',
              'workshopsNumber'
            )}
            
            {renderNumberInput('Research proposals facilitated by RDC - Number', 'researchProposalsNumber')}
            
            {renderPdfUpload()}
          </>
        )}
      </div>

      
    </div>
  );

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => {
    const totalActivities = Number(formData.researchActivitiesNumber || 0) + 
                           Number(formData.workshopsNumber || 0) + 
                           Number(formData.researchProposalsNumber || 0);
    
    const yearsActive = formData.yearOfEstablishment 
      ? new Date().getFullYear() - Number(formData.yearOfEstablishment)
      : 0;
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>R&D Cell Status</h4>
            <p><strong>Cell Established:</strong> {formData.hasRDCell || 'Not specified'}</p>
            {formData.hasRDCell === 'Yes' && (
              <>
                <p><strong>Year Established:</strong> {formData.yearOfEstablishment || 'Not specified'}</p>
                <p><strong>Years Active:</strong> {yearsActive > 0 ? `${yearsActive} years` : 'N/A'}</p>
              </>
            )}
          </div>

          <div className="summary-card">
            <h4>Research Activities</h4>
            <p><strong>Total Activities:</strong> {formData.researchActivitiesNumber || 0}</p>
            {yearsActive > 0 && (
              <p><strong>Avg. per Year:</strong> {(Number(formData.researchActivitiesNumber || 0) / yearsActive).toFixed(1)}</p>
            )}
          </div>

          <div className="summary-card">
            <h4>Workshops Conducted</h4>
            <p><strong>Total Workshops:</strong> {formData.workshopsNumber || 0}</p>
            {yearsActive > 0 && (
              <p><strong>Avg. per Year:</strong> {(Number(formData.workshopsNumber || 0) / yearsActive).toFixed(1)}</p>
            )}
          </div>

          <div className="summary-card">
            <h4>Research Proposals</h4>
            <p><strong>Proposals Facilitated:</strong> {formData.researchProposalsNumber || 0}</p>
            {yearsActive > 0 && (
              <p><strong>Avg. per Year:</strong> {(Number(formData.researchProposalsNumber || 0) / yearsActive).toFixed(1)}</p>
            )}
          </div>

          <div className="summary-card">
            <h4>Overall R&D Performance</h4>
            <p><strong>Total Activities:</strong> {totalActivities}</p>
            <p><strong>Activity Distribution:</strong></p>
            <div style={{ marginLeft: '15px', fontSize: '0.9rem' }}>
              <p>• Research: {totalActivities > 0 ? ((Number(formData.researchActivitiesNumber || 0) / totalActivities) * 100).toFixed(0) : 0}%</p>
              <p>• Workshops: {totalActivities > 0 ? ((Number(formData.workshopsNumber || 0) / totalActivities) * 100).toFixed(0) : 0}%</p>
              <p>• Proposals: {totalActivities > 0 ? ((Number(formData.researchProposalsNumber || 0) / totalActivities) * 100).toFixed(0) : 0}%</p>
            </div>
            <p><strong>Performance Rating:</strong> {
              totalActivities >= 20 ? '🟢 Excellent' :
              totalActivities >= 10 ? '🟡 Good' :
              totalActivities >= 5 ? '🟠 Moderate' :
              totalActivities > 0 ? '🔴 Limited' : '⚪ No activities'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Document Upload Status</h4>
            <p><strong>PDF Document:</strong> {uploadedFile && !uploadedFile.selected ? '✅ Uploaded' : '❌ Not uploaded'}</p>
            {uploadedFile && !uploadedFile.selected && (
              <>
                <p><strong>File Name:</strong> {uploadedFile.file.name}</p>
                <p><strong>File Size:</strong> {(uploadedFile.file.size / 1024).toFixed(2)} KB</p>
              </>
            )}
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
          <h3>R&D Cell Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your R&D Cell data has been recorded.</p>
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
      case 0: return renderRnDCellDetails();
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

      <Page16
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

export default RnDCellForm;