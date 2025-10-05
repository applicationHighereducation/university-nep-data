import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page5 from '../pages/Page5';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: SEC Courses Overview
  secCoursesTotal: string | number;
  secCoursesSemesterWise: string;
  secBeyondDisciplineNumber: string | number;
  selectedSecBeyondDiscipline: string[];
  secByHeiNumber: string | number;
  selectedSecByHei: string[];
  
  // Section 2: External SEC & Alignments
  secByExternalNumber: string | number;
  selectedSecByExternal: string[];
  secAlignedNcvetNumber: string | number;
  secViaHaryanaSkillNumber: string | number;
  selectedSecViaHaryanaSkill: string[];
  secViaSkillUniversitiesNumber: string | number;
  selectedSecViaSkillUniversities: string[];
  
  // Section 3: SEC Implementation & Outcomes
  secMappedNsqfNumber: string | number;
  studentsInternshipPercentage: string | number;
  finalYearPlacementPercentage: string | number;
  mouSignedSecNumber: string | number;
  activeMouSecNumber: string | number;
  secUnderMouDetails: string;
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
const SECForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    secCoursesTotal: '',
    secCoursesSemesterWise: '',
    secBeyondDisciplineNumber: '',
    selectedSecBeyondDiscipline: [],
    secByHeiNumber: '',
    selectedSecByHei: [],
    secByExternalNumber: '',
    selectedSecByExternal: [],
    secAlignedNcvetNumber: '',
    secViaHaryanaSkillNumber: '',
    selectedSecViaHaryanaSkill: [],
    secViaSkillUniversitiesNumber: '',
    selectedSecViaSkillUniversities: [],
    secMappedNsqfNumber: '',
    studentsInternshipPercentage: '',
    finalYearPlacementPercentage: '',
    mouSignedSecNumber: '',
    activeMouSecNumber: '',
    secUnderMouDetails: '',
  });

  // Dynamic option states for each dropdown
  const [secBeyondDisciplineOptions, setSecBeyondDisciplineOptions] = useState<string[]>([
    'Digital Marketing',
    'Data Analytics',
    'Web Development',
    'Mobile App Development',
    'Financial Planning',
    'Entrepreneurship Development',
    'Communication Skills',
    'Foreign Languages',
    'Photography & Videography',
    'Graphic Design',
    'Content Writing',
    'Public Speaking',
    'Project Management',
    'Other'
  ]);

  const [secByHeiOptions, setSecByHeiOptions] = useState<string[]>([
    'Computer Programming',
    'Database Management',
    'Network Administration',
    'Digital Art & Design',
    'Business Communication',
    'Marketing Management',
    'Human Resource Management',
    'Financial Accounting',
    'Research Methodology',
    'Statistical Analysis',
    'Creative Writing',
    'Foreign Language Proficiency',
    'Other'
  ]);

  const [secByExternalOptions, setSecByExternalOptions] = useState<string[]>([
    'Industry-Specific Software Training',
    'Professional Certification Courses',
    'Technical Skills Workshop',
    'Soft Skills Development',
    'Leadership Training',
    'Advanced Excel & Data Analysis',
    'Cloud Computing Fundamentals',
    'Cybersecurity Basics',
    'Digital Marketing Certification',
    'AI/ML Fundamentals',
    'IoT Applications',
    'Blockchain Technology',
    'Other'
  ]);

  const [secViaHaryanaSkillOptions, setSecViaHaryanaSkillOptions] = useState<string[]>([
    'Agriculture & Allied Skills',
    'Healthcare & Life Sciences',
    'IT & Software Development',
    'Manufacturing & Engineering',
    'Tourism & Hospitality',
    'Retail & Sales',
    'Banking & Finance',
    'Logistics & Supply Chain',
    'Construction & Real Estate',
    'Media & Entertainment',
    'Automotive Skills',
    'Textile & Handicrafts',
    'Other'
  ]);

  const [secViaSkillUniversitiesOptions, setSecViaSkillUniversitiesOptions] = useState<string[]>([
    'Skill-based Certificate Programs',
    'Vocational Training Modules',
    'Industry Collaboration Programs',
    'Professional Development Courses',
    'Technical Certification Programs',
    'Apprenticeship Programs',
    'Short-term Skill Courses',
    'Online Skill Development',
    'Competency-based Training',
    'Sector-specific Skills',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "SEC Courses Overview", description: "Total SEC courses and discipline-specific details", fields: [] },
    { id: 1, title: "External SEC & Alignments", description: "External experts and institutional alignments", fields: [] },
    { id: 2, title: "SEC Implementation & Outcomes", description: "NSQF mapping, placements, and MoUs", fields: [] },
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
    console.log('SEC Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page6';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page6';
  };

  const resetForm = (): void => {
    setFormData({
      secCoursesTotal: '',
      secCoursesSemesterWise: '',
      secBeyondDisciplineNumber: '',
      selectedSecBeyondDiscipline: [],
      secByHeiNumber: '',
      selectedSecByHei: [],
      secByExternalNumber: '',
      selectedSecByExternal: [],
      secAlignedNcvetNumber: '',
      secViaHaryanaSkillNumber: '',
      selectedSecViaHaryanaSkill: [],
      secViaSkillUniversitiesNumber: '',
      selectedSecViaSkillUniversities: [],
      secMappedNsqfNumber: '',
      studentsInternshipPercentage: '',
      finalYearPlacementPercentage: '',
      mouSignedSecNumber: '',
      activeMouSecNumber: '',
      secUnderMouDetails: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: SEC COURSES OVERVIEW
  const renderSecCoursesOverview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">SEC Courses Overview</h2>
      <p className="section-description">Total SEC courses and discipline-specific details</p>

      <div className="form-grid">
        {renderNumberInput('SEC courses offered - Total Number', 'secCoursesTotal')}
        <div></div>
        
        {renderTextarea('SEC courses offered - Semester-wise List', 'secCoursesSemesterWise', 'Provide semester-wise breakdown of SEC courses offered (e.g., Semester 1: Course A, Course B; Semester 2: Course C, Course D)')}
        
        {renderNumberInput('SEC courses beyond discipline - Number', 'secBeyondDisciplineNumber')}
        <div></div>
        {Number(formData.secBeyondDisciplineNumber) > 0 && renderDropdownWithTags('SEC courses beyond discipline - List', 'secBeyondDiscipline', secBeyondDisciplineOptions, 'selectedSecBeyondDiscipline', '-- Add a course --', setSecBeyondDisciplineOptions)}
        
        {renderNumberInput('SEC taught by HEI faculty - Number', 'secByHeiNumber')}
        <div></div>
        {Number(formData.secByHeiNumber) > 0 && renderDropdownWithTags('SEC taught by HEI faculty - List', 'secByHei', secByHeiOptions, 'selectedSecByHei', '-- Add a course --', setSecByHeiOptions)}
      </div>
    </div>
  );

  // SECTION 1: EXTERNAL SEC & ALIGNMENTS
  const renderExternalSecAlignments = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">External SEC & Alignments</h2>
      <p className="section-description">External experts and institutional alignments</p>

      <div className="form-grid">
        {renderNumberInput('SEC taught by external experts - Number', 'secByExternalNumber')}
        <div></div>
        {Number(formData.secByExternalNumber) > 0 && renderDropdownWithTags('SEC taught by external experts - List', 'secByExternal', secByExternalOptions, 'selectedSecByExternal', '-- Add a course --', setSecByExternalOptions)}
        
        {renderNumberInput('SEC aligned with NCVET/NSDC/SSC/NQR - Number', 'secAlignedNcvetNumber')}
        <div></div>
        
        {renderNumberInput('SEC via Haryana Skill Development Mission - Number', 'secViaHaryanaSkillNumber')}
        <div></div>
        {Number(formData.secViaHaryanaSkillNumber) > 0 && renderDropdownWithTags('SEC via Haryana Skill Development Mission - List', 'secViaHaryanaSkill', secViaHaryanaSkillOptions, 'selectedSecViaHaryanaSkill', '-- Add a program --', setSecViaHaryanaSkillOptions)}
        
        {renderNumberInput('SEC via Skill Universities/other universities/vocational institutions - Number', 'secViaSkillUniversitiesNumber')}
        <div></div>
        {Number(formData.secViaSkillUniversitiesNumber) > 0 && renderDropdownWithTags('SEC via Skill Universities/other universities/vocational institutions - List', 'secViaSkillUniversities', secViaSkillUniversitiesOptions, 'selectedSecViaSkillUniversities', '-- Add a program --', setSecViaSkillUniversitiesOptions)}
      </div>
    </div>
  );

  // SECTION 2: SEC IMPLEMENTATION & OUTCOMES
  const renderSecImplementationOutcomes = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">SEC Implementation & Outcomes</h2>
      <p className="section-description">NSQF mapping, placements, and MoUs</p>

      <div className="form-grid">
        {renderNumberInput('SEC mapped to NSQF with official Framework - Number', 'secMappedNsqfNumber')}
        {renderPercentageInput('Students completing internship in skill area - Percentage', 'studentsInternshipPercentage')}
        
        {renderPercentageInput('Final year placed in skill area - Percentage', 'finalYearPlacementPercentage')}
        {renderNumberInput('MoUs signed for SEC - Number', 'mouSignedSecNumber')}
        
        {renderNumberInput('Active MoUs for SEC - Number', 'activeMouSecNumber')}
        <div></div>
        
        {renderTextarea('SEC offered under MoUs - Course-wise student counts', 'secUnderMouDetails', 'Provide detailed information about SEC courses offered under MoUs including course names and student enrollment counts')}
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
          <h4>SEC Courses Overview</h4>
          <p><strong>Total SEC Courses:</strong> {formData.secCoursesTotal || 0}</p>
          <p><strong>SEC Beyond Discipline:</strong> {formData.secBeyondDisciplineNumber || 0}</p>
          <p><strong>SEC by HEI Faculty:</strong> {formData.secByHeiNumber || 0}</p>
          <p><strong>Selected Beyond Discipline:</strong> {formData.selectedSecBeyondDiscipline.length > 0 ? formData.selectedSecBeyondDiscipline.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>External SEC & Alignments</h4>
          <p><strong>SEC by External Experts:</strong> {formData.secByExternalNumber || 0}</p>
          <p><strong>SEC Aligned NCVET/NSDC:</strong> {formData.secAlignedNcvetNumber || 0}</p>
          <p><strong>SEC via Haryana Skill Mission:</strong> {formData.secViaHaryanaSkillNumber || 0}</p>
          <p><strong>SEC via Skill Universities:</strong> {formData.secViaSkillUniversitiesNumber || 0}</p>
        </div>

        <div className="summary-card">
          <h4>Implementation & Outcomes</h4>
          <p><strong>SEC Mapped to NSQF:</strong> {formData.secMappedNsqfNumber || 0}</p>
          <p><strong>Internship Completion:</strong> {formData.studentsInternshipPercentage || 0}%</p>
          <p><strong>Skill Area Placement:</strong> {formData.finalYearPlacementPercentage || 0}%</p>
        </div>

        <div className="summary-card">
          <h4>MoUs & Partnerships</h4>
          <p><strong>MoUs Signed:</strong> {formData.mouSignedSecNumber || 0}</p>
          <p><strong>Active MoUs:</strong> {formData.activeMouSecNumber || 0}</p>
          <p><strong>MoU Details:</strong> {formData.secUnderMouDetails ? 'Provided' : 'Not provided'}</p>
        </div>

        <div className="summary-card">
          <h4>Selected Courses Summary</h4>
          <p><strong>HEI Faculty Courses:</strong> {formData.selectedSecByHei.length}</p>
          <p><strong>External Expert Courses:</strong> {formData.selectedSecByExternal.length}</p>
          <p><strong>Haryana Skill Programs:</strong> {formData.selectedSecViaHaryanaSkill.length}</p>
          <p><strong>Skill University Programs:</strong> {formData.selectedSecViaSkillUniversities.length}</p>
        </div>

        <div className="summary-card">
          <h4>Additional Information</h4>
          <p><strong>Semester-wise List:</strong> {formData.secCoursesSemesterWise ? 'Provided' : 'Not provided'}</p>
          <p><strong>Total Selected Courses:</strong> {
            formData.selectedSecBeyondDiscipline.length + 
            formData.selectedSecByHei.length + 
            formData.selectedSecByExternal.length + 
            formData.selectedSecViaHaryanaSkill.length + 
            formData.selectedSecViaSkillUniversities.length
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
          <h3>SEC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your SEC data has been recorded.</p>
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
      case 0: return renderSecCoursesOverview();
      case 1: return renderExternalSecAlignments();
      case 2: return renderSecImplementationOutcomes();
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

      <Page5
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

export default SECForm;