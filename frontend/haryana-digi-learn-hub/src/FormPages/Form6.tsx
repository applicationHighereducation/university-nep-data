import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page6 from '../pages/Page6';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: VOC Course Overview
  totalVocCoursesPool: string | number;
  vocCoursesPerSemesterNumber: string | number;
  vocCoursesPerSemesterList: string;
  vocCoursesOptedNumber: string | number;
  vocCoursesOptedList: string;
  vocBeyondDisciplineNumber: string | number;
  selectedVocBeyondDiscipline: string[];
  
  // Section 2: VOC Implementation & Faculty
  handsOnCreditWeightage: string;
  vocEngagedByHeiNumber: string | number;
  teachersAvailableVocNumber: string | number;
  vocExternalExpertsNumber: string | number;
  selectedVocExternalExperts: string[];
  vocViaNsvetNumber: string | number;
  selectedVocViaNsvet: string[];
  vocViaSkillUniversitiesNumber: string | number;
  selectedVocViaSkillUniversities: string[];
  
  // Section 3: VOC Outcomes & Partnerships
  finalYearVocPlacementPercentage: string | number;
  mouVocNumber: string | number;
  activeMouVocNumber: string | number;
  vocTrainingMouDetails: string;
  studentsVocInternshipPercentage: string | number;
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
const VOCForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    totalVocCoursesPool: '',
    vocCoursesPerSemesterNumber: '',
    vocCoursesPerSemesterList: '',
    vocCoursesOptedNumber: '',
    vocCoursesOptedList: '',
    vocBeyondDisciplineNumber: '',
    selectedVocBeyondDiscipline: [],
    handsOnCreditWeightage: '',
    vocEngagedByHeiNumber: '',
    teachersAvailableVocNumber: '',
    vocExternalExpertsNumber: '',
    selectedVocExternalExperts: [],
    vocViaNsvetNumber: '',
    selectedVocViaNsvet: [],
    vocViaSkillUniversitiesNumber: '',
    selectedVocViaSkillUniversities: [],
    finalYearVocPlacementPercentage: '',
    mouVocNumber: '',
    activeMouVocNumber: '',
    vocTrainingMouDetails: '',
    studentsVocInternshipPercentage: '',
  });

  // Dynamic option states for each dropdown
  const [vocBeyondDisciplineOptions, setVocBeyondDisciplineOptions] = useState<string[]>([
    'Food Processing & Technology',
    'Textile & Garment Design',
    'Automotive Technology',
    'Construction Technology',
    'Beauty & Wellness',
    'Tourism & Travel Management',
    'Retail Management',
    'Banking & Finance',
    'Healthcare Technology',
    'Agriculture Technology',
    'Renewable Energy Technology',
    'Digital Media Production',
    'Logistics & Supply Chain',
    'Other'
  ]);

  const [vocExternalExpertsOptions, setVocExternalExpertsOptions] = useState<string[]>([
    'Industrial Automation',
    'Advanced Manufacturing',
    'Quality Control & Testing',
    'Digital Marketing Specialist',
    'Financial Planning & Analysis',
    'Healthcare Management',
    'Hotel & Restaurant Management',
    'Event Management',
    'Interior Design',
    'Fashion Technology',
    'Photography & Videography',
    'Web Development & Design',
    'Mobile App Development',
    'Other'
  ]);

  const [vocViaNsvetOptions, setVocViaNsvetOptions] = useState<string[]>([
    'NSDC Certified Courses',
    'Sector Skill Council Programs',
    'Recognition of Prior Learning (RPL)',
    'Short Term Training Programs',
    'Apprenticeship Training Scheme',
    'Skill Development Programs',
    'Industry-Aligned Training',
    'Competency-Based Training',
    'Vocational Education Programs',
    'Skill Certification Courses',
    'Other'
  ]);

  const [vocViaSkillUniversitiesOptions, setVocViaSkillUniversitiesOptions] = useState<string[]>([
    'Advanced Diploma Programs',
    'Certificate in Specialized Skills',
    'Industry Partnership Programs',
    'Technical Training Modules',
    'Professional Development Courses',
    'Skill-based Learning Programs',
    'Vocational Training Certificates',
    'Trade-specific Programs',
    'Technology Integration Courses',
    'Entrepreneurship Development',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "VOC Course Overview", description: "Vocational course offerings and selections", fields: [] },
    { id: 1, title: "VOC Implementation & Faculty", description: "Practical components and teaching arrangements", fields: [] },
    { id: 2, title: "VOC Outcomes & Partnerships", description: "Placements, MoUs, and internship outcomes", fields: [] },
    { id: 3, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 4, title: "Submit", description: "Final submission", fields: [] }
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

  // Generic component for rendering percentage input
  const renderPercentageInput = (
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
          max="100"
          step="0.01"
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
    console.log('VOC Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page7';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page7';
  };

  const resetForm = (): void => {
    setFormData({
      totalVocCoursesPool: '',
      vocCoursesPerSemesterNumber: '',
      vocCoursesPerSemesterList: '',
      vocCoursesOptedNumber: '',
      vocCoursesOptedList: '',
      vocBeyondDisciplineNumber: '',
      selectedVocBeyondDiscipline: [],
      handsOnCreditWeightage: '',
      vocEngagedByHeiNumber: '',
      teachersAvailableVocNumber: '',
      vocExternalExpertsNumber: '',
      selectedVocExternalExperts: [],
      vocViaNsvetNumber: '',
      selectedVocViaNsvet: [],
      vocViaSkillUniversitiesNumber: '',
      selectedVocViaSkillUniversities: [],
      finalYearVocPlacementPercentage: '',
      mouVocNumber: '',
      activeMouVocNumber: '',
      vocTrainingMouDetails: '',
      studentsVocInternshipPercentage: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: VOC COURSE OVERVIEW
  const renderVocCourseOverview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">VOC Course Overview</h2>
      <p className="section-description">Vocational course offerings and selections</p>

      <div className="form-grid">
        {renderNumberInput('Total VOC courses in affiliating university pool - Number', 'totalVocCoursesPool')}
        {renderNumberInput('Total VOC courses offered per semester in university - Number', 'vocCoursesPerSemesterNumber')}
        
        {renderTextarea('VOC courses offered per semester - List', 'vocCoursesPerSemesterList', 'Provide semester-wise list of VOC courses offered (e.g., Semester 1: Course A, Course B; Semester 2: Course C, Course D)')}
        
        {renderNumberInput('VOC courses opted per semester - Number', 'vocCoursesOptedNumber')}
        <div></div>
        
        {renderTextarea('VOC courses opted per semester - List', 'vocCoursesOptedList', 'Provide semester-wise list of VOC courses actually opted by students')}
        
        {renderNumberInput('VOC beyond discipline - Number', 'vocBeyondDisciplineNumber')}
        <div></div>
        {Number(formData.vocBeyondDisciplineNumber) > 0 && renderDropdownWithTags('VOC beyond discipline - List', 'vocBeyondDiscipline', vocBeyondDisciplineOptions, 'selectedVocBeyondDiscipline', '-- Add a course --', setVocBeyondDisciplineOptions)}
      </div>
    </div>
  );

  // SECTION 1: VOC IMPLEMENTATION & FACULTY
  const renderVocImplementationFaculty = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">VOC Implementation & Faculty</h2>
      <p className="section-description">Practical components and teaching arrangements</p>

      <div className="form-grid">
        {renderTextarea('Hands-on/practical credit weightage per VOC (%) - Course-wise', 'handsOnCreditWeightage', 'Provide course-wise breakdown of hands-on/practical credit weightage (e.g., Course A: 60%, Course B: 70%)')}
        
        {renderNumberInput('VOC engaged by HEI Faculty - Number', 'vocEngagedByHeiNumber')}
        {renderNumberInput('Teachers available to teach VOC - Number', 'teachersAvailableVocNumber')}
        
        {renderNumberInput('VOC with external experts - Number', 'vocExternalExpertsNumber')}
        <div></div>
        {Number(formData.vocExternalExpertsNumber) > 0 && renderDropdownWithTags('VOC with external experts - List', 'vocExternalExperts', vocExternalExpertsOptions, 'selectedVocExternalExperts', '-- Add a course --', setVocExternalExpertsOptions)}
        
        {renderNumberInput('VOC via NSVET/NSDC - Number', 'vocViaNsvetNumber')}
        <div></div>
        {Number(formData.vocViaNsvetNumber) > 0 && renderDropdownWithTags('VOC via NSVET/NSDC - List', 'vocViaNsvet', vocViaNsvetOptions, 'selectedVocViaNsvet', '-- Add a program --', setVocViaNsvetOptions)}
        
        {renderNumberInput('VOC via Skill Universities/other universities/vocational institutions - Number', 'vocViaSkillUniversitiesNumber')}
        <div></div>
        {Number(formData.vocViaSkillUniversitiesNumber) > 0 && renderDropdownWithTags('VOC via Skill Universities/other universities/vocational institutions - List', 'vocViaSkillUniversities', vocViaSkillUniversitiesOptions, 'selectedVocViaSkillUniversities', '-- Add a program --', setVocViaSkillUniversitiesOptions)}
      </div>
    </div>
  );

  // SECTION 2: VOC OUTCOMES & PARTNERSHIPS
  const renderVocOutcomesPartnerships = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">VOC Outcomes & Partnerships</h2>
      <p className="section-description">Placements, MoUs, and internship outcomes</p>

      <div className="form-grid">
        {renderPercentageInput('Final year placed in VOC area - Percentage', 'finalYearVocPlacementPercentage')}
        {renderNumberInput('MoUs for VOC - Number', 'mouVocNumber')}
        
        {renderNumberInput('Active MoUs for VOC - Number', 'activeMouVocNumber')}
        {renderPercentageInput('Percentage', 'studentsVocInternshipPercentage')}
        
        {renderTextarea('VOC training provided by MoU partners - Course-wise student counts', 'vocTrainingMouDetails', 'Provide detailed information about VOC training provided by MoU partners including course names and student enrollment counts')}
      </div>
    </div>
  );

  // SECTION 3: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>VOC Course Overview</h4>
          <p><strong>Total VOC in Pool:</strong> {formData.totalVocCoursesPool || 0}</p>
          <p><strong>VOC Offered per Semester:</strong> {formData.vocCoursesPerSemesterNumber || 0}</p>
          <p><strong>VOC Opted per Semester:</strong> {formData.vocCoursesOptedNumber || 0}</p>
          <p><strong>VOC Beyond Discipline:</strong> {formData.vocBeyondDisciplineNumber || 0}</p>
        </div>

        <div className="summary-card">
          <h4>Faculty & Implementation</h4>
          <p><strong>VOC by HEI Faculty:</strong> {formData.vocEngagedByHeiNumber || 0}</p>
          <p><strong>Available VOC Teachers:</strong> {formData.teachersAvailableVocNumber || 0}</p>
          <p><strong>VOC with External Experts:</strong> {formData.vocExternalExpertsNumber || 0}</p>
          <p><strong>VOC via NSVET/NSDC:</strong> {formData.vocViaNsvetNumber || 0}</p>
        </div>

        <div className="summary-card">
          <h4>Outcomes & Performance</h4>
          <p><strong>VOC Area Placement:</strong> {formData.finalYearVocPlacementPercentage || 0}%</p>
          <p><strong>VOC Internship Completion:</strong> {formData.studentsVocInternshipPercentage || 0}%</p>
          <p><strong>MoUs Signed:</strong> {formData.mouVocNumber || 0}</p>
          <p><strong>Active MoUs:</strong> {formData.activeMouVocNumber || 0}</p>
        </div>

        <div className="summary-card">
          <h4>Selected Courses Summary</h4>
          <p><strong>Beyond Discipline Courses:</strong> {formData.selectedVocBeyondDiscipline.length}</p>
          <p><strong>External Expert Courses:</strong> {formData.selectedVocExternalExperts.length}</p>
          <p><strong>NSVET/NSDC Programs:</strong> {formData.selectedVocViaNsvet.length}</p>
          <p><strong>Skill University Programs:</strong> {formData.selectedVocViaSkillUniversities.length}</p>
        </div>

        <div className="summary-card">
          <h4>Institutional Programs</h4>
          <p><strong>VOC via Skill Universities:</strong> {formData.vocViaSkillUniversitiesNumber || 0}</p>
          <p><strong>Total Selected Programs:</strong> {
            formData.selectedVocBeyondDiscipline.length + 
            formData.selectedVocExternalExperts.length + 
            formData.selectedVocViaNsvet.length + 
            formData.selectedVocViaSkillUniversities.length
          }</p>
        </div>

        <div className="summary-card">
          <h4>Additional Information</h4>
          <p><strong>Semester-wise Offered List:</strong> {formData.vocCoursesPerSemesterList ? 'Provided' : 'Not provided'}</p>
          <p><strong>Semester-wise Opted List:</strong> {formData.vocCoursesOptedList ? 'Provided' : 'Not provided'}</p>
          <p><strong>Hands-on Credit Details:</strong> {formData.handsOnCreditWeightage ? 'Provided' : 'Not provided'}</p>
          <p><strong>MoU Training Details:</strong> {formData.vocTrainingMouDetails ? 'Provided' : 'Not provided'}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. If everything looks correct, proceed to the next step for final submission.
        </p>
      </div>
    </div>
  );

  // SECTION 4: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>VOC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your VOC data has been recorded.</p>
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
      case 0: return renderVocCourseOverview();
      case 1: return renderVocImplementationFaculty();
      case 2: return renderVocOutcomesPartnerships();
      case 3: return renderReview();
      case 4: return renderSubmit();
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

      <Page6
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

export default VOCForm;