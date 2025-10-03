import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page2 from '../pages/Page2';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface FormData {
  // Section 1: CCFPP Alignment & Strict Programs
  isUgcCcfppFollowed: 'Yes' | 'No' | '';
  pgStrictAlignedNumber: string | number;
  selectedPgStrictAligned: string[];
  pgStrictAlignedPercentage: string | number;
  pgDifferentNumber: string | number;
  selectedPgDifferent: string[];
  
  // Section 2: Different Programs & Council Aligned
  pgDifferentPercentage: string | number;
  pgCouncilAlignedNumber: string | number;
  selectedPgCouncilAligned: string[];
  pgCouncilAlignedPercentage: string | number;
  twoYearMasterNumber: string | number;
  selectedTwoYearMaster: string[];
  twoYearMasterPercentage: string | number;
  
  // Section 3: 1-Year & 5-Year Programs
  oneYearMasterNumber: string | number;
  selectedOneYearMaster: string[];
  oneYearMasterPercentage: string | number;
  fiveYearIntegratedNumber: string | number;
  selectedFiveYearIntegrated: string[];
  fiveYearIntegratedPercentage: string | number;
  
  // Total PG Programs for percentage calculations
  totalPGPrograms: string | number;
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
const PGProgramForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    isUgcCcfppFollowed: '',
    pgStrictAlignedNumber: '',
    selectedPgStrictAligned: [],
    pgStrictAlignedPercentage: '',
    pgDifferentNumber: '',
    selectedPgDifferent: [],
    pgDifferentPercentage: '',
    pgCouncilAlignedNumber: '',
    selectedPgCouncilAligned: [],
    pgCouncilAlignedPercentage: '',
    twoYearMasterNumber: '',
    selectedTwoYearMaster: [],
    twoYearMasterPercentage: '',
    oneYearMasterNumber: '',
    selectedOneYearMaster: [],
    oneYearMasterPercentage: '',
    fiveYearIntegratedNumber: '',
    selectedFiveYearIntegrated: [],
    fiveYearIntegratedPercentage: '',
    totalPGPrograms: 100, // Default for percentage calculations
  });

  // Dynamic option states for each dropdown
  const [pgStrictAlignedOptions, setPgStrictAlignedOptions] = useState<string[]>([
    'M.Tech Computer Science',
    'M.Sc. Physics',
    'M.A. English Literature',
    'Master of Business Administration (MBA)',
    'Master of Computer Applications (MCA)',
    'M.Com',
    'M.Ed (Master of Education)',
    'M.Sc. Mathematics',
    'M.A. History',
    'M.Sc. Chemistry',
    'M.A. Political Science',
    'M.Sc. Biology',
    'Other'
  ]);

  const [pgDifferentOptions, setPgDifferentOptions] = useState<string[]>([
    'M.Phil Programs',
    'Professional Master Programs',
    'Interdisciplinary Master Programs',
    'Industry-Specific Master Programs',
    'Research-Based Master Programs',
    'Specialized Technology Programs',
    'Creative Arts Programs',
    'Other'
  ]);

  const [pgCouncilAlignedOptions, setPgCouncilAlignedOptions] = useState<string[]>([
    'M.Tech (AICTE Approved)',
    'M.Pharm (PCI Approved)',
    'Master in Medical Sciences (MCI Approved)',
    'LL.M (BCI Approved)',
    'M.Arch (COA Approved)',
    'M.E. (Engineering Council)',
    'Other'
  ]);

  const [twoYearMasterOptions, setTwoYearMasterOptions] = useState<string[]>([
    'M.A. (Master of Arts)',
    'M.Sc. (Master of Science)',
    'M.Com (Master of Commerce)',
    'M.Tech (Master of Technology)',
    'MBA (Master of Business Administration)',
    'MCA (Master of Computer Applications)',
    'M.Ed (Master of Education)',
    'M.S.W. (Master of Social Work)',
    'Other'
  ]);

  const [oneYearMasterOptions, setOneYearMasterOptions] = useState<string[]>([
    'Executive MBA',
    'Post Graduate Diploma',
    'Professional Master Programs',
    'Certificate Master Programs',
    'Accelerated Master Programs',
    'Other'
  ]);

  const [fiveYearIntegratedOptions, setFiveYearIntegratedOptions] = useState<string[]>([
    '5-year Integrated M.Tech',
    '5-year Integrated MBA',
    '5-year Integrated M.Sc.',
    '5-year Integrated M.A.',
    '5-year Law Programme (B.A. LL.B/B.Com LL.B)',
    '5-year Integrated M.Arch',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "CCFPP Alignment & Strict Programs", description: "UGC CCFPP compliance and strictly aligned programs", fields: [] },
    { id: 1, title: "Different Programs & Council Aligned", description: "Programs different from CCFPP and council alignments", fields: [] },
    { id: 2, title: "1-Year & 5-Year Programs", description: "Specialized duration master programs", fields: [] },
    { id: 3, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 4, title: "Submit", description: "Final submission", fields: [] }
  ];

  // ====================================
  // UTILITY FUNCTIONS
  // ====================================
  const updateFormData = (field: keyof FormData, value: string | number | string[]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePercentage = (numberField: string | number, total: string | number): string => {
    const num = Number(numberField) || 0;
    const totalNum = Number(total) || 0;
    return totalNum > 0 ? ((num / totalNum) * 100).toFixed(2) : '0';
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

  // Generic component for rendering number input with percentage
  const renderNumberWithPercentage = (
    label: string,
    numberField: keyof FormData,
    percentageField: keyof FormData,
    percentageLabel: string,
    required = false
  ): JSX.Element => {
    return (
      <>
        <div className="form-group">
          <label className="label">
            {label} {required && <span className="required">*</span>}
          </label>
          <input
            type="number"
            className="input"
            value={formData[numberField]}
            onChange={(e) => updateFormData(numberField, e.target.value)}
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="label">{percentageLabel}</label>
          <input
            type="text"
            className="input"
            value={`${formData[percentageField]} %`}
            readOnly
          />
        </div>
      </>
    );
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
    console.log('UGC CCFPP Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page12';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page12';
  };

  const resetForm = (): void => {
    setFormData({
      isUgcCcfppFollowed: '',
      pgStrictAlignedNumber: '',
      selectedPgStrictAligned: [],
      pgStrictAlignedPercentage: '',
      pgDifferentNumber: '',
      selectedPgDifferent: [],
      pgDifferentPercentage: '',
      pgCouncilAlignedNumber: '',
      selectedPgCouncilAligned: [],
      pgCouncilAlignedPercentage: '',
      twoYearMasterNumber: '',
      selectedTwoYearMaster: [],
      twoYearMasterPercentage: '',
      oneYearMasterNumber: '',
      selectedOneYearMaster: [],
      oneYearMasterPercentage: '',
      fiveYearIntegratedNumber: '',
      selectedFiveYearIntegrated: [],
      fiveYearIntegratedPercentage: '',
      totalPGPrograms: 100,
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
  };

  // ====================================
  // EFFECTS
  // ====================================
  // Auto-calculate percentages based on total PG programs
  useEffect(() => {
    updateFormData('pgStrictAlignedPercentage', calculatePercentage(formData.pgStrictAlignedNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.pgStrictAlignedNumber]);

  useEffect(() => {
    updateFormData('pgDifferentPercentage', calculatePercentage(formData.pgDifferentNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.pgDifferentNumber]);

  useEffect(() => {
    updateFormData('pgCouncilAlignedPercentage', calculatePercentage(formData.pgCouncilAlignedNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.pgCouncilAlignedNumber]);

  useEffect(() => {
    updateFormData('twoYearMasterPercentage', calculatePercentage(formData.twoYearMasterNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.twoYearMasterNumber]);

  useEffect(() => {
    updateFormData('oneYearMasterPercentage', calculatePercentage(formData.oneYearMasterNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.oneYearMasterNumber]);

  useEffect(() => {
    updateFormData('fiveYearIntegratedPercentage', calculatePercentage(formData.fiveYearIntegratedNumber, formData.totalPGPrograms));
  }, [formData.totalPGPrograms, formData.fiveYearIntegratedNumber]);

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: CCFPP ALIGNMENT & STRICT PROGRAMS
  const renderCcfppAlignmentStrictPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">CCFPP Alignment & Strict Programs</h2>
      <p className="section-description">UGC CCFPP compliance and strictly aligned programs</p>

      <div className="form-grid">
        {renderYesNoRadio('Is UGC CCFPP followed?', 'isUgcCcfppFollowed')}
        
        {renderNumberWithPercentage('PG programmes aligned strictly to UGC CCFPP - Number', 'pgStrictAlignedNumber', 'pgStrictAlignedPercentage', 'PG programmes aligned strictly to UGC CCFPP - Percentage')}
        
        {Number(formData.pgStrictAlignedNumber) > 0 && renderDropdownWithTags('PG programmes aligned strictly to UGC CCFPP - List', 'pgStrictAligned', pgStrictAlignedOptions, 'selectedPgStrictAligned', '-- Add a program --', setPgStrictAlignedOptions)}
        
        {renderNumberWithPercentage('PG programmes different from UGC CCFPP - Number', 'pgDifferentNumber', 'pgDifferentPercentage', 'PG programmes different from UGC CCFPP - Percentage')}
        
        {Number(formData.pgDifferentNumber) > 0 && renderDropdownWithTags('PG programmes different from UGC CCFPP - List', 'pgDifferent', pgDifferentOptions, 'selectedPgDifferent', '-- Add a program --', setPgDifferentOptions)}
      </div>
    </div>
  );

  // SECTION 1: DIFFERENT PROGRAMS & COUNCIL ALIGNED
  const renderDifferentProgramsCouncilAligned = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Different Programs & Council Aligned</h2>
      <p className="section-description">Programs different from CCFPP and council alignments</p>

      <div className="form-grid">
        {renderNumberWithPercentage('PG programmes different from UGC CCFPP but aligned to Council - Number', 'pgCouncilAlignedNumber', 'pgCouncilAlignedPercentage', 'PG programmes different from UGC CCFPP but aligned to Council - Percentage')}
        
        {Number(formData.pgCouncilAlignedNumber) > 0 && renderDropdownWithTags('PG programmes different from UGC CCFPP but aligned to Council - List', 'pgCouncilAligned', pgCouncilAlignedOptions, 'selectedPgCouncilAligned', '-- Add a program --', setPgCouncilAlignedOptions)}
        
        {renderNumberWithPercentage('2-year Master Degree programmes - Number', 'twoYearMasterNumber', 'twoYearMasterPercentage', '2-year Master Degree programmes - Percentage')}
        
        {Number(formData.twoYearMasterNumber) > 0 && renderDropdownWithTags('2-year Master Degree programmes - List', 'twoYearMaster', twoYearMasterOptions, 'selectedTwoYearMaster', '-- Add a program --', setTwoYearMasterOptions)}
      </div>
    </div>
  );

  // SECTION 2: 1-YEAR & 5-YEAR PROGRAMS
  const renderOneYearFiveYearPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">1-Year & 5-Year Programs</h2>
      <p className="section-description">Specialized duration master programs</p>

      <div className="form-grid">
        {renderNumberWithPercentage('1-year Master Degree programmes - Number', 'oneYearMasterNumber', 'oneYearMasterPercentage', '1-year Master Degree programmes - Percentage')}
        
        {Number(formData.oneYearMasterNumber) > 0 && renderDropdownWithTags('1-year Master Degree programmes - List', 'oneYearMaster', oneYearMasterOptions, 'selectedOneYearMaster', '-- Add a program --', setOneYearMasterOptions)}
        
        {renderNumberWithPercentage('5-year Integrated Master Degree programmes - Number', 'fiveYearIntegratedNumber', 'fiveYearIntegratedPercentage', '5-year Integrated Master Degree programmes - Percentage')}
        
        {Number(formData.fiveYearIntegratedNumber) > 0 && renderDropdownWithTags('5-year Integrated Master Degree programmes - List', 'fiveYearIntegrated', fiveYearIntegratedOptions, 'selectedFiveYearIntegrated', '-- Add a program --', setFiveYearIntegratedOptions)}
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
          <h4>UGC CCFPP Compliance</h4>
          <p><strong>UGC CCFPP Followed:</strong> {formData.isUgcCcfppFollowed || 'Not specified'}</p>
          <p><strong>Strictly Aligned Programs:</strong> {formData.pgStrictAlignedNumber || 0} ({formData.pgStrictAlignedPercentage || 0}%)</p>
          <p><strong>Different from CCFPP:</strong> {formData.pgDifferentNumber || 0} ({formData.pgDifferentPercentage || 0}%)</p>
        </div>

        <div className="summary-card">
          <h4>Council Aligned Programs</h4>
          <p><strong>Council Aligned Programs:</strong> {formData.pgCouncilAlignedNumber || 0} ({formData.pgCouncilAlignedPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedPgCouncilAligned.length > 0 ? formData.selectedPgCouncilAligned.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Master Programs by Duration</h4>
          <p><strong>2-Year Programs:</strong> {formData.twoYearMasterNumber || 0} ({formData.twoYearMasterPercentage || 0}%)</p>
          <p><strong>1-Year Programs:</strong> {formData.oneYearMasterNumber || 0} ({formData.oneYearMasterPercentage || 0}%)</p>
          <p><strong>5-Year Integrated:</strong> {formData.fiveYearIntegratedNumber || 0} ({formData.fiveYearIntegratedPercentage || 0}%)</p>
        </div>

        <div className="summary-card">
          <h4>Program Lists Summary</h4>
          <p><strong>Strictly Aligned:</strong> {formData.selectedPgStrictAligned.length} programs</p>
          <p><strong>Different from CCFPP:</strong> {formData.selectedPgDifferent.length} programs</p>
          <p><strong>2-Year Programs:</strong> {formData.selectedTwoYearMaster.length} programs</p>
          <p><strong>1-Year Programs:</strong> {formData.selectedOneYearMaster.length} programs</p>
        </div>

        <div className="summary-card">
          <h4>Total Distribution</h4>
          <p><strong>Total Programs Covered:</strong> {
            Number(formData.pgStrictAlignedNumber || 0) + 
            Number(formData.pgDifferentNumber || 0) + 
            Number(formData.pgCouncilAlignedNumber || 0) + 
            Number(formData.twoYearMasterNumber || 0) + 
            Number(formData.oneYearMasterNumber || 0) + 
            Number(formData.fiveYearIntegratedNumber || 0)
          }</p>
          <p><strong>CCFPP Compliance Rate:</strong> {
            Number(formData.pgStrictAlignedNumber || 0) > 0 
              ? `${((Number(formData.pgStrictAlignedNumber) / (Number(formData.pgStrictAlignedNumber) + Number(formData.pgDifferentNumber))) * 100).toFixed(1)}%`
              : '0%'
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
          <h3>UGC CCFPP Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your UGC CCFPP alignment data has been recorded.</p>
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
      case 0: return renderCcfppAlignmentStrictPrograms();
      case 1: return renderDifferentProgramsCouncilAligned();
      case 2: return renderOneYearFiveYearPrograms();
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
      <FormHeader 
        onSignIn={() => { /* TODO: implement sign in logic */ }} 
        onSignUp={() => { /* TODO: implement sign up logic */ }} 
      />
      <PageNavigationSubheader totalPages={21}/>

      <Page2
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

export default PGProgramForm;