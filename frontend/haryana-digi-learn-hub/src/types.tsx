// types.ts
export interface FormData {
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

export interface Section {
  id: number;
  title: string;
  description: string;
  fields: string[];
}

export interface FormErrors {
  [key: string]: string;
}
