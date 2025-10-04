import React, { useState, FormEvent, useEffect } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page17 from '../pages/Page17';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface ProjectDetail {
  id: string;
  agency?: string;
  project?: string;
  grant?: string;
  sponsor?: string;
  outcome?: string;
}

interface PublicationDetail {
  id: string;
  title: string;
}

interface FormData {
  // Section 1: High-value projects
  projects10CrPlus: string | number;
  projects10CrPlusList: ProjectDetail[];
  projects1To10Cr: string | number;
  projects1To10CrList: ProjectDetail[];
  projects50LTo1Cr: string | number;
  projects50LTo1CrList: ProjectDetail[];
  
  // Section 2: Lower-value and funded projects
  projects10LTo50L: string | number;
  projects10LTo50LList: ProjectDetail[];
  projectsBelow10L: string | number;
  projectsBelow10LList: ProjectDetail[];
  industryFundedProjects: string | number;
  industryFundedProjectsList: ProjectDetail[];
  ngoFundedProjects: string | number;
  ngoFundedProjectsList: ProjectDetail[];
  
  // Section 3: Publications
  sciPublications: string | number;
  sciPublicationsList: PublicationDetail[];
  esciPublications: string | number;
  esciPublicationsList: PublicationDetail[];
  scopusPublications: string | number;
  scopusPublicationsList: PublicationDetail[];
  
  // Section 4: Quartile publications and H-index
  q1Publications: string | number;
  q1PublicationsList: PublicationDetail[];
  q2Publications: string | number;
  q2PublicationsList: PublicationDetail[];
  q3Publications: string | number;
  q3PublicationsList: PublicationDetail[];
  q4Publications: string | number;
  q4PublicationsList: PublicationDetail[];
  peerReviewedPublications: string | number;
  peerReviewedPublicationsList: PublicationDetail[];
  institutionHIndex: string | number;
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
const ResearchProjectsForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    projects10CrPlus: 0,
    projects10CrPlusList: [],
    projects1To10Cr: 0,
    projects1To10CrList: [],
    projects50LTo1Cr: 0,
    projects50LTo1CrList: [],
    projects10LTo50L: 0,
    projects10LTo50LList: [],
    projectsBelow10L: 0,
    projectsBelow10LList: [],
    industryFundedProjects: 0,
    industryFundedProjectsList: [],
    ngoFundedProjects: 0,
    ngoFundedProjectsList: [],
    sciPublications: 0,
    sciPublicationsList: [],
    esciPublications: 0,
    esciPublicationsList: [],
    scopusPublications: 0,
    scopusPublicationsList: [],
    q1Publications: 0,
    q1PublicationsList: [],
    q2Publications: 0,
    q2PublicationsList: [],
    q3Publications: 0,
    q3PublicationsList: [],
    q4Publications: 0,
    q4PublicationsList: [],
    peerReviewedPublications: 0,
    peerReviewedPublicationsList: [],
    institutionHIndex: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "High-Value Projects", description: "Projects sanctioned ≥ 10 Cr to ≥ 50 L", fields: [] },
    { id: 1, title: "Lower-Value & Funded Projects", description: "Projects < 50 L and industry/NGO funded", fields: [] },
    { id: 2, title: "Indexed Publications", description: "SCI/SCIE/SSCI/AHCI/ESCI/SCOPUS publications", fields: [] },
    { id: 3, title: "Quartile Publications & H-Index", description: "Publications by quartile and institution H-index", fields: [] },
    { id: 4, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 5, title: "Submit", description: "Final submission", fields: [] }
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
    const currentList = formData[listField] as (ProjectDetail[] | PublicationDetail[]);
    const maxEntries = getMaxEntries(numberField);
    return currentList.length < maxEntries;
  };

  // Functions for project details
  const addProjectDetail = (listField: keyof FormData, numberField: keyof FormData, type: 'agency' | 'full'): void => {
    if (!canAddMoreEntries(listField, numberField)) return;
    
    const newProject: ProjectDetail = {
      id: generateId(),
      ...(type === 'agency' ? { agency: '' } : { project: '', grant: '', sponsor: '', outcome: '' })
    };
    const currentList = (formData[listField] as ProjectDetail[]) || [];
    updateFormData(listField, [...currentList, newProject]);
  };

  const updateProjectDetail = (listField: keyof FormData, id: string, field: string, value: string): void => {
    const currentList = (formData[listField] as ProjectDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removeProjectDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as ProjectDetail[]) || [];
    updateFormData(listField, currentList.filter(item => item.id !== id));
  };

  // Functions for publication details
  const addPublicationDetail = (listField: keyof FormData, numberField: keyof FormData): void => {
    if (!canAddMoreEntries(listField, numberField)) return;
    
    const newPublication: PublicationDetail = {
      id: generateId(),
      title: ''
    };
    const currentList = (formData[listField] as PublicationDetail[]) || [];
    updateFormData(listField, [...currentList, newPublication]);
  };

  const updatePublicationDetail = (listField: keyof FormData, id: string, value: string): void => {
    const currentList = (formData[listField] as PublicationDetail[]) || [];
    const updatedList = currentList.map(item => 
      item.id === id ? { ...item, title: value } : item
    );
    updateFormData(listField, updatedList);
  };

  const removePublicationDetail = (listField: keyof FormData, id: string): void => {
    const currentList = (formData[listField] as PublicationDetail[]) || [];
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

  // Component for rendering project list (Agency only) with constraints
  const renderProjectListAgency = (
    label: string,
    listField: keyof FormData,
    numberField: keyof FormData
  ): JSX.Element => {
    const projects = (formData[listField] as ProjectDetail[]) || [];
    const maxEntries = getMaxEntries(numberField);
    const canAddMore = canAddMoreEntries(listField, numberField);
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({projects.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {projects.map((project, index) => (
                <div key={project.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ minWidth: '30px', color: '#6c757d' }}>{index + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    value={project.agency || ''}
                    onChange={(e) => updateProjectDetail(listField, project.id, 'agency', e.target.value)}
                    placeholder="Enter funding agency name"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeProjectDetail(listField, project.id)}
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
                  onClick={() => addProjectDetail(listField, numberField, 'agency')}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add Project ({projects.length}/{maxEntries})
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
            {projects.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '1rem' }}>
                  📋 Current Entries ({projects.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projects.map((project, index) => (
                    <div key={project.id} style={{ 
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
                        {project.agency || <em style={{ color: '#6c757d' }}>No agency entered</em>}
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

  // Component for rendering project list (Full details) with TABLE VIEW and constraints
  const renderProjectListFullTable = (
    label: string,
    listField: keyof FormData,
    numberField: keyof FormData
  ): JSX.Element => {
    const projects = (formData[listField] as ProjectDetail[]) || [];
    const maxEntries = getMaxEntries(numberField);
    const canAddMore = canAddMoreEntries(listField, numberField);
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({projects.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Add Project Button */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              {canAddMore ? (
                <button
                  type="button"
                  onClick={() => addProjectDetail(listField, numberField, 'full')}
                  className="btn btn-primary"
                  style={{ padding: '10px 25px', fontSize: '1rem' }}
                >
                  Add Project ({projects.length}/{maxEntries})
                </button>
              ) : (
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  color: '#856404',
                  display: 'inline-block'
                }}>
                  Maximum {maxEntries} entries reached. Remove an entry to add a new one.
                </div>
              )}
            </div>

            {/* Table View */}
            {projects.length > 0 && (
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
                  📊 Projects Table ({projects.length} entries)
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
                            minWidth: '200px'
                          }}>
                            Project Name
                          </th>
                          <th style={{ 
                            padding: '12px 8px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #dee2e6',
                            fontWeight: 'bold',
                            color: '#495057',
                            minWidth: '120px'
                          }}>
                            Grant Amount
                          </th>
                          <th style={{ 
                            padding: '12px 8px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #dee2e6',
                            fontWeight: 'bold',
                            color: '#495057',
                            minWidth: '150px'
                          }}>
                            Sponsor
                          </th>
                          <th style={{ 
                            padding: '12px 8px', 
                            textAlign: 'left', 
                            borderBottom: '2px solid #dee2e6',
                            fontWeight: 'bold',
                            color: '#495057',
                            minWidth: '200px'
                          }}>
                            Outcome
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
                        {projects.map((project, index) => (
                          <tr key={project.id} style={{ 
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
                                value={project.project || ''}
                                onChange={(e) => updateProjectDetail(listField, project.id, 'project', e.target.value)}
                                placeholder="Enter project name"
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
                              <input
                                type="text"
                                value={project.grant || ''}
                                onChange={(e) => updateProjectDetail(listField, project.id, 'grant', e.target.value)}
                                placeholder="Grant amount"
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
                              <input
                                type="text"
                                value={project.sponsor || ''}
                                onChange={(e) => updateProjectDetail(listField, project.id, 'sponsor', e.target.value)}
                                placeholder="Sponsor name"
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
                              <input
                                type="text"
                                value={project.outcome || ''}
                                onChange={(e) => updateProjectDetail(listField, project.id, 'outcome', e.target.value)}
                                placeholder="Project outcome"
                                style={{
                                  width: '100%',
                                  padding: '6px 8px',
                                  border: '1px solid #ced4da',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                              />
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removeProjectDetail(listField, project.id)}
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
            {projects.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                borderRadius: '8px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                <p style={{ margin: 0, fontSize: '1rem' }}>No projects added yet</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Click "Add Project" to get started</p>
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

  // Component for rendering publication list with constraints
  const renderPublicationList = (
    label: string,
    listField: keyof FormData,
    numberField: keyof FormData
  ): JSX.Element => {
    const publications = (formData[listField] as PublicationDetail[]) || [];
    const maxEntries = getMaxEntries(numberField);
    const canAddMore = canAddMoreEntries(listField, numberField);
    
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label}
          <span style={{ fontSize: '0.9rem', color: '#6c757d', marginLeft: '10px' }}>
            ({publications.length}/{maxEntries} entries)
          </span>
        </label>
        
        {maxEntries > 0 ? (
          <div style={{ marginTop: '10px' }}>
            {/* Input Area */}
            <div style={{ marginBottom: '20px' }}>
              {publications.map((publication, index) => (
                <div key={publication.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ minWidth: '30px', color: '#6c757d' }}>{index + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    value={publication.title}
                    onChange={(e) => updatePublicationDetail(listField, publication.id, e.target.value)}
                    placeholder="Enter publication title"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removePublicationDetail(listField, publication.id)}
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
                  onClick={() => addPublicationDetail(listField, numberField)}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Add Publication ({publications.length}/{maxEntries})
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
            {publications.length > 0 && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '6px' 
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '1rem' }}>
                  📚 Current Publications ({publications.length})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {publications.map((publication, index) => (
                    <div key={publication.id} style={{ 
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
                        {publication.title || <em style={{ color: '#6c757d' }}>No title entered</em>}
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
    console.log('Research Projects Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page18';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page18';
  };

  const resetForm = (): void => {
    setFormData({
      projects10CrPlus: 0,
      projects10CrPlusList: [],
      projects1To10Cr: 0,
      projects1To10CrList: [],
      projects50LTo1Cr: 0,
      projects50LTo1CrList: [],
      projects10LTo50L: 0,
      projects10LTo50LList: [],
      projectsBelow10L: 0,
      projectsBelow10LList: [],
      industryFundedProjects: 0,
      industryFundedProjectsList: [],
      ngoFundedProjects: 0,
      ngoFundedProjectsList: [],
      sciPublications: 0,
      sciPublicationsList: [],
      esciPublications: 0,
      esciPublicationsList: [],
      scopusPublications: 0,
      scopusPublicationsList: [],
      q1Publications: 0,
      q1PublicationsList: [],
      q2Publications: 0,
      q2PublicationsList: [],
      q3Publications: 0,
      q3PublicationsList: [],
      q4Publications: 0,
      q4PublicationsList: [],
      peerReviewedPublications: 0,
      peerReviewedPublicationsList: [],
      institutionHIndex: 0,
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
      { numberField: 'projects10CrPlus', listField: 'projects10CrPlusList' },
      { numberField: 'projects1To10Cr', listField: 'projects1To10CrList' },
      { numberField: 'projects50LTo1Cr', listField: 'projects50LTo1CrList' },
      { numberField: 'projects10LTo50L', listField: 'projects10LTo50LList' },
      { numberField: 'projectsBelow10L', listField: 'projectsBelow10LList' },
      { numberField: 'industryFundedProjects', listField: 'industryFundedProjectsList' },
      { numberField: 'ngoFundedProjects', listField: 'ngoFundedProjectsList' },
      { numberField: 'sciPublications', listField: 'sciPublicationsList' },
      { numberField: 'esciPublications', listField: 'esciPublicationsList' },
      { numberField: 'scopusPublications', listField: 'scopusPublicationsList' },
      { numberField: 'q1Publications', listField: 'q1PublicationsList' },
      { numberField: 'q2Publications', listField: 'q2PublicationsList' },
      { numberField: 'q3Publications', listField: 'q3PublicationsList' },
      { numberField: 'q4Publications', listField: 'q4PublicationsList' },
      { numberField: 'peerReviewedPublications', listField: 'peerReviewedPublicationsList' },
    ];

    fieldsToCheck.forEach(({ numberField, listField }) => {
      const maxEntries = Number(formData[numberField as keyof FormData]) || 0;
      const currentList = formData[listField as keyof FormData] as (ProjectDetail[] | PublicationDetail[]);
      if (currentList.length > maxEntries) {
        updateFormData(listField as keyof FormData, currentList.slice(0, maxEntries));
      }
    });
  }, [
    formData.projects10CrPlus, formData.projects1To10Cr, formData.projects50LTo1Cr,
    formData.projects10LTo50L, formData.projectsBelow10L, formData.industryFundedProjects,
    formData.ngoFundedProjects, formData.sciPublications, formData.esciPublications,
    formData.scopusPublications, formData.q1Publications, formData.q2Publications,
    formData.q3Publications, formData.q4Publications, formData.peerReviewedPublications
  ]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: HIGH-VALUE PROJECTS
  const renderHighValueProjects = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">High-Value Projects</h2>
      <p className="section-description">Projects sanctioned ≥ 10 Cr to ≥ 50 L</p>

      <div className="form-grid">
        {renderNumberInput('Projects sanctioned ≥ 10 Cr - Number', 'projects10CrPlus')}
        {renderProjectListAgency('Projects sanctioned ≥ 10 Cr - List (Agency)', 'projects10CrPlusList', 'projects10CrPlus')}
        
        {renderNumberInput('Projects sanctioned ≥ 1 Cr & < 10 Cr - Number', 'projects1To10Cr')}
        {renderProjectListAgency('Projects sanctioned ≥ 1 Cr & < 10 Cr - List (Agency)', 'projects1To10CrList', 'projects1To10Cr')}
        
        {renderNumberInput('Projects sanctioned ≥ 50 L & < 1 Cr - Number', 'projects50LTo1Cr')}
        {renderProjectListAgency('Projects sanctioned ≥ 50 L & < 1 Cr - List (Agency)', 'projects50LTo1CrList', 'projects50LTo1Cr')}
      </div>
    </div>
  );

  // SECTION 1: LOWER-VALUE & FUNDED PROJECTS
  const renderLowerValueFundedProjects = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Lower-Value & Funded Projects</h2>
      <p className="section-description">Projects &lt; 50 L and industry/NGO funded</p>

      <div className="form-grid">
        {renderNumberInput('Projects sanctioned ≥ 10 L & < 50 L - Number', 'projects10LTo50L')}
        {renderProjectListAgency('Projects sanctioned ≥ 10 L & < 50 L - List (Agency)', 'projects10LTo50LList', 'projects10LTo50L')}
        
        {renderNumberInput('Projects sanctioned < 10 L - Number', 'projectsBelow10L')}
        {renderProjectListAgency('Projects sanctioned < 10 L - List (Agency)', 'projectsBelow10LList', 'projectsBelow10L')}
        
        {renderNumberInput('Industry-funded projects - Number', 'industryFundedProjects')}
        {renderProjectListFullTable('Industry-funded projects - List (Project, Grant, Sponsor, Outcome)', 'industryFundedProjectsList', 'industryFundedProjects')}
        
        {renderNumberInput('NGO/Other agency funded projects - Number', 'ngoFundedProjects')}
        {renderProjectListFullTable('NGO/Other agency funded projects - List (Project, Grant, Sponsor, Outcome)', 'ngoFundedProjectsList', 'ngoFundedProjects')}
      </div>
    </div>
  );

  // SECTION 2: INDEXED PUBLICATIONS
  const renderIndexedPublications = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Indexed Publications</h2>
      <p className="section-description">SCI/SCIE/SSCI/AHCI/ESCI/SCOPUS publications</p>

      <div className="form-grid">
        {renderNumberInput('SCI/SCIE/SSCI/AHCI publications - Number', 'sciPublications')}
        {renderPublicationList('SCI/SCIE/SSCI/AHCI publications - List', 'sciPublicationsList', 'sciPublications')}
        
        {renderNumberInput('ESCI publications - Number', 'esciPublications')}
        {renderPublicationList('ESCI publications - List', 'esciPublicationsList', 'esciPublications')}
        
        {renderNumberInput('SCOPUS publications (not covered above) - Number', 'scopusPublications')}
        {renderPublicationList('SCOPUS publications (not covered above) - List', 'scopusPublicationsList', 'scopusPublications')}
      </div>
    </div>
  );

  // SECTION 3: QUARTILE PUBLICATIONS & H-INDEX
  const renderQuartilePublications = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Quartile Publications & H-Index</h2>
      <p className="section-description">Publications by quartile and institution H-index</p>

      <div className="form-grid">
        {renderNumberInput('Q1 Publications - Number', 'q1Publications')}
        {renderPublicationList('Q1 Publications - List', 'q1PublicationsList', 'q1Publications')}
        
        {renderNumberInput('Q2 Publications - Number', 'q2Publications')}
        {renderPublicationList('Q2 Publications - List', 'q2PublicationsList', 'q2Publications')}
        
        {renderNumberInput('Q3 Publications - Number', 'q3Publications')}
        {renderPublicationList('Q3 Publications - List', 'q3PublicationsList', 'q3Publications')}
        
        {renderNumberInput('Q4 Publications - Number', 'q4Publications')}
        {renderPublicationList('Q4 Publications - List', 'q4PublicationsList', 'q4Publications')}
        
        {renderNumberInput('Peer-reviewed & indexed journals (other than above) - Number', 'peerReviewedPublications')}
        {renderPublicationList('Peer-reviewed & indexed journals (other than above) - List', 'peerReviewedPublicationsList', 'peerReviewedPublications')}
        
        {renderNumberInput('Institution H-index', 'institutionHIndex')}
      </div>
    </div>
  );

  // SECTION 4: REVIEW
  const renderReview = (): JSX.Element => {
    const totalProjects = Number(formData.projects10CrPlus || 0) + Number(formData.projects1To10Cr || 0) + 
                         Number(formData.projects50LTo1Cr || 0) + Number(formData.projects10LTo50L || 0) + 
                         Number(formData.projectsBelow10L || 0) + Number(formData.industryFundedProjects || 0) + 
                         Number(formData.ngoFundedProjects || 0);
    
    const totalPublications = Number(formData.sciPublications || 0) + Number(formData.esciPublications || 0) + 
                             Number(formData.scopusPublications || 0) + Number(formData.q1Publications || 0) + 
                             Number(formData.q2Publications || 0) + Number(formData.q3Publications || 0) + 
                             Number(formData.q4Publications || 0) + Number(formData.peerReviewedPublications || 0);
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>High-Value Projects</h4>
            <p><strong>≥ 10 Cr:</strong> {formData.projects10CrPlus || 0} projects ({formData.projects10CrPlusList.length} listed)</p>
            <p><strong>1-10 Cr:</strong> {formData.projects1To10Cr || 0} projects ({formData.projects1To10CrList.length} listed)</p>
            <p><strong>50L-1Cr:</strong> {formData.projects50LTo1Cr || 0} projects ({formData.projects50LTo1CrList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Lower-Value Projects</h4>
            <p><strong>10L-50L:</strong> {formData.projects10LTo50L || 0} projects ({formData.projects10LTo50LList.length} listed)</p>
            <p><strong>Below 10L:</strong> {formData.projectsBelow10L || 0} projects ({formData.projectsBelow10LList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Funded Projects</h4>
            <p><strong>Industry-funded:</strong> {formData.industryFundedProjects || 0} projects ({formData.industryFundedProjectsList.length} listed)</p>
            <p><strong>NGO/Other:</strong> {formData.ngoFundedProjects || 0} projects ({formData.ngoFundedProjectsList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Indexed Publications</h4>
            <p><strong>SCI/SCIE/SSCI/AHCI:</strong> {formData.sciPublications || 0} ({formData.sciPublicationsList.length} listed)</p>
            <p><strong>ESCI:</strong> {formData.esciPublications || 0} ({formData.esciPublicationsList.length} listed)</p>
            <p><strong>SCOPUS:</strong> {formData.scopusPublications || 0} ({formData.scopusPublicationsList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Quartile Publications</h4>
            <p><strong>Q1:</strong> {formData.q1Publications || 0} ({formData.q1PublicationsList.length} listed)</p>
            <p><strong>Q2:</strong> {formData.q2Publications || 0} ({formData.q2PublicationsList.length} listed)</p>
            <p><strong>Q3:</strong> {formData.q3Publications || 0} ({formData.q3PublicationsList.length} listed)</p>
            <p><strong>Q4:</strong> {formData.q4Publications || 0} ({formData.q4PublicationsList.length} listed)</p>
          </div>

          <div className="summary-card">
            <h4>Overall Summary</h4>
            <p><strong>Total Projects:</strong> {totalProjects}</p>
            <p><strong>Total Publications:</strong> {totalPublications}</p>
            <p><strong>Peer-reviewed (other):</strong> {formData.peerReviewedPublications || 0} ({formData.peerReviewedPublicationsList.length} listed)</p>
            <p><strong>Institution H-index:</strong> {formData.institutionHIndex || 'Not specified'}</p>
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

  // SECTION 5: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Research Projects Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your research projects and publications data has been recorded.</p>
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
      case 0: return renderHighValueProjects();
      case 1: return renderLowerValueFundedProjects();
      case 2: return renderIndexedPublications();
      case 3: return renderQuartilePublications();
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
      <FormHeader 
        onSignIn={() => { /* TODO: implement sign in logic */ }} 
        onSignUp={() => { /* TODO: implement sign up logic */ }} 
      />
      <PageNavigationSubheader totalPages={21}/>

      <Page17
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

export default ResearchProjectsForm;