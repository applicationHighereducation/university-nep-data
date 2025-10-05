import React, { useState, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page21 from '../pages/Page21';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface ActivityDetail {
  id: string;
  name: string;
}

interface IndustryRelationCell {
  exists: 'Yes' | 'No' | '';
  year: string | number;
  composition: string;
}

interface FormData {
  // Section 1: IIC and Innovation Activities
  isMemberOfIIC: 'Yes' | 'No' | '';
  iicActivitiesNumber: string | number;
  iicActivitiesList: ActivityDetail[];
  studentsParticipatingNumber: string | number;
  seedFundingNumber: string | number;
  seedFundingList: ActivityDetail[];
  
  // Section 2: Mentorship and Industry Relations
  mentorshipProgrammesNumber: string | number;
  mentorshipProgrammesList: ActivityDetail[];
  industryParticipationList: ActivityDetail[];
  startupAcquisitionsList: ActivityDetail[];
  industryRelationCell: IndustryRelationCell;
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
const InnovationIICForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 or appropriate defaults
    isMemberOfIIC: 'No',
    iicActivitiesNumber: 0,
    iicActivitiesList: [],
    studentsParticipatingNumber: 0,
    seedFundingNumber: 0,
    seedFundingList: [],
    mentorshipProgrammesNumber: 0,
    mentorshipProgrammesList: [],
    industryParticipationList: [],
    startupAcquisitionsList: [],
    industryRelationCell: {
      exists: 'No',
      year: 0,
      composition: ''
    },
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "IIC and Innovation Activities", description: "Innovation council membership and activities", fields: [] },
    { id: 1, title: "Mentorship and Industry Relations", description: "Mentorship programs and industry collaborations", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateIndustryRelationCell = (field: keyof IndustryRelationCell, value: any): void => {
    setFormData(prev => ({
      ...prev,
      industryRelationCell: {
        ...prev.industryRelationCell,
        [field]: value
      }
    }));
  };

  const generateId = (): string => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Functions for activity details
  const addActivityDetail = (listField: keyof FormData): void => {
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

  // Component for rendering Yes/No radio buttons
  const renderYesNoRadio = (
    label: string,
    field: keyof FormData | 'industryRelationCellExists',
    required = false
  ): JSX.Element => {
    const value = field === 'industryRelationCellExists' 
      ? formData.industryRelationCell.exists 
      : formData[field as keyof FormData];
    
    const handleChange = (val: string) => {
      if (field === 'industryRelationCellExists') {
        updateIndustryRelationCell('exists', val as 'Yes' | 'No');
      } else {
        updateFormData(field as keyof FormData, val);
      }
    };

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
              checked={value === 'Yes'}
              onChange={(e) => handleChange(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name={field}
              value="No"
              checked={value === 'No'}
              onChange={(e) => handleChange(e.target.value)}
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
    return (
      <div className="form-group form-group-full">
        <label className="label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type="number"
          className="input"
          value={typeof formData[field] === 'string' || typeof formData[field] === 'number' ? formData[field] : 0}
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
        />
      </div>
    );
  };

  // Component for rendering activity list
  const renderActivityList = (
    label: string,
    listField: keyof FormData,
    placeholder: string
  ): JSX.Element => {
    const activities = (formData[listField] as ActivityDetail[]) || [];
    
    return (
      <div className="form-group form-group-full">
        <label className="label">{label}</label>
        <div style={{ marginTop: '10px' }}>
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
          <button
            type="button"
            onClick={() => addActivityDetail(listField)}
            className="btn btn-primary"
            style={{ marginTop: '10px' }}
          >
            Add Item
          </button>
        </div>
      </div>
    );
  };

  // Component for rendering industry relation cell details
  const renderIndustryRelationCellDetails = (): JSX.Element => {
    return (
      <div className="form-group form-group-full" style={{ marginTop: '15px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h4 style={{ color: '#495057', fontSize: '1.05rem', marginBottom: '15px' }}>Institution-Industry Relation Cell Details</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
          <div>
            <label className="label" style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Year of Establishment</label>
            <input
              type="number"
              className="input"
              value={formData.industryRelationCell.year}
              onChange={(e) => updateIndustryRelationCell('year', e.target.value === '' ? 0 : e.target.value)}
              placeholder="Enter year"
              min="1900"
              max="2100"
            />
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Composition</label>
            <textarea
              className="input"
              value={formData.industryRelationCell.composition}
              onChange={(e) => updateIndustryRelationCell('composition', e.target.value)}
              placeholder="Describe the composition of the cell (members, roles, structure)"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
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
    console.log('Innovation and IIC Form submitted:', formData);
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
      // Reset to default values (0 or appropriate defaults)
      isMemberOfIIC: 'No',
      iicActivitiesNumber: 0,
      iicActivitiesList: [],
      studentsParticipatingNumber: 0,
      seedFundingNumber: 0,
      seedFundingList: [],
      mentorshipProgrammesNumber: 0,
      mentorshipProgrammesList: [],
      industryParticipationList: [],
      startupAcquisitionsList: [],
      industryRelationCell: {
        exists: 'No',
        year: 0,
        composition: ''
      },
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: IIC AND INNOVATION ACTIVITIES
  const renderIICActivities = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">IIC and Innovation Activities</h2>
      <p className="section-description">Innovation council membership and activities</p>

      <div className="form-grid">
        {renderYesNoRadio("Member of Institution's Innovation Council (IIC)?", 'isMemberOfIIC')}
        
        {renderNumberInput(
          "IIC/innovation activities last academic year (hackathons, idea contests, talks, bootcamps) - Number",
          'iicActivitiesNumber'
        )}
        {Number(formData.iicActivitiesNumber) > 0 && renderActivityList(
          'IIC/innovation activities last academic year - List',
          'iicActivitiesList',
          'Enter activity name/description'
        )}
        
        {renderNumberInput(
          'Students participating in innovation/start-up activities (last AY) - Number',
          'studentsParticipatingNumber'
        )}
        
        {renderNumberInput(
          'Seed funding/pre-incubation support to student ideas - Number',
          'seedFundingNumber'
        )}
        {Number(formData.seedFundingNumber) > 0 && renderActivityList(
          'Seed funding/pre-incubation support to student ideas - List',
          'seedFundingList',
          'Enter student idea/project name'
        )}
      </div>
    </div>
  );

  // SECTION 1: MENTORSHIP AND INDUSTRY RELATIONS
  const renderMentorshipIndustryRelations = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Mentorship and Industry Relations</h2>
      <p className="section-description">Mentorship programs and industry collaborations</p>

      <div className="form-grid">
        {renderNumberInput(
          'Mentorship programmes for start-ups (student/faculty) - Number',
          'mentorshipProgrammesNumber'
        )}
        {Number(formData.mentorshipProgrammesNumber) > 0 && renderActivityList(
          'Mentorship programmes for start-ups (student/faculty) - List',
          'mentorshipProgrammesList',
          'Enter mentorship programme name'
        )}
        
        {renderActivityList(
          'Industry participation in innovation/start-up mentoring - Programmes/List',
          'industryParticipationList',
          'Enter industry partner/programme name'
        )}
        
        {renderActivityList(
          'Incubated start-ups acquired or industry-collaborated - List',
          'startupAcquisitionsList',
          'Enter start-up name and collaboration details'
        )}
        
        {renderYesNoRadio('Institution-Industry Relation Cell exists?', 'industryRelationCellExists')}
        
        {formData.industryRelationCell.exists === 'Yes' && renderIndustryRelationCellDetails()}
      </div>
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => {
    const participationRate = Number(formData.iicActivitiesNumber) > 0 && Number(formData.studentsParticipatingNumber) > 0
      ? (Number(formData.studentsParticipatingNumber) / Number(formData.iicActivitiesNumber)).toFixed(1)
      : '0';
    
    return (
      <div className="form-section">
        <h2 className="section-title">Review</h2>
        <p className="section-description">Review all information before submission</p>
        
        <div className="summary-grid">
          <div className="summary-card">
            <h4>IIC Membership & Activities</h4>
            <p><strong>IIC Member:</strong> {formData.isMemberOfIIC || 'Not specified'}</p>
            <p><strong>Activities Conducted:</strong> {formData.iicActivitiesNumber || 0}</p>
            <p><strong>Students Participating:</strong> {formData.studentsParticipatingNumber || 0}</p>
            <p><strong>Avg. Students per Activity:</strong> {participationRate}</p>
          </div>

          <div className="summary-card">
            <h4>Seed Funding & Support</h4>
            <p><strong>Ideas Supported:</strong> {formData.seedFundingNumber || 0}</p>
            <p><strong>Funding Recipients:</strong> {formData.seedFundingList.length}</p>
            {formData.seedFundingList.length > 0 && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#004085' }}>
                  {formData.seedFundingList.length} student ideas received support
                </p>
              </div>
            )}
          </div>

          <div className="summary-card">
            <h4>Mentorship Programs</h4>
            <p><strong>Total Programs:</strong> {formData.mentorshipProgrammesNumber || 0}</p>
            <p><strong>Industry Participants:</strong> {formData.industryParticipationList.length}</p>
            <p><strong>Start-ups with Industry:</strong> {formData.startupAcquisitionsList.length}</p>
          </div>

          <div className="summary-card">
            <h4>Industry Relations</h4>
            <p><strong>Relation Cell Exists:</strong> {formData.industryRelationCell.exists || 'Not specified'}</p>
            {formData.industryRelationCell.exists === 'Yes' && (
              <>
                <p><strong>Established:</strong> {formData.industryRelationCell.year || 'Not specified'}</p>
                <p><strong>Has Composition:</strong> {formData.industryRelationCell.composition ? 'Yes' : 'Not specified'}</p>
              </>
            )}
          </div>

          <div className="summary-card">
            <h4>Innovation Ecosystem</h4>
            <p><strong>Total Activities:</strong> {formData.iicActivitiesList.length}</p>
            <p><strong>Mentorship Programs:</strong> {formData.mentorshipProgrammesList.length}</p>
            <p><strong>Industry Partners:</strong> {formData.industryParticipationList.length}</p>
            <p><strong>Successful Collaborations:</strong> {formData.startupAcquisitionsList.length}</p>
          </div>

          <div className="summary-card">
            <h4>Overall Impact</h4>
            <p><strong>Student Engagement:</strong> {formData.studentsParticipatingNumber || 0} students</p>
            <p><strong>Ideas Funded:</strong> {formData.seedFundingNumber || 0}</p>
            <p><strong>Industry Connections:</strong> {formData.industryParticipationList.length + formData.startupAcquisitionsList.length}</p>
            <div style={{ 
              marginTop: '15px', 
              padding: '12px', 
              backgroundColor: Number(formData.studentsParticipatingNumber) > 100 ? '#d4edda' : Number(formData.studentsParticipatingNumber) > 50 ? '#fff3cd' : '#f8d7da',
              borderRadius: '6px',
              border: `1px solid ${Number(formData.studentsParticipatingNumber) > 100 ? '#c3e6cb' : Number(formData.studentsParticipatingNumber) > 50 ? '#ffeaa7' : '#f5c6cb'}`
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                color: Number(formData.studentsParticipatingNumber) > 100 ? '#155724' : Number(formData.studentsParticipatingNumber) > 50 ? '#856404' : '#721c24',
                fontWeight: '500'
              }}>
                {Number(formData.studentsParticipatingNumber) > 100 
                  ? 'Strong student engagement in innovation'
                  : Number(formData.studentsParticipatingNumber) > 50
                  ? 'Moderate student engagement'
                  : 'Opportunity to increase engagement'}
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
          <h3>Innovation and IIC Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your innovation and IIC activities data has been recorded.</p>
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
      case 0: return renderIICActivities();
      case 1: return renderMentorshipIndustryRelations();
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
      <Header />
      <PageNavigationSubheader totalPages={21}/>

      <Page21
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

export default InnovationIICForm;