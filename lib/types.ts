// Core type definitions for Scout Program Planner

export type Section = 'Beavers' | 'Cubs' | 'Scouts' | 'Ventures' | 'Rovers';
export type Environment = 'indoor' | 'outdoor' | 'mixed';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ProgramType = 'skill' | 'theme' | 'activity-badge';
export type MeetingStructure = 'game-bases-game' | 'custom';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type WeekendType = 'hike' | 'camp' | 'day-trip' | 'overnight';

export interface ProgramInput {
  // Basic Parameters
  section: Section;
  programDuration: number;
  meetingDuration: number;
  groupSize: number;
  patrolCount: number;

  // Program Type: Skill, Theme, or Activity Badge
  programType: ProgramType;
  adventureSkill?: string;      // For 'skill' type
  skillLevel?: number;          // For 'skill' type
  customTheme?: string;         // For 'theme' type
  activityBadge?: string;       // For 'activity-badge' type

  // Meeting Structure
  meetingStructure: MeetingStructure;

  // Location & Context
  location: string;
  environment: Environment;
  season?: Season;

  // Additional Options
  includeWeekend: boolean;
  scoutMethod: string;
}

export interface AdventureSkill {
  name: string;
  preface: string;
  stages: AdventureStage[];
}

export interface AdventureStage {
  stageNumber: number;
  competencies: Competency[];
}

export interface Competency {
  statement: string;
  explanation: string;
}

export interface ActivityBadge {
  name: string;
  description: string;
  section: Section;  // Which section this badge is for
  requirements: ActivityRequirement[];
}

export interface ActivityRequirement {
  number: number;      // Requirement number (1, 2, 3, etc.)
  title: string;       // Short title (optional)
  text: string;        // Full requirement text
  subRequirements?: string[];  // Sub-requirements like 1.1, 1.2, etc.
}
