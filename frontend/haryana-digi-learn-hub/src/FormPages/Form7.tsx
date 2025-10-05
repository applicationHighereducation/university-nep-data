import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page7 from '../pages/Page7';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: AEC Courses
  aecCoursesOfferedSemesterWise: string;
  aecCoursesOptedSemesterWise: string;
  aecIndianLanguagesNumber: string | number;
  selectedAecIndianLanguages: string[];
  aecIndianLanguagesOptedNumber: string | number;
  selectedAecIndianLanguagesOpted: string[];
  foreignLanguagesNumber: string | number;
  selectedForeignLanguages: string[];
  foreignLanguagesStudentCounts: string;
  aecLearningOutcomes: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

interface OtherInputState {
  [key: string]: {
    isVisible: boolean;
    value: string;
  };
}

// ====================================
// MAIN COMPONENT
// ====================================
const AECForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    aecCoursesOfferedSemesterWise: '',
    aecCoursesOptedSemesterWise: '',
    aecIndianLanguagesNumber: '',
    selectedAecIndianLanguages: [],
    aecIndianLanguagesOptedNumber: '',
    selectedAecIndianLanguagesOpted: [],
    foreignLanguagesNumber: '',
    selectedForeignLanguages: [],
    foreignLanguagesStudentCounts: '',
    aecLearningOutcomes: '',
  });

  // Dynamic option states for each dropdown
  const [aecIndianLanguagesOptions, setAecIndianLanguagesOptions] = useState<string[]>([
    'Hindi',
    'Sanskrit',
    'Tamil',
    'Telugu',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'Assamese',
    'Odia',
    'Manipuri',
    'Nepali',
    'Bodo',
    'Santhali',
    'Maithili',
    'Dogri',
    'Kashmiri',
    'Konkani',
    'Sindhi',
    'Other'
  ]);

  const [aecIndianLanguagesOptedOptions, setAecIndianLanguagesOptedOptions] = useState<string[]>([
    'Hindi',
    'Sanskrit',
    'Tamil',
    'Telugu',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'Assamese',
    'Odia',
    'Manipuri',
    'Nepali',
    'Bodo',
    'Santhali',
    'Maithili',
    'Dogri',
    'Kashmiri',
    'Konkani',
    'Sindhi',
    'Other'
  ]);

  const [foreignLanguagesOptions, setForeignLanguagesOptions] = useState<string[]>([
    'English',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic',
    'Persian',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Turkish',
    'Hebrew',
    'Thai',
    'Vietnamese',
    'Indonesian',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "AEC Courses", description: "Ability Enhancement Course offerings and outcomes", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: string | number | string[]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to handle "Other" option selection
  const handleOtherSelection = (fieldKey: string): void => {
    setOtherInputs(prev => ({
      ...prev,
      [fieldKey]: {
        isVisible: true,
        value: ''
      }
    }));
  };

  // Function to add custom "Other" item
  const addOtherItem = (
    fieldKey: string, 
    selectedField: keyof FormData, 
    optionsState: string[], 
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    const trimmedValue = otherInputs[fieldKey]?.value.trim();
    if (trimmedValue) {
      // Add to options list if not already present
      if (!optionsState.includes(trimmedValue)) {
        const otherIndex = optionsState.indexOf('Other');
        const newOptions = [...optionsState];
        newOptions.splice(otherIndex, 0, trimmedValue);
        setOptionsState(newOptions);
      }

      // Add to selected items
      const currentItems = (formData[selectedField] as string[]) || [];
      if (!currentItems.includes(trimmedValue)) {
        updateFormData(selectedField, [...currentItems, trimmedValue]);
      }

      // Reset other input
      setOtherInputs(prev => ({
        ...prev,
        [fieldKey]: {
          isVisible: false,
          value: ''
        }
      }));
    }
  };

  // Function to cancel "Other" input
  const cancelOtherInput = (fieldKey: string): void => {
    setOtherInputs(prev => ({
      ...prev,
      [fieldKey]: {
        isVisible: false,
        value: ''
      }
    }));
  };

  // Function to update "Other" input value
  const updateOtherInput = (fieldKey: string, value: string): void => {
    setOtherInputs(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        value: value
      }
    }));
  };

  // Generic function to handle dropdown selection (including "Other")
  const handleDropdownSelection = (
    value: string,
    fieldKey: string,
    selectedField: keyof FormData,
    optionsState: string[],
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    if (value === 'Other') {
      handleOtherSelection(fieldKey);
    } else {
      // Add to selected items directly
      const currentItems = (formData[selectedField] as string[]) || [];
      if (!currentItems.includes(value)) {
        updateFormData(selectedField, [...currentItems, value]);
      }
    }
  };

  // Generic function to handle removing items from arrays
  const handleRemoveItem = (itemToRemove: string, field: keyof FormData): void => {
    const currentItems = (formData[field] as string[]) || [];
    updateFormData(field, currentItems.filter(item => item !== itemToRemove));
  };

  // Generic component for rendering number input
  const renderNumberInput = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className="input"
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value)}
          min="0"
        />
      </div>
    );
  };

  // Generic component for rendering textarea
  const renderTextarea = (
    label: string,
    field: keyof FormData,
    placeholder: string = '',
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <textarea
          className="textarea"
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      </div>
    );
  };

  // Enhanced generic component for rendering dropdown with tags and "Other" option
  const renderDropdownWithTags = (
    label: string,
    fieldKey: string,
    options: string[],
    selectedField: keyof FormData,
    placeholder: string,
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): JSX.Element => {
    const selectedItems = (formData[selectedField] as string[]) || [];
    const otherInputState = otherInputs[fieldKey];
    
    return (
      <>
        <div className="form-group form-group-full">
          <label className="label">{label}</label>
          <select
            className="select"
            onChange={(e) => handleDropdownSelection(e.target.value, fieldKey, selectedField, options, setOptionsState)}
            value=""
          >
            <option value="" disabled>{placeholder}</option>
            {options
              .filter(option => !selectedItems.includes(option))
              .map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>

        {/* Other input field */}
        {otherInputState?.isVisible && (
          <div className="form-group form-group-full">
            <label className="label">Please specify:</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                className="input"
                value={otherInputState.value}
                onChange={(e) => updateOtherInput(fieldKey, e.target.value)}
                placeholder="Enter custom option"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addOtherItem(fieldKey, selectedField, options, setOptionsState)}
                disabled={!otherInputState.value.trim()}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => cancelOtherInput(fieldKey)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Selected items display */}
        {selectedItems.length > 0 && (
          <div className="form-group form-group-full">
            <label className="label">Selected {label} ({selectedItems.length})</label>
            <div className="selected-items-box">
              {selectedItems.map(item => (
                <div key={item} className="selected-item-tag">
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item, selectedField)}
                    className="remove-tag-btn"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
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
    console.log('AEC Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page8';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page8';
  };

  const resetForm = (): void => {
    setFormData({
      aecCoursesOfferedSemesterWise: '',
      aecCoursesOptedSemesterWise: '',
      aecIndianLanguagesNumber: '',
      selectedAecIndianLanguages: [],
      aecIndianLanguagesOptedNumber: '',
      selectedAecIndianLanguagesOpted: [],
      foreignLanguagesNumber: '',
      selectedForeignLanguages: [],
      foreignLanguagesStudentCounts: '',
      aecLearningOutcomes: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: AEC COURSES
  const renderAecCourses = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">AEC Courses</h2>
      <p className="section-description">Ability Enhancement Course offerings and outcomes</p>

      <div className="form-grid">
        {renderTextarea('AEC courses offered - Semester-wise Number/List', 'aecCoursesOfferedSemesterWise', 'Provide semester-wise breakdown of AEC courses offered with numbers (e.g., Semester 1: 5 courses - Course A, Course B, Course C; Semester 2: 4 courses - Course D, Course E)')}
        
        {renderTextarea('AEC courses opted by students - Semester-wise Number/List', 'aecCoursesOptedSemesterWise', 'Provide semester-wise breakdown of AEC courses actually opted by students with numbers')}
        
        {renderNumberInput('AEC courses offered in Indian languages - Number', 'aecIndianLanguagesNumber')}
        <div></div>
        {Number(formData.aecIndianLanguagesNumber) > 0 && renderDropdownWithTags('AEC courses offered in Indian languages - List', 'aecIndianLanguages', aecIndianLanguagesOptions, 'selectedAecIndianLanguages', '-- Add a language --', setAecIndianLanguagesOptions)}
        
        {renderNumberInput('AEC courses in Indian languages opted - Number', 'aecIndianLanguagesOptedNumber')}
        <div></div>
        {Number(formData.aecIndianLanguagesOptedNumber) > 0 && renderDropdownWithTags('AEC courses in Indian languages opted - List', 'aecIndianLanguagesOpted', aecIndianLanguagesOptedOptions, 'selectedAecIndianLanguagesOpted', '-- Add a language --', setAecIndianLanguagesOptedOptions)}
        
        {renderNumberInput('Courses offered in foreign languages - Number', 'foreignLanguagesNumber')}
        <div></div>
        {Number(formData.foreignLanguagesNumber) > 0 && renderDropdownWithTags('Courses offered in foreign languages - List', 'foreignLanguages', foreignLanguagesOptions, 'selectedForeignLanguages', '-- Add a language --', setForeignLanguagesOptions)}
        
        {renderTextarea('Foreign languages with student counts', 'foreignLanguagesStudentCounts', 'Provide language-wise student enrollment counts (e.g., French: 45 students, German: 32 students, Spanish: 28 students)')}
        
        {renderTextarea('Attainment/Learning outcomes of AEC - Course-wise/Semester-wise/Overall', 'aecLearningOutcomes', 'Provide detailed learning outcomes and attainment levels for AEC courses (course-wise, semester-wise, and overall assessment)')}
      </div>
    </div>
  );

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>AEC Course Overview</h4>
          <p><strong>AEC Courses Offered:</strong> {formData.aecCoursesOfferedSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>AEC Courses Opted:</strong> {formData.aecCoursesOptedSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Learning Outcomes:</strong> {formData.aecLearningOutcomes ? 'Provided' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>Indian Language Courses</h4>
          <p><strong>Indian Languages Offered:</strong> {formData.aecIndianLanguagesNumber || 0}</p>
          <p><strong>Indian Languages Opted:</strong> {formData.aecIndianLanguagesOptedNumber || 0}</p>
          <p><strong>Selected Offered Languages:</strong> {formData.selectedAecIndianLanguages.length > 0 ? formData.selectedAecIndianLanguages.join(', ') : 'None'}</p>
          <p><strong>Selected Opted Languages:</strong> {formData.selectedAecIndianLanguagesOpted.length > 0 ? formData.selectedAecIndianLanguagesOpted.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Foreign Language Courses</h4>
          <p><strong>Foreign Languages Offered:</strong> {formData.foreignLanguagesNumber || 0}</p>
          <p><strong>Selected Languages:</strong> {formData.selectedForeignLanguages.length > 0 ? formData.selectedForeignLanguages.join(', ') : 'None'}</p>
          <p><strong>Student Counts:</strong> {formData.foreignLanguagesStudentCounts ? 'Provided' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>Summary Statistics</h4>
          <p><strong>Total Indian Languages (Offered):</strong> {formData.selectedAecIndianLanguages.length}</p>
          <p><strong>Total Indian Languages (Opted):</strong> {formData.selectedAecIndianLanguagesOpted.length}</p>
          <p><strong>Total Foreign Languages:</strong> {formData.selectedForeignLanguages.length}</p>
          <p><strong>Total Language Options:</strong> {
            formData.selectedAecIndianLanguages.length + 
            formData.selectedAecIndianLanguagesOpted.length + 
            formData.selectedForeignLanguages.length
          }</p>
        </div>

        <div className="summary-card">
          <h4>Detailed Information</h4>
          <p><strong>Semester-wise Course Details:</strong> {
            formData.aecCoursesOfferedSemesterWise && formData.aecCoursesOptedSemesterWise ? 'Complete' : 'Incomplete'
          }</p>
          <p><strong>Language Course Coverage:</strong> {
            (Number(formData.aecIndianLanguagesNumber) > 0 || Number(formData.foreignLanguagesNumber) > 0) ? 'Available' : 'Not available'
          }</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. If everything looks correct, proceed to the next step for final submission.
        </p>
      </div>
    </div>
  );

  // SECTION 2: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>AEC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your AEC data has been recorded.</p>
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
      case 0: return renderAecCourses();
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

      <Page7
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

export default AECForm;