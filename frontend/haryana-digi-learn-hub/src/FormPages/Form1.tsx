import React, { useState, useEffect, FormEvent } from 'react';
import './Form1.css';
import FormHeader from '../components/FormHeader';
import PageNavigationSubheader from '../components/FormSubheader';
import Page1 from '../pages/Page1';
import { Header } from '@/components/Header';
import axios from 'axios';

// ====================================
// TYPE DEFINITIONS
// ====================================
interface UniversityData {
  universityId: string;
  universityName: string;
  totalPrograms: number;
}

interface FormData {
  universityId: string;
  universityName: string;
  totalPrograms: string | number;
  
  // UGC CCFUGP
  ugcFollowed: string;
  ugProgramsNumber: string | number;
  ugProgramsPercentage: string | number;
  selectedCourses: string[];
  
  // Regulating Councils & Non-Aligned
  regulatingCouncilsNumber: string | number;
  selectedRegulatingCourses: string[];
  regulatingCouncilsPercentage: string | number;
  selectedCouncils: string[];
  ccfugpProgramsNumber: string | number;
  ccfugpProgramsPercentage: string | number;
  selectedCcfugpPrograms: string[];
  
  // Bachelor & B.VOC Programs
  bachelorDegreeNumber: string | number;
  bachelorDegreePercentage: string | number;
  selectedBachelorPrograms: string[];
  bVocNumber: string | number;
  bVocPercentage: string | number;
  selectedBVocPrograms: string[];
  
  // 4 Year Programs
  fourYearBachelorNumber: string | number;
  fourYearBachelorPercentage: string | number;
  selectedFourYearBachelor: string[];
  honoursWithResearchNumber: string | number;
  honoursWithResearchPercentage: string | number;
  selectedHonoursWithResearch: string[];
  
  // Other 4 Year Programs
  itepProgramsNumber: string | number;
  itepLevels: string[];
  integratedDegreeNumber: string | number;
  selectedIntegratedDegree: string[];
  phdAdmissionAllowed: string;
  phdStudentsNumber: string | number;
  
  // 5 Year Programs
  fiveYearIntegratedNumber: string | number;
  fiveYearIntegratedPercentage: string | number;
  selectedFiveYearIntegrated: string[];
  
  // Others
  ordinanceFlexibilityNumber: string | number;
  flexibilityProvidedNumber: string | number;
  selectedFlexibilityProvided: string[];
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
const CollegeProgramForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [universityData, setUniversityData] = useState<UniversityData | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [otherInputs, setOtherInputs] = useState<OtherInputState>({});
  
  const [formData, setFormData] = useState<FormData>({
    universityId: '',
    universityName: '',
    totalPrograms: '',
    ugcFollowed: '',
    ugProgramsNumber: '',
    ugProgramsPercentage: '0',
    selectedCourses: [],
    selectedRegulatingCourses: [],
    regulatingCouncilsNumber: '',
    regulatingCouncilsPercentage: '0',
    selectedCouncils: [],
    ccfugpProgramsNumber: '',
    ccfugpProgramsPercentage: '0',
    selectedCcfugpPrograms: [],
    bachelorDegreeNumber: '',
    bachelorDegreePercentage: '0',
    selectedBachelorPrograms: [],
    bVocNumber: '',
    bVocPercentage: '0',
    selectedBVocPrograms: [],
    fourYearBachelorNumber: '',
    fourYearBachelorPercentage: '0',
    selectedFourYearBachelor: [],
    honoursWithResearchNumber: '',
    honoursWithResearchPercentage: '0',
    selectedHonoursWithResearch: [],
    itepProgramsNumber: 0,
    itepLevels: [],
    integratedDegreeNumber: '',
    selectedIntegratedDegree: [],
    phdAdmissionAllowed: '',
    phdStudentsNumber: 0,
    fiveYearIntegratedNumber: '',
    fiveYearIntegratedPercentage: '0',
    selectedFiveYearIntegrated: [],
    ordinanceFlexibilityNumber: 0,
    flexibilityProvidedNumber: '',
    selectedFlexibilityProvided: [],
  });

  // Dynamic option states for each dropdown
  const [courseOptions, setCourseOptions] = useState<string[]>([
    'B.Tech Computer Science',
    'B.Sc. Physics (Hons)',
    'B.A. English Literature',
    'Bachelor of Business Administration (BBA)',
    'Bachelor of Computer Applications (BCA)',
    'B.Com (Hons)',
    'Other'
  ]);

  const [regulatingCourseOptions, setRegulatingCourseOptions] = useState<string[]>([
    'AICTE (All India Council for Technical Education)',
    'UGC (University Grants Commission)',
    'NCTE (National Council for Teacher Education)',
    'MCI (Medical Council of India)',
    'BCI (Bar Council of India)',
    'PCI (Pharmacy Council of India)',
    'Other'
  ]);

  const [ccfugpProgramOptions, setCcfugpProgramOptions] = useState<string[]>([
    'B.A. (Bachelor of Arts)',
    'B.Com (Bachelor of Commerce)',
    'B.Sc. (Bachelor of Science)',
    'B.Tech (Bachelor of Technology)',
    'BBA (Bachelor of Business Administration)',
    'BCA (Bachelor of Computer Applications)',
    'Other'
  ]);

  const [bachelorProgramOptions, setBachelorProgramOptions] = useState<string[]>([
    'B.A. (Bachelor of Arts)',
    'B.Com (Bachelor of Commerce)',
    'B.Sc. (Bachelor of Science)',
    'B.Tech (Bachelor of Technology)',
    'BBA (Bachelor of Business Administration)',
    'BCA (Bachelor of Computer Applications)',
    'Other'
  ]);

  const [bVocProgramOptions, setBVocProgramOptions] = useState<string[]>([
    'B.VOC Healthcare Management',
    'B.VOC Software Development',
    'B.VOC Digital Marketing',
    'B.VOC Web Design & Development',
    'B.VOC Banking & Finance',
    'B.VOC Retail Management',
    'Other'
  ]);

  const [fourYearBachelorOptions, setFourYearBachelorOptions] = useState<string[]>([
    '4-year B.A. (Honours)',
    '4-year B.Sc. (Honours)',
    '4-year B.Com (Honours)',
    '4-year B.Tech',
    '4-year BBA (Honours)',
    'Other'
  ]);

  const [honoursResearchOptions, setHonoursResearchOptions] = useState<string[]>([
    'B.A. (Honours with Research)',
    'B.Sc. (Honours with Research)',
    'B.Com (Honours with Research)',
    'B.Tech (Honours with Research)',
    'Other'
  ]);

  const [integratedDegreeOptions, setIntegratedDegreeOptions] = useState<string[]>([
    'B.A.-M.A. Integrated',
    'B.Sc.-M.Sc. Integrated',
    'B.Com-M.Com Integrated',
    'B.Tech-M.Tech Integrated',
    'Other'
  ]);

  const [fiveYearIntegratedOptions, setFiveYearIntegratedOptions] = useState<string[]>([
    '5-year B.A.-M.A. Integrated',
    '5-year B.Sc.-M.Sc. Integrated',
    '5-year B.Tech-M.Tech Integrated',
    '5-year Law Programme',
    'Other'
  ]);

  const [flexibilityOptions, setFlexibilityOptions] = useState<string[]>([
    'Single Major Programme',
    'Honours Programme',
    'Multi-disciplinary Programme',
    'Interdisciplinary Programme',
    'Other'
  ]);

  const [itepLevelOptions, setItepLevelOptions] = useState<string[]>([
    'Primary',
    'Secondary',
    'Senior Secondary',
    'Other'
  ]);

  // Define sections
  const sections: Section[] = [
    { id: 0, title: "UGC CCFUGP Information", description: "Provide details about UGC CCFUGP alignment", fields: [] },
    { id: 1, title: "Regulating Councils Programs", description: "Information about regulating council alignments and non-aligned programs", fields: [] },
    { id: 2, title: "Bachelor Degree Programs", description: "3-year bachelor degree and B.VOC program details", fields: [] },
    { id: 3, title: "Four Year University Programs", description: "4-year bachelor degree and honours with research programs", fields: [] },
    { id: 4, title: "Other 4 Year Programs", description: "ITEP and integrated degree programs", fields: [] },
    { id: 5, title: "5 Year University Programs", description: "5-year integrated program information", fields: [] },
    { id: 6, title: "Other Program Information", description: "UG programmes with ordinance flexibility", fields: [] },
    { id: 7, title: "Review", description: "Review all information before submission", fields: [] },
    { id: 8, title: "Submit", description: "Final submission", fields: [] }
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
    optionsState: string[],
    setOptionsState: React.Dispatch<React.SetStateAction<string[]>>
  ): void => {
    if (value === 'Other') {
      handleOtherSelection(fieldKey);
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

  // Handle focus on number inputs with default value 0
  const handleNumberInputFocus = (field: keyof FormData): void => {
    if (formData[field] === 0 || formData[field] === '0') {
      updateFormData(field, '');
    }
  };

  // Handle blur on number inputs to restore 0 if empty
  const handleNumberInputBlur = (field: keyof FormData): void => {
    if (formData[field] === '' || formData[field] === null || formData[field] === undefined) {
      updateFormData(field, 0);
    }
  };

  // Modified component for rendering disabled number input with percentage and heading
  const renderDisabledNumberWithPercentage = (
    heading: string,
    numberField: keyof FormData,
    percentageField: keyof FormData,
    selectedItems: string[] = [],
    required = false
  ): JSX.Element => {
    const calculatedCount = calculateCountFromSelection(selectedItems);
    
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
            value={`${formData[percentageField] || '0'} %`}
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
  // Api Functions
  // ====================================
  const fetchProgramId = async (programs) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/ugForm/getProgram',
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

  //Send Page 1 Data
  const sendCCFGUGPData = async () => {
    const isFollowed = formData.ugcFollowed === 'Yes';

    try {
      const response = await axios.post(
        'http://localhost:8000/api/ugform/ccfugp',
        {
          isFollowed: isFollowed,
          count: formData.ugProgramsNumber
        },
        { withCredentials: true }
      );

      const programIds = await fetchProgramId(formData.selectedCourses);

      if (programIds.length > 0 || programIds.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugForm/insertProgram',
          {
            programIds: programIds     
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

    } catch (error) {
      console.error("❌ Error in sendCCFGUGPData:", error);
    }
  };

  //Send Page 2 Data
  const sendRegulatingCouncilsData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/ugform/setSection3',
        {
          count_regulating: formData.regulatingCouncilsNumber,
          count_others: formData.ccfugpProgramsNumber
        },
        { withCredentials: true }
      );

      const programIds = await fetchProgramId(formData.selectedRegulatingCourses);
    
      if (programIds.length > 0 || programIds.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugform/insertRegulatingProgram',
          {
            programIds: programIds
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

      const ccfugpProgramIds = await fetchProgramId(formData.selectedCcfugpPrograms);
      
      if (ccfugpProgramIds.length > 0 || ccfugpProgramIds.length === 0) {
        const insertCcfugpResponse = await axios.post(
          'http://localhost:8000/api/ugform/insertNonAlignedProgram',
          {
            programIds: ccfugpProgramIds
          },
          { withCredentials: true }
        );
      }

    } catch (error) {
      console.error("❌ Error in sendRegulatingCouncilsData:", error);
    }
  };

  //Send Page 3 data
  const setSection4 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/ugform/setSection4', {
        count_non_bvoc : formData.bachelorDegreeNumber,
        count_bvoc : formData.bVocNumber
      }, {withCredentials: true})

      const programIdsList1 = await fetchProgramId(formData.selectedBachelorPrograms)
      const programIdsList2 = await fetchProgramId(formData.selectedBVocPrograms)

      if (programIdsList1.length > 0 || programIdsList1.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugform/insertBachelorProgram',
          {
            programIds: programIdsList1      
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

      if (programIdsList2.length > 0 || programIdsList2.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugform/insertBvoc',
          {
            programIds: programIdsList2 
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

    } catch (error) {
      console.log('Error while sending Section 4 Data',error)
    }
  }

  //Send Page 4 Data
  const setSection5 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/ugform/setSection5', {
        count_bach : formData.fourYearBachelorNumber,
        count_honor: formData.honoursWithResearchNumber
      }, {withCredentials: true})

      const programIdsList1 = await fetchProgramId(formData.selectedFourYearBachelor)
      const programIdsList2 = await fetchProgramId(formData.selectedHonoursWithResearch)

      if (programIdsList1.length > 0 || programIdsList1.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugform/insert4YrBachelor',
          {
            programIds: programIdsList1      
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

      if (programIdsList2.length > 0 || programIdsList2.length === 0) {
        const insertResponse = await axios.post(
          'http://localhost:8000/api/ugform/insert4YrHonor',
          {
            programIds: programIdsList2 
          },
          { withCredentials: true }
        );
      } else {
        console.warn("⚠️ No program IDs found, skipping insert.");
      }

    } catch (error) {
      console.error("Error in setSection5:", error);
    }
  }

  const setSection6 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/ugform/setSection6', {
        count_ITEP : formData.itepProgramsNumber,
        count_4year_integrated: formData.integratedDegreeNumber,
        count_PhD_after4years : formData.phdStudentsNumber
      }, {withCredentials: true})

      const programIds = await fetchProgramId(formData.selectedIntegratedDegree)
      const number = await programIds.map(Number)

      const insertResponse = await axios.post('http://localhost:8000/api/ugform/insert4Integrated', {programIds: number}, {withCredentials: true})
    } catch (error) {
      console.log('Error while sending section 6 data', error)
    }
  }

  const setSection7 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/ugform/setSection7', {
        count_5years_integrated: formData.fiveYearIntegratedNumber
      }, {withCredentials: true})

      const programIds = await fetchProgramId(formData.selectedFiveYearIntegrated)

      const insertResponse = await axios.post('http://localhost:8000/api/ugform/insert5Integrated', {programIds: programIds}, {withCredentials: true})
    } catch (error) {
      console.log('Error while sending page 7 data', error)
    }
  }

  const setSection8 = async() => {
    try {
      const response = await axios.post('http://localhost:8000/api/ugform/setSection8', {
        count_ordinance: formData.ordinanceFlexibilityNumber,
        count_actual: formData.flexibilityProvidedNumber
      }, {withCredentials: true})

      const programIds = await fetchProgramId(formData.selectedFlexibilityProvided)
      const insertResponse = await axios.post('http://localhost:8000/api/ugform/insertFlexibility', {programIds: programIds}, {withCredentials: true})
    } catch (error) {
      console.log('Error while posting page 8 data', error)
    }
  }

  // ====================================
  // EVENT HANDLERS
  // ====================================
  const handleNext = async () => {
    // Validation for Section 0 - UGC CCFUGP
    if (currentSection === 0) {
      if (!formData.ugcFollowed) {
        alert('Please select whether UGC CCFUGP is followed or not.');
        return;
      }
      await sendCCFGUGPData();
    } else if (currentSection === 1) {
      await sendRegulatingCouncilsData();
    } else if (currentSection === 2){
      await setSection4()
    } else if (currentSection === 3){
      await setSection5()
    } else if (currentSection === 4){
      await setSection6()
    } else if (currentSection === 5){
      await setSection7()
    } else if (currentSection === 6){
      await setSection8()
    }

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
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      window.location.href = '/form/page2';
    }, 2000);
  };

  const handleNavigateToNextForm = (): void => {
    window.location.href = '/form/page2';
  };

  const resetForm = (): void => {
    setFormData({
      universityId: '',
      universityName: '',
      totalPrograms: '',
      ugcFollowed: '',
      ugProgramsNumber: '',
      ugProgramsPercentage: '0',
      selectedCourses: [],
      selectedRegulatingCourses: [],
      regulatingCouncilsNumber: '',
      regulatingCouncilsPercentage: '0',
      selectedCouncils: [],
      ccfugpProgramsNumber: '',
      ccfugpProgramsPercentage: '0',
      selectedCcfugpPrograms: [],
      bachelorDegreeNumber: '',
      bachelorDegreePercentage: '0',
      selectedBachelorPrograms: [],
      bVocNumber: '',
      bVocPercentage: '0',
      selectedBVocPrograms: [],
      fourYearBachelorNumber: '',
      fourYearBachelorPercentage: '0',
      selectedFourYearBachelor: [],
      honoursWithResearchNumber: '',
      honoursWithResearchPercentage: '0',
      selectedHonoursWithResearch: [],
      itepProgramsNumber: 0,
      itepLevels: [],
      integratedDegreeNumber: '',
      selectedIntegratedDegree: [],
      phdAdmissionAllowed: '',
      phdStudentsNumber: 0,
      fiveYearIntegratedNumber: '',
      fiveYearIntegratedPercentage: '0',
      selectedFiveYearIntegrated: [],
      ordinanceFlexibilityNumber: 0,
      flexibilityProvidedNumber: '',
      selectedFlexibilityProvided: [],
    });
    setSubmitted(false);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setUniversityData(null);
    setOtherInputs({});
  };

  // ====================================
  // EFFECTS
  // ====================================
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const uniName = await axios.get('http://localhost:8000/api/ugform/getName', {withCredentials: true})
        const uniData = uniName.data.data

        const totalProgramsResponse = await axios.get('http://localhost:8000/api/ugform/total', {withCredentials: true})
        const totalPrograms = totalProgramsResponse.data.data

        const mockUniversityData: UniversityData = {
          universityId: uniData.u_id,
          universityName: uniData.u_name,
          totalPrograms: totalPrograms
        };
        
        setUniversityData(mockUniversityData);
        setFormData(prev => ({
          ...prev,
          universityId: mockUniversityData.universityId,
          universityName: mockUniversityData.universityName,
          totalPrograms: mockUniversityData.totalPrograms,
        }));
      } catch (error) {
        console.error('Error fetching university data:', error);
      }
    };

    fetchUniversityData();
  }, []);

  useEffect(() => {
    const fetchPrograms = async() => {
      try {
        const response = await axios.get('http://localhost:8000/api/program/getUG', {withCredentials: true})
        const data = response.data.data
        const names = data.map((course: any) => course.name);
        setCourseOptions(names)
        setRegulatingCourseOptions(names)
        setCcfugpProgramOptions(names)
        setBachelorProgramOptions(names)
        setBVocProgramOptions(names)
        setFiveYearIntegratedOptions(names)
        setFourYearBachelorOptions(names)
        setHonoursResearchOptions(names)
        setIntegratedDegreeOptions(names)
        setFlexibilityOptions(names)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPrograms()
  }, [])

  // Auto-calculate percentages
  useEffect(() => {
    updateFormData('ugProgramsPercentage', calculatePercentage(formData.ugProgramsNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.ugProgramsNumber]);

  useEffect(() => {
    updateFormData('regulatingCouncilsPercentage', calculatePercentage(formData.regulatingCouncilsNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.regulatingCouncilsNumber]);

  useEffect(() => {
    updateFormData('ccfugpProgramsPercentage', calculatePercentage(formData.ccfugpProgramsNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.ccfugpProgramsNumber]);

  useEffect(() => {
    updateFormData('bachelorDegreePercentage', calculatePercentage(formData.bachelorDegreeNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.bachelorDegreeNumber]);

  useEffect(() => {
    updateFormData('bVocPercentage', calculatePercentage(formData.bVocNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.bVocNumber]);

  useEffect(() => {
    updateFormData('fourYearBachelorPercentage', calculatePercentage(formData.fourYearBachelorNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.fourYearBachelorNumber]);

  useEffect(() => {
    updateFormData('honoursWithResearchPercentage', calculatePercentage(formData.honoursWithResearchNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.honoursWithResearchNumber]);

  useEffect(() => {
    updateFormData('fiveYearIntegratedPercentage', calculatePercentage(formData.fiveYearIntegratedNumber, formData.totalPrograms));
  }, [formData.totalPrograms, formData.fiveYearIntegratedNumber]); 

  // ====================================
  // SECTION RENDERERS
  // ====================================
  
  // SECTION 0: UGC CCFUGP INFORMATION
  const renderUGCCCFUGPInformation = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">UGC CCFUGP Information</h2>
      <p className="section-description">Provide details about UGC CCFUGP alignment</p>

      <div className="form-grid">
        <div className="form-group form-group-full">
          <label className="label">Is UGC CCFUGP followed? <span className="required">*</span></label>
          <div className="radio-group">
            {['Yes', 'No'].map(option => (
              <div
                key={option}
                className={`radio-option ${formData.ugcFollowed === option ? 'selected' : ''}`}
                onClick={() => updateFormData('ugcFollowed', option)}
              >
                <input
                  type="radio"
                  name="ugc_followed"
                  value={option}
                  checked={formData.ugcFollowed === option}
                  readOnly
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>
        
        {formData.ugcFollowed === 'Yes' && (
          <>
            {renderDisabledNumberWithPercentage('Number of UG programmes aligned to UGC CCFUGP', 'ugProgramsNumber', 'ugProgramsPercentage', formData.selectedCourses)}
            {renderDropdownWithTags('Select Aligned Programmes', 'courses', courseOptions, 'selectedCourses', '-- Add a programme --', setCourseOptions)}
          </>
        )}
      </div>
    </div>
  );

  // SECTION 1: REGULATING COUNCILS & NON-ALIGNED PROGRAMS
  const renderRegulatingCouncilsAndNonAligned = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Regulating Councils & Non-Aligned Programs</h2>
      <p className="section-description">Information about regulating council alignments and non-aligned programs</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('UG programmes aligned to Regulating Councils', 'regulatingCouncilsNumber', 'regulatingCouncilsPercentage', formData.selectedRegulatingCourses)}
        {renderDropdownWithTags('Select Programs Aligned to Regulating Councils', 'regulatingCourses', regulatingCourseOptions, 'selectedRegulatingCourses', '-- Add a programme --', setRegulatingCourseOptions)}
        
        {renderDisabledNumberWithPercentage('Programmes neither CCFUGP nor Council', 'ccfugpProgramsNumber', 'ccfugpProgramsPercentage', formData.selectedCcfugpPrograms)}
        {renderDropdownWithTags('Select Non-Aligned Programs', 'ccfugpPrograms', ccfugpProgramOptions, 'selectedCcfugpPrograms', '-- Add a programme --', setCcfugpProgramOptions)}
      </div>
    </div>
  );

  // SECTION 2: BACHELOR DEGREE PROGRAMS & B.VOC PROGRAMS
  const renderBachelorAndBVocPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Bachelor Degree Programs & B.VOC Programs</h2>
      <p className="section-description">3-year bachelor degree and B.VOC program details</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('3-year bachelor Degree programmes (non-B.VOC)', 'bachelorDegreeNumber', 'bachelorDegreePercentage', formData.selectedBachelorPrograms)}
        {renderDropdownWithTags('Select Bachelor Degree Programs', 'bachelorPrograms', bachelorProgramOptions, 'selectedBachelorPrograms', '-- Add a program --', setBachelorProgramOptions)}
        
        {renderDisabledNumberWithPercentage('Number of B.VOC programmes', 'bVocNumber', 'bVocPercentage', formData.selectedBVocPrograms)}
        {renderDropdownWithTags('Select B.VOC Programs', 'bVocPrograms', bVocProgramOptions, 'selectedBVocPrograms', '-- Add a B.VOC program --', setBVocProgramOptions)}
      </div>
    </div>
  );

  // SECTION 3: 4 YEAR PROGRAMS
  const renderFourYearPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">4 Year Programs</h2>
      <p className="section-description">4-year bachelor degree and honours with research programs</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('4 Year Bachelor Degree Program', 'fourYearBachelorNumber', 'fourYearBachelorPercentage', formData.selectedFourYearBachelor)}
        {renderDropdownWithTags('Select 4-year Bachelor Programs', 'fourYearBachelor', fourYearBachelorOptions, 'selectedFourYearBachelor', '-- Add a 4-year program --', setFourYearBachelorOptions)}
        
        {renderDisabledNumberWithPercentage('4 Year Honours with Research Program', 'honoursWithResearchNumber', 'honoursWithResearchPercentage', formData.selectedHonoursWithResearch)}
        {renderDropdownWithTags('Select Honours with Research Programs', 'honoursResearch', honoursResearchOptions, 'selectedHonoursWithResearch', '-- Add a honours program --', setHonoursResearchOptions)}
      </div>
    </div>
  );

  // SECTION 4: OTHER 4 YEAR PROGRAMS
  const renderOtherFourYearPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Other 4 Year Programs</h2>
      <p className="section-description">ITEP and integrated degree programs</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">4-year ITEP programmes - Counts</label>
          <input
            type="number"
            className="input"
            value={formData.itepProgramsNumber}
            onChange={(e) => updateFormData('itepProgramsNumber', e.target.value)}
            onFocus={() => handleNumberInputFocus('itepProgramsNumber')}
            onBlur={() => handleNumberInputBlur('itepProgramsNumber')}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="label"></label>
        </div>
        {renderDropdownWithTags('ITEP Levels', 'itepLevels', itepLevelOptions, 'itepLevels', '-- Select levels --', setItepLevelOptions)}

        {renderDisabledNumberWithPercentage('4-year Integrated degree programmes (other than ITEP)', 'integratedDegreeNumber', 'integratedDegreePercentage', formData.selectedIntegratedDegree)}
        {renderDropdownWithTags('4-year Integrated degree programmes (other than ITEP) - List', 'integratedDegree', integratedDegreeOptions, 'selectedIntegratedDegree', '-- Add integrated program --', setIntegratedDegreeOptions)}

        <div className="form-group form-group-full">
          <label className="label">Ordinance allows PhD admission after 4-year Bachelor (Honours with Research)?</label>
          <div className="radio-group">
            {['Yes', 'No'].map(option => (
              <div
                key={option}
                className={`radio-option ${formData.phdAdmissionAllowed === option ? 'selected' : ''}`}
                onClick={() => updateFormData('phdAdmissionAllowed', option)}
              >
                <input
                  type="radio"
                  name="phd_admission"
                  value={option}
                  checked={formData.phdAdmissionAllowed === option}
                  readOnly
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>

        {formData.phdAdmissionAllowed === 'Yes' && (
          <div className="form-group">
            <label className="label">Students admitted to PhD with 4-year Honours (no Master's) - Number</label>
            <input
              type="number"
              className="input"
              value={formData.phdStudentsNumber}
              onChange={(e) => updateFormData('phdStudentsNumber', e.target.value)}
              onFocus={() => handleNumberInputFocus('phdStudentsNumber')}
              onBlur={() => handleNumberInputBlur('phdStudentsNumber')}
              min="0"
            />
          </div>
        )}
      </div>
    </div>
  );

  // SECTION 5: 5 YEAR PROGRAMS
  const renderFiveYearPrograms = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">5 Year Programs</h2>
      <p className="section-description">5-year integrated program information</p>

      <div className="form-grid">
        {renderDisabledNumberWithPercentage('(Not Master degree) - Counts', 'fiveYearIntegratedNumber', 'fiveYearIntegratedPercentage', formData.selectedFiveYearIntegrated)}
        {renderDropdownWithTags('5-year Integrated programmes (not Master degree) - List', 'fiveYearIntegrated', fiveYearIntegratedOptions, 'selectedFiveYearIntegrated', '-- Add 5-year program --', setFiveYearIntegratedOptions)}
      </div>
    </div>
  );

  // SECTION 6: OTHERS
  const renderOthers = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Others</h2>
      <p className="section-description">UG programmes with ordinance flexibility</p>

      <div className="form-grid">
        <div className="form-group">
          <label className="label">UG programmes with ordinance flexibility (3-yr to Single Major/Honours) - Counts</label>
          <input
            type="number"
            className="input"
            value={formData.ordinanceFlexibilityNumber}
            onChange={(e) => updateFormData('ordinanceFlexibilityNumber', e.target.value)}
            onFocus={() => handleNumberInputFocus('ordinanceFlexibilityNumber')}
            onBlur={() => handleNumberInputBlur('ordinanceFlexibilityNumber')}
            min="0"
          />
        </div>

        {renderDisabledNumberWithPercentage('UG programmes where flexibility actually provided', 'flexibilityProvidedNumber', 'flexibilityProvidedPercentage', formData.selectedFlexibilityProvided)}
        {renderDropdownWithTags('UG programmes where flexibility actually provided - List', 'flexibilityProvided', flexibilityOptions, 'selectedFlexibilityProvided', '-- Add flexibility program --', setFlexibilityOptions)}
      </div>
    </div>
  );

  // SECTION 7: REVIEW
  const renderReview = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Review</h2>
      <p className="section-description">Review all information before submission</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h4>Institution Details</h4>
          <p><strong>University:</strong> {formData.universityName || 'Not available'}</p>
          <p><strong>University ID:</strong> {formData.universityId || 'Not available'}</p>
          <p><strong>Total Programs:</strong> {formData.totalPrograms || 'N/A'}</p>
        </div>

        <div className="summary-card">
          <h4>UGC CCFUGP</h4>
          <p><strong>UGC Followed:</strong> {formData.ugcFollowed || 'Not specified'}</p>
          {formData.ugcFollowed === 'Yes' && (
            <>
              <p><strong>UG Programs:</strong> {formData.ugProgramsNumber || 0} ({formData.ugProgramsPercentage || 0}%)</p>
              <p><strong>Selected Courses:</strong> {formData.selectedCourses.length > 0 ? formData.selectedCourses.join(', ') : 'None'}</p>
            </>
          )}
        </div>

        <div className="summary-card">
          <h4>Regulating Councils</h4>
          <p><strong>Programs:</strong> {formData.regulatingCouncilsNumber || 0} ({formData.regulatingCouncilsPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedRegulatingCourses.length > 0 ? formData.selectedRegulatingCourses.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Non-Aligned Programs</h4>
          <p><strong>Programs:</strong> {formData.ccfugpProgramsNumber || 0} ({formData.ccfugpProgramsPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedCcfugpPrograms.length > 0 ? formData.selectedCcfugpPrograms.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Bachelor Degree Programs</h4>
          <p><strong>Programs:</strong> {formData.bachelorDegreeNumber || 0} ({formData.bachelorDegreePercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedBachelorPrograms.length > 0 ? formData.selectedBachelorPrograms.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>B.VOC Programs</h4>
          <p><strong>Programs:</strong> {formData.bVocNumber || 0} ({formData.bVocPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedBVocPrograms.length > 0 ? formData.selectedBVocPrograms.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>4-Year Bachelor Programs</h4>
          <p><strong>Programs:</strong> {formData.fourYearBachelorNumber || 0} ({formData.fourYearBachelorPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedFourYearBachelor.length > 0 ? formData.selectedFourYearBachelor.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Honours with Research</h4>
          <p><strong>Programs:</strong> {formData.honoursWithResearchNumber || 0} ({formData.honoursWithResearchPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedHonoursWithResearch.length > 0 ? formData.selectedHonoursWithResearch.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Other 4-Year Programs</h4>
          <p><strong>ITEP Programs:</strong> {formData.itepProgramsNumber || 0}</p>
          <p><strong>ITEP Levels:</strong> {formData.itepLevels.length > 0 ? formData.itepLevels.join(', ') : 'None'}</p>
          <p><strong>Integrated Degree:</strong> {formData.integratedDegreeNumber || 0}</p>
          <p><strong>PhD Admission Allowed:</strong> {formData.phdAdmissionAllowed || 'Not specified'}</p>
          {formData.phdAdmissionAllowed === 'Yes' && (
            <p><strong>PhD Students:</strong> {formData.phdStudentsNumber || 0}</p>
          )}
        </div>

        <div className="summary-card">
          <h4>5-Year Programs</h4>
          <p><strong>Programs:</strong> {formData.fiveYearIntegratedNumber || 0} ({formData.fiveYearIntegratedPercentage || 0}%)</p>
          <p><strong>Selected Programs:</strong> {formData.selectedFiveYearIntegrated.length > 0 ? formData.selectedFiveYearIntegrated.join(', ') : 'None'}</p>
        </div>

        <div className="summary-card">
          <h4>Flexibility Programs</h4>
          <p><strong>Ordinance Flexibility:</strong> {formData.ordinanceFlexibilityNumber || 0}</p>
          <p><strong>Actually Provided:</strong> {formData.flexibilityProvidedNumber || 0}</p>
          <p><strong>Flexibility Programs:</strong> {formData.selectedFlexibilityProvided.length > 0 ? formData.selectedFlexibilityProvided.join(', ') : 'None'}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '20px' }}>
          Please review all the information above. Click "Next" to proceed to submission.
        </p>
      </div>
    </div>
  );

  // SECTION 8: SUBMIT
  const renderSubmit = (): JSX.Element => (
    <div className="form-section">
      <h2 className="section-title">Submit</h2>
      <p className="section-description">Final submission</p>
      
      {submitted ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Form Submitted Successfully!</h3>
          <p>Thank you for your submission. Your data has been recorded.</p>
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
      case 0: return renderUGCCCFUGPInformation();
      case 1: return renderRegulatingCouncilsAndNonAligned();
      case 2: return renderBachelorAndBVocPrograms();
      case 3: return renderFourYearPrograms();
      case 4: return renderOtherFourYearPrograms();
      case 5: return renderFiveYearPrograms();
      case 6: return renderOthers();
      case 7: return renderReview();
      case 8: return renderSubmit();
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

      <Page1
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

export default CollegeProgramForm;