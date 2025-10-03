import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page10 from '../pages/Page10';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: Community Engagement Programs
  communityEngagementProgramsNumber: string | number;
  selectedCommunityEngagementPrograms: string[];
  activeCommunityProgramsNumber: string | number;
  communityCoursesOfferedSemesterWise: string;
  communityCoursesOptedSemesterWise: string;
  
  // Section 2: Assessment & Credits
  assessmentWeightCommunity: string;
  experientialLearningActivities: string;
  creditsProvisionNss: 'Yes' | 'No' | '';
  maxCreditsUg: string | number;
  maxCredits4Year: string | number;
  maxCredits5Year: string | number;
  studentVolunteersNumber: string | number;
  studentVolunteersPercentage: string;
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
const CommunityEngagementForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    communityEngagementProgramsNumber: '',
    selectedCommunityEngagementPrograms: [],
    activeCommunityProgramsNumber: '',
    communityCoursesOfferedSemesterWise: '',
    communityCoursesOptedSemesterWise: '',
    assessmentWeightCommunity: '',
    experientialLearningActivities: '',
    creditsProvisionNss: '',
    maxCreditsUg: '',
    maxCredits4Year: '',
    maxCredits5Year: '',
    studentVolunteersNumber: '',
    studentVolunteersPercentage: '',
  });

  // Dynamic option states for each dropdown
  const [communityEngagementProgramsOptions, setCommunityEngagementProgramsOptions] = useState<string[]>([
    'Rural Development Programs',
    'Community Health Services',
    'Environmental Conservation Projects',
    'Education and Literacy Programs',
    'Women Empowerment Initiatives',
    'Child Welfare Programs',
    'Elder Care Services',
    'Skill Development Training',
    'Disaster Relief and Management',
    'Digital Literacy Programs',
    'Sustainable Agriculture Projects',
    'Clean Water and Sanitation',
    'Renewable Energy Initiatives',
    'Social Entrepreneurship',
    'Community Infrastructure Development',
    'Cultural Heritage Preservation',
    'Legal Aid and Awareness',
    'Mental Health Support',
    'Poverty Alleviation Programs',
    'Youth Development Activities',
    'Blood Donation Drives',
    'Tree Plantation Campaigns',
    'Waste Management Projects',
    'Road Safety Awareness',
    'Food Security Programs',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Community Engagement Programs", description: "Programs and courses based on community service", fields: [] },
    { id: 1, title: "Assessment & Credits", description: "Assessment methods and credit provisions", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
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

  // Component for rendering Yes/No radio buttons
  const renderYesNoRadio = (
    label: string,
    field: keyof FormData,
    required = false
  ): JSX.Element => {
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
    console.log('Community Engagement Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page11';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page11';
  };

  const resetForm = (): void => {
    setFormData({
      communityEngagementProgramsNumber: '',
      selectedCommunityEngagementPrograms: [],
      activeCommunityProgramsNumber: '',
      communityCoursesOfferedSemesterWise: '',
      communityCoursesOptedSemesterWise: '',
      assessmentWeightCommunity: '',
      experientialLearningActivities: '',
      creditsProvisionNss: '',
      maxCreditsUg: '',
      maxCredits4Year: '',
      maxCredits5Year: '',
      studentVolunteersNumber: '',
      studentVolunteersPercentage: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: COMMUNITY ENGAGEMENT PROGRAMS
  const renderCommunityEngagementPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Community Engagement Programs</h2>
      <p className="section-description">Programs and courses based on community service</p>

      <div className="form-grid">
        {renderNumberInput('Programmes based on Community Engagement & Service - Number', 'communityEngagementProgramsNumber')}
        <div></div>
        
        {Number(formData.communityEngagementProgramsNumber) > 0 && renderDropdownWithTags('Programmes based on Community Engagement & Service - List', 'communityEngagementPrograms', communityEngagementProgramsOptions, 'selectedCommunityEngagementPrograms', '-- Add a program --', setCommunityEngagementProgramsOptions)}
        
        {renderNumberInput('Programmes actively running based on Community Engagement & Service - Number', 'activeCommunityProgramsNumber')}
        <div></div>
        
        {renderTextarea('Courses based on Community Engagement & Service - Semester-wise List', 'communityCoursesOfferedSemesterWise', 'Provide semester-wise list of community engagement courses offered (e.g., Semester 1: Course A, Course B; Semester 2: Course C, Course D)')}
        
        {renderTextarea('Courses based on Community Engagement & Service opted by students - Semester-wise List', 'communityCoursesOptedSemesterWise', 'Provide semester-wise list of community engagement courses actually opted by students')}
      </div>
    </div>
  );

  // SECTION 1: ASSESSMENT & CREDITS
  const renderAssessmentCredits = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Assessment & Credits</h2>
      <p className="section-description">Assessment methods and credit provisions</p>

      <div className="form-grid">
        {renderTextarea('Assessment via activities in above courses (%) - Course-wise', 'assessmentWeightCommunity', 'Provide course-wise breakdown of assessment weightage for activities (e.g., Community Service Course: 60%, Social Work Practicum: 70%)')}
        
        {renderTextarea('Experiential learning activities under value-based education - Semester-wise List', 'experientialLearningActivities', 'Provide semester-wise list of experiential learning activities under value-based education programs')}
        
        {renderYesNoRadio('Credits provision for NSS/NCC/YRC?', 'creditsProvisionNss')}
        
        {formData.creditsProvisionNss === 'Yes' && (
          <>
            {renderNumberInput('Max credits via NSS/NCC/YRC (UG)', 'maxCreditsUg')}
            {renderNumberInput('Max credits via NSS/NCC/YRC (4-yr Integrated)', 'maxCredits4Year')}
            
            {renderNumberInput('Max credits via NSS/NCC/YRC (5-yr Integrated)', 'maxCredits5Year')}
            <div></div>
          </>
        )}
        
        {renderNumberInput('Student volunteers credited for NSS/NCC/YRC - Number', 'studentVolunteersNumber')}
        <div></div>
        
        {renderTextarea('Student volunteers credited for NSS/NCC/YRC - Percentage of enrolled (semester-wise)', 'studentVolunteersPercentage', 'Provide semester-wise percentage of enrolled students who are credited volunteers (e.g., Semester 1: 15%, Semester 2: 18%)')}
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
          <h4>Community Engagement Overview</h4>
          <p><strong>Total Programs:</strong> {formData.communityEngagementProgramsNumber || 0}</p>
          <p><strong>Active Programs:</strong> {formData.activeCommunityProgramsNumber || 0}</p>
          <p><strong>Selected Programs:</strong> {formData.selectedCommunityEngagementPrograms.length}</p>
          <p><strong>Activity Rate:</strong> {
            Number(formData.communityEngagementProgramsNumber) > 0 
              ? `${((Number(formData.activeCommunityProgramsNumber) / Number(formData.communityEngagementProgramsNumber)) * 100).toFixed(1)}%`
              : '0%'
          }</p>
        </div>

        <div className="summary-card">
          <h4>Course Information</h4>
          <p><strong>Courses Offered (Semester-wise):</strong> {formData.communityCoursesOfferedSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Courses Opted (Semester-wise):</strong> {formData.communityCoursesOptedSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Assessment Details:</strong> {formData.assessmentWeightCommunity ? 'Provided' : 'Not provided'}</p>
          <p><strong>Experiential Learning:</strong> {formData.experientialLearningActivities ? 'Detailed' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>NSS/NCC/YRC Credits</h4>
          <p><strong>Credits Provision:</strong> {formData.creditsProvisionNss || 'Not specified'}</p>
          {formData.creditsProvisionNss === 'Yes' && (
            <>
              <p><strong>Max Credits (UG):</strong> {formData.maxCreditsUg || 0}</p>
              <p><strong>Max Credits (4-yr):</strong> {formData.maxCredits4Year || 0}</p>
              <p><strong>Max Credits (5-yr):</strong> {formData.maxCredits5Year || 0}</p>
            </>
          )}
        </div>

        <div className="summary-card">
          <h4>Student Volunteers</h4>
          <p><strong>Credited Volunteers:</strong> {formData.studentVolunteersNumber || 0}</p>
          <p><strong>Semester-wise Percentages:</strong> {formData.studentVolunteersPercentage ? 'Provided' : 'Not provided'}</p>
          <p><strong>Volunteer Programs:</strong> {formData.selectedCommunityEngagementPrograms.join(', ') || 'None listed'}</p>
        </div>

        <div className="summary-card">
          <h4>Data Completeness</h4>
          <p><strong>Program Details:</strong> {
            formData.communityEngagementProgramsNumber && formData.selectedCommunityEngagementPrograms.length > 0 ? 'Complete' : 'Incomplete'
          }</p>
          <p><strong>Course Information:</strong> {
            formData.communityCoursesOfferedSemesterWise && formData.communityCoursesOptedSemesterWise ? 'Complete' : 'Incomplete'
          }</p>
          <p><strong>Assessment Data:</strong> {formData.assessmentWeightCommunity ? 'Complete' : 'Incomplete'}</p>
        </div>
      </div>

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
          <h3>Community Engagement Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your Community Engagement & Service data has been recorded.</p>
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
      case 0: return renderCommunityEngagementPrograms();
      case 1: return renderAssessmentCredits();
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

      <Page10
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

export default CommunityEngagementForm;