import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page4 from '../pages/Page4';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: MDC Overview
  mdcOfferedTotal: string | number;
  mdcOfferedByDiscipline: string;
  mdcOptedStudentsTotal: string | number;
  mdcOptedStudentsByDiscipline: string;
  moocsForMdcNumber: string | number;
  selectedMoocsForMdc: string[];
  
  // Section 2: MDC Implementation
  mdcViaMoocsNumber: string | number;
  selectedMdcViaMoocs: string[];
  mdcViaOtherUniversitiesNumber: string | number;
  selectedMdcViaOtherUniversities: string[];
  mdcLearningOutcomes: string;
  
  // Section 3: Course Structure
  majorCoursesByDiscipline: string;
  majorCoursesDelivery: string;
  minorCoursesByDiscipline: string;
  minorCoursesDelivery: string;
  
  // Section 4: Resources & Partnerships
  teachersForMdcNumber: string | number;
  mouSignedNumber: string | number;
  activeMouNumber: string | number;
  mdcUnderMouDetails: string;
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
const MDCForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    mdcOfferedTotal: '',
    mdcOfferedByDiscipline: '',
    mdcOptedStudentsTotal: '',
    mdcOptedStudentsByDiscipline: '',
    moocsForMdcNumber: '',
    selectedMoocsForMdc: [],
    mdcViaMoocsNumber: '',
    selectedMdcViaMoocs: [],
    mdcViaOtherUniversitiesNumber: '',
    selectedMdcViaOtherUniversities: [],
    mdcLearningOutcomes: '',
    majorCoursesByDiscipline: '',
    majorCoursesDelivery: '',
    minorCoursesByDiscipline: '',
    minorCoursesDelivery: '',
    teachersForMdcNumber: '',
    mouSignedNumber: '',
    activeMouNumber: '',
    mdcUnderMouDetails: '',
  });

  // Dynamic option states for each dropdown
  const [moocsForMdcOptions, setMoocsForMdcOptions] = useState<string[]>([
    'Introduction to Data Science',
    'Environmental Studies',
    'Digital Marketing',
    'Psychology and Human Behavior',
    'Financial Literacy',
    'Communication Skills',
    'Ethics and Values',
    'Innovation and Entrepreneurship',
    'Critical Thinking',
    'Global Citizenship',
    'Other'
  ]);

  const [mdcViaMoocsOptions, setMdcViaMoocsOptions] = useState<string[]>([
    'NPTEL Courses',
    'SWAYAM Courses',
    'Coursera Courses',
    'edX Courses',
    'FutureLearn Courses',
    'Khan Academy',
    'MIT OpenCourseWare',
    'Stanford Online',
    'Harvard Online Learning',
    'Other'
  ]);

  const [mdcViaOtherUniversitiesOptions, setMdcViaOtherUniversitiesOptions] = useState<string[]>([
    'IIT Delhi Online Courses',
    'IISc Bangalore Courses',
    'JNU Online Programs',
    'University of Delhi Courses',
    'IGNOU Programs',
    'BITS Pilani Online',
    'Anna University Courses',
    'Jadavpur University Online',
    'International University Courses',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "MDC Overview", description: "Total MDC offerings and student participation", fields: [] },
    { id: 1, title: "MDC Implementation", description: "MDC delivery through MOOCs and other platforms", fields: [] },
    { id: 2, title: "Course Structure", description: "Major and minor course organization", fields: [] },
    { id: 3, title: "Resources & Partnerships", description: "Faculty resources and institutional partnerships", fields: [] },
    { id: 4, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 5, title: "Submit", description: "Final submission", fields: [] }
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
    console.log('MDC Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page5';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page5';
  };

  const resetForm = (): void => {
    setFormData({
      mdcOfferedTotal: '',
      mdcOfferedByDiscipline: '',
      mdcOptedStudentsTotal: '',
      mdcOptedStudentsByDiscipline: '',
      moocsForMdcNumber: '',
      selectedMoocsForMdc: [],
      mdcViaMoocsNumber: '',
      selectedMdcViaMoocs: [],
      mdcViaOtherUniversitiesNumber: '',
      selectedMdcViaOtherUniversities: [],
      mdcLearningOutcomes: '',
      majorCoursesByDiscipline: '',
      majorCoursesDelivery: '',
      minorCoursesByDiscipline: '',
      minorCoursesDelivery: '',
      teachersForMdcNumber: '',
      mouSignedNumber: '',
      activeMouNumber: '',
      mdcUnderMouDetails: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: MDC OVERVIEW
  const renderMdcOverview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">MDC Overview</h2>
      <p className="section-description">Total MDC offerings and student participation</p>

      <div className="form-grid">
        {renderNumberInput('MDC offered - Total Number', 'mdcOfferedTotal')}
        <div></div>
        
        {renderTextarea('MDC offered - Number by discipline', 'mdcOfferedByDiscipline', 'Provide discipline-wise breakdown of MDC courses offered (e.g., Sciences: 15, Arts: 12, Commerce: 8, etc.)')}
        
        {renderNumberInput('MDC opted by students - Total Number', 'mdcOptedStudentsTotal')}
        <div></div>
        
        {renderTextarea('MDC opted by students - Number by discipline', 'mdcOptedStudentsByDiscipline', 'Provide discipline-wise breakdown of students who opted for MDC courses')}
        
        {renderNumberInput('MOOCs identified to be offered as MDC - Number', 'moocsForMdcNumber')}
        <div></div>
        
        {Number(formData.moocsForMdcNumber) > 0 && renderDropdownWithTags('MOOCs identified to be offered as MDC - List', 'moocsForMdc', moocsForMdcOptions, 'selectedMoocsForMdc', '-- Add a MOOC course --', setMoocsForMdcOptions)}
      </div>
    </div>
  );

  // SECTION 1: MDC IMPLEMENTATION
  const renderMdcImplementation = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">MDC Implementation</h2>
      <p className="section-description">MDC delivery through MOOCs and other platforms</p>

      <div className="form-grid">
        {renderNumberInput('MDC opted through MOOCs - Number', 'mdcViaMoocsNumber')}
        <div></div>
        
        {Number(formData.mdcViaMoocsNumber) > 0 && renderDropdownWithTags('MDC opted through MOOCs - List', 'mdcViaMoocs', mdcViaMoocsOptions, 'selectedMdcViaMoocs', '-- Add a MOOC platform --', setMdcViaMoocsOptions)}
        
        {renderNumberInput('MDC opted via other universities\' online courses - Number', 'mdcViaOtherUniversitiesNumber')}
        <div></div>
        
        {Number(formData.mdcViaOtherUniversitiesNumber) > 0 && renderDropdownWithTags('MDC opted via other universities\' online courses - List', 'mdcViaOtherUniversities', mdcViaOtherUniversitiesOptions, 'selectedMdcViaOtherUniversities', '-- Add a university course --', setMdcViaOtherUniversitiesOptions)}
        
        {renderTextarea('Attainment/Learning Outcomes of MDC - Course-wise details', 'mdcLearningOutcomes', 'Provide detailed course-wise learning outcomes and attainment levels for MDC courses')}
      </div>
    </div>
  );

  // SECTION 2: COURSE STRUCTURE
  const renderCourseStructure = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Course Structure</h2>
      <p className="section-description">Major and minor course organization</p>

      <div className="form-grid">
        {renderTextarea('Major courses offered in each discipline - List', 'majorCoursesByDiscipline', 'Provide discipline-wise list of major courses offered')}
        
        {renderTextarea('Major courses delivery (Combinations/Open Choice)', 'majorCoursesDelivery', 'Describe the delivery methodology for major courses including combinations and open choice options')}
        
        {renderTextarea('Minor courses offered per major discipline - List', 'minorCoursesByDiscipline', 'Provide discipline-wise list of minor courses available for each major discipline')}
        
        {renderTextarea('Minor courses delivery (Combinations/Open Choice)', 'minorCoursesDelivery', 'Describe the delivery methodology for minor courses including combinations and open choice options')}
      </div>
    </div>
  );

  // SECTION 3: RESOURCES & PARTNERSHIPS
  const renderResourcesPartnerships = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Resources & Partnerships</h2>
      <p className="section-description">Faculty resources and institutional partnerships</p>

      <div className="form-grid">
        {renderNumberInput('Teachers available to teach MDC - Number', 'teachersForMdcNumber')}
        {renderNumberInput('MoUs signed for MDC - Number', 'mouSignedNumber')}
        
        {renderNumberInput('Active MoUs for MDC - Number', 'activeMouNumber')}
        <div></div>
        
        {renderTextarea('MDC under MoUs - Number of courses and student counts', 'mdcUnderMouDetails', 'Provide details of MDC courses offered under MoUs including number of courses and student enrollment counts')}
      </div>
    </div>
  );

  // SECTION 4: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>MDC Overview</h4>
          <p><strong>Total MDC Offered:</strong> {formData.mdcOfferedTotal || 0}</p>
          <p><strong>Students Opted (Total):</strong> {formData.mdcOptedStudentsTotal || 0}</p>
          <p><strong>MOOCs for MDC:</strong> {formData.moocsForMdcNumber || 0}</p>
          <p><strong>Selected MOOCs:</strong> {formData.selectedMoocsForMdc.length > 0 ? formData.selectedMoocsForMdc.join(', ') : 'None'}</p>
          {formData.mdcOfferedByDiscipline && (
            <p><strong>MDC by Discipline:</strong> {formData.mdcOfferedByDiscipline.substring(0, 100)}{formData.mdcOfferedByDiscipline.length > 100 ? '...' : ''}</p>
          )}
        </div>

        <div className="summary-card">
          <h4>MDC Implementation</h4>
          <p><strong>MDC via MOOCs:</strong> {formData.mdcViaMoocsNumber || 0}</p>
          <p><strong>MDC via Other Universities:</strong> {formData.mdcViaOtherUniversitiesNumber || 0}</p>
          <p><strong>MOOC Platforms:</strong> {formData.selectedMdcViaMoocs.length > 0 ? formData.selectedMdcViaMoocs.join(', ') : 'None'}</p>
          <p><strong>Other Universities:</strong> {formData.selectedMdcViaOtherUniversities.length > 0 ? formData.selectedMdcViaOtherUniversities.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Course Structure</h4>
          <p><strong>Major Courses:</strong> {formData.majorCoursesByDiscipline ? 'Defined' : 'Not defined'}</p>
          <p><strong>Minor Courses:</strong> {formData.minorCoursesByDiscipline ? 'Defined' : 'Not defined'}</p>
          <p><strong>Major Delivery:</strong> {formData.majorCoursesDelivery ? 'Specified' : 'Not specified'}</p>
          <p><strong>Minor Delivery:</strong> {formData.minorCoursesDelivery ? 'Specified' : 'Not specified'}</p>
        </div>

        <div className="summary-card">
          <h4>Resources & Partnerships</h4>
          <p><strong>Teachers for MDC:</strong> {formData.teachersForMdcNumber || 0}</p>
          <p><strong>Total MoUs Signed:</strong> {formData.mouSignedNumber || 0}</p>
          <p><strong>Active MoUs:</strong> {formData.activeMouNumber || 0}</p>
          <p><strong>MoU Details:</strong> {formData.mdcUnderMouDetails ? 'Provided' : 'Not provided'}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. Click "Next" to proceed to submission.
        </p>
      </div>
    </div>
  );

  // SECTION 5: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>MDC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your MDC data has been recorded.</p>
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
      case 0: return renderMdcOverview();
      case 1: return renderMdcImplementation();
      case 2: return renderCourseStructure();
      case 3: return renderResourcesPartnerships();
      case 4: return renderReview();
      case 5: return renderSubmit();
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

      <Page4
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

export default MDCForm;