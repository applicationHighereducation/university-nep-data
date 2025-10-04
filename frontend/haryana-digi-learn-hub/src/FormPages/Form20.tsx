import React, { useState, FormEvent, useEffect } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page20 from '../pages/Page20';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface StartupDetail {
  id: string;
  name: string;
  registeredAddress?: string;
  registrationNo?: string;
  registeringBody?: string;
  revenueGenerated?: string | number;
}

interface AgencyDetail {
  id: string;
  name: string;
  type: 'National' | 'International' | '';
}

interface FormData {
  // Section 1: Incubation Centre Details
  hasIncubationCentre: 'Yes' | 'No' | '';
  yearOfEstablishment: string;
  registeredUnderSec8: 'Yes' | 'No';
  registeredUnderSec8Date: string;
  
  // Numbers (disabled fields - to be managed separately)
  recognizedAgenciesNumber: number;
  startupsIncubatedNumber: number;
  startupsRegisteredNumber: number;
  startupsCommercializedNumber: number;
  
  // Lists (populated from Excel uploads)
  recognizedAgencies: AgencyDetail[];
  startupsIncubatedList: StartupDetail[];
  startupsRegisteredList: StartupDetail[];
  startupsCommercializedList: StartupDetail[];
  
  // Section 2: Start-up Statistics
  totalInvestmentFunding: string | number;
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
  agencies?: { file: File; selected: boolean } | null;
  incubated?: { file: File; selected: boolean } | null;
  registered?: { file: File; selected: boolean } | null;
  commercialized?: { file: File; selected: boolean } | null;
}

// ====================================
// MAIN COMPONENT
// ====================================
const StartupIncubationForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile>({});
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    hasIncubationCentre: '',
    yearOfEstablishment: '',
    registeredUnderSec8: 'No',
    registeredUnderSec8Date: '',
    recognizedAgenciesNumber: 0,
    recognizedAgencies: [],
    startupsIncubatedNumber: 0,
    startupsIncubatedList: [],
    startupsRegisteredNumber: 0,
    startupsRegisteredList: [],
    startupsCommercializedNumber: 0,
    startupsCommercializedList: [],
    totalInvestmentFunding: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Incubation Centre Details", description: "Basic information about the incubation centre", fields: [] },
    { id: 1, title: "Start-up Statistics", description: "Incubated start-ups and funding details", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
  ];

  // Template/Demo URLs for Excel downloads
  const excelTemplateURLs = {
    agencies: '/templates/recognized-agencies-template.xlsx',
    incubated: '/templates/startups-incubated-template.xlsx',
    registered: '/templates/startups-registered-template.xlsx',
    commercialized: '/templates/startups-commercialized-template.xlsx'
  };

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const validateData = (updatedData: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    const currentYear = new Date().getFullYear();
    const year = Number(updatedData.yearOfEstablishment);

    // Validation: hasIncubationCentre is required
    if (!updatedData.hasIncubationCentre) {
      errors.push({
        field: 'hasIncubationCentre',
        message: 'Please select whether you have a Start-up Incubation Centre'
      });
    }

    // Validation: Year constraints - only check for future years
    if (updatedData.hasIncubationCentre === 'Yes' && updatedData.yearOfEstablishment) {
      if (year > currentYear) {
        errors.push({
          field: 'yearOfEstablishment',
          message: 'Year of establishment cannot be in the future'
        });
      }
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

  const formatCurrency = (value: string | number): string => {
    if (!value) return '';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('en-IN');
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
  const handleFileSelect = (
    file: File, 
    type: 'agencies' | 'incubated' | 'registered' | 'commercialized'
  ): void => {
    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
      alert('Invalid file type. Please upload only .xlsx, .xls, or .csv files.');
      return;
    }

    setUploadedFiles(prev => ({
      ...prev,
      [type]: { file, selected: true }
    }));
  };

  const handleFileRemove = (
    type: 'agencies' | 'incubated' | 'registered' | 'commercialized'
  ): void => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: null
    }));
    
    // Reset the file input
    const fileInput = document.getElementById(`file-upload-${type}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileUpload = (
    type: 'agencies' | 'incubated' | 'registered' | 'commercialized'
  ): void => {
    const fileData = uploadedFiles[type];
    if (fileData && fileData.selected) {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: { ...fileData, selected: false }
      }));
      alert(`File "${fileData.file.name}" uploaded successfully!`);
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
    
    // Generate years array
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

  // Component for rendering number input (disabled)
  const renderDisabledNumberInput = (
    label: string,
    field: keyof FormData
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">{label}</label>
        <input
          type="number"
          className="input"
          value=""
          disabled
          placeholder="Will be managed separately"
          style={{ 
            backgroundColor: '#f8f9fa', 
            cursor: 'not-allowed',
            color: '#6c757d' 
          }}
        />
        <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
          This field will be managed separately
        </p>
      </div>
    );
  };

  // Component for rendering year picker input
  const renderYearPickerInput = (
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
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className={`input ${hasFieldError ? 'input-error' : ''}`}
            value={formData[field] as string}
            onClick={() => setShowYearPicker(true)}
            readOnly
            placeholder="Select year (1500 - present)"
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

  // Component for rendering date input
  const renderDateInput = (
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
          type="date"
          className="input"
          value={formData[field] as string}
          onChange={(e) => updateFormData(field, e.target.value)}
        />
      </div>
    );
  };

  // Component for rendering currency input with ₹ symbol
  const renderCurrencyInput = (
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
          <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#495057' }}>₹</span>
          <input
            type="text"
            className="input"
            value={typeof formData[field] === 'string' || typeof formData[field] === 'number' ? formData[field] : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d.]/g, '');
              // Allow only one decimal point
              const parts = value.split('.');
              if (parts.length > 2) {
                return;
              }
              updateFormData(field, value);
            }}
            onFocus={(e) => {
              if (e.target.value === '0') {
                updateFormData(field, '');
              }
            }}
            placeholder="Enter amount"
            style={{ flex: 1 }}
          />
        </div>
        {formData[field] && (typeof formData[field] === 'string' || typeof formData[field] === 'number') && formData[field] !== '0' && formData[field] !== '' && (
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
            Formatted: ₹ {formatCurrency(formData[field] as string | number)}
          </p>
        )}
      </div>
    );
  };

  // Component for Excel upload with download template link
  const renderExcelUpload = (
    label: string,
    type: 'agencies' | 'incubated' | 'registered' | 'commercialized'
  ): JSX.Element => {
    const uploadedFile = uploadedFiles[type];
    const fileSelected = uploadedFile && uploadedFile.selected;
    const fileUploaded = uploadedFile && !uploadedFile.selected;

    return (
      <div className="form-group form-group-full">
        <label className="label">{label}</label>
        
        {/* Download Template Link */}
        <div style={{ 
          marginBottom: '15px', 
          padding: '12px', 
          backgroundColor: '#e7f3ff', 
          border: '1px solid #b3d9ff', 
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            <span style={{ fontSize: '0.95rem', color: '#495057' }}>
              Download Excel Template
            </span>
          </div>
          <a
            href={excelTemplateURLs[type]}
            download
            style={{
              padding: '6px 16px',
              backgroundColor: '#0056b3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          >
            Download Template
          </a>
        </div>

        {/* File Selection/Upload Section */}
        {!uploadedFile ? (
          // No file selected - show choose file button
          <div>
            <input
              type="file"
              id={`file-upload-${type}`}
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file, type);
                }
              }}
              style={{ display: 'none' }}
            />
            <label
              htmlFor={`file-upload-${type}`}
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
              📁 Choose File
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
                <span style={{ fontSize: '1.2rem' }}>📄</span>
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
                onClick={() => handleFileUpload(type)}
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
                onClick={() => handleFileRemove(type)}
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
              <span style={{ fontSize: '1.2rem' }}>✅</span>
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
              onClick={() => handleFileRemove(type)}
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

        {/* Upload Instructions */}
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: '#6c757d'
        }}>
          <strong>Instructions:</strong>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
            <li>Download the template Excel file using the button above</li>
            <li>Fill in your data following the template format</li>
            <li>Choose file (.xlsx, .xls, or .csv only)</li>
            <li>Click Upload to confirm the file upload</li>
          </ul>
        </div>
      </div>
    );
  };

  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = (): void => {
    // Check if hasIncubationCentre is selected
    if (currentSection === 0 && !formData.hasIncubationCentre) {
      setValidationErrors([{
        field: 'hasIncubationCentre',
        message: 'Please select whether you have a Start-up Incubation Centre'
      }]);
      return;
    }

    // If user selected "No" for incubation centre, redirect to next form
    if (currentSection === 0 && formData.hasIncubationCentre === 'No') {
      window.location.href = '/form/page21';
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
    
    console.log('Start-up Incubation Form submitted:', formData);
    console.log('Uploaded files:', uploadedFiles);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page21';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page21';
  };

  const resetForm = (): void => {
    setFormData({
      hasIncubationCentre: '',
      yearOfEstablishment: '',
      registeredUnderSec8: 'No',
      registeredUnderSec8Date: '',
      recognizedAgenciesNumber: 0,
      recognizedAgencies: [],
      startupsIncubatedNumber: 0,
      startupsIncubatedList: [],
      startupsRegisteredNumber: 0,
      startupsRegisteredList: [],
      startupsCommercializedNumber: 0,
      startupsCommercializedList: [],
      totalInvestmentFunding: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
    setUploadedFiles({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: INCUBATION CENTRE DETAILS
  const renderIncubationCentreDetails = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Incubation Centre Details</h2>
      <p className="section-description">Basic information about the incubation centre</p>

      <div className="form-grid">
        {renderYesNoRadio('Start-up Incubation Centre?', 'hasIncubationCentre', true)}
        
        {formData.hasIncubationCentre === 'Yes' && (
          <>
            {renderYearPickerInput('Year of establishment', 'yearOfEstablishment')}
            
            {renderYesNoRadio('Registered under Sec 8 Companies Act?', 'registeredUnderSec8')}
            
            {formData.registeredUnderSec8 === 'Yes' && (
              renderDateInput('Registration date under Sec 8 Companies Act', 'registeredUnderSec8Date')
            )}
            
            {renderDisabledNumberInput('Recognized/sponsored by national/international agencies - Number', 'recognizedAgenciesNumber')}
            
            {renderExcelUpload(
              'Recognized/sponsored by national/international agencies - List (Upload Excel)',
              'agencies'
            )}
          </>
        )}
      </div>
    </div>
  );

  // SECTION 1: START-UP STATISTICS
  const renderStartupStatistics = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Start-up Statistics</h2>
      <p className="section-description">Incubated start-ups and funding details</p>

      <div className="form-grid">
        {renderDisabledNumberInput('Start-ups formally incubated (till date) - Number', 'startupsIncubatedNumber')}
        {renderExcelUpload(
          'Start-ups formally incubated (till date) - List (Upload Excel)',
          'incubated'
        )}
        
        {renderDisabledNumberInput('Start-ups registered as legal entities during incubation - Number', 'startupsRegisteredNumber')}
        {renderExcelUpload(
          'Start-ups registered as legal entities during incubation - List (Upload Excel)',
          'registered'
        )}
        
        {renderDisabledNumberInput('Incubated start-ups commercialized/piloted - Number', 'startupsCommercializedNumber')}
        {renderExcelUpload(
          'Incubated start-ups commercialized/piloted - List (Upload Excel)',
          'commercialized'
        )}
        
        {renderCurrencyInput('Total investment/funding raised by incubated start-ups (₹)', 'totalInvestmentFunding')}
      </div>
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => {
    const registrationRate = formData.startupsIncubatedNumber > 0 
      ? ((formData.startupsRegisteredNumber / formData.startupsIncubatedNumber) * 100).toFixed(1)
      : '0';
    
    const commercializationRate = formData.startupsIncubatedNumber > 0 
      ? ((formData.startupsCommercializedNumber / formData.startupsIncubatedNumber) * 100).toFixed(1)
      : '0';
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Incubation Centre Status</h4>
            <p><strong>Has Incubation Centre:</strong> {formData.hasIncubationCentre}</p>
            {formData.hasIncubationCentre === 'Yes' && (
              <>
                <p><strong>Year of Establishment:</strong> {formData.yearOfEstablishment || 'Not specified'}</p>
                <p><strong>Sec 8 Registration:</strong> {formData.registeredUnderSec8}</p>
                {formData.registeredUnderSec8 === 'Yes' && formData.registeredUnderSec8Date && (
                  <p><strong>Sec 8 Registration Date:</strong> {new Date(formData.registeredUnderSec8Date).toLocaleDateString()}</p>
                )}
              </>
            )}
          </div>

          <div className="summary-card">
            <h4>Uploaded Files</h4>
            <p><strong>Agencies List:</strong> {uploadedFiles.agencies && !uploadedFiles.agencies.selected ? '✅ Uploaded' : '❌ Not uploaded'}</p>
            <p><strong>Incubated List:</strong> {uploadedFiles.incubated && !uploadedFiles.incubated.selected ? '✅ Uploaded' : '❌ Not uploaded'}</p>
            <p><strong>Registered List:</strong> {uploadedFiles.registered && !uploadedFiles.registered.selected ? '✅ Uploaded' : '❌ Not uploaded'}</p>
            <p><strong>Commercialized List:</strong> {uploadedFiles.commercialized && !uploadedFiles.commercialized.selected ? '✅ Uploaded' : '❌ Not uploaded'}</p>
          </div>

          <div className="summary-card">
            <h4>Funding Summary</h4>
            <p><strong>Total Investment/Funding Raised:</strong></p>
            <p style={{ fontSize: '1.3rem', fontWeight: '600', color: '#28a745', marginTop: '10px' }}>
              ₹ {formatCurrency(formData.totalInvestmentFunding) || '0'}
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

  // SECTION 3: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Start-up Incubation Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your start-up incubation data has been recorded.</p>
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
      case 0: return renderIncubationCentreDetails();
      case 1: return renderStartupStatistics();
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
      <FormHeader 
        onSignIn={() => { /* TODO: implement sign in logic */ }} 
        onSignUp={() => { /* TODO: implement sign up logic */ }} 
      />
      <PageNavigationSubheader totalPages={21}/>

      <Page20
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

export default StartupIncubationForm;