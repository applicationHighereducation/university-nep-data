import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page16 from '../pages/Page16';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface ActivityDetail {
  id: string;
  name: string;
}

interface WorkshopDetail {
  id: string;
  name: string;
  outcomes: string;
}

interface FormData {
  // Section 1: R&D Cell Details
  hasRDCell: 'Yes' | 'No' | '';
  yearOfEstablishment: string | number;
  rdcComposition: string;
  researchActivitiesNumber: string | number;
  researchActivitiesList: ActivityDetail[];
  workshopsNumber: string | number;
  workshopsList: WorkshopDetail[];
  researchProposalsNumber: string | number;
  researchProposalsList: ActivityDetail[];
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

// ====================================
// MAIN COMPONENT
// ====================================
const RnDCellForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values
    hasRDCell: '',
    yearOfEstablishment: 0,
    rdcComposition: '',
    researchActivitiesNumber: 0,
    researchActivitiesList: [],
    workshopsNumber: 0,
    workshopsList: [],
    researchProposalsNumber: 0,
    researchProposalsList: [],
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "R&D Cell Details", description: "Research and Development Cell information and activities", fields: [] },
    { id: 1, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 2, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const validateData = (updatedData: FormData): ValidationError[] => {
    const errors: ValidationError[] = [];
    const currentYear = new Date().getFullYear();
    const year = Number(updatedData.yearOfEstablishment);

    // Validation: Year constraints
    if (updatedData.hasRDCell === 'Yes' && year > 0) {
      if (year > currentYear) {
        errors.push({
          field: 'yearOfEstablishment',
          message: 'Year of establishment cannot be in the future'
        });
      } else if (year < 1800) {
        errors.push({
          field: 'yearOfEstablishment',
          message: 'Year of establishment cannot be before 1800'
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

  const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Function to get the maximum allowed entries for a list field
  const getMaxEntries = (numberField: keyof FormData): number => {
    return Number(formData[numberField]) || 0;
  };

  // Function to check if more entries can be added
  const canAddMoreEntries = (listField: keyof FormData, numberField: keyof FormData): boolean => {
    const currentList = formData[listField] as (ActivityDetail[] | WorkshopDetail[]);
    const maxEntries = getMaxEntries(numberField);
    return currentList.length < maxEntries;
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

  // Functions for activity details
  const addActivityDetail = (listField: keyof FormData, numberField: keyof FormData): void => {
    if (!canAddMoreEntries(listField, numberField)) return;
    
    const newActivity: ActivityDetail = {
      id: generateId(),
      name: ''
    };
    const currentList = (formData[listField] as ActivityDetail[]) || [];
    updateFormData(listField, [...currentList, newActivity]);
  };

  const updateActivityDetail = (listField: keyof FormData, id: string, value: string): void => {
    const currentList = (formData[listField] as ActivityDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, name: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removeActivityDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as ActivityDetail[]) || [];
    updateFormData(listField, currentList.filter(item => item.id !== id));
  };

  // Functions for workshop details
  const addWorkshopDetail = (): void => {
    if (!canAddMoreEntries('workshopsList', 'workshopsNumber')) return;
    
    const newWorkshop: WorkshopDetail = {
      id: generateId(),
      name: '',
      outcomes: ''
    };
    updateFormData('workshopsList', [...formData.workshopsList, newWorkshop]);
  };

  const updateWorkshopDetail = (id: string, field: string, value: string): void => {
    const updatedList = formData.workshopsList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFormData('workshopsList', updatedList);
  };

  const removeWorkshopDetail = (id: string): void => {
    updateFormData('workshopsList', formData.workshopsList.filter(item => item.id !== id));
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

  // Component for rendering number input
  const renderNumberInput = (
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
        <input
          type="number"
          className={`input ${hasFieldError ? 'input-error' : ''}`}
          value={typeof formData[field] === 'string' || typeof formData[field] === 'number' ? formData[field] : ''}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
          max={field === 'yearOfEstablishment' ? new Date().getFullYear() : undefined}
        />
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

  // Component for rendering textarea
  const renderTextarea = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    required = false
  ): JSX.Element => {
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <textarea
          className="input"
          value={formData[field] as string}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ resize: 'vertical' }}
        />
      </div>
    );
  };

  // Component for rendering activity list with constraints and proper view
  const renderActivityList = (
    label: string,
    listField: keyof FormData,
    numberField: keyof FormData,
    placeholder: string
  ): JSX.Element => {
    const activities = (formData[listField] as ActivityDetail[]) || [];
    const maxEntries = getMaxEntries(numberField);
    const canAddMore = canAddMoreEntries(listField, numberField);
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({activities.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {activities.map((activity, index) => (
                <div key={activity.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ minWidth: '30px', color: '#6c757d' }}>{index + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    value={activity.name}
                    onChange={(e) => updateActivityDetail(listField, activity.id, e.target.value)}
                    placeholder={placeholder}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeActivityDetail(listField, activity.id)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {canAddMore ? (
                <button
                  type="button"
                  onClick={() => addActivityDetail(listField, numberField)}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add Item ({activities.length}/{maxEntries})
                </button>
              ) : (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '8px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#856404'
                }}>
                  Maximum {maxEntries} entries reached. Remove an entry to add a new one.
                </div>
              )}
            </div>

            {/* List View */}
            {activities.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '1rem' }}>
                  📋 Current Entries ({activities.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activities.map((activity, index) => (
                    <div key={activity.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e9ecef', 
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ 
                        minWidth: '25px', 
                        color: '#6c757d', 
                        fontWeight: 'bold' 
                      }}>
                        {index + 1}.
                      </span>
                      <span style={{ flex: 1, color: '#495057' }}>
                        {activity.name || <em style={{ color: '#6c757d' }}>No name entered</em>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            marginTop: '10px',
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
    );
  };

  // Component for rendering workshop list with outcomes, constraints and proper view
  const renderWorkshopList = (): JSX.Element => {
    const maxEntries = getMaxEntries('workshopsNumber');
    const canAddMore = canAddMoreEntries('workshopsList', 'workshopsNumber');
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          Workshops by RDC (projects, industry linkages, publications, consultancy) - List + Outcomes
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({formData.workshopsList.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {formData.workshopsList.map((workshop, index) => (
                <div key={workshop.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#495057' }}>Workshop {index + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeWorkshopDetail(workshop.id)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label className="label" style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Workshop Name/Topic</label>
                      <input
                        type="text"
                        className="input"
                        value={workshop.name}
                        onChange={(e) => updateWorkshopDetail(workshop.id, 'name', e.target.value)}
                        placeholder="Enter workshop name (e.g., Industry Linkage Workshop, Research Publication Training)"
                      />
                    </div>
                    <div>
                      <label className="label" style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Outcomes</label>
                      <textarea
                        className="input"
                        value={workshop.outcomes}
                        onChange={(e) => updateWorkshopDetail(workshop.id, 'outcomes', e.target.value)}
                        placeholder="Describe outcomes (e.g., 5 new industry collaborations, 10 papers published, 3 consultancy projects initiated)"
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {canAddMore ? (
                <button
                  type="button"
                  onClick={addWorkshopDetail}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add Workshop ({formData.workshopsList.length}/{maxEntries})
                </button>
              ) : (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '8px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#856404'
                }}>
                  Maximum {maxEntries} workshops reached. Remove a workshop to add a new one.
                </div>
              )}
            </div>

            {/* List View */}
            {formData.workshopsList.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '1rem' }}>
                  🎯 Current Workshop Entries ({formData.workshopsList.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {formData.workshopsList.map((workshop, index) => (
                    <div key={workshop.id} style={{ 
                      padding: '12px', 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e9ecef', 
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '8px',
                        borderBottom: '1px solid #f1f3f4',
                        paddingBottom: '6px'
                      }}>
                        <span style={{ 
                          minWidth: '25px', 
                          color: '#6c757d', 
                          fontWeight: 'bold' 
                        }}>
                          {index + 1}.
                        </span>
                        <strong style={{ color: '#495057' }}>
                          {workshop.name || <em style={{ color: '#6c757d' }}>No workshop name entered</em>}
                        </strong>
                      </div>
                      <div style={{ marginLeft: '25px' }}>
                        <strong style={{ color: '#6c757d', fontSize: '0.8rem' }}>Outcomes:</strong>
                        <div style={{ 
                          marginTop: '4px', 
                          color: '#495057',
                          lineHeight: '1.4'
                        }}>
                          {workshop.outcomes || <em style={{ color: '#6c757d' }}>No outcomes entered</em>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            marginTop: '10px',
            padding: '12px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#6c757d'
          }}>
            Please enter a number greater than 0 in the workshops number field to add entries.
          </div>
        )}
      </div>
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
    
    // Final validation before submission
    const errors = validateData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      alert('Please fix validation errors before submitting.');
      return;
    }
    
    console.log('R&D Cell Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page17';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page17';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values
      hasRDCell: '',
      yearOfEstablishment: 0,
      rdcComposition: '',
      researchActivitiesNumber: 0,
      researchActivitiesList: [],
      workshopsNumber: 0,
      workshopsList: [],
      researchProposalsNumber: 0,
      researchProposalsList: [],
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
  };

  // ====================================
  // EFFECTS
  // ====================================
  // Effects to handle list trimming when numbers are reduced
  useEffect(() => {
    const maxEntries = Number(formData.researchActivitiesNumber) || 0;
    const currentList = formData.researchActivitiesList;
    if (currentList.length > maxEntries) {
      updateFormData('researchActivitiesList', currentList.slice(0, maxEntries));
    }
  }, [formData.researchActivitiesNumber]);

  useEffect(() => {
    const maxEntries = Number(formData.workshopsNumber) || 0;
    const currentList = formData.workshopsList;
    if (currentList.length > maxEntries) {
      updateFormData('workshopsList', currentList.slice(0, maxEntries));
    }
  }, [formData.workshopsNumber]);

  useEffect(() => {
    const maxEntries = Number(formData.researchProposalsNumber) || 0;
    const currentList = formData.researchProposalsList;
    if (currentList.length > maxEntries) {
      updateFormData('researchProposalsList', currentList.slice(0, maxEntries));
    }
  }, [formData.researchProposalsNumber]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: R&D CELL DETAILS
  const renderRnDCellDetails = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">R&D Cell Details</h2>
      <p className="section-description">Research and Development Cell information and activities</p>

      <div className="form-grid">
        {renderYesNoRadio('R&D Cell established?', 'hasRDCell')}
        
        {formData.hasRDCell === 'Yes' && (
          <>
            {renderNumberInput('Year of establishment', 'yearOfEstablishment')}
            
            {renderTextarea(
              'Composition of R&D Cell',
              'rdcComposition',
              'Describe the composition (members, roles, structure, responsibilities)'
            )}
            
            {renderNumberInput('Research activities by RDC - Number', 'researchActivitiesNumber')}
            {renderActivityList(
              'Research activities by RDC - List',
              'researchActivitiesList',
              'researchActivitiesNumber',
              'Enter research activity/project name'
            )}
            
            {renderNumberInput(
              'Workshops by RDC (projects, industry linkages, publications, consultancy) - Number',
              'workshopsNumber'
            )}
            {renderWorkshopList()}
            
            {renderNumberInput('Research proposals facilitated by RDC - Number', 'researchProposalsNumber')}
            {renderActivityList(
              'Research proposals facilitated by RDC - List',
              'researchProposalsList',
              'researchProposalsNumber',
              'Enter research proposal title/details'
            )}
          </>
        )}
      </div>

      {/* Data summary for R&D Cell */}
      {formData.hasRDCell === 'Yes' && (Number(formData.researchActivitiesNumber) > 0 || Number(formData.workshopsNumber) > 0 || Number(formData.researchProposalsNumber) > 0) && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#e8f4fd', 
            border: '1px solid #bee5eb', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#0c5460'
          }}>
            <strong>📊 R&D Cell Activity Summary:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>Research Activities: {formData.researchActivitiesNumber || 0} ({formData.researchActivitiesList.length} listed)</li>
              <li>Workshops: {formData.workshopsNumber || 0} ({formData.workshopsList.length} listed)</li>
              <li>Research Proposals: {formData.researchProposalsNumber || 0} ({formData.researchProposalsList.length} listed)</li>
              <li>Total Activities: {Number(formData.researchActivitiesNumber || 0) + Number(formData.workshopsNumber || 0) + Number(formData.researchProposalsNumber || 0)}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // SECTION 1: REVIEW
  const renderReview = (): JSX.Element => {
    const totalActivities = Number(formData.researchActivitiesNumber || 0) + 
                           Number(formData.workshopsNumber || 0) + 
                           Number(formData.researchProposalsNumber || 0);
    
    const yearsActive = formData.yearOfEstablishment 
      ? new Date().getFullYear() - Number(formData.yearOfEstablishment)
      : 0;

    const workshopsWithOutcomes = formData.workshopsList.filter(w => w.outcomes.trim()).length;
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>R&D Cell Status</h4>
            <p><strong>Cell Established:</strong> {formData.hasRDCell || 'Not specified'}</p>
            {formData.hasRDCell === 'Yes' && (
              <>
                <p><strong>Year Established:</strong> {formData.yearOfEstablishment || 'Not specified'}</p>
                <p><strong>Years Active:</strong> {yearsActive > 0 ? `${yearsActive} years` : 'N/A'}</p>
                <p><strong>Composition Defined:</strong> {formData.rdcComposition ? '✅ Yes' : '❌ Not specified'}</p>
              </>
            )}
          </div>

          <div className="summary-card">
            <h4>Research Activities</h4>
            <p><strong>Total Activities:</strong> {formData.researchActivitiesNumber || 0}</p>
            <p><strong>Activities Listed:</strong> {formData.researchActivitiesList.length}</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.researchActivitiesNumber) > 0 && formData.researchActivitiesList.length === Number(formData.researchActivitiesNumber)
                ? '✅ Complete' 
                : formData.researchActivitiesList.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            {yearsActive > 0 && (
              <p><strong>Avg. per Year:</strong> {(Number(formData.researchActivitiesNumber || 0) / yearsActive).toFixed(1)}</p>
            )}
          </div>

          <div className="summary-card">
            <h4>Workshops Conducted</h4>
            <p><strong>Total Workshops:</strong> {formData.workshopsNumber || 0}</p>
            <p><strong>Workshops Listed:</strong> {formData.workshopsList.length}</p>
            <p><strong>With Outcomes:</strong> {workshopsWithOutcomes}/{formData.workshopsList.length}</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.workshopsNumber) > 0 && formData.workshopsList.length === Number(formData.workshopsNumber)
                ? '✅ Complete' 
                : formData.workshopsList.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Research Proposals</h4>
            <p><strong>Proposals Facilitated:</strong> {formData.researchProposalsNumber || 0}</p>
            <p><strong>Proposals Listed:</strong> {formData.researchProposalsList.length}</p>
            <p><strong>List Completeness:</strong> {
              Number(formData.researchProposalsNumber) > 0 && formData.researchProposalsList.length === Number(formData.researchProposalsNumber)
                ? '✅ Complete' 
                : formData.researchProposalsList.length > 0 
                  ? '🟡 Partial' 
                  : '❌ Not started'
            }</p>
            {yearsActive > 0 && (
              <p><strong>Avg. per Year:</strong> {(Number(formData.researchProposalsNumber || 0) / yearsActive).toFixed(1)}</p>
            )}
          </div>

          <div className="summary-card">
            <h4>Overall R&D Performance</h4>
            <p><strong>Total Activities:</strong> {totalActivities}</p>
            <p><strong>Activity Distribution:</strong></p>
            <div style={{ marginLeft: '15px', fontSize: '0.9rem' }}>
              <p>• Research: {((Number(formData.researchActivitiesNumber || 0) / totalActivities) * 100 || 0).toFixed(0)}%</p>
              <p>• Workshops: {((Number(formData.workshopsNumber || 0) / totalActivities) * 100 || 0).toFixed(0)}%</p>
              <p>• Proposals: {((Number(formData.researchProposalsNumber || 0) / totalActivities) * 100 || 0).toFixed(0)}%</p>
            </div>
            <p><strong>Performance Rating:</strong> {
              totalActivities >= 20 ? '🟢 Excellent' :
              totalActivities >= 10 ? '🟡 Good' :
              totalActivities >= 5 ? '🟠 Moderate' :
              totalActivities > 0 ? '🔴 Limited' : '⚪ No activities'
            }</p>
          </div>

          <div className="summary-card">
            <h4>Data Quality Assessment</h4>
            <p><strong>Validation Errors:</strong> {validationErrors.length === 0 ? '✅ No errors' : `❌ ${validationErrors.length} error(s)`}</p>
            <p><strong>List Constraints Met:</strong> {
              (Number(formData.researchActivitiesNumber) === formData.researchActivitiesList.length || Number(formData.researchActivitiesNumber) === 0) &&
              (Number(formData.workshopsNumber) === formData.workshopsList.length || Number(formData.workshopsNumber) === 0) &&
              (Number(formData.researchProposalsNumber) === formData.researchProposalsList.length || Number(formData.researchProposalsNumber) === 0)
                ? '✅ Yes' : '❌ No'
            }</p>
            <p><strong>Workshop Outcomes:</strong> {
              formData.workshopsList.length > 0 
                ? `${((workshopsWithOutcomes / formData.workshopsList.length) * 100).toFixed(0)}% complete`
                : 'No workshops'
            }</p>
            <p><strong>Overall Completeness:</strong> {
              formData.hasRDCell === 'Yes' && 
              formData.rdcComposition && 
              totalActivities > 0 
                ? '✅ Complete' 
                : '🟡 Partial'
            }</p>
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

        {/* Missing lists warning */}
        {formData.hasRDCell === 'Yes' && (
          (Number(formData.researchActivitiesNumber) > formData.researchActivitiesList.length ||
           Number(formData.workshopsNumber) > formData.workshopsList.length ||
           Number(formData.researchProposalsNumber) > formData.researchProposalsList.length)
        ) && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px',
            color: '#856404'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Incomplete Activity Listings</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {Number(formData.researchActivitiesNumber) > formData.researchActivitiesList.length && (
                <li>Research Activities: {Number(formData.researchActivitiesNumber) - formData.researchActivitiesList.length} more activity(ies) needed</li>
              )}
              {Number(formData.workshopsNumber) > formData.workshopsList.length && (
                <li>Workshops: {Number(formData.workshopsNumber) - formData.workshopsList.length} more workshop(s) needed</li>
              )}
              {Number(formData.researchProposalsNumber) > formData.researchProposalsList.length && (
                <li>Research Proposals: {Number(formData.researchProposalsNumber) - formData.researchProposalsList.length} more proposal(s) needed</li>
              )}
            </ul>
          </div>
        )}

        {formData.rdcComposition && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4 style={{ color: '#495057', marginBottom: '10px' }}>R&D Cell Composition</h4>
            <p style={{ color: '#6c757d', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
              {formData.rdcComposition}
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

  // SECTION 2: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>R&D Cell Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your R&D Cell data has been recorded.</p>
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
      case 0: return renderRnDCellDetails();
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

      <Page16
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

export default RnDCellForm;