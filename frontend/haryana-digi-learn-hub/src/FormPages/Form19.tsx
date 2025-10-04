import React, { useState, FormEvent, useEffect } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page19 from '../pages/Page19';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface MoUDetail {
  id: string;
  name: string;
}

interface ExchangeDetail {
  id: string;
  nameOurSide: string;
  detailsOurSide: string;
  nameOtherSide: string;
  detailsOtherSide: string;
}

interface FormData {
  // Section 1: Research MoUs
  researchMoUsNumber: string | number;
  researchMoUsList: MoUDetail[];
  activeResearchMoUsNumber: string | number;
  activeResearchMoUsList: MoUDetail[];
  inactiveMoUsNumber: string | number;
  inactiveMoUsList: MoUDetail[];
  
  // Section 2: Exchanges and Projects
  facultyExchanges: ExchangeDetail[];
  labFacilityMoUs: ExchangeDetail[];
  interdisciplinaryCentres: MoUDetail[];
  ongoingInterdisciplinaryNumber: string | number;
  ongoingInterdisciplinaryList: MoUDetail[];
}

interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

// ====================================
// MAIN COMPONENT
// ====================================
const ResearchMoUsForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    researchMoUsNumber: 0,
    researchMoUsList: [],
    activeResearchMoUsNumber: 0,
    activeResearchMoUsList: [],
    inactiveMoUsNumber: 0,
    inactiveMoUsList: [],
    facultyExchanges: [],
    labFacilityMoUs: [],
    interdisciplinaryCentres: [],
    ongoingInterdisciplinaryNumber: 0,
    ongoingInterdisciplinaryList: [],
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Research MoUs", description: "MoUs related to research activities", fields: [] },
    { id: 1, title: "Exchanges & Collaborations", description: "Faculty exchanges, facility usage, and interdisciplinary projects", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const currentList = formData[listField] as (MoUDetail[] | ExchangeDetail[]);
    const maxEntries = getMaxEntries(numberField);
    return currentList.length < maxEntries;
  };

  // Functions for MoU details
  const addMoUDetail = (listField: keyof FormData, numberField?: keyof FormData): void => {
    if (numberField && !canAddMoreEntries(listField, numberField)) return;
    
    const newMoU: MoUDetail = {
      id: generateId(),
      name: ''
    };
    const currentList = (formData[listField] as MoUDetail[]) || [];
    updateFormData(listField, [...currentList, newMoU]);
  };

  const updateMoUDetail = (listField: keyof FormData, id: string, value: string): void => {
    const currentList = (formData[listField] as MoUDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, name: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removeMoUDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as MoUDetail[]) || [];
    updateFormData(listField, currentList.filter(item => item.id !== id));
  };

  // Functions for exchange details
  const addExchangeDetail = (listField: keyof FormData): void => {
    const newExchange: ExchangeDetail = {
      id: generateId(),
      nameOurSide: '',
      detailsOurSide: '',
      nameOtherSide: '',
      detailsOtherSide: ''
    };
    const currentList = (formData[listField] as ExchangeDetail[]) || [];
    updateFormData(listField, [...currentList, newExchange]);
  };

  const updateExchangeDetail = (listField: keyof FormData, id: string, field: string, value: string): void => {
    const currentList = (formData[listField] as ExchangeDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removeExchangeDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as ExchangeDetail[]) || [];
    updateFormData(listField, currentList.filter(item => item.id !== id));
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
          value={typeof formData[field] === 'string' || typeof formData[field] === 'number' ? formData[field] : ''}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
        />
      </div>
    );
  };

  // Component for rendering MoU list with constraints
  const renderMoUList = (
    label: string,
    listField: keyof FormData,
    numberField?: keyof FormData
  ): JSX.Element => {
    const mous = (formData[listField] as MoUDetail[]) || [];
    const maxEntries = numberField ? getMaxEntries(numberField) : undefined;
    const canAddMore = numberField ? canAddMoreEntries(listField, numberField) : true;
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          {numberField && (
            <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
              ({mous.length}/{maxEntries} entries)
            </span>
          )}
        </label>
        
        {!numberField || maxEntries! > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {mous.map((mou, index) => (
                <div key={mou.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ minWidth: '30px', color: '#6c757d' }}>{index + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    value={mou.name}
                    onChange={(e) => updateMoUDetail(listField, mou.id, e.target.value)}
                    placeholder="Enter MoU name/organization"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMoUDetail(listField, mou.id)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {(!numberField || canAddMore) ? (
                <button
                  type="button"
                  onClick={() => addMoUDetail(listField, numberField)}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add MoU {numberField && `(${mous.length}/${maxEntries})`}
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
            {mous.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '1rem' }}>
                  🤝 Current MoUs ({mous.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mous.map((mou, index) => (
                    <div key={mou.id} style={{ 
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
                        {mou.name || <em style={{ color: '#6c757d' }}>No name entered</em>}
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

  // Component for rendering exchange list with TABLE VIEW
  const renderExchangeTable = (
    label: string,
    listField: keyof FormData
  ): JSX.Element => {
    const exchanges = (formData[listField] as ExchangeDetail[]) || [];
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({exchanges.length} entries)
          </span>
        </label>
        
        <div style={{ marginTop: '10px' }}>
          {/* Add Exchange Button */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => addExchangeDetail(listField)}
              className="btn btn-primary"
              style={{ padding: '10px 25px', fontSize: '1rem' }}
            >
              Add Exchange/Collaboration ({exchanges.length})
            </button>
          </div>

          {/* Table View */}
          {exchanges.length > 0 && (
            <div style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: '#ffffff' 
            }}>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '12px 15px', 
                borderBottom: '1px solid #dee2e6',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                🔄 Exchange/Collaboration Table ({exchanges.length} entries)
              </div>
              
              {/* Desktop Table View */}
              <div style={{ display: 'block' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    fontSize: '0.9rem'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f3f4' }}>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '40px'
                        }}>
                          #
                        </th>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '150px'
                        }}>
                          Our Institution - Name
                        </th>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '200px'
                        }}>
                          Our Institution - Details
                        </th>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '150px'
                        }}>
                          Partner Institution - Name
                        </th>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '200px'
                        }}>
                          Partner Institution - Details
                        </th>
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'center', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '80px'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchanges.map((exchange, index) => (
                        <tr key={exchange.id} style={{ 
                          borderBottom: '1px solid #e9ecef'
                        }}>
                          <td style={{ 
                            padding: '12px 8px', 
                            fontWeight: 'bold',
                            color: '#6c757d',
                            textAlign: 'center'
                          }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: '8px' }}>
                            <input
                              type="text"
                              value={exchange.nameOurSide}
                              onChange={(e) => updateExchangeDetail(listField, exchange.id, 'nameOurSide', e.target.value)}
                              placeholder="Faculty/researcher name"
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <textarea
                              value={exchange.detailsOurSide}
                              onChange={(e) => updateExchangeDetail(listField, exchange.id, 'detailsOurSide', e.target.value)}
                              placeholder="Enter details"
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <input
                              type="text"
                              value={exchange.nameOtherSide}
                              onChange={(e) => updateExchangeDetail(listField, exchange.id, 'nameOtherSide', e.target.value)}
                              placeholder="Faculty/researcher name"
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <textarea
                              value={exchange.detailsOtherSide}
                              onChange={(e) => updateExchangeDetail(listField, exchange.id, 'detailsOtherSide', e.target.value)}
                              placeholder="Enter details"
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeExchangeDetail(listField, exchange.id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {exchanges.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔄</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>No exchanges/collaborations added yet</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Click "Add Exchange/Collaboration" to get started</p>
            </div>
          )}
        </div>
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
    console.log('Research MoUs Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page20';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page20';
  };

  const resetForm = (): void => {
    setFormData({
      researchMoUsNumber: 0,
      researchMoUsList: [],
      activeResearchMoUsNumber: 0,
      activeResearchMoUsList: [],
      inactiveMoUsNumber: 0,
      inactiveMoUsList: [],
      facultyExchanges: [],
      labFacilityMoUs: [],
      interdisciplinaryCentres: [],
      ongoingInterdisciplinaryNumber: 0,
      ongoingInterdisciplinaryList: [],
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };

  // ====================================
  // EFFECTS
  // ====================================
  // Effects to handle list trimming when numbers are reduced
  useEffect(() => {
    const fieldsToCheck = [
      { numberField: 'researchMoUsNumber', listField: 'researchMoUsList' },
      { numberField: 'activeResearchMoUsNumber', listField: 'activeResearchMoUsList' },
      { numberField: 'inactiveMoUsNumber', listField: 'inactiveMoUsList' },
      { numberField: 'ongoingInterdisciplinaryNumber', listField: 'ongoingInterdisciplinaryList' },
    ];

    fieldsToCheck.forEach(({ numberField, listField }) => {
      const maxEntries = Number(formData[numberField as keyof FormData]) || 0;
      const currentList = formData[listField as keyof FormData] as MoUDetail[];
      if (currentList.length > maxEntries) {
        updateFormData(listField as keyof FormData, currentList.slice(0, maxEntries));
      }
    });
  }, [
    formData.researchMoUsNumber, formData.activeResearchMoUsNumber, 
    formData.inactiveMoUsNumber, formData.ongoingInterdisciplinaryNumber
  ]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: RESEARCH MoUs
  const renderResearchMoUs = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Research MoUs</h2>
      <p className="section-description">MoUs related to research activities</p>

      <div className="form-grid">
        {renderNumberInput('MoUs related to research - Number', 'researchMoUsNumber')}
        {renderMoUList('MoUs related to research - List', 'researchMoUsList', 'researchMoUsNumber')}
        
        {renderNumberInput('Active research MoUs - Number', 'activeResearchMoUsNumber')}
        {renderMoUList('Active research MoUs - List', 'activeResearchMoUsList', 'activeResearchMoUsNumber')}
        
        {renderNumberInput('Signed research MoUs with no activity in last 2 years - Number', 'inactiveMoUsNumber')}
        {renderMoUList('Signed research MoUs with no activity in last 2 years - List', 'inactiveMoUsList', 'inactiveMoUsNumber')}
      </div>
    </div>
  );

  // SECTION 1: EXCHANGES & COLLABORATIONS
  const renderExchangesCollaborations = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Exchanges & Collaborations</h2>
      <p className="section-description">Faculty exchanges, facility usage, and interdisciplinary projects</p>

      <div className="form-grid">
        {renderExchangeTable(
          'Faculty/Researcher exchanges under research MoUs - Names & details (both sides)',
          'facultyExchanges'
        )}
        
        {renderExchangeTable(
          'MoUs with lab/expert facility usage - Names & details (both sides)',
          'labFacilityMoUs'
        )}
        
        {renderMoUList('Interdisciplinary research centres established - List', 'interdisciplinaryCentres')}
        
        {renderNumberInput('On-going interdisciplinary research projects - Number', 'ongoingInterdisciplinaryNumber')}
        {renderMoUList('On-going interdisciplinary research projects - List', 'ongoingInterdisciplinaryList', 'ongoingInterdisciplinaryNumber')}
      </div>
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => {
    const activityRate = Number(formData.researchMoUsNumber) > 0 
      ? ((Number(formData.activeResearchMoUsNumber) / Number(formData.researchMoUsNumber)) * 100).toFixed(1)
      : '0';
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Research MoUs Overview</h4>
            <p><strong>Total Research MoUs:</strong> {formData.researchMoUsNumber || 0} ({formData.researchMoUsList.length} listed)</p>
            <p><strong>Active MoUs:</strong> {formData.activeResearchMoUsNumber || 0} ({formData.activeResearchMoUsList.length} listed)</p>
            <p><strong>Inactive (2+ years):</strong> {formData.inactiveMoUsNumber || 0} ({formData.inactiveMoUsList.length} listed)</p>
            <p><strong>Activity Rate:</strong> {activityRate}%</p>
          </div>

          <div className="summary-card">
            <h4>Faculty Exchanges</h4>
            <p><strong>Total Exchanges:</strong> {formData.facultyExchanges.length}</p>
            <p><strong>Our Faculty:</strong> {formData.facultyExchanges.filter(e => e.nameOurSide).length}</p>
            <p><strong>Partner Faculty:</strong> {formData.facultyExchanges.filter(e => e.nameOtherSide).length}</p>
          </div>

          <div className="summary-card">
            <h4>Lab/Facility Usage</h4>
            <p><strong>Total Collaborations:</strong> {formData.labFacilityMoUs.length}</p>
            <p><strong>Our Resources:</strong> {formData.labFacilityMoUs.filter(e => e.nameOurSide).length}</p>
            <p><strong>Partner Resources:</strong> {formData.labFacilityMoUs.filter(e => e.nameOtherSide).length}</p>
          </div>

          <div className="summary-card">
            <h4>Interdisciplinary Research</h4>
            <p><strong>Research Centres:</strong> {formData.interdisciplinaryCentres.length}</p>
            <p><strong>Ongoing Projects:</strong> {formData.ongoingInterdisciplinaryNumber || 0} ({formData.ongoingInterdisciplinaryList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Collaboration Summary</h4>
            <p><strong>Total Exchanges:</strong> {formData.facultyExchanges.length + formData.labFacilityMoUs.length}</p>
            <p><strong>Total Active Collaborations:</strong> {
              Number(formData.activeResearchMoUsNumber || 0) + 
              formData.facultyExchanges.length + 
              formData.labFacilityMoUs.length
            }</p>
          </div>

          <div className="summary-card">
            <h4>MoU Status Distribution</h4>
            <p><strong>Active vs Total:</strong> {formData.activeResearchMoUsNumber || 0} / {formData.researchMoUsNumber || 0}</p>
            <p><strong>Utilization Rate:</strong> {activityRate}%</p>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: Number(activityRate) >= 70 ? '#d4edda' : Number(activityRate) >= 40 ? '#fff3cd' : '#f8d7da',
              borderRadius: '6px',
              border: `1px solid ${Number(activityRate) >= 70 ? '#c3e6cb' : Number(activityRate) >= 40 ? '#ffeaa7' : '#f5c6cb'}`
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                color: Number(activityRate) >= 70 ? '#155724' : Number(activityRate) >= 40 ? '#856404' : '#721c24',
                fontWeight: '500'
              }}>
                {Number(activityRate) >= 70 
                  ? 'Excellent MoU utilization'
                  : Number(activityRate) >= 40
                  ? 'Moderate MoU utilization'
                  : 'Low MoU utilization - consider review'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
            Please review all the information above. If everything looks correct, proceed to the next step for final submission.
          </p>
        </div>
      </div>
    );
  };

  // SECTION 3: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Research MoUs Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your research MoUs and collaborations data has been recorded.</p>
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
      case 0: return renderResearchMoUs();
      case 1: return renderExchangesCollaborations();
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

      <Page19
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

export default ResearchMoUsForm;