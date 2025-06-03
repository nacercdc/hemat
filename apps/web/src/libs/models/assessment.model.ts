//Temporary dummy User interface
export interface User {
  firstName: string;
  lastName: string;
}

//Temporary dummy Country interface
export interface Country {
  name: string;
}

//Temporary dummy Status type
export type StatusType =
  | "Draft"
  | "Pending"
  | "Closed"
  | "Ready"
  | "In-Progress"
  | "Completed";

//Temporary dummy Assessment interface
export interface Assessment {
  id: number;
  name: string;
  createdBy: User;
  startDate: string;
  endDate: string;
  country: Country;
  status: StatusType;
  createdAt: string;
}
