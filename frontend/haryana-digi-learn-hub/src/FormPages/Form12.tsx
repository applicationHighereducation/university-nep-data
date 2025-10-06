import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page12 from '../pages/Page12';
import { Header } from '@/components/Header';
import axios from 'axios';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: First & Second Year
  firstYearAppearedNumber: string | number;
  firstYearExitPercentage: string | number;
  secondYearReEntryNumber: string | number;
  secondYearAppearedNumber: string | number;
  secondYearExitPercentage: string | number;
  
  // Section 2: Third Year & Honours
  thirdYearReEntryNumber: string | number;
  thirdYearAppearedNumber: string | number;
  thirdYearExitPercentage: string | number;
  fourthYearHonoursPercentage: string | number;
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
const UGExitOptionsForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    // Default values set to 0 for numbers
    firstYearAppearedNumber: 0,
    firstYearExitPercentage: 0,
    secondYearReEntryNumber: 0,
    secondYearAppearedNumber: 0,
    secondYearExitPercentage: 0,
    thirdYearReEntryNumber: 0,
    thirdYearAppearedNumber: 0,
    thirdYearExitPercentage: 0,
    fourthYearHonoursPercentage: 0,
  });

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "First & Second Year", description: "First and second year exit options and progression", fields: [] },
    { id: 1, title: "Third Year & Honours", description: "Third year exits and honours program entry", fields: [] },
    { id: 2, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 3, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value === '' ? 0 : value }));
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
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
        />
      </div>
    );
  };

  // Component for rendering percentage input
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
          onChange={(e) => updateFormData(field, e.target.value === '' ? 0 : e.target.value)}
          min="0"
          max="100"
          step="0.01"
        />
      </div>
    );
  };

//API Calls

const insertSection1 = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/page12/section1', {
      ug_appear_1yr_count: formData.firstYearAppearedNumber,
      ug_exit_1yr_percent: formData.firstYearExitPercentage,
      ug_enter_2yr_count : formData.secondYearReEntryNumber,
      ug_appear_2yr_count: formData.secondYearAppearedNumber,
      ug_exit_2yr_percent: formData.secondYearExitPercentage
    }, {withCredentials: true})

    console.log(response.data.data)
  } catch (error) {
    console.log('Error while inserting data: ', error)
  }
}

const insertSection2 = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/page12/section2', {
        ug_enter_3yr_count: formData.thirdYearReEntryNumber,
        ug_appear_3yr_count: formData.thirdYearAppearedNumber,
        ug_exit_3yr_percent: formData.thirdYearExitPercentage,
        ug_enter_4yr_percent: formData.fourthYearHonoursPercentage
    }, {withCredentials: true})

    console.log(response.data.data)
  } catch (error) {
    console.log('Error while inserting data: ', error)
  }
}


useEffect(() => {
  const fetchUGData = async () => {
    try {
      
      const section1Response = await axios.get('http://localhost:8000/api/page12/section1', {withCredentials: true});
      const section1Data = section1Response.data.data || {};
     
      const section2Response = await axios.get('http://localhost:8000/api/page12/section2', {withCredentials: true});
      const section2Data = section2Response.data.data || {};

     
      setFormData(prev => ({
        ...prev,
        firstYearAppearedNumber: section1Data.ug_appear_1yr_count || 0,
        firstYearExitPercentage: section1Data.ug_exit_1yr_percent || 0,
        secondYearReEntryNumber: section1Data.ug_enter_2yr_count || 0,
        secondYearAppearedNumber: section1Data.ug_appear_2yr_count || 0,
        secondYearExitPercentage: section1Data.ug_exit_2yr_percent || 0,
        thirdYearReEntryNumber: section2Data.ug_enter_3yr_count || 0,
        thirdYearAppearedNumber: section2Data.ug_appear_3yr_count || 0,
        thirdYearExitPercentage: section2Data.ug_exit_3yr_percent || 0,
        fourthYearHonoursPercentage: section2Data.ug_enter_4yr_percent || 0
      }));

    } catch (error) {
      console.error('Error fetching UG data:', error);
    }
  };

  fetchUGData();
}, []);



  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = async() => {
    setCompletedSections(prev => new Set([...prev, currentSection]));

    if(currentSection === 0){
      await insertSection1()
    } else if (currentSection === 1){
      await insertSection2()
    }

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
    console.log('UG Exit Options Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page13';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page13';
  };

  const resetForm = (): void => {
    setFormData({
      // Reset to default values (0 for numbers)
      firstYearAppearedNumber: 0,
      firstYearExitPercentage: 0,
      secondYearReEntryNumber: 0,
      secondYearAppearedNumber: 0,
      secondYearExitPercentage: 0,
      thirdYearReEntryNumber: 0,
      thirdYearAppearedNumber: 0,
      thirdYearExitPercentage: 0,
      fourthYearHonoursPercentage: 0,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: FIRST & SECOND YEAR
  const renderFirstSecondYear = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">First & Second Year</h2>
      <p className="section-description">First and second year exit options and progression</p>

      <div className="form-grid">
        <h3 style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', fontSize: '1.2em', fontWeight: '600', color: '#2c3e50' }}>First Year (End of 2nd Semester)</h3>
        
        {renderNumberInput('UG: Students appeared in 1st year/2nd semester - Number', 'firstYearAppearedNumber')}
        {renderPercentageInput('UG: Students opted & provided Exit after 1st year - Percentage', 'firstYearExitPercentage')}
        
        {renderNumberInput('UG: Students entering 2nd year after Exit (same/other HEI) - Number', 'secondYearReEntryNumber')}
        <div></div>
        
        <h3 style={{ gridColumn: '1 / -1', margin: '30px 0 10px 0', fontSize: '1.2em', fontWeight: '600', color: '#2c3e50' }}>Second Year (End of 4th Semester)</h3>
        
        {renderNumberInput('UG: Students appeared in 2nd year/4th semester - Number', 'secondYearAppearedNumber')}
        {renderPercentageInput('UG: Students opted & provided Exit after 2nd year/4th sem - Percentage', 'secondYearExitPercentage')}
      </div>

      {/* Data summary for current year progress */}
      {(Number(formData.firstYearAppearedNumber) > 0 || Number(formData.secondYearAppearedNumber) > 0) && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#e8f4fd', 
            border: '1px solid #bee5eb', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#0c5460'
          }}>
            <strong>📊 Early Years Summary:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>1st Year Students: {formData.firstYearAppearedNumber || 0} | Exit Rate: {formData.firstYearExitPercentage || 0}%</li>
              <li>2nd Year Students: {formData.secondYearAppearedNumber || 0} | Exit Rate: {formData.secondYearExitPercentage || 0}%</li>
              <li>Re-entries to 2nd Year: {formData.secondYearReEntryNumber || 0}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // SECTION 1: THIRD YEAR & HONOURS
  const renderThirdYearHonours = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Third Year & Honours</h2>
      <p className="section-description">Third year exits and honours program entry</p>

      <div className="form-grid">
        <h3 style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', fontSize: '1.2em', fontWeight: '600', color: '#2c3e50' }}>Third Year (End of 6th Semester)</h3>
        
        {renderNumberInput('UG: Students entering 3rd year after Exit (same/other HEI) - Number', 'thirdYearReEntryNumber')}
        {renderNumberInput('UG: Students appeared in 3rd year/6th semester - Number', 'thirdYearAppearedNumber')}
        
        {renderPercentageInput('UG: Students opted & provided Exit after 3rd year/6th sem - Percentage', 'thirdYearExitPercentage')}
        <div></div>
        
        <h3 style={{ gridColumn: '1 / -1', margin: '30px 0 10px 0', fontSize: '1.2em', fontWeight: '600', color: '#2c3e50' }}>Fourth Year - Honours Programs</h3>
        
        {renderPercentageInput('UG: Students entering 4th year/7th sem Honours/Honours with Research - Percentage', 'fourthYearHonoursPercentage')}
        <div></div>
      </div>

      {/* Data summary for advanced years */}
      {(Number(formData.thirdYearAppearedNumber) > 0 || Number(formData.fourthYearHonoursPercentage) > 0) && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f0f8ff', 
            border: '1px solid #cce7ff', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#0056b3'
          }}>
            <strong>🎓 Advanced Years Summary:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>3rd Year Students: {formData.thirdYearAppearedNumber || 0} | Exit Rate: {formData.thirdYearExitPercentage || 0}%</li>
              <li>Honours Entry Rate: {formData.fourthYearHonoursPercentage || 0}%</li>
              <li>Re-entries to 3rd Year: {formData.thirdYearReEntryNumber || 0}</li>
              <li>Estimated Honours Students: {
                Number(formData.thirdYearAppearedNumber) > 0 
                  ? Math.round(Number(formData.thirdYearAppearedNumber) * Number(formData.fourthYearHonoursPercentage || 0) / 100)
                  : 0
              }</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // SECTION 2: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>First Year Statistics</h4>
          <p><strong>Students Appeared (1st year/2nd sem):</strong> {formData.firstYearAppearedNumber || 0}</p>
          <p><strong>Exit Rate after 1st Year:</strong> {formData.firstYearExitPercentage || 0}%</p>
          <p><strong>Estimated Exits:</strong> {
            Number(formData.firstYearAppearedNumber) > 0 
              ? Math.round(Number(formData.firstYearAppearedNumber) * Number(formData.firstYearExitPercentage || 0) / 100)
              : 0
          } students</p>
          <p><strong>Re-entries to 2nd Year:</strong> {formData.secondYearReEntryNumber || 0}</p>
        </div>

        <div className="summary-card">
          <h4>Second Year Statistics</h4>
          <p><strong>Students Appeared (2nd year/4th sem):</strong> {formData.secondYearAppearedNumber || 0}</p>
          <p><strong>Exit Rate after 2nd Year:</strong> {formData.secondYearExitPercentage || 0}%</p>
          <p><strong>Estimated Exits:</strong> {
            Number(formData.secondYearAppearedNumber) > 0 
              ? Math.round(Number(formData.secondYearAppearedNumber) * Number(formData.secondYearExitPercentage || 0) / 100)
              : 0
          } students</p>
        </div>

        <div className="summary-card">
          <h4>Third Year Statistics</h4>
          <p><strong>Re-entries to 3rd Year:</strong> {formData.thirdYearReEntryNumber || 0}</p>
          <p><strong>Students Appeared (3rd year/6th sem):</strong> {formData.thirdYearAppearedNumber || 0}</p>
          <p><strong>Exit Rate after 3rd Year:</strong> {formData.thirdYearExitPercentage || 0}%</p>
          <p><strong>Estimated Exits:</strong> {
            Number(formData.thirdYearAppearedNumber) > 0 
              ? Math.round(Number(formData.thirdYearAppearedNumber) * Number(formData.thirdYearExitPercentage || 0) / 100)
              : 0
          } students</p>
        </div>

        <div className="summary-card">
          <h4>Honours Program Entry</h4>
          <p><strong>4th Year Honours Entry Rate:</strong> {formData.fourthYearHonoursPercentage || 0}%</p>
          <p><strong>Estimated Honours Students:</strong> {
            Number(formData.thirdYearAppearedNumber) > 0 
              ? Math.round(Number(formData.thirdYearAppearedNumber) * Number(formData.fourthYearHonoursPercentage || 0) / 100)
              : 0
          } students</p>
          <p><strong>Based on 3rd Year Appeared:</strong> {formData.thirdYearAppearedNumber || 0} students</p>
        </div>

        <div className="summary-card">
          <h4>Progression Analysis</h4>
          <p><strong>1st to 2nd Year Continuation:</strong> {
            Number(formData.firstYearAppearedNumber) > 0 
              ? `${(100 - Number(formData.firstYearExitPercentage || 0)).toFixed(1)}%`
              : '0%'
          }</p>
          <p><strong>2nd to 3rd Year Continuation:</strong> {
            Number(formData.secondYearAppearedNumber) > 0 
              ? `${(100 - Number(formData.secondYearExitPercentage || 0)).toFixed(1)}%`
              : '0%'
          }</p>
          <p><strong>3rd Year to Degree/Honours:</strong> {
            Number(formData.thirdYearAppearedNumber) > 0 
              ? `${(100 - Number(formData.thirdYearExitPercentage || 0)).toFixed(1)}%`
              : '0%'
          }</p>
          <p><strong>Overall Retention Quality:</strong> {
            ((100 - Number(formData.firstYearExitPercentage || 0)) + 
             (100 - Number(formData.secondYearExitPercentage || 0)) + 
             (100 - Number(formData.thirdYearExitPercentage || 0))) / 3 >= 80 ? '🟢 Excellent' :
            ((100 - Number(formData.firstYearExitPercentage || 0)) + 
             (100 - Number(formData.secondYearExitPercentage || 0)) + 
             (100 - Number(formData.thirdYearExitPercentage || 0))) / 3 >= 70 ? '🟡 Good' : '🔴 Needs Attention'
          }</p>
        </div>

        <div className="summary-card">
          <h4>Re-entry & Mobility Summary</h4>
          <p><strong>Total Re-entries (All Years):</strong> {
            Number(formData.secondYearReEntryNumber || 0) + 
            Number(formData.thirdYearReEntryNumber || 0)
          }</p>
          <p><strong>Re-entries to 2nd Year:</strong> {formData.secondYearReEntryNumber || 0}</p>
          <p><strong>Re-entries to 3rd Year:</strong> {formData.thirdYearReEntryNumber || 0}</p>
          <p><strong>Student Mobility:</strong> {
            (Number(formData.secondYearReEntryNumber || 0) + Number(formData.thirdYearReEntryNumber || 0)) > 0 ? 'Active' : 'Minimal'
          }</p>
          <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#6c757d' }}>
            Re-entries indicate students returning after exit from same/other HEI
          </p>
        </div>

        <div className="summary-card">
          <h4>Program Efficiency Metrics</h4>
          <p><strong>Total Students Tracked:</strong> {
            Math.max(
              Number(formData.firstYearAppearedNumber || 0),
              Number(formData.secondYearAppearedNumber || 0),
              Number(formData.thirdYearAppearedNumber || 0)
            )
          }</p>
          <p><strong>Exit Flexibility Offered:</strong> {
            (Number(formData.firstYearExitPercentage || 0) > 0 ? 1 : 0) +
            (Number(formData.secondYearExitPercentage || 0) > 0 ? 1 : 0) +
            (Number(formData.thirdYearExitPercentage || 0) > 0 ? 1 : 0)
          }/3 exit points</p>
          <p><strong>Honours Program Adoption:</strong> {
            Number(formData.fourthYearHonoursPercentage || 0) >= 25 ? '🟢 High' :
            Number(formData.fourthYearHonoursPercentage || 0) >= 15 ? '🟡 Moderate' :
            Number(formData.fourthYearHonoursPercentage || 0) > 0 ? '🟠 Low' : '⚪ Not Available'
          }</p>
          <p><strong>Data Completeness:</strong> {
            Object.values(formData).filter(value => Number(value) > 0).length >= 6 ? 'Complete' : 'Partial'
          }</p>
        </div>

        <div className="summary-card">
          <h4>Key Performance Indicators</h4>
          <p><strong>Average Exit Rate:</strong> {
            ((Number(formData.firstYearExitPercentage || 0) + 
              Number(formData.secondYearExitPercentage || 0) + 
              Number(formData.thirdYearExitPercentage || 0)) / 3).toFixed(1)
          }%</p>
          <p><strong>Student Flow Efficiency:</strong> {
            Number(formData.firstYearAppearedNumber || 0) > 0 && 
            Number(formData.secondYearAppearedNumber || 0) > 0 && 
            Number(formData.thirdYearAppearedNumber || 0) > 0 ? 'Tracked' : 'Partial'
          }</p>
          <p><strong>Exit Option Utilization:</strong> {
            Math.max(
              Number(formData.firstYearExitPercentage || 0),
              Number(formData.secondYearExitPercentage || 0),
              Number(formData.thirdYearExitPercentage || 0)
            ).toFixed(1)
          }% (highest)</p>
          <p><strong>Re-entry Support:</strong> {
            Number(formData.secondYearReEntryNumber || 0) + Number(formData.thirdYearReEntryNumber || 0) > 0 ? 'Available' : 'Not Available'
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

  // SECTION 3: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>UG Exit Options Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your UG exit options data has been recorded.</p>
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
      case 0: return renderFirstSecondYear();
      case 1: return renderThirdYearHonours();
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

      <Page12
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

export default UGExitOptionsForm;