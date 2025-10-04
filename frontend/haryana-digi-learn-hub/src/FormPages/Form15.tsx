import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page15 from '../pages/Page15';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Global Interdependence
  globalInterdependenceNumber: string | number;
  selectedGlobalInterdependence: string[];
  globalInterdependenceSyllabusPercentage: string | number;
  
  // Global Competencies
  globalCompetenciesNumber: string | number;
  selectedGlobalCompetencies: string[];
  globalCompetenciesSyllabusPercentage: string | number;
  
  // Universal Values
  universalValuesNumber: string | number;
  selectedUniversalValues: string[];
  universalValuesSyllabusPercentage: string | number;
  
  // Active Citizenship
  activeCitizenshipNumber: string | number;
  selectedActiveCitizenship: string[];
  activeCitizenshipSyllabusPercentage: string | number;
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
const GlobalCitizenshipForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 for numbers
    globalInterdependenceNumber: 0,
    selectedGlobalInterdependence: [],
    globalInterdependenceSyllabusPercentage: 0,
    globalCompetenciesNumber: 0,
    selectedGlobalCompetencies: [],
    globalCompetenciesSyllabusPercentage: 0,
    universalValuesNumber: 0,
    selectedUniversalValues: [],
    universalValuesSyllabusPercentage: 0,
    activeCitizenshipNumber: 0,
    selectedActiveCitizenship: [],
    activeCitizenshipSyllabusPercentage: 0,
  });

  // Dynamic option states for each dropdown
  const [globalInterdependenceOptions, setGlobalInterdependenceOptions] = useState<string[]>([
    'Environmental Studies',
    'Climate Change and Sustainability',
    'Global Economics',
    'International Relations',
    'Migration Studies',
    'Conflict Resolution',
    'Public Health and Pandemics',
    'Social Inequality Studies',
    'Development Studies',
    'Geopolitics',
    'Other'
  ]);

  const [globalCompetenciesOptions, setGlobalCompetenciesOptions] = useState<string[]>([
    'Critical Thinking and Analysis',
    'Problem Solving Skills',
    'Intercultural Communication',
    'Cross-Cultural Understanding',
    'Global Leadership',
    'Research Methodology',
    'Data Analysis and Interpretation',
    'Systems Thinking',
    'Creative Problem Solving',
    'Collaborative Learning',
    'Other'
  ]);

  const [universalValuesOptions, setUniversalValuesOptions] = useState<string[]>([
    'Human Rights Education',
    'Democratic Principles',
    'Cultural Diversity Studies',
    'Peace Studies',
    'Ethics and Moral Philosophy',
    'Social Justice',
    'Gender Studies',
    'Religious Tolerance',
    'Inclusive Education',
    'Civic Education',
    'Other'
  ]);

  const [activeCitizenshipOptions, setActiveCitizenshipOptions] = useState<string[]>([
    'Community Service Learning',
    'Environmental Action Projects',
    'Climate Action Initiatives',
    'Social Entrepreneurship',
    'Volunteer Programs',
    'Civic Engagement',
    'Sustainable Development Projects',
    'Community Development',
    'Public Policy and Advocacy',
    'Social Innovation',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Global Citizenship Courses", description: "Courses promoting global citizenship and interdependence", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: string | number | string[]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to get the maximum allowed entries for a list field
  const getMaxEntries = (numberField: keyof FormData): number => {
    return Number(formData[numberField]) || 0;
  };

  // Function to check if more entries can be added
  const canAddMoreEntries = (selectedField: keyof FormData, numberField?: keyof FormData): boolean => {
    if (!numberField) return true; // No limit if no number field specified
    const selectedItems = (formData[selectedField] as string[]) || [];
    const maxEntries = getMaxEntries(numberField);
    return selectedItems.length < maxEntries;
  };

  // Function to handle "Other" option selection
  const handleOtherSelection = (fieldKey: string, selectedField: keyof FormData, numberField?: keyof FormData): void => {
    if (canAddMoreEntries(selectedField, numberField)) {
      setOtherInputs(prev => ({
        ...prev,
        [fieldKey]: {
          isVisible: true,
          value: ''
        }
      }));
    }
  };

  // Function to add custom "Other" item
  const addOtherItem = (
    fieldKey: string, 
    selectedField: keyof FormData, 
    numberField: keyof FormData | undefined,
    optionsState: string[], 
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    const trimmedValue = otherInputs[fieldKey]?.value.trim();
    if (trimmedValue && canAddMoreEntries(selectedField, numberField)) {
      if (!optionsState.includes(trimmedValue)) {
        const otherIndex = optionsState.indexOf('Other');
        const newOptions = [...optionsState];
        newOptions.splice(otherIndex, 0, trimmedValue);
        setOptionsState(newOptions);
      }

      const currentItems = (formData[selectedField] as string[]) || [];
      if (!currentItems.includes(trimmedValue)) {
        updateFormData(selectedField, [...currentItems, trimmedValue]);
      }

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
    numberField: keyof FormData | undefined,
    optionsState: string[],
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    if (!canAddMoreEntries(selectedField, numberField)) {
      return; // Don't allow more entries if limit is reached
    }

    if (value === 'Other') {
      handleOtherSelection(fieldKey, selectedField, numberField);
    } else {
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

  // Component for rendering number input
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
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
        />
      </div>
    );
  };

  // Component for rendering syllabus percentage input
  const renderSyllabusPercentageInput = (
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
          <input
            type="number"
            className="input"
            value={formData[field]}
            onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
            min="0"
            max="100"
            step="0.01"
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#495057' }}>%</span>
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
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>,
    numberField?: keyof FormData
  ): JSX.Element => {
    const selectedItems = (formData[selectedField] as string[]) || [];
    const maxEntries = numberField ? getMaxEntries(numberField) : undefined;
    const canAddMore = canAddMoreEntries(selectedField, numberField);
    const otherInputState = otherInputs[fieldKey];
    
    return (
      <>
        <div className="form-group form-group-full">
          <label className="label">
            {label}
            {numberField && (
              <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
                ({selectedItems.length}/{maxEntries} entries)
              </span>
            )}
          </label>
          {!numberField || (maxEntries && maxEntries > 0) ? (
            <>
              <select
                className="select"
                onChange={(e) => handleDropdownSelection(e.target.value, fieldKey, selectedField, numberField, options, setOptionsState)}
                value=""
                disabled={numberField ? !canAddMore : false}
              >
                <option value="" disabled>
                  {numberField && !canAddMore ? `Maximum ${maxEntries} entries reached` : placeholder}
                </option>
                {(!numberField || canAddMore) && options
                  .filter(option => !selectedItems.includes(option))
                  .map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              {numberField && !canAddMore && maxEntries && maxEntries > 0 && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#856404'
                }}>
                  You have reached the maximum number of entries ({maxEntries}). 
                  Remove an entry to add a new one.
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              Please enter a number greater than 0 in the corresponding number field to add entries.
            </div>
          )}
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
                placeholder="Enter custom course"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addOtherItem(fieldKey, selectedField, numberField, options, setOptionsState)}
                disabled={!otherInputState.value.trim() || !canAddMoreEntries(selectedField, numberField)}
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
    console.log('Global Citizenship Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page16';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page16';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values (0 for numbers)
      globalInterdependenceNumber: 0,
      selectedGlobalInterdependence: [],
      globalInterdependenceSyllabusPercentage: 0,
      globalCompetenciesNumber: 0,
      selectedGlobalCompetencies: [],
      globalCompetenciesSyllabusPercentage: 0,
      universalValuesNumber: 0,
      selectedUniversalValues: [],
      universalValuesSyllabusPercentage: 0,
      activeCitizenshipNumber: 0,
      selectedActiveCitizenship: [],
      activeCitizenshipSyllabusPercentage: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // EFFECTS
  // ====================================
  // Effects to handle list trimming when numbers are reduced
  useEffect(() => {
    const maxEntries = Number(formData.globalInterdependenceNumber) || 0;
    const currentList = formData.selectedGlobalInterdependence;
    if (currentList.length > maxEntries) {
      updateFormData('selectedGlobalInterdependence', currentList.slice(0, maxEntries));
    }
  }, [formData.globalInterdependenceNumber]);

  useEffect(() => {
    const maxEntries = Number(formData.globalCompetenciesNumber) || 0;
    const currentList = formData.selectedGlobalCompetencies;
    if (currentList.length > maxEntries) {
      updateFormData('selectedGlobalCompetencies', currentList.slice(0, maxEntries));
    }
  }, [formData.globalCompetenciesNumber]);

  useEffect(() => {
    const maxEntries = Number(formData.universalValuesNumber) || 0;
    const currentList = formData.selectedUniversalValues;
    if (currentList.length > maxEntries) {
      updateFormData('selectedUniversalValues', currentList.slice(0, maxEntries));
    }
  }, [formData.universalValuesNumber]);

  useEffect(() => {
    const maxEntries = Number(formData.activeCitizenshipNumber) || 0;
    const currentList = formData.selectedActiveCitizenship;
    if (currentList.length > maxEntries) {
      updateFormData('selectedActiveCitizenship', currentList.slice(0, maxEntries));
    }
  }, [formData.activeCitizenshipNumber]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: GLOBAL CITIZENSHIP COURSES
  const renderGlobalCitizenshipCourses = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Global Citizenship Courses</h2>
      <p className="section-description">Courses promoting global citizenship and interdependence</p>

      <div className="form-grid">
        {/* Global Interdependence */}
        <div className="form-group form-group-full" style={{ gridColumn: '1 / -1', marginTop: '20px', marginBottom: '10px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.2rem', marginBottom: '5px' }}>Global Interdependence</h3>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>Climate change, inequality, pandemics, migration, conflicts</p>
        </div>

        {renderNumberInput(
          'Courses covering Global Interdependence - Number',
          'globalInterdependenceNumber'
        )}
        
        {renderDropdownWithTags(
          'Courses covering Global Interdependence - List',
          'globalInterdependence',
          globalInterdependenceOptions,
          'selectedGlobalInterdependence',
          '-- Add a course --',
          setGlobalInterdependenceOptions,
          'globalInterdependenceNumber'
        )}
        
        {Number(formData.globalInterdependenceNumber) > 0 && renderSyllabusPercentageInput(
          'Courses covering Global Interdependence - % syllabus coverage',
          'globalInterdependenceSyllabusPercentage'
        )}

        {/* Global Competencies */}
        <div className="form-group form-group-full" style={{ gridColumn: '1 / -1', marginTop: '30px', marginBottom: '10px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.2rem', marginBottom: '5px' }}>Global Competencies</h3>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>Critical thinking, problem solving, intercultural understanding, communication</p>
        </div>

        {renderNumberInput(
          'Courses developing Global Competencies - Number',
          'globalCompetenciesNumber'
        )}
        
        {renderDropdownWithTags(
          'Courses developing Global Competencies - List',
          'globalCompetencies',
          globalCompetenciesOptions,
          'selectedGlobalCompetencies',
          '-- Add a course --',
          setGlobalCompetenciesOptions,
          'globalCompetenciesNumber'
        )}
        
        {Number(formData.globalCompetenciesNumber) > 0 && renderSyllabusPercentageInput(
          'Courses developing Global Competencies - % syllabus coverage',
          'globalCompetenciesSyllabusPercentage'
        )}

        {/* Universal Values */}
        <div className="form-group form-group-full" style={{ gridColumn: '1 / -1', marginTop: '30px', marginBottom: '10px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.2rem', marginBottom: '5px' }}>Universal Values</h3>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>Human rights, democracy, diversity, peace, tolerance, social justice</p>
        </div>

        {renderNumberInput(
          'Courses promoting Universal Values - Number',
          'universalValuesNumber'
        )}
        
        {renderDropdownWithTags(
          'Courses promoting Universal Values - List',
          'universalValues',
          universalValuesOptions,
          'selectedUniversalValues',
          '-- Add a course --',
          setUniversalValuesOptions,
          'universalValuesNumber'
        )}
        
        {Number(formData.universalValuesNumber) > 0 && renderSyllabusPercentageInput(
          'Courses promoting Universal Values - % syllabus coverage',
          'universalValuesSyllabusPercentage'
        )}

        {/* Active Citizenship */}
        <div className="form-group form-group-full" style={{ gridColumn: '1 / -1', marginTop: '30px', marginBottom: '10px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.2rem', marginBottom: '5px' }}>Active & Responsible Citizenship</h3>
          <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: 0 }}>Community service, climate action</p>
        </div>

        {renderNumberInput(
          'Courses enabling active & responsible citizenship - Number',
          'activeCitizenshipNumber'
        )}
        
        {renderDropdownWithTags(
          'Courses enabling active & responsible citizenship - List',
          'activeCitizenship',
          activeCitizenshipOptions,
          'selectedActiveCitizenship',
          '-- Add a course --',
          setActiveCitizenshipOptions,
          'activeCitizenshipNumber'
        )}
        
        {Number(formData.activeCitizenshipNumber) > 0 && renderSyllabusPercentageInput(
          'Courses enabling active & responsible citizenship - % syllabus coverage',
          'activeCitizenshipSyllabusPercentage'
        )}
      </div>
    </div>
  );

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => {
    const totalCourses = Number(formData.globalInterdependenceNumber || 0) + 
                        Number(formData.globalCompetenciesNumber || 0) + 
                        Number(formData.universalValuesNumber || 0) + 
                        Number(formData.activeCitizenshipNumber || 0);

    const totalSelectedCourses = formData.selectedGlobalInterdependence.length +
                                formData.selectedGlobalCompetencies.length +
                                formData.selectedUniversalValues.length +
                                formData.selectedActiveCitizenship.length;

    const averageSyllabusCoverage = (() => {
      const courses = [
        Number(formData.globalInterdependenceNumber || 0) > 0 ? Number(formData.globalInterdependenceSyllabusPercentage || 0) : 0,
        Number(formData.globalCompetenciesNumber || 0) > 0 ? Number(formData.globalCompetenciesSyllabusPercentage || 0) : 0,
        Number(formData.universalValuesNumber || 0) > 0 ? Number(formData.universalValuesSyllabusPercentage || 0) : 0,
        Number(formData.activeCitizenshipNumber || 0) > 0 ? Number(formData.activeCitizenshipSyllabusPercentage || 0) : 0
      ].filter(val => val > 0);
      return courses.length > 0 ? (courses.reduce((a, b) => a + b, 0) / courses.length).toFixed(2) : '0';
    })();

    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Global Interdependence Courses</h4>
            <p><strong>Number of Courses:</strong> {formData.globalInterdependenceNumber || 0}</p>
            <p><strong>Courses Listed:</strong> {formData.selectedGlobalInterdependence.length}</p>
            <p><strong>Syllabus Coverage:</strong> {formData.globalInterdependenceSyllabusPercentage || 0}%</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.globalInterdependenceNumber) > 0 && formData.selectedGlobalInterdependence.length === Number(formData.globalInterdependenceNumber)
                ? '✅ Complete' 
                : formData.selectedGlobalInterdependence.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              {formData.selectedGlobalInterdependence.length > 0 ? formData.selectedGlobalInterdependence.join(', ') : 'No courses selected'}
            </p>
          </div>

          <div className="summary-card">
            <h4>Global Competencies Courses</h4>
            <p><strong>Number of Courses:</strong> {formData.globalCompetenciesNumber || 0}</p>
            <p><strong>Courses Listed:</strong> {formData.selectedGlobalCompetencies.length}</p>
            <p><strong>Syllabus Coverage:</strong> {formData.globalCompetenciesSyllabusPercentage || 0}%</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.globalCompetenciesNumber) > 0 && formData.selectedGlobalCompetencies.length === Number(formData.globalCompetenciesNumber)
                ? '✅ Complete' 
                : formData.selectedGlobalCompetencies.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              {formData.selectedGlobalCompetencies.length > 0 ? formData.selectedGlobalCompetencies.join(', ') : 'No courses selected'}
            </p>
          </div>

          <div className="summary-card">
            <h4>Universal Values Courses</h4>
            <p><strong>Number of Courses:</strong> {formData.universalValuesNumber || 0}</p>
            <p><strong>Courses Listed:</strong> {formData.selectedUniversalValues.length}</p>
            <p><strong>Syllabus Coverage:</strong> {formData.universalValuesSyllabusPercentage || 0}%</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.universalValuesNumber) > 0 && formData.selectedUniversalValues.length === Number(formData.universalValuesNumber)
                ? '✅ Complete' 
                : formData.selectedUniversalValues.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              {formData.selectedUniversalValues.length > 0 ? formData.selectedUniversalValues.join(', ') : 'No courses selected'}
            </p>
          </div>

          <div className="summary-card">
            <h4>Active Citizenship Courses</h4>
            <p><strong>Number of Courses:</strong> {formData.activeCitizenshipNumber || 0}</p>
            <p><strong>Courses Listed:</strong> {formData.selectedActiveCitizenship.length}</p>
            <p><strong>Syllabus Coverage:</strong> {formData.activeCitizenshipSyllabusPercentage || 0}%</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.activeCitizenshipNumber) > 0 && formData.selectedActiveCitizenship.length === Number(formData.activeCitizenshipNumber)
                ? '✅ Complete' 
                : formData.selectedActiveCitizenship.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              {formData.selectedActiveCitizenship.length > 0 ? formData.selectedActiveCitizenship.join(', ') : 'No courses selected'}
            </p>
          </div>

          <div className="summary-card">
            <h4>Overall Program Summary</h4>
            <p><strong>Total Courses:</strong> {totalCourses}</p>
            <p><strong>Total Selected Courses:</strong> {totalSelectedCourses}</p>
            <p><strong>Average Syllabus Coverage:</strong> {averageSyllabusCoverage}%</p>
            <p><strong>Program Breadth:</strong> {
              [
                Number(formData.globalInterdependenceNumber) > 0 ? 1 : 0,
                Number(formData.globalCompetenciesNumber) > 0 ? 1 : 0,
                Number(formData.universalValuesNumber) > 0 ? 1 : 0,
                Number(formData.activeCitizenshipNumber) > 0 ? 1 : 0
              ].reduce((a, b) => a + b, 0)
            }/4 areas covered</p>
            <p><strong>Data Completeness:</strong> {
              totalCourses > 0 && totalSelectedCourses > 0 ? 'Complete' : totalCourses > 0 ? 'Partial' : 'Not started'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Global Citizenship Assessment</h4>
            <p><strong>Coverage Quality:</strong> {
              Number(averageSyllabusCoverage) >= 80 ? '🟢 Excellent' :
              Number(averageSyllabusCoverage) >= 60 ? '🟡 Good' :
              Number(averageSyllabusCoverage) >= 40 ? '🟠 Fair' : 
              Number(averageSyllabusCoverage) > 0 ? '🔴 Limited' : '⚪ No coverage'
            }</p>
            <p><strong>Program Diversity:</strong> {
              totalSelectedCourses >= 12 ? '🟢 Highly Diverse' :
              totalSelectedCourses >= 8 ? '🟡 Diverse' :
              totalSelectedCourses >= 4 ? '🟠 Moderate' : 
              totalSelectedCourses > 0 ? '🔴 Limited' : '⚪ No diversity'
            }</p>
            <p><strong>List Constraints Met:</strong> {
              totalCourses === totalSelectedCourses && totalCourses > 0 ? '✅ Yes' : 
              totalSelectedCourses <= totalCourses ? '🟡 Partial' : '❌ No'
            }</p>
            <p><strong>Comprehensive Coverage:</strong> {
              [
                Number(formData.globalInterdependenceNumber) > 0,
                Number(formData.globalCompetenciesNumber) > 0,
                Number(formData.universalValuesNumber) > 0,
                Number(formData.activeCitizenshipNumber) > 0
              ].every(Boolean) ? '🟢 All 4 areas' :
              [
                Number(formData.globalInterdependenceNumber) > 0,
                Number(formData.globalCompetenciesNumber) > 0,
                Number(formData.universalValuesNumber) > 0,
                Number(formData.activeCitizenshipNumber) > 0
              ].filter(Boolean).length >= 3 ? '🟡 3 areas' :
              [
                Number(formData.globalInterdependenceNumber) > 0,
                Number(formData.globalCompetenciesNumber) > 0,
                Number(formData.universalValuesNumber) > 0,
                Number(formData.activeCitizenshipNumber) > 0
              ].filter(Boolean).length >= 2 ? '🟠 2 areas' :
              [
                Number(formData.globalInterdependenceNumber) > 0,
                Number(formData.globalCompetenciesNumber) > 0,
                Number(formData.universalValuesNumber) > 0,
                Number(formData.activeCitizenshipNumber) > 0
              ].filter(Boolean).length === 1 ? '🔴 1 area' : '⚪ No coverage'
            }</p>
          </div>
        </div>

        {/* Missing course lists warning */}
        {(Number(formData.globalInterdependenceNumber) > formData.selectedGlobalInterdependence.length ||
          Number(formData.globalCompetenciesNumber) > formData.selectedGlobalCompetencies.length ||
          Number(formData.universalValuesNumber) > formData.selectedUniversalValues.length ||
          Number(formData.activeCitizenshipNumber) > formData.selectedActiveCitizenship.length) && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px',
            color: '#856404'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Incomplete Course Listings</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {Number(formData.globalInterdependenceNumber) > formData.selectedGlobalInterdependence.length && (
                <li>Global Interdependence: {Number(formData.globalInterdependenceNumber) - formData.selectedGlobalInterdependence.length} more course(s) needed</li>
              )}
              {Number(formData.globalCompetenciesNumber) > formData.selectedGlobalCompetencies.length && (
                <li>Global Competencies: {Number(formData.globalCompetenciesNumber) - formData.selectedGlobalCompetencies.length} more course(s) needed</li>
              )}
              {Number(formData.universalValuesNumber) > formData.selectedUniversalValues.length && (
                <li>Universal Values: {Number(formData.universalValuesNumber) - formData.selectedUniversalValues.length} more course(s) needed</li>
              )}
              {Number(formData.activeCitizenshipNumber) > formData.selectedActiveCitizenship.length && (
                <li>Active Citizenship: {Number(formData.activeCitizenshipNumber) - formData.selectedActiveCitizenship.length} more course(s) needed</li>
              )}
            </ul>
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
          <h3>Global Citizenship Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your global citizenship courses data has been recorded.</p>
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
      case 0: return renderGlobalCitizenshipCourses();
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

      <Page15
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

export default GlobalCitizenshipForm;