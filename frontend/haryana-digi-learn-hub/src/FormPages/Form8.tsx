import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page8 from '../pages/Page8';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: Value-based Programs
  compulsoryValuesProgramsNumber: string | number;
  assessmentWeightActivities: string;
  programsWithoutValuesNumber: string | number;
  vacOfferedSemesterWise: string;
  iksBasedVacSemesterWise: string;
  vacOptedSemesterWise: string;
  nonDisciplineVacSemesterWise: string;
  
  // Section 2: Resources & Faculty
  vacBooksNumber: string | number;
  selectedVacBooks: string[];
  teachersAvailableVacNumber: string | number;
  facultyTrainedNumber: string | number;
  selectedFacultyTrained: string[];
  fdpStpNumber: string | number;
  selectedFdpStp: string[];
  avgValueCreditsPerStudent: string | number;
  
  // Section 3: MoUs & Activities
  mouValueBasedNumber: string | number;
  selectedMouValueBased: string[];
  activitiesUnderMou: string;
  studentsTrainedMouPercentage: string | number;
  interdisciplinaryEventsNumber: string | number;
  selectedInterdisciplinaryEvents: string[];
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
const VACForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    compulsoryValuesProgramsNumber: '',
    assessmentWeightActivities: '',
    programsWithoutValuesNumber: '',
    vacOfferedSemesterWise: '',
    iksBasedVacSemesterWise: '',
    vacOptedSemesterWise: '',
    nonDisciplineVacSemesterWise: '',
    vacBooksNumber: '',
    selectedVacBooks: [],
    teachersAvailableVacNumber: '',
    facultyTrainedNumber: '',
    selectedFacultyTrained: [],
    fdpStpNumber: '',
    selectedFdpStp: [],
    avgValueCreditsPerStudent: '',
    mouValueBasedNumber: '',
    selectedMouValueBased: [],
    activitiesUnderMou: '',
    studentsTrainedMouPercentage: '',
    interdisciplinaryEventsNumber: '',
    selectedInterdisciplinaryEvents: [],
  });

  // Dynamic option states for each dropdown
  const [vacBooksOptions, setVacBooksOptions] = useState<string[]>([
    'Ethics and Moral Philosophy',
    'Constitutional Values',
    'Human Rights Education',
    'Environmental Ethics',
    'Professional Ethics',
    'Social Responsibility',
    'Cultural Values',
    'Spiritual Values',
    'Universal Human Values',
    'Value-based Leadership',
    'Indian Philosophy',
    'Moral Psychology',
    'Ethics in Technology',
    'Other'
  ]);

  const [facultyTrainedOptions, setFacultyTrainedOptions] = useState<string[]>([
    'Value-based Teaching Methodology',
    'Ethics Integration Techniques',
    'Moral Development Pedagogy',
    'Constitutional Values Education',
    'Character Building Methods',
    'Experiential Learning in Values',
    'Case Study Method for Ethics',
    'Reflective Practice in Values',
    'Assessment of Value Learning',
    'Cross-cultural Ethics Teaching',
    'Other'
  ]);

  const [fdpStpOptions, setFdpStpOptions] = useState<string[]>([
    'Faculty Development on Value Education',
    'Ethics Teaching Workshop',
    'Constitutional Values Training',
    'Character Development Program',
    'Moral Leadership Training',
    'Value-based Curriculum Design',
    'Assessment in Value Education',
    'Experiential Learning Methods',
    'Cross-disciplinary Values Integration',
    'International Values Education',
    'Other'
  ]);

  const [mouValueBasedOptions, setMouValueBasedOptions] = useState<string[]>([
    'Art of Living Foundation',
    'Bharat Scouts and Guides',
    'National Service Scheme (NSS)',
    'Nehru Yuva Kendra Sangathan',
    'Indian Red Cross Society',
    'Rotary International',
    'Lions Club International',
    'Akshaya Patra Foundation',
    'Teach for India',
    'CRY - Child Rights and You',
    'Smile Foundation',
    'HelpAge India',
    'Other'
  ]);

  const [interdisciplinaryEventsOptions, setInterdisciplinaryEventsOptions] = useState<string[]>([
    'Ethics in Science and Technology',
    'Values in Business and Commerce',
    'Human Rights and Law',
    'Environmental Ethics Conference',
    'Medical Ethics Seminar',
    'Educational Values Workshop',
    'Cultural Values Symposium',
    'Leadership and Values Summit',
    'Interfaith Dialogue Conference',
    'Ethics in AI and Technology',
    'Social Justice Seminar',
    'Global Ethics Forum',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Value-based Programs", description: "Compulsory ethics courses and VAC offerings", fields: [] },
    { id: 1, title: "Resources & Faculty", description: "Teaching resources and faculty development", fields: [] },
    { id: 2, title: "MoUs & Activities", description: "Partnerships and interdisciplinary activities", fields: [] },
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

  // Generic component for rendering percentage/decimal input
  const renderDecimalInput = (
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
    console.log('VAC Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page9';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page9';
  };

  const resetForm = (): void => {
    setFormData({
      compulsoryValuesProgramsNumber: '',
      assessmentWeightActivities: '',
      programsWithoutValuesNumber: '',
      vacOfferedSemesterWise: '',
      iksBasedVacSemesterWise: '',
      vacOptedSemesterWise: '',
      nonDisciplineVacSemesterWise: '',
      vacBooksNumber: '',
      selectedVacBooks: [],
      teachersAvailableVacNumber: '',
      facultyTrainedNumber: '',
      selectedFacultyTrained: [],
      fdpStpNumber: '',
      selectedFdpStp: [],
      avgValueCreditsPerStudent: '',
      mouValueBasedNumber: '',
      selectedMouValueBased: [],
      activitiesUnderMou: '',
      studentsTrainedMouPercentage: '',
      interdisciplinaryEventsNumber: '',
      selectedInterdisciplinaryEvents: [],
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: VALUE-BASED PROGRAMS
  const renderValueBasedPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Value-based Programs</h2>
      <p className="section-description">Compulsory ethics courses and VAC offerings</p>

      <div className="form-grid">
        {renderNumberInput('Programmes with compulsory UHV/Ethics/Constitutional/Human/Moral Values - Number', 'compulsoryValuesProgramsNumber')}
        <div></div>
        
        {renderTextarea('Assessment weight via activities/practicals in above courses (%) - Course-wise', 'assessmentWeightActivities', 'Provide course-wise breakdown of assessment weightage for activities/practicals (e.g., Ethics Course: 40%, Constitutional Values: 35%)')}
        
        {renderNumberInput('Programmes without compulsory values course - Number', 'programsWithoutValuesNumber')}
        <div></div>
        
        {renderTextarea('VAC offered - Semester-wise List', 'vacOfferedSemesterWise', 'Provide semester-wise list of Value Added Courses offered (e.g., Semester 1: Course A, Course B; Semester 2: Course C, Course D)')}
        
        {renderTextarea('IKS-based VAC offered - Semester-wise List', 'iksBasedVacSemesterWise', 'Provide semester-wise list of Indian Knowledge Systems based VAC courses')}
        
        {renderTextarea('VAC opted - Semester-wise List', 'vacOptedSemesterWise', 'Provide semester-wise list of VAC courses actually opted by students')}
        
        {renderTextarea('Non-discipline-specific VAC opted - Semester-wise List with student strength', 'nonDisciplineVacSemesterWise', 'Provide semester-wise list with student enrollment numbers for non-discipline specific VAC courses')}
      </div>
    </div>
  );

  // SECTION 1: RESOURCES & FACULTY
  const renderResourcesFaculty = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Resources & Faculty</h2>
      <p className="section-description">Teaching resources and faculty development</p>

      <div className="form-grid">
        {renderNumberInput('Books/Lecture Notes/Study materials for VAC (print/digital) - Number', 'vacBooksNumber')}
        <div></div>
        {Number(formData.vacBooksNumber) > 0 && renderDropdownWithTags('Books/Study materials for VAC - List', 'vacBooks', vacBooksOptions, 'selectedVacBooks', '-- Add a resource --', setVacBooksOptions)}
        
        {renderNumberInput('Teachers available to teach VAC - Number', 'teachersAvailableVacNumber')}
        {renderNumberInput('Faculty trained in value-based pedagogy - Number', 'facultyTrainedNumber')}
        
        {Number(formData.facultyTrainedNumber) > 0 && renderDropdownWithTags('Faculty trained in value-based pedagogy - List', 'facultyTrained', facultyTrainedOptions, 'selectedFacultyTrained', '-- Add training type --', setFacultyTrainedOptions)}
        
        {renderNumberInput('FDPs/STPs on value-based education - Number', 'fdpStpNumber')}
        <div></div>
        {Number(formData.fdpStpNumber) > 0 && renderDropdownWithTags('FDPs/STPs on value-based education - List', 'fdpStp', fdpStpOptions, 'selectedFdpStp', '-- Add program type --', setFdpStpOptions)}
        
        {renderDecimalInput('Avg value-based credits earned per Bachelor student', 'avgValueCreditsPerStudent')}
        <div></div>
      </div>
    </div>
  );

  // SECTION 2: MOUS & ACTIVITIES
  const renderMousActivities = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">MoUs & Activities</h2>
      <p className="section-description">Partnerships and interdisciplinary activities</p>

      <div className="form-grid">
        {renderNumberInput('MoUs for value-based education/training - Number', 'mouValueBasedNumber')}
        <div></div>
        {Number(formData.mouValueBasedNumber) > 0 && renderDropdownWithTags('MoUs for value-based education/training - List', 'mouValueBased', mouValueBasedOptions, 'selectedMouValueBased', '-- Add MoU partner --', setMouValueBasedOptions)}
        
        {renderTextarea('Activities under value-based MoUs - MoU-wise with student counts', 'activitiesUnderMou', 'Provide MoU-wise breakdown of activities with student participation numbers')}
        
        {renderDecimalInput('Students trained under value-based MoUs (% of enrolled that semester)', 'studentsTrainedMouPercentage')}
        {renderNumberInput('Interdisciplinary conferences/seminars/workshops on value-based education - Number', 'interdisciplinaryEventsNumber')}
        
        {Number(formData.interdisciplinaryEventsNumber) > 0 && renderDropdownWithTags('Interdisciplinary conferences/seminars/workshops - List', 'interdisciplinaryEvents', interdisciplinaryEventsOptions, 'selectedInterdisciplinaryEvents', '-- Add event type --', setInterdisciplinaryEventsOptions)}
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
          <h4>Value-based Programs</h4>
          <p><strong>Compulsory Values Programs:</strong> {formData.compulsoryValuesProgramsNumber || 0}</p>
          <p><strong>Programs Without Values:</strong> {formData.programsWithoutValuesNumber || 0}</p>
          <p><strong>Assessment Weight Details:</strong> {formData.assessmentWeightActivities ? 'Provided' : 'Not provided'}</p>
          <p><strong>VAC Semester Lists:</strong> {formData.vacOfferedSemesterWise && formData.vacOptedSemesterWise ? 'Complete' : 'Incomplete'}</p>
        </div>

        <div className="summary-card">
          <h4>Resources & Faculty</h4>
          <p><strong>VAC Books/Materials:</strong> {formData.vacBooksNumber || 0}</p>
          <p><strong>Available Teachers:</strong> {formData.teachersAvailableVacNumber || 0}</p>
          <p><strong>Trained Faculty:</strong> {formData.facultyTrainedNumber || 0}</p>
          <p><strong>FDPs/STPs:</strong> {formData.fdpStpNumber || 0}</p>
          <p><strong>Avg Credits per Student:</strong> {formData.avgValueCreditsPerStudent || 0}</p>
        </div>

        <div className="summary-card">
          <h4>MoUs & Partnerships</h4>
          <p><strong>Value-based MoUs:</strong> {formData.mouValueBasedNumber || 0}</p>
          <p><strong>Students Trained (%):</strong> {formData.studentsTrainedMouPercentage || 0}%</p>
          <p><strong>Interdisciplinary Events:</strong> {formData.interdisciplinaryEventsNumber || 0}</p>
          <p><strong>MoU Activities:</strong> {formData.activitiesUnderMou ? 'Detailed' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>Selected Resources</h4>
          <p><strong>Study Materials:</strong> {formData.selectedVacBooks.length}</p>
          <p><strong>Faculty Training Types:</strong> {formData.selectedFacultyTrained.length}</p>
          <p><strong>FDP/STP Programs:</strong> {formData.selectedFdpStp.length}</p>
          <p><strong>MoU Partners:</strong> {formData.selectedMouValueBased.length}</p>
        </div>

        <div className="summary-card">
          <h4>VAC Course Details</h4>
          <p><strong>IKS-based VAC:</strong> {formData.iksBasedVacSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Non-discipline VAC:</strong> {formData.nonDisciplineVacSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Event Types:</strong> {formData.selectedInterdisciplinaryEvents.length}</p>
        </div>

        <div className="summary-card">
          <h4>Overall Summary</h4>
          <p><strong>Total Selected Items:</strong> {
            formData.selectedVacBooks.length + 
            formData.selectedFacultyTrained.length + 
            formData.selectedFdpStp.length + 
            formData.selectedMouValueBased.length + 
            formData.selectedInterdisciplinaryEvents.length
          }</p>
          <p><strong>Data Completeness:</strong> {
            (formData.vacOfferedSemesterWise && formData.vacOptedSemesterWise && formData.assessmentWeightActivities) ? 'High' : 'Moderate'
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

  // SECTION 4: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>VAC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your VAC data has been recorded.</p>
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
      case 0: return renderValueBasedPrograms();
      case 1: return renderResourcesFaculty();
      case 2: return renderMousActivities();
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
     <Header />
      <PageNavigationSubheader totalPages={21}/>

      <Page8
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

export default VACForm;