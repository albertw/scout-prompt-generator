import { AdventureSkill } from './types';

let skillsCache: AdventureSkill[] | null = null;

export async function loadAdventureSkills(): Promise<AdventureSkill[]> {
  if (skillsCache !== null) {
    return skillsCache;
  }

  try {
    const response = await fetch('/data/adventure-skills.json');
    if (!response.ok) {
      throw new Error('Failed to load adventure skills data');
    }
    const data = await response.json();
    skillsCache = data.skills || [];
    return skillsCache!;
  } catch (error) {
    console.error('Error loading adventure skills:', error);
    return [];
  }
}

export async function getSkillNames(): Promise<string[]> {
  const skills = await loadAdventureSkills();
  return skills.map(skill => skill.name);
}

export async function getSkillByName(name: string): Promise<AdventureSkill | undefined> {
  const skills = await loadAdventureSkills();
  return skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
}

export async function getCompetenciesForSkill(
  skillName: string,
  stage: number
): Promise<Array<{ statement: string; explanation: string }>> {
  const skill = await getSkillByName(skillName);
  if (!skill) return [];

  const stageData = skill.stages.find(s => s.stageNumber === stage);
  if (!stageData) return [];

  return stageData.competencies.map(c => ({
    statement: c.statement,
    explanation: c.explanation
  }));
}

export async function getStagesForSkill(skillName: string): Promise<number[]> {
  const skill = await getSkillByName(skillName);
  if (!skill || !skill.stages || skill.stages.length === 0) return [];

  return skill.stages
    .map(s => s.stageNumber)
    .sort((a, b) => a - b);
}
