import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page3 from '../pages/Page3';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: Total Program Numbers
  ugDisciplinesNumber: string | number;
  selectedUgDisciplines: string[];
  pgFacultiesNumber: string | number;
  selectedPgFaculties: string[];
  pgDepartmentsNumber: string | number;
  selectedPgDepartments: string[];
  
  // Section 2: Post-NEP Additions
  postNepDisciplinesNumber: string | number;
  selectedPostNepDisciplines: string[];
  postNepProgrammesNumber: string | number;
  selectedPostNepProgrammes: string[];
  
  // Section 3: Seat Details
  ugSanctionedSeats: string | number;
  ugSeatsFilledPercentage: string | number;
  pgSanctionedSeats: string | number;
  pgSeatsFilledPercentage: string | number;
  studentStrengthByDiscipline: string;
  studentStrengthByProgramme: string;
  
  // Section 4: Special Programs
  aedpNumber: string | number;
  aedpDetails: string;
  languageDepartments: string[];
  odlProgrammesNumber: string | number;
  selectedOdlProgrammes: string[];
  iksProgrammesNumber: string | number;
  selectedIksProgrammes: string[];
  
  // Section 5: Online Learning
  moocsDetails: string;
  moocsPercentageCourses: string | number;
  moocsPercentageStudents: string | number;
  onlineCoursesDetails: string;
  onlineCoursesPercentageCourses: string | number;
  onlineCoursesPercentageStudents: string | number;
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
const AcademicProgramForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    ugDisciplinesNumber: '',
    selectedUgDisciplines: [],
    pgFacultiesNumber: '',
    selectedPgFaculties: [],
    pgDepartmentsNumber: '',
    selectedPgDepartments: [],
    postNepDisciplinesNumber: '',
    selectedPostNepDisciplines: [],
    postNepProgrammesNumber: '',
    selectedPostNepProgrammes: [],
    ugSanctionedSeats: '',
    ugSeatsFilledPercentage: '',
    pgSanctionedSeats: '',
    pgSeatsFilledPercentage: '',
    studentStrengthByDiscipline: '',
    studentStrengthByProgramme: '',
    aedpNumber: '',
    aedpDetails: '',
    languageDepartments: [],
    odlProgrammesNumber: '',
    selectedOdlProgrammes: [],
    iksProgrammesNumber: '',
    selectedIksProgrammes: [],
    moocsDetails: '',
    moocsPercentageCourses: '',
    moocsPercentageStudents: '',
    onlineCoursesDetails: '',
    onlineCoursesPercentageCourses: '',
    onlineCoursesPercentageStudents: '',
  });

  // Dynamic option states for each dropdown
  const [ugDisciplineOptions, setUgDisciplineOptions] = useState<string[]>([
    'Arts',
    'Science',
    'Commerce',
    'Engineering',
    'Management',
    'Medicine',
    'Law',
    'Education',
    'Agriculture',
    'Other'
  ]);

  const [pgFacultiesOptions, setPgFacultiesOptions] = useState<string[]>([
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Commerce',
    'Faculty of Engineering & Technology',
    'Faculty of Management Studies',
    'Faculty of Medicine',
    'Faculty of Law',
    'Faculty of Education',
    'Faculty of Social Sciences',
    'Other'
  ]);

  const [pgDepartmentsOptions, setPgDepartmentsOptions] = useState<string[]>([
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Business Administration',
    'English Literature',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Economics',
    'Psychology',
    'Other'
  ]);

  const [postNepDisciplinesOptions, setPostNepDisciplinesOptions] = useState<string[]>([
    'Data Science',
    'Artificial Intelligence',
    'Environmental Studies',
    'Digital Humanities',
    'Biotechnology',
    'Renewable Energy',
    'Cyber Security',
    'Robotics',
    'Public Policy',
    'Other'
  ]);

  const [postNepProgrammesOptions, setPostNepProgrammesOptions] = useState<string[]>([
    'B.Tech in AI & ML',
    'M.Sc. Data Science',
    'B.A. Digital Humanities',
    'M.Tech Renewable Energy',
    'B.Sc. Environmental Science',
    'M.A. Public Policy',
    'B.Tech Robotics',
    'M.Sc. Cyber Security',
    'Other'
  ]);

  const [languageDepartmentsOptions, setLanguageDepartmentsOptions] = useState<string[]>([
    'Languages/Literature',
    'Music',
    'Philosophy',
    'Indology',
    'Art',
    'Dance',
    'Theatre',
    'Education',
    'Mathematics',
    'Statistics',
    'Pure & Applied Sciences',
    'Sociology',
    'Economics',
    'Sports',
    'Translation & Interpretation',
    'Other'
  ]);

  const [odlProgrammesOptions, setOdlProgrammesOptions] = useState<string[]>([
    'B.A. in Languages',
    'M.A. Literature',
    'B.A. Philosophy',
    'M.A. Indology',
    'B.A. Music',
    'Certificate in Translation',
    'Diploma in Arts',
    'B.A. Sociology',
    'Other'
  ]);

  const [iksProgrammesOptions, setIksProgrammesOptions] = useState<string[]>([
    'Traditional Medicine',
    'Ayurveda',
    'Yoga Studies',
    'Ancient Philosophy',
    'Sanskrit Studies',
    'Indian Classical Music',
    'Traditional Arts & Crafts',
    'Vedic Studies',
    'Astrology',
    'Other'
  ]);

  // Define sections - Updated to have separate Review and Submit
  const sections: Section[] = [
    { id: 0, title: "Total Program Numbers", description: "Overall academic program statistics", fields: [] },
    { id: 1, title: "Post-NEP Additions", description: "Programs and disciplines added after NEP implementation", fields: [] },
    { id: 2, title: "Seat Details", description: "Sanctioned seats and enrollment statistics", fields: [] },
    { id: 3, title: "Special Programs", description: "AEDP, Language departments, and IKS programs", fields: [] },
    { id: 4, title: "Online Learning", description: "MOOCs and online course participation", fields: [] },
    { id: 5, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 6, title: "Submit", description: "Final submission", fields: [] }
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

  // Generic component for rendering text input
  const renderTextInput = (
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
          type="text"
          className="input"
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value)}
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
    console.log('Academic Program Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page4';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page4';
  };

  const resetForm = (): void => {
    setFormData({
      ugDisciplinesNumber: '',
      selectedUgDisciplines: [],
      pgFacultiesNumber: '',
      selectedPgFaculties: [],
      pgDepartmentsNumber: '',
      selectedPgDepartments: [],
      postNepDisciplinesNumber: '',
      selectedPostNepDisciplines: [],
      postNepProgrammesNumber: '',
      selectedPostNepProgrammes: [],
      ugSanctionedSeats: '',
      ugSeatsFilledPercentage: '',
      pgSanctionedSeats: '',
      pgSeatsFilledPercentage: '',
      studentStrengthByDiscipline: '',
      studentStrengthByProgramme: '',
      aedpNumber: '',
      aedpDetails: '',
      languageDepartments: [],
      odlProgrammesNumber: '',
      selectedOdlProgrammes: [],
      iksProgrammesNumber: '',
      selectedIksProgrammes: [],
      moocsDetails: '',
      moocsPercentageCourses: '',
      moocsPercentageStudents: '',
      onlineCoursesDetails: '',
      onlineCoursesPercentageCourses: '',
      onlineCoursesPercentageStudents: '',
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: TOTAL PROGRAM NUMBERS
  const renderTotalProgramNumbers = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Total Program Numbers</h2>
      <p className="section-description">Overall academic program statistics</p>

      <div className="form-grid">
        {renderNumberInput('UG Disciplines - Number', 'ugDisciplinesNumber')}
        <div></div>
        {Number(formData.ugDisciplinesNumber) > 0 && renderDropdownWithTags('UG Disciplines - List', 'ugDisciplines', ugDisciplineOptions, 'selectedUgDisciplines', '-- Add a discipline --', setUgDisciplineOptions)}
        
        {renderNumberInput('PG Faculties - Number', 'pgFacultiesNumber')}
        <div></div>
        {Number(formData.pgFacultiesNumber) > 0 && renderDropdownWithTags('PG Faculties - List', 'pgFaculties', pgFacultiesOptions, 'selectedPgFaculties', '-- Add a faculty --', setPgFacultiesOptions)}
        
        {renderNumberInput('PG Departments - Number', 'pgDepartmentsNumber')}
        <div></div>
        {Number(formData.pgDepartmentsNumber) > 0 && renderDropdownWithTags('PG Departments - List', 'pgDepartments', pgDepartmentsOptions, 'selectedPgDepartments', '-- Add a department --', setPgDepartmentsOptions)}
      </div>
    </div>
  );

  // SECTION 1: POST-NEP ADDITIONS
  const renderPostNepAdditions = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Post-NEP Additions</h2>
      <p className="section-description">Programs and disciplines added after NEP implementation</p>

      <div className="form-grid">
        {renderNumberInput('Disciplines/Faculties added post-NEP - Number', 'postNepDisciplinesNumber')}
        <div></div>
        {Number(formData.postNepDisciplinesNumber) > 0 && renderDropdownWithTags('Disciplines/Faculties added post-NEP - List', 'postNepDisciplines', postNepDisciplinesOptions, 'selectedPostNepDisciplines', '-- Add a discipline/faculty --', setPostNepDisciplinesOptions)}
        
        {renderNumberInput('Programmes added post-NEP - Number', 'postNepProgrammesNumber')}
        <div></div>
        {Number(formData.postNepProgrammesNumber) > 0 && renderDropdownWithTags('Programmes added post-NEP - List', 'postNepProgrammes', postNepProgrammesOptions, 'selectedPostNepProgrammes', '-- Add a programme --', setPostNepProgrammesOptions)}
      </div>
    </div>
  );

  // SECTION 2: SEAT DETAILS
  const renderSeatDetails = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Seat Details</h2>
      <p className="section-description">Sanctioned seats and enrollment statistics</p>

      <div className="form-grid">
        {renderNumberInput('UG sanctioned seats (all years) - Total', 'ugSanctionedSeats')}
        {renderTextInput('UG seats filled (all years) - Percentage', 'ugSeatsFilledPercentage')}
        
        {renderNumberInput('PG sanctioned seats (all years) - Total', 'pgSanctionedSeats')}
        {renderTextInput('PG seats filled (all years) - Percentage', 'pgSeatsFilledPercentage')}
        
        {renderTextarea('Student strength by discipline/faculty - Details', 'studentStrengthByDiscipline', 'Provide detailed breakdown of student strength across different disciplines/faculties')}
        
        {renderTextarea('Student strength by programme - Details', 'studentStrengthByProgramme', 'Provide detailed breakdown of student strength across different programmes')}
      </div>
    </div>
  );

  // SECTION 3: SPECIAL PROGRAMS
  const renderSpecialPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Special Programs</h2>
      <p className="section-description">AEDP, Language departments, and IKS programs</p>

      <div className="form-grid">
        {renderNumberInput('Apprenticeship Embedded Degree Programmes (AEDP) - Number', 'aedpNumber')}
        <div></div>
        
        {renderTextarea('AEDP details (programme, students, focus sector, MoU partner)', 'aedpDetails', 'Provide detailed information about AEDP programmes including programme name, number of students, focus sector, and MoU partners')}
        
        {renderDropdownWithTags('Language/Literature/Arts Departments', 'languageDepartments', languageDepartmentsOptions, 'languageDepartments', '-- Add a department --', setLanguageDepartmentsOptions)}
        
        {renderNumberInput('Programmes via ODL/Online (where dept doesn\'t exist) - Number', 'odlProgrammesNumber')}
        <div></div>
        {Number(formData.odlProgrammesNumber) > 0 && renderDropdownWithTags('Programmes via ODL/Online - List', 'odlProgrammes', odlProgrammesOptions, 'selectedOdlProgrammes', '-- Add a programme --', setOdlProgrammesOptions)}
        
        {renderNumberInput('IKS-based programmes - Number', 'iksProgrammesNumber')}
        <div></div>
        {Number(formData.iksProgrammesNumber) > 0 && renderDropdownWithTags('IKS-based programmes - List', 'iksProgrammes', iksProgrammesOptions, 'selectedIksProgrammes', '-- Add an IKS programme --', setIksProgrammesOptions)}
      </div>
    </div>
  );

  // SECTION 4: ONLINE LEARNING
  const renderOnlineLearning = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Online Learning</h2>
      <p className="section-description">MOOCs and online course participation</p>

      <div className="form-grid">
        {renderTextarea('MOOCs opted - Semester-wise List with student counts', 'moocsDetails', 'Provide semester-wise details of MOOCs with student enrollment numbers')}
        
        {renderTextInput('MOOCs opted - % of courses offered that semester', 'moocsPercentageCourses')}
        {renderTextInput('MOOCs opted - % of students opting', 'moocsPercentageStudents')}
        
        {renderTextarea('Online courses (other than MOOCs) - Semester-wise List with student counts', 'onlineCoursesDetails', 'Provide semester-wise details of online courses (excluding MOOCs) with student enrollment numbers')}
        
        {renderTextInput('Online courses (other than MOOCs) - % of courses offered', 'onlineCoursesPercentageCourses')}
        {renderTextInput('Online courses (other than MOOCs) - % of students opting', 'onlineCoursesPercentageStudents')}
      </div>
    </div>
  );

  // SECTION 5: REVIEW (NEW - Separate from Submit)
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>Total Program Numbers</h4>
          <p><strong>UG Disciplines:</strong> {formData.ugDisciplinesNumber || 0}</p>
          <p><strong>PG Faculties:</strong> {formData.pgFacultiesNumber || 0}</p>
          <p><strong>PG Departments:</strong> {formData.pgDepartmentsNumber || 0}</p>
          <p><strong>Selected UG Disciplines:</strong> {formData.selectedUgDisciplines.length > 0 ? formData.selectedUgDisciplines.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Post-NEP Additions</h4>
          <p><strong>New Disciplines/Faculties:</strong> {formData.postNepDisciplinesNumber || 0}</p>
          <p><strong>New Programmes:</strong> {formData.postNepProgrammesNumber || 0}</p>
          <p><strong>Selected New Disciplines:</strong> {formData.selectedPostNepDisciplines.length > 0 ? formData.selectedPostNepDisciplines.join(', ') : 'None'}</p>
          <p><strong>Selected New Programmes:</strong> {formData.selectedPostNepProgrammes.length > 0 ? formData.selectedPostNepProgrammes.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Seat Statistics</h4>
          <p><strong>UG Sanctioned Seats:</strong> {formData.ugSanctionedSeats || 0}</p>
          <p><strong>UG Seats Filled:</strong> {formData.ugSeatsFilledPercentage || 0}%</p>
          <p><strong>PG Sanctioned Seats:</strong> {formData.pgSanctionedSeats || 0}</p>
          <p><strong>PG Seats Filled:</strong> {formData.pgSeatsFilledPercentage || 0}%</p>
        </div>

        <div className="summary-card">
          <h4>Special Programs</h4>
          <p><strong>AEDP Programs:</strong> {formData.aedpNumber || 0}</p>
          <p><strong>ODL Programmes:</strong> {formData.odlProgrammesNumber || 0}</p>
          <p><strong>IKS Programs:</strong> {formData.iksProgrammesNumber || 0}</p>
          <p><strong>Language/Arts Depts:</strong> {formData.languageDepartments.length}</p>
        </div>

        <div className="summary-card">
          <h4>Online Learning</h4>
          <p><strong>MOOCs Course %:</strong> {formData.moocsPercentageCourses || 0}%</p>
          <p><strong>MOOCs Student %:</strong> {formData.moocsPercentageStudents || 0}%</p>
          <p><strong>Other Online Course %:</strong> {formData.onlineCoursesPercentageCourses || 0}%</p>
          <p><strong>Other Online Student %:</strong> {formData.onlineCoursesPercentageStudents || 0}%</p>
        </div>

        <div className="summary-card">
          <h4>Additional Details</h4>
          <p><strong>AEDP Details:</strong> {formData.aedpDetails ? 'Provided' : 'Not provided'}</p>
          <p><strong>Student Strength by Discipline:</strong> {formData.studentStrengthByDiscipline ? 'Provided' : 'Not provided'}</p>
          <p><strong>Student Strength by Programme:</strong> {formData.studentStrengthByProgramme ? 'Provided' : 'Not provided'}</p>
          <p><strong>MOOCs Details:</strong> {formData.moocsDetails ? 'Provided' : 'Not provided'}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. If everything looks correct, proceed to the next step for final submission.
        </p>
      </div>
    </div>
  );

  // SECTION 6: SUBMIT (NEW - Separate from Review)
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Academic Program Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your academic program data has been recorded.</p>
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
      case 0: return renderTotalProgramNumbers();
      case 1: return renderPostNepAdditions();
      case 2: return renderSeatDetails();
      case 3: return renderSpecialPrograms();
      case 4: return renderOnlineLearning();
      case 5: return renderReview();
      case 6: return renderSubmit();
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

      <Page3
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

export default AcademicProgramForm;