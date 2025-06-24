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
  phoneNumber: string;
  country: string;
  jobTitle: string;
}

export interface UpdateProfile {
  title?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  country?: string;
  jobTitle?: string;
}
