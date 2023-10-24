import { StatusCodesResponse } from "./statusCodes";

export interface Skill {
  id: number;
  name: string;
}
export interface AllSkills extends StatusCodesResponse {
  skills: Skill[];
}

export enum Status {
  NOT_PROCESSED = 0,
  AUTHORIZED = 1,
  SUSPICIOUS = 2,
  MESSAGE_SENT = 3,
}

export interface Volunteer {
  id: number;
  name: string;
  job_title: string;
  can_help_with: string;
  whatsapp_num: string;
  email: string;
  linkedin_profile: string;
  comments: string | null;
  status: Status;
  is_student: boolean;
  skills: Skill[];
  timestamp: string;
  authorized_text: string;
}

export interface MatchingVolunteers extends StatusCodesResponse {
  volunteers: Volunteer[];
}
