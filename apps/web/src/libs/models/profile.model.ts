export enum GenderEnum {
  MALE = "Male",
  FEMALE = "Female",
}

export interface Profile {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  dateOfBirth: string;
  country: string;
  jobTitle: string;
}
