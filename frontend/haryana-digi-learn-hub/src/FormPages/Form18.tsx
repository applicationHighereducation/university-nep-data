import React, { useState, FormEvent, useEffect } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page18 from '../pages/Page18';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface PatentDetail {
  id: string;
  title: string;
}

interface CommercializedPatent {
  id: string;
  details: string;
  revenue: string;
  mous: string;
}

interface FormData {
  // Section 1: Individual Patents
  patentsFiledNumber: string | number;
  patentsFiledList: PatentDetail[];
  patentsPublishedNumber: string | number;
  patentsPublishedList: PatentDetail[];
  patentsGrantedNumber: string | number;
  patentsGrantedList: PatentDetail[];
  grantedPatentsCommercialized: CommercializedPatent[];
  grantedPatentsGovtTransfer: CommercializedPatent[];
  
  // Section 2: Joint Patents
  patentsFiledJointNumber: string | number;
  patentsFiledJointList: PatentDetail[];
  patentsPublishedJointNumber: string | number;
  patentsPublishedJointList: PatentDetail[];
  patentsGrantedJointNumber: string | number;
  patentsGrantedJointList: PatentDetail[];
  grantedPatentsJointCommercialized: CommercializedPatent[];
  grantedPatentsJointGovtTransfer: CommercializedPatent[];
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
const PatentsForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    patentsFiledNumber: 0,
    patentsFiledList: [],
    patentsPublishedNumber: 0,
    patentsPublishedList: [],
    patentsGrantedNumber: 0,
    patentsGrantedList: [],
    grantedPatentsCommercialized: [],
    grantedPatentsGovtTransfer: [],
    patentsFiledJointNumber: 0,
    patentsFiledJointList: [],
    patentsPublishedJointNumber: 0,
    patentsPublishedJointList: [],
    patentsGrantedJointNumber: 0,
    patentsGrantedJointList: [],
    grantedPatentsJointCommercialized: [],
    grantedPatentsJointGovtTransfer: [],
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "Individual Patents", description: "Patents filed, published, and granted individually", fields: [] },
    { id: 1, title: "Joint Patents", description: "Patents filed, published, and granted jointly", fields: [] },
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
    const currentList = formData[listField] as (PatentDetail[] | CommercializedPatent[]);
    const maxEntries = getMaxEntries(numberField);
    return currentList.length < maxEntries;
  };

  // Functions for patent details
  const addPatentDetail = (listField: keyof FormData, numberField: keyof FormData): void => {
    if (!canAddMoreEntries(listField, numberField)) return;
    
    const newPatent: PatentDetail = {
      id: generateId(),
      title: ''
    };
    const currentList = (formData[listField] as PatentDetail[]) || [];
    updateFormData(listField, [...currentList, newPatent]);
  };

  const updatePatentDetail = (listField: keyof FormData, id: string, value: string): void => {
    const currentList = (formData[listField] as PatentDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, title: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removePatentDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as PatentDetail[]) || [];
    updateFormData(listField, currentList.filter(item => item.id !== id));
  };

  // Functions for commercialized patents
  const addCommercializedPatent = (listField: keyof FormData): void => {
    const newPatent: CommercializedPatent = {
      id: generateId(),
      details: '',
      revenue: '',
      mous: ''
    };
    const currentList = (formData[listField] as CommercializedPatent[]) || [];
    updateFormData(listField, [...currentList, newPatent]);
  };

  const updateCommercializedPatent = (listField: keyof FormData, id: string, field: string, value: string): void => {
    const currentList = (formData[listField] as CommercializedPatent[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removeCommercializedPatent = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as CommercializedPatent[]) || [];
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

  // Component for rendering patent list with constraints
  const renderPatentList = (
    label: string,
    listField: keyof FormData,
    numberField: keyof FormData
  ): JSX.Element => {
    const patents = (formData[listField] as PatentDetail[]) || [];
    const maxEntries = getMaxEntries(numberField);
    const canAddMore = canAddMoreEntries(listField, numberField);
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({patents.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {patents.map((patent, index) => (
                <div key={patent.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ minWidth: '30px', color: '#6c757d' }}>{index + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    value={patent.title}
                    onChange={(e) => updatePatentDetail(listField, patent.id, e.target.value)}
                    placeholder="Enter patent title"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removePatentDetail(listField, patent.id)}
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
                  onClick={() => addPatentDetail(listField, numberField)}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add Patent ({patents.length}/{maxEntries})
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
            {patents.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '1rem' }}>
                  📄 Current Patents ({patents.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {patents.map((patent, index) => (
                    <div key={patent.id} style={{ 
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
                        {patent.title || <em style={{ color: '#6c757d' }}>No title entered</em>}
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

  // Component for rendering commercialized patent list with TABLE VIEW
  const renderCommercializedPatentTable = (
    label: string,
    listField: keyof FormData,
    includeRevenue: boolean = true
  ): JSX.Element => {
    const patents = (formData[listField] as CommercializedPatent[]) || [];
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({patents.length} entries)
          </span>
        </label>
        
        <div style={{ marginTop: '10px' }}>
          {/* Add Patent Button */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => addCommercializedPatent(listField)}
              className="btn btn-primary"
              style={{ padding: '10px 25px', fontSize: '1rem' }}
            >
              Add Patent ({patents.length})
            </button>
          </div>

          {/* Table View */}
          {patents.length > 0 && (
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
                💼 Commercialized Patents Table ({patents.length} entries)
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
                          minWidth: '250px'
                        }}>
                          Details
                        </th>
                        {includeRevenue && (
                          <th style={{ 
                            padding: '12px 8px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #dee2e6',
                            fontWeight: 'bold',
                            color: '#495057',
                            minWidth: '120px'
                          }}>
                            Revenue
                          </th>
                        )}
                        <th style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          borderBottom: '2px solid #dee2e6',
                          fontWeight: 'bold',
                          color: '#495057',
                          minWidth: '200px'
                        }}>
                          MoUs
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
                      {patents.map((patent, index) => (
                        <tr key={patent.id} style={{ 
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
                            <textarea
                              value={patent.details}
                              onChange={(e) => updateCommercializedPatent(listField, patent.id, 'details', e.target.value)}
                              placeholder="Enter patent details"
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
                          {includeRevenue && (
                            <td style={{ padding: '8px' }}>
                              <input
                                type="text"
                                value={patent.revenue}
                                onChange={(e) => updateCommercializedPatent(listField, patent.id, 'revenue', e.target.value)}
                                placeholder="Revenue amount"
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  border: '1px solid #ced4da',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                              />
                            </td>
                          )}
                          <td style={{ padding: '8px' }}>
                            <textarea
                              value={patent.mous}
                              onChange={(e) => updateCommercializedPatent(listField, patent.id, 'mous', e.target.value)}
                              placeholder="Enter MoU details"
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                resize: 'vertical',
                                minHeight: '50px'
                              }}
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeCommercializedPatent(listField, patent.id)}
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
          {patents.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💼</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>No commercialized patents added yet</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Click "Add Patent" to get started</p>
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
    console.log('Patents Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page19';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page19';
  };

  const resetForm = (): void => {
    setFormData({
      patentsFiledNumber: 0,
      patentsFiledList: [],
      patentsPublishedNumber: 0,
      patentsPublishedList: [],
      patentsGrantedNumber: 0,
      patentsGrantedList: [],
      grantedPatentsCommercialized: [],
      grantedPatentsGovtTransfer: [],
      patentsFiledJointNumber: 0,
      patentsFiledJointList: [],
      patentsPublishedJointNumber: 0,
      patentsPublishedJointList: [],
      patentsGrantedJointNumber: 0,
      patentsGrantedJointList: [],
      grantedPatentsJointCommercialized: [],
      grantedPatentsJointGovtTransfer: [],
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
      { numberField: 'patentsFiledNumber', listField: 'patentsFiledList' },
      { numberField: 'patentsPublishedNumber', listField: 'patentsPublishedList' },
      { numberField: 'patentsGrantedNumber', listField: 'patentsGrantedList' },
      { numberField: 'patentsFiledJointNumber', listField: 'patentsFiledJointList' },
      { numberField: 'patentsPublishedJointNumber', listField: 'patentsPublishedJointList' },
      { numberField: 'patentsGrantedJointNumber', listField: 'patentsGrantedJointList' },
    ];

    fieldsToCheck.forEach(({ numberField, listField }) => {
      const maxEntries = Number(formData[numberField as keyof FormData]) || 0;
      const currentList = formData[listField as keyof FormData] as PatentDetail[];
      if (currentList.length > maxEntries) {
        updateFormData(listField as keyof FormData, currentList.slice(0, maxEntries));
      }
    });
  }, [
    formData.patentsFiledNumber, formData.patentsPublishedNumber, formData.patentsGrantedNumber,
    formData.patentsFiledJointNumber, formData.patentsPublishedJointNumber, formData.patentsGrantedJointNumber
  ]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: INDIVIDUAL PATENTS
  const renderIndividualPatents = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Individual Patents</h2>
      <p className="section-description">Patents filed, published, and granted individually</p>

      <div className="form-grid">
        {renderNumberInput('Patents filed - Number', 'patentsFiledNumber')}
        {renderPatentList('Patents filed - List', 'patentsFiledList', 'patentsFiledNumber')}
        
        {renderNumberInput('Patents published - Number', 'patentsPublishedNumber')}
        {renderPatentList('Patents published - List', 'patentsPublishedList', 'patentsPublishedNumber')}
        
        {renderNumberInput('Patents granted - Number', 'patentsGrantedNumber')}
        {renderPatentList('Patents granted - List', 'patentsGrantedList', 'patentsGrantedNumber')}
        
        <div className="form-group form-group-full" style={{ marginTop: '20px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.1rem', marginBottom: '10px' }}>Commercialization & Technology Transfer</h3>
        </div>
        
        {renderCommercializedPatentTable(
          'Granted patents commercialized/licensed/sold - Details + Revenue + MoUs',
          'grantedPatentsCommercialized',
          true
        )}
        
        {renderCommercializedPatentTable(
          'Granted patents licensed/tech transferred to Govt. orgs - Details + MoUs',
          'grantedPatentsGovtTransfer',
          false
        )}
      </div>
    </div>
  );

  // SECTION 1: JOINT PATENTS
  const renderJointPatents = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Joint Patents</h2>
      <p className="section-description">Patents filed, published, and granted jointly (not counted in individual patents)</p>

      <div className="form-grid">
        {renderNumberInput('Patents filed jointly (not counted above) - Number', 'patentsFiledJointNumber')}
        {renderPatentList('Patents filed jointly (not counted above) - List', 'patentsFiledJointList', 'patentsFiledJointNumber')}
        
        {renderNumberInput('Patents published jointly (not counted above) - Number', 'patentsPublishedJointNumber')}
        {renderPatentList('Patents published jointly (not counted above) - List', 'patentsPublishedJointList', 'patentsPublishedJointNumber')}
        
        {renderNumberInput('Patents granted jointly (not counted above) - Number', 'patentsGrantedJointNumber')}
        {renderPatentList('Patents granted jointly (not counted above) - List', 'patentsGrantedJointList', 'patentsGrantedJointNumber')}
        
        <div className="form-group form-group-full" style={{ marginTop: '20px', borderTop: '2px solid #dee2e6', paddingTop: '20px' }}>
          <h3 style={{ color: '#495057', fontSize: '1.1rem', marginBottom: '10px' }}>Commercialization & Technology Transfer (Joint Patents)</h3>
        </div>
        
        {renderCommercializedPatentTable(
          'Granted patents (joint) commercialized/licensed/sold - Details + Revenue + MoUs',
          'grantedPatentsJointCommercialized',
          true
        )}
        
        {renderCommercializedPatentTable(
          'Granted patents (joint) licensed/tech transferred to Govt. orgs - Details + MoUs',
          'grantedPatentsJointGovtTransfer',
          false
        )}
      </div>
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => {
    const totalPatentsFiled = Number(formData.patentsFiledNumber || 0) + Number(formData.patentsFiledJointNumber || 0);
    const totalPatentsPublished = Number(formData.patentsPublishedNumber || 0) + Number(formData.patentsPublishedJointNumber || 0);
    const totalPatentsGranted = Number(formData.patentsGrantedNumber || 0) + Number(formData.patentsGrantedJointNumber || 0);
    const totalCommercialized = formData.grantedPatentsCommercialized.length + formData.grantedPatentsJointCommercialized.length;
    const totalGovtTransfer = formData.grantedPatentsGovtTransfer.length + formData.grantedPatentsJointGovtTransfer.length;
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Individual Patents</h4>
            <p><strong>Filed:</strong> {formData.patentsFiledNumber || 0} ({formData.patentsFiledList.length} listed)</p>
            <p><strong>Published:</strong> {formData.patentsPublishedNumber || 0} ({formData.patentsPublishedList.length} listed)</p>
            <p><strong>Granted:</strong> {formData.patentsGrantedNumber || 0} ({formData.patentsGrantedList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Joint Patents</h4>
            <p><strong>Filed:</strong> {formData.patentsFiledJointNumber || 0} ({formData.patentsFiledJointList.length} listed)</p>
            <p><strong>Published:</strong> {formData.patentsPublishedJointNumber || 0} ({formData.patentsPublishedJointList.length} listed)</p>
            <p><strong>Granted:</strong> {formData.patentsGrantedJointNumber || 0} ({formData.patentsGrantedJointList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Total Patents</h4>
            <p><strong>Total Filed:</strong> {totalPatentsFiled}</p>
            <p><strong>Total Published:</strong> {totalPatentsPublished}</p>
            <p><strong>Total Granted:</strong> {totalPatentsGranted}</p>
          </div>

          <div className="summary-card">
            <h4>Individual Commercialization</h4>
            <p><strong>Commercialized/Licensed/Sold:</strong> {formData.grantedPatentsCommercialized.length}</p>
            <p><strong>Govt. Tech Transfer:</strong> {formData.grantedPatentsGovtTransfer.length}</p>
          </div>

          <div className="summary-card">
            <h4>Joint Commercialization</h4>
            <p><strong>Commercialized/Licensed/Sold:</strong> {formData.grantedPatentsJointCommercialized.length}</p>
            <p><strong>Govt. Tech Transfer:</strong> {formData.grantedPatentsJointGovtTransfer.length}</p>
          </div>

          <div className="summary-card">
            <h4>Overall Summary</h4>
            <p><strong>Total Commercialized:</strong> {totalCommercialized}</p>
            <p><strong>Total Govt. Transfer:</strong> {totalGovtTransfer}</p>
            <p><strong>Success Rate:</strong> {totalPatentsGranted > 0 ? `${((totalCommercialized + totalGovtTransfer) / totalPatentsGranted * 100).toFixed(1)}%` : '0%'}</p>
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
          <h3>Patents Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your patents and technology transfer data has been recorded.</p>
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
      case 0: return renderIndividualPatents();
      case 1: return renderJointPatents();
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

      <Page18
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

export default PatentsForm;