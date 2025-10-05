import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page2 from '../pages/Page2';
import axios from 'axios';
import { Header } from '@/components/Header';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface ProgramTypeData {
  type: string;
  count: number;
}

interface UniversityData {
  universityId: string;
  universityName: string;
  totalPGPrograms: number;
  programTypes: ProgramTypeData[];
}

interface FormData {
  universityId: string;
  universityName: string;
  totalPGPrograms: number;
  programTypes: ProgramTypeData[];
  
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
// DEMO API FUNCTIONS
// ====================================
const fetchUniversityDataFromAPI = async (): Promise<UniversityData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data representing what would come from backend
  return {
    universityId: 'UNI001',
    universityName: 'Sample University Name',
    totalPGPrograms: 28, // Just PG programs for percentage calculations
    programTypes: [
      { type: 'Under Graduate', count: 45 },
      { type: 'PG', count: 28 },
      { type: 'PHD', count: 12 },
      { type: 'Diploma', count: 15 },
      { type: 'Certificates', count: 8 }
    ]
  };
};

// ====================================
// MAIN COMPONENT
// ====================================
const PGProgramForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [universityData, setUniversityData] = useState<UniversityData | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    universityId: '',
    universityName: '',
    totalPGPrograms: 0,
    programTypes: [],
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
  const updateFormData = (field: keyof FormData, value: string | number | string[] | ProgramTypeData[]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePercentage = (numberField: string | number, total: number): string => {
    const num = Number(numberField) || 0;
    return total > 0 ? ((num / total) * 100).toFixed(2) : '0';
  };

  // Function to calculate count based on selected items
  const calculateCountFromSelection = (selectedItems: string[]): number => {
    return selectedItems.length;
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

  // Modified component for rendering disabled number input with percentage and heading
  const renderDisabledNumberWithPercentage = (
    heading: string,
    numberField: keyof FormData,
    percentageField: keyof FormData,
    selectedItems: string[] = [],
    required = false
  ): JSX.Element => {
    // Auto-calculate the count based on selected items
    const calculatedCount = calculateCountFromSelection(selectedItems);
    
    // Update form data if count has changed
    if (Number(formData[numberField]) !== calculatedCount) {
      updateFormData(numberField, calculatedCount);
    }

    return (
      <>
        <h3 style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', fontSize: '1.2em', fontWeight: '600' }}>
          {heading} {required && <span className="required">*</span>}
        </h3>
        <div className="form-group">
          <label className="label">Counts</label>
          <input
            type="number"
            className="input disabled-input"
            value={calculatedCount}
            readOnly
            disabled
            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
          />
        </div>
        <div className="form-group">
          <label className="label">Percentage</label>
          <input
            type="text"
            className="input disabled-input"
            value={`${formData[percentageField]} %`}
            readOnly
            disabled
            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
          />
        </div>
      </>
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

  //API Calls

   const fetchProgramId = async (programs) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/pgForm/getProgramId',
      { names: programs },
      { withCredentials: true }
    );

    const programData = response.data.data;
    const programIDs = programData.map(program => program.p_id);
    return programIDs;
  } catch (error) {
    console.error("Error fetching program IDs:", error);
    return [];
  }
};

  const setSection1 = async() => {
    const isFollowed = formData.isUgcCcfppFollowed === 'Yes'
    try {
       const response = await axios.post('http://localhost:8000/api/pgform/setSection1', {
         isFollowed : isFollowed,
        count_ccfpp : formData.pgStrictAlignedNumber,
        pg_other_count: formData.pgDifferentNumber
       }, {withCredentials: true})

      const programs1 = await fetchProgramId(formData.selectedPgStrictAligned)
      const programs2 = await fetchProgramId(formData.selectedPgDifferent)
     

      const sendProgram1 = await axios.post('http://localhost:8000/api/pgform/insertpgCCFFP', {
        programIds : programs1
      }, {withCredentials: true})
      
      const sendProgram2 = await axios.post('http://localhost:8000/api/pgform/insertpgOtherThanCCFUGP', {
        programIds : programs2
      }, {withCredentials: true})

      console.log(sendProgram1.data.data,sendProgram2.data.data)
    } catch (error) {
      console.log(error)
    }
  } 

  const setSection2 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/pgform/setSection2', {
        count_regulating: formData.pgCouncilAlignedNumber,
        count_2year: formData.twoYearMasterNumber
      }, {withCredentials: true})

      const regulatingPrograms = await fetchProgramId(formData.selectedPgCouncilAligned)
      const twoYearPrograms = await fetchProgramId(formData.selectedTwoYearMaster)

      const sendRegulating = await axios.post('http://localhost:8000/api/pgform/insertRegulating', {
        programIds : regulatingPrograms
      }, {withCredentials: true})

       const sendTwoYear = await axios.post('http://localhost:8000/api/pgform/insert2Yearpg', {
        programIds : twoYearPrograms
      }, {withCredentials: true})
    } catch (error) {
      console.log('Error while posting Section 2 data: ', error)
    }
}

    const setSection3 = async() => {
      try {
         const response = await axios.post('http://localhost:8000/api/pgform/setSection3', {
          count_1year: formData.oneYearMasterNumber,
          count_5year_integrated : formData.fiveYearIntegratedNumber
      }, {withCredentials: true})

      const fiveYear = await fetchProgramId(formData.selectedFiveYearIntegrated)
      const oneYear = await fetchProgramId(formData.selectedOneYearMaster)

      const setFive = await axios.post('http://localhost:8000/api/pgform/insert5YearIntegratedpg', {
        programIds: fiveYear
      }, {withCredentials: true})

      const setOne = await axios.post('http://localhost:8000/api/pgform/insert1Yearpg', {
        programIds: oneYear
      }, {withCredentials: true})

      } catch (error) {
        console.log('Error while posting Section 3 data', error)
      }
    }


  
  

  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = async() => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
      if (currentSection === 0) {
        await setSection1();
  } else if (currentSection === 1){
    await setSection2()
  } else if (currentSection === 2){
    await setSection3()
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
    console.log('PG Form submitted:', formData);
    setSubmitted(true);
    
    // Show popup and redirect after delay
    setTimeout(() => {
      window.location.href = '/form/page12';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page12';
  };

  const resetForm = async (): Promise<void> => {
    // Reset all form state
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setOtherInputs({});
    
    // Re-fetch university data
    try {
      const data = await fetchUniversityDataFromAPI();
      setUniversityData(data);
      setFormData({
        universityId: data.universityId,
        universityName: data.universityName,
        totalPGPrograms: data.totalPGPrograms,
        programTypes: data.programTypes,
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
      });
    } catch (error) {
      console.error('Error fetching university data:', error);
    }
  };

  // ====================================
  // EFFECTS
  // ====================================
  useEffect(() => {
   const fetchDetails = async() => {
      try {
        const uniName = await axios.get('http://localhost:8000/api/ugform/getName', {withCredentials: true})
        const uniData = uniName.data.data

        const totalPrograms = await axios.get('http://localhost:8000/api/pgform/total', {withCredentials: true})
        const programs = totalPrograms.data.data
        setUniversityData(uniData);
        setFormData(prev => ({
          ...prev,
          universityId: uniData.u_id,
          universityName: uniData.u_name,
          totalPGPrograms: programs,

        }));
      } catch (error) {
        console.error('Error fetching university data:', error);
      }
    }
   
   fetchDetails() 
  }, []);


  useEffect(() => {
    const fetchPrograms = async() => {
      try {
        const response = await axios.get('http://localhost:8000/api/pgform/get', {withCredentials: true})
        const data  = response.data.data
        const names = data.map((course: any) => course.name);
        setPgStrictAlignedOptions(names)
        setPgDifferentOptions(names)
        setPgCouncilAlignedOptions(names)
        setTwoYearMasterOptions(names)
        setFiveYearIntegratedOptions(names)
        setOneYearMasterOptions(names)
      } catch (error) {
        console.log('Error while fetching programs: ', error)
      }
    }
    fetchPrograms()
  }, [])

  

  // Auto-calculate percentages based on PG total
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
        <div className="form-group form-group-full">
          <label className="label">Is UGC CCFPP followed? <span className="required">*</span></label>
          <div className="radio-group">
            {['Yes', 'No'].map(option => (
              <div
                key={option}
                className={`radio-option ${formData.isUgcCcfppFollowed === option ? 'selected' : ''}`}
                onClick={() => updateFormData('isUgcCcfppFollowed', option)}
              >
                <input
                  type="radio"
                  name="ugc_ccfpp_followed"
                  value={option}
                  checked={formData.isUgcCcfppFollowed === option}
                  readOnly
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        {renderDisabledNumberWithPercentage('PG programmes aligned strictly to UGC CCFPP', 'pgStrictAlignedNumber', 'pgStrictAlignedPercentage', formData.selectedPgStrictAligned)}
        {renderDropdownWithTags('PG programmes aligned strictly to UGC CCFPP - List', 'pgStrictAligned', pgStrictAlignedOptions, 'selectedPgStrictAligned', '-- Add a program --', setPgStrictAlignedOptions)}
        
        {renderDisabledNumberWithPercentage('PG programmes different from UGC CCFPP', 'pgDifferentNumber', 'pgDifferentPercentage', formData.selectedPgDifferent)}
        {renderDropdownWithTags('PG programmes different from UGC CCFPP - List', 'pgDifferent', pgDifferentOptions, 'selectedPgDifferent', '-- Add a program --', setPgDifferentOptions)}
      </div>
    </div>
  );

  // SECTION 1: DIFFERENT PROGRAMS & COUNCIL ALIGNED
  const renderDifferentProgramsCouncilAligned = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Different Programs & Council Aligned</h2>
      <p className="section-description">Programs different from CCFPP and council alignments</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('PG programmes different from UGC CCFPP but aligned to Council', 'pgCouncilAlignedNumber', 'pgCouncilAlignedPercentage', formData.selectedPgCouncilAligned)}
        {renderDropdownWithTags('PG programmes different from UGC CCFPP but aligned to Council - List', 'pgCouncilAligned', pgCouncilAlignedOptions, 'selectedPgCouncilAligned', '-- Add a program --', setPgCouncilAlignedOptions)}
        
        {renderDisabledNumberWithPercentage('2-year Master Degree programmes', 'twoYearMasterNumber', 'twoYearMasterPercentage', formData.selectedTwoYearMaster)}
        {renderDropdownWithTags('2-year Master Degree programmes - List', 'twoYearMaster', twoYearMasterOptions, 'selectedTwoYearMaster', '-- Add a program --', setTwoYearMasterOptions)}
      </div>
    </div>
  );

  // SECTION 2: 1-YEAR & 5-YEAR PROGRAMS
  const renderOneYearFiveYearPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">1-Year & 5-Year Programs</h2>
      <p className="section-description">Specialized duration master programs</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('1-year Master Degree programmes', 'oneYearMasterNumber', 'oneYearMasterPercentage', formData.selectedOneYearMaster)}
        {renderDropdownWithTags('1-year Master Degree programmes - List', 'oneYearMaster', oneYearMasterOptions, 'selectedOneYearMaster', '-- Add a program --', setOneYearMasterOptions)}
        
        {renderDisabledNumberWithPercentage('5-year Integrated Master Degree programmes', 'fiveYearIntegratedNumber', 'fiveYearIntegratedPercentage', formData.selectedFiveYearIntegrated)}
        {renderDropdownWithTags('5-year Integrated Master Degree programmes - List', 'fiveYearIntegrated', fiveYearIntegratedOptions, 'selectedFiveYearIntegrated', '-- Add a program --', setFiveYearIntegratedOptions)}
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
          <h4>Institution Details</h4>
          <p><strong>University:</strong> {formData.universityName || 'Not available'}</p>
          <p><strong>University ID:</strong> {formData.universityId || 'Not available'}</p>
          <p><strong>Total PG Programs:</strong> {formData.totalPGPrograms || 'N/A'}</p>
        </div>

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
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. All percentages are calculated based on total PG programs ({formData.totalPGPrograms}). Click "Next" to proceed to submission.
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
          <h3>PG Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your PG program data has been recorded.</p>
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
    <Header />
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