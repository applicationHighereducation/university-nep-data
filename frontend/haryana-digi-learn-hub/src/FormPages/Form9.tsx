import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page9 from '../pages/Page9';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: Environmental Education Programs
  compulsoryEnvironmentalProgramsNumber: string | number;
  selectedEnvironmentalPrograms: string[];
  assessmentWeightEnvironmental: string;
  ugWithoutEnvironmentalNumber: string | number;
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
const EnvironmentalEducationForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    compulsoryEnvironmentalProgramsNumber: '',
    selectedEnvironmentalPrograms: [],
    assessmentWeightEnvironmental: '',
    ugWithoutEnvironmentalNumber: '',
  });

  // Dynamic option states for each dropdown
  const [environmentalProgramsOptions, setEnvironmentalProgramsOptions] = useState<string[]>([
    'Environmental Science and Ecology',
    'Climate Change and Global Warming',
    'Sustainable Development',
    'Environmental Conservation',
    'Pollution Control and Management',
    'Biodiversity and Wildlife Conservation',
    'Renewable Energy Systems',
    'Water Resource Management',
    'Waste Management and Recycling',
    'Environmental Impact Assessment',
    'Green Technology and Innovation',
    'Environmental Law and Policy',
    'Urban Ecology and Planning',
    'Natural Resource Management',
    'Environmental Chemistry',
    'Environmental Microbiology',
    'Forest Ecology and Management',
    'Marine and Coastal Ecology',
    'Environmental Monitoring',
    'Carbon Footprint and Management',
    'Environmental Health and Safety',
    'Ecological Restoration',
    'Environmental Economics',
    'Green Building and Architecture',
    'Environmental Psychology',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Environmental Education Programs", description: "Compulsory environmental education course details", fields: [] },
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
    console.log('Environmental Education Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page10';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page10';
  };

  const resetForm = (): void => {
    setFormData({
      compulsoryEnvironmentalProgramsNumber: '',
      selectedEnvironmentalPrograms: [],
      assessmentWeightEnvironmental: '',
      ugWithoutEnvironmentalNumber: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: ENVIRONMENTAL EDUCATION PROGRAMS
  const renderEnvironmentalEducationPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Environmental Education Programs</h2>
      <p className="section-description">Compulsory environmental education course details</p>

      <div className="form-grid">
        {renderNumberInput('Programmes with compulsory Environmental Education course - Number', 'compulsoryEnvironmentalProgramsNumber')}
        <div></div>
        
        {Number(formData.compulsoryEnvironmentalProgramsNumber) > 0 && renderDropdownWithTags('Programmes with compulsory Environmental Education course - List', 'environmentalPrograms', environmentalProgramsOptions, 'selectedEnvironmentalPrograms', '-- Add a program --', setEnvironmentalProgramsOptions)}
        
        {renderTextarea('Assessment weight via activities in Environmental Education (%) - Course-wise', 'assessmentWeightEnvironmental', 'Provide course-wise breakdown of assessment weightage for activities in Environmental Education (e.g., Environmental Science: 40%, Climate Change Studies: 35%)')}
        
        {renderNumberInput('UG programmes without compulsory Environmental Education - Number', 'ugWithoutEnvironmentalNumber')}
        <div></div>
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
          <h4>Environmental Education Overview</h4>
          <p><strong>Programs with Compulsory Environmental Education:</strong> {formData.compulsoryEnvironmentalProgramsNumber || 0}</p>
          <p><strong>UG Programs Without Environmental Education:</strong> {formData.ugWithoutEnvironmentalNumber || 0}</p>
          <p><strong>Assessment Weight Details:</strong> {formData.assessmentWeightEnvironmental ? 'Provided' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>Selected Programs</h4>
          <p><strong>Environmental Education Programs:</strong> {formData.selectedEnvironmentalPrograms.length}</p>
          <p><strong>Selected Programs:</strong> {formData.selectedEnvironmentalPrograms.length > 0 ? formData.selectedEnvironmentalPrograms.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Program Coverage</h4>
          <p><strong>Total Programs with Environmental Education:</strong> {formData.compulsoryEnvironmentalProgramsNumber || 0}</p>
          <p><strong>Total Programs without Environmental Education:</strong> {formData.ugWithoutEnvironmentalNumber || 0}</p>
          <p><strong>Coverage Rate:</strong> {
            (Number(formData.compulsoryEnvironmentalProgramsNumber) + Number(formData.ugWithoutEnvironmentalNumber)) > 0 
              ? `${((Number(formData.compulsoryEnvironmentalProgramsNumber) / (Number(formData.compulsoryEnvironmentalProgramsNumber) + Number(formData.ugWithoutEnvironmentalNumber))) * 100).toFixed(1)}%`
              : '0%'
          }</p>
        </div>

        <div className="summary-card">
          <h4>Data Summary</h4>
          <p><strong>Form Completion Status:</strong> {
            formData.compulsoryEnvironmentalProgramsNumber && formData.assessmentWeightEnvironmental ? 'Complete' : 'Incomplete'
          }</p>
          <p><strong>Programs Listed:</strong> {formData.selectedEnvironmentalPrograms.length > 0 ? 'Yes' : 'No'}</p>
          <p><strong>Assessment Details:</strong> {formData.assessmentWeightEnvironmental ? 'Detailed' : 'Not provided'}</p>
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
          <h3>Environmental Education Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your Environmental Education data has been recorded.</p>
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
      case 0: return renderEnvironmentalEducationPrograms();
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
      <FormHeader 
        onSignIn={() => { /* TODO: implement sign in logic */ }} 
        onSignUp={() => { /* TODO: implement sign up logic */ }} 
      />
      <PageNavigationSubheader totalPages={21}/>

      <Page9
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

export default EnvironmentalEducationForm;