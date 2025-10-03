// CollegeProgramForm5.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './Form19.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import FormPage from '../components/FormPage';
import Page19 from '../pages/Page19';

// Type definitions
interface FormData {
  college: string;
  totalPrograms: string | number;
  ugcFollowed: string;
  ugProgramsNumber: string | number;
  ugProgramsPercentage: string | number;
  regulatingCouncilsNumber: string | number;
  regulatingCouncilsNames: string;
  regulatingCouncilsPercentage: string | number;
  ccfugpProgramsNumber: string | number;
  ccfugpProgramsPercentage: string | number;
  bachelorDegreeNumber: string | number;
  bachelorDegreeList: string;
  bachelorDegreePercentage: string | number;
  bVocNumber: string | number;
  bVocList: string;
  bVocPercentage: string | number;
}

interface CollegeInfo {
  programs: number;
  ugcFollowed: string;
  ugProgramsNumber: number;
  ugProgramsPercentage: number;
  regulatingCouncilsNumber: number;
  regulatingCouncilsPercentage: number;
  bachelorDegreeNumber: number;
  bachelorDegreePercentage: number;
  bVocNumber: number;
  bVocPercentage: number;
}

interface CollegeData {
  [key: string]: CollegeInfo;
}

interface FormErrors {
  [key: string]: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

const CollegeProgramForm19: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<FormData>({
    college: '',
    totalPrograms: '',
    ugcFollowed: '',
    ugProgramsNumber: '',
    ugProgramsPercentage: '',
    regulatingCouncilsNumber: '',
    regulatingCouncilsNames: '',
    regulatingCouncilsPercentage: '',
    ccfugpProgramsNumber: '',
    ccfugpProgramsPercentage: '',
    bachelorDegreeNumber: '',
    bachelorDegreeList: '',
    bachelorDegreePercentage: '',
    bVocNumber: '',
    bVocList: '',
    bVocPercentage: ''
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Define sections
  const sections: Section[] = [
    {
      id: 0,
      title: "Institution Selection",
      description: "Select your institution and view program overview",
      fields: ['college', 'totalPrograms']
    },
    {
      id: 1,
      title: "UGC CCFUGP Information", 
      description: "Provide details about UGC CCFUGP alignment",
      fields: ['ugcFollowed', 'ugProgramsNumber', 'ugProgramsPercentage']
    },
    {
      id: 2,
      title: "Regulating Councils",
      description: "Information about regulating council alignments", 
      fields: ['regulatingCouncilsNumber', 'regulatingCouncilsNames', 'regulatingCouncilsPercentage']
    },
    {
      id: 3,
      title: "Non-Aligned Programs",
      description: "Programs not aligned to CCFUGP or councils",
      fields: ['ccfugpProgramsNumber', 'ccfugpProgramsPercentage']
    },
    {
      id: 4,
      title: "Bachelor Degree Programs", 
      description: "3-year bachelor degree program details",
      fields: ['bachelorDegreeNumber', 'bachelorDegreeList', 'bachelorDegreePercentage']
    },
    {
      id: 5,
      title: "B.VOC Programs",
      description: "Bachelor of Vocation program information", 
      fields: ['bVocNumber', 'bVocList', 'bVocPercentage']
    },
    {
      id: 6,
      title: "Review & Submit",
      description: "Review all information before submission",
      fields: []
    }
  ];

  // College data from CSV
  const collegeData: CollegeData = {
    'JCBUST': {
      programs: 20, 
      ugcFollowed: 'Yes',
      ugProgramsNumber: 2,
      ugProgramsPercentage: 10,
      regulatingCouncilsNumber: 10,
      regulatingCouncilsPercentage: 50,
      bachelorDegreeNumber: 3,
      bachelorDegreePercentage: 15,
      bVocNumber: 5,
      bVocPercentage: 25
    },
    'GJU': { 
      programs: 10, 
      ugcFollowed: 'Yes',
      ugProgramsNumber: 3,
      ugProgramsPercentage: 30,
      regulatingCouncilsNumber: 5,
      regulatingCouncilsPercentage: 50,
      bachelorDegreeNumber: 0,
      bachelorDegreePercentage: 0,
      bVocNumber: 1,
      bVocPercentage: 10
    },
    'Manav Rachna': { 
      programs: 15, 
      ugcFollowed: 'No',
      ugProgramsNumber: 0,
      ugProgramsPercentage: 0,
      regulatingCouncilsNumber: 10,
      regulatingCouncilsPercentage: 66.6666667,
      bachelorDegreeNumber: 2,
      bachelorDegreePercentage: 13.3333333,
      bVocNumber: 1,
      bVocPercentage: 6.6666667
    },
    'DCRUST': { 
      programs: 25, 
      ugcFollowed: 'Yes',
      ugProgramsNumber: 6,
      ugProgramsPercentage: 24,
      regulatingCouncilsNumber: 12,
      regulatingCouncilsPercentage: 48,
      bachelorDegreeNumber: 0,
      bachelorDegreePercentage: 0,
      bVocNumber: 3,
      bVocPercentage: 12
    }
  };

  const updateFormData = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateSection = (sectionId: number): boolean => {
    const newErrors: FormErrors = {};

    // Validation for each section
    switch (sectionId) {
      case 0: // Institution Selection
        if (!formData.college) {
          newErrors.college = 'Please select an institution';
        }
        break;
      case 1: // UGC CCFUGP
        if (!formData.ugcFollowed) {
          newErrors.ugcFollowed = 'Please select if UGC CCFUGP is followed';
        }
        break;
      // Add more validations as needed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (validateSection(currentSection)) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
      }
    }
  };

  const handlePrevious = (): void => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSectionClick = (sectionId: number): void => {
    // Allow navigation to completed sections or the next incomplete section
    const maxAllowedSection = Math.max(...Array.from(completedSections), -1) + 1;
    if (sectionId <= maxAllowedSection) {
      setCurrentSection(sectionId);
    }
  };

  const resetForm = (): void => {
    setFormData({
      college: '',
      totalPrograms: '',
      ugcFollowed: '',
      ugProgramsNumber: '',
      ugProgramsPercentage: '',
      regulatingCouncilsNumber: '',
      regulatingCouncilsNames: '',
      regulatingCouncilsPercentage: '',
      ccfugpProgramsNumber: '',
      ccfugpProgramsPercentage: '',
      bachelorDegreeNumber: '',
      bachelorDegreeList: '',
      bachelorDegreePercentage: '',
      bVocNumber: '',
      bVocList: '',
      bVocPercentage: ''
    });
    setErrors({});
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      resetForm();
    }, 5000);
  };

  // Auto-populate fields when college is selected
  useEffect(() => {
    if (formData.college && collegeData[formData.college]) {
      const data: CollegeInfo = collegeData[formData.college];
      setFormData(prev => ({
        ...prev,
        totalPrograms: data.programs,
        ugcFollowed: data.ugcFollowed,
        ugProgramsNumber: data.ugProgramsNumber,
        ugProgramsPercentage: data.ugProgramsPercentage,
        regulatingCouncilsNumber: data.regulatingCouncilsNumber,
        regulatingCouncilsPercentage: data.regulatingCouncilsPercentage,
        bachelorDegreeNumber: data.bachelorDegreeNumber,
        bachelorDegreePercentage: data.bachelorDegreePercentage,
        bVocNumber: data.bVocNumber,
        bVocPercentage: data.bVocPercentage
      }));
    }
  }, [formData.college]);

  const renderSection = (): JSX.Element => {
    const section = sections[currentSection];

    switch (currentSection) {
      case 0: // Institution Selection
        return (
          <div className="form-section">
            <h2 className="section-title">{section.title}</h2>
            <p className="section-description">{section.description}</p>
            
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label className="label">
                  Select Institution <span className="required">*</span>
                </label>
                <select
                  className="select"
                  value={formData.college}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => updateFormData('college', e.target.value)}
                  required
                >
                  <option value="">-- Select Institution --</option>
                  <option value="JCBUST">JCBUST</option>
                  <option value="GJU">GJU</option>
                  <option value="Manav Rachna">Manav Rachna</option>
                  <option value="DCRUST">DCRUST</option>
                </select>
                {errors.college && <span className="validation-message">{errors.college}</span>}
              </div>

              {formData.college && (
                <div className="card">
                  <h3 className="card-title">{formData.totalPrograms || '0'}</h3>
                  <p className="card-subtitle">Total Number of Programs</p>
                </div>
              )}
            </div>
          </div>
        );

// UGC CCFUGP Information
case 1:
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>

      <div className="form-grid">
        <div className="form-group form-group-full">
          <label className="label">
            Is UGC CCFUGP followed? <span className="required">*</span>
          </label>
          <div className="radio-group">
            <div
              className={`radio-option ${formData.ugcFollowed === 'Yes' ? 'selected' : ''}`}
              onClick={() => updateFormData('ugcFollowed', 'Yes')}
            >
              <input
                type="radio"
                name="ugc_followed"
                value="Yes"
                checked={formData.ugcFollowed === 'Yes'}
                onChange={() => updateFormData('ugcFollowed', 'Yes')}
              />
              <label>Yes</label>
            </div>
            <div
              className={`radio-option ${formData.ugcFollowed === 'No' ? 'selected' : ''}`}
              onClick={() => updateFormData('ugcFollowed', 'No')}
            >
              <input
                type="radio"
                name="ugc_followed"
                value="No"
                checked={formData.ugcFollowed === 'No'}
                onChange={() => updateFormData('ugcFollowed', 'No')}
              />
              <label>No</label>
            </div>
          </div>
          {errors.ugcFollowed && <span className="validation-message">{errors.ugcFollowed}</span>}
        </div>

        <div className="form-group">
          <label className="label">Number of UG programmes aligned to UGC CCFUGP</label>
          <input
            type="number"
            className="input"
            value={formData.ugProgramsNumber}
            onChange={(e) => updateFormData('ugProgramsNumber', e.target.value)}
            min="0"
          />
        </div>

        {Number(formData.ugProgramsNumber) > 0 && (
          <div className="form-group">
            <label className="label">Percentage of UG programmes aligned to UGC CCFUGP</label>
            <input
              type="number"
              className="input"
              value={formData.ugProgramsPercentage}
              onChange={(e) => updateFormData('ugProgramsPercentage', e.target.value)}
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );

// Regulating Councils
case 2:
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">Number of UG programmes aligned to Regulating Councils</label>
          <input
            type="number"
            className="input"
            value={formData.regulatingCouncilsNumber}
            onChange={(e) => updateFormData('regulatingCouncilsNumber', e.target.value)}
            min="0"
          />
        </div>

        {Number(formData.regulatingCouncilsNumber) > 0 && (
          <>
            <div className="form-group">
              <label className="label">Percentage aligned to Regulating Councils</label>
              <input
                type="number"
                className="input"
                value={formData.regulatingCouncilsPercentage}
                onChange={(e) => updateFormData('regulatingCouncilsPercentage', e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group form-group-full">
              <label className="label">Names of Regulating Councils</label>
              <textarea
                className="textarea"
                value={formData.regulatingCouncilsNames}
                onChange={(e) => updateFormData('regulatingCouncilsNames', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

// Non-Aligned Programs
case 3:
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">Number of programmes neither CCFUGP nor Council</label>
          <input
            type="number"
            className="input"
            value={formData.ccfugpProgramsNumber}
            onChange={(e) => updateFormData('ccfugpProgramsNumber', e.target.value)}
            min="0"
          />
        </div>

        {Number(formData.ccfugpProgramsNumber) > 0 && (
          <div className="form-group">
            <label className="label">Percentage of programmes neither CCFUGP nor Council</label>
            <input
              type="number"
              className="input"
              value={formData.ccfugpProgramsPercentage}
              onChange={(e) => updateFormData('ccfugpProgramsPercentage', e.target.value)}
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );

// Bachelor Degree Programs
case 4:
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">Number of 3-year bachelor Degree programmes (non-B.VOC)</label>
          <input
            type="number"
            className="input"
            value={formData.bachelorDegreeNumber}
            onChange={(e) => updateFormData('bachelorDegreeNumber', e.target.value)}
            min="0"
          />
        </div>

        {Number(formData.bachelorDegreeNumber) > 0 && (
          <>
            <div className="form-group">
              <label className="label">Percentage of 3-year bachelor Degree programmes (non-B.VOC)</label>
              <input
                type="number"
                className="input"
                value={formData.bachelorDegreePercentage}
                onChange={(e) => updateFormData('bachelorDegreePercentage', e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group form-group-full">
              <label className="label">List of 3-year bachelor Degree programmes (non-B.VOC)</label>
              <textarea
                className="textarea"
                value={formData.bachelorDegreeList}
                onChange={(e) => updateFormData('bachelorDegreeList', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

// B.VOC Programs
case 5:
  return (
    <div className="form-section">
      <h2 className="section-title">{section.title}</h2>
      <p className="section-description">{section.description}</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">Number of B.VOC programmes</label>
          <input
            type="number"
            className="input"
            value={formData.bVocNumber}
            onChange={(e) => updateFormData('bVocNumber', e.target.value)}
            min="0"
          />
        </div>

        {Number(formData.bVocNumber) > 0 && (
          <>
            <div className="form-group">
              <label className="label">Percentage of B.VOC programmes</label>
              <input
                type="number"
                className="input"
                value={formData.bVocPercentage}
                onChange={(e) => updateFormData('bVocPercentage', e.target.value)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group form-group-full">
              <label className="label">List of B.VOC programmes</label>
              <textarea
                className="textarea"
                value={formData.bVocList}
                onChange={(e) => updateFormData('bVocList', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

      case 6: // Review & Submit
        return (
          <div className="form-section">
            <h2 className="section-title">{section.title}</h2>
            <p className="section-description">{section.description}</p>
            
            {submitted ? (
              <div className="success-message">
                ✅ Form submitted successfully! Thank you for your submission.
                <br />
                <small>Form will reset automatically in 5 seconds...</small>
              </div>
            ) : (
              <div className="summary-grid">
                <div className="summary-card">
                  <h4>Institution Details</h4>
                  <p><strong>Institution:</strong> {formData.college || 'Not selected'}</p>
                  <p><strong>Total Programs:</strong> {formData.totalPrograms || 'N/A'}</p>
                </div>

                <div className="summary-card">
                  <h4>UGC CCFUGP</h4>
                  <p><strong>UGC Followed:</strong> {formData.ugcFollowed || 'Not specified'}</p>
                  <p><strong>UG Programs:</strong> {formData.ugProgramsNumber || 0} ({formData.ugProgramsPercentage || 0}%)</p>
                </div>

                <div className="summary-card">
                  <h4>Regulating Councils</h4>
                  <p><strong>Programs:</strong> {formData.regulatingCouncilsNumber || 0} ({formData.regulatingCouncilsPercentage || 0}%)</p>
                  <p><strong>Councils:</strong> {formData.regulatingCouncilsNames || 'Not specified'}</p>
                </div>

                <div className="summary-card">
                  <h4>Non-Aligned Programs</h4>
                  <p><strong>Programs:</strong> {formData.ccfugpProgramsNumber || 0} ({formData.ccfugpProgramsPercentage || 0}%)</p>
                </div>

                <div className="summary-card">
                  <h4>Bachelor Degree Programs</h4>
                  <p><strong>Programs:</strong> {formData.bachelorDegreeNumber || 0} ({formData.bachelorDegreePercentage || 0}%)</p>
                  <p><strong>List:</strong> {formData.bachelorDegreeList || 'Not specified'}</p>
                </div>

                <div className="summary-card">
                  <h4>B.VOC Programs</h4>
                  <p><strong>Programs:</strong> {formData.bVocNumber || 0} ({formData.bVocPercentage || 0}%)</p>
                  <p><strong>List:</strong> {formData.bVocList || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="container">
     <FormHeader />
     <PageNavigationSubheader totalPages={21}/>

    <Page19 
      progressPercentage={progressPercentage}
      sections={sections}
      currentSection={currentSection}
      completedSections={completedSections}
      handleSectionClick={handleSectionClick}
      handleSubmit={handleSubmit}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      resetForm={resetForm}
      submitted={submitted}
      renderSection={renderSection}
    />
    </div>
  );
};

export default CollegeProgramForm19;