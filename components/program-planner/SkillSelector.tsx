'use client';

import { useState, useEffect } from 'react';
import { getSkillNames, getCompetenciesForSkill, getStagesForSkill } from '@/lib/adventure-skills';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';

interface SkillSelectorProps {
  skill: string;
  level: number;
  onSkillChange: (skill: string) => void;
  onLevelChange: (level: number) => void;
}

export function SkillSelector({ skill, level, onSkillChange, onLevelChange }: SkillSelectorProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStages, setLoadingStages] = useState(!!skill); // Start as true if skill is already set
  const [competencies, setCompetencies] = useState<Array<{ statement: string; explanation: string }>>([]);
  const [availableStages, setAvailableStages] = useState<number[]>([]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const skillNames = await getSkillNames();
      setSkills(skillNames.sort());
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompetencies = async () => {
    try {
      const comps = await getCompetenciesForSkill(skill, level);
      setCompetencies(comps);
    } catch (error) {
      console.error('Failed to load competencies:', error);
    }
  };

  const loadAvailableStages = async () => {
    try {
      setLoadingStages(true);
      const stages = await getStagesForSkill(skill);
      setAvailableStages(stages);
      // Auto-select the first available stage
      if (stages.length > 0) {
        onLevelChange(stages[0]);
      }
    } catch (error) {
      console.error('Failed to load stages:', error);
      setAvailableStages([]);
    } finally {
      setLoadingStages(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (skill) {
      loadAvailableStages();
    }
  }, [skill]);

  useEffect(() => {
    if (skill && level) {
      loadCompetencies();
    }
  }, [skill, level]);

  const skillOptions = skills.map((s) => ({ value: s, label: s }));

  const levelOptions = availableStages.map((stage) => ({
    value: String(stage),
    label: `Stage ${stage}`,
  }));

  if (loading || (skill && loadingStages && availableStages.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Adventure Skill</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Select Staged Skill"
          value={skill}
          onChange={(e) => onSkillChange(e.target.value)}
          options={[
            { value: '', label: 'Select a skill...' },
            ...skillOptions
          ]}
        />

        {skill && availableStages.length > 0 ? (
          <Select
            label="Skill Stage"
            value={String(level)}
            onChange={(e) => onLevelChange(parseInt(e.target.value))}
            options={levelOptions}
          />
        ) : skill && !loadingStages ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <strong>No stages available</strong> for this skill. Please select a different skill.
            </p>
          </div>
        ) : skill ? (
          <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3">
            <Spinner size="sm" />
          </div>
        ) : (
          <Select
            label="Skill Stage"
            value=""
            onChange={() => {}}
            options={[]}
            disabled
          />
        )}
      </div>

      {competencies.length > 0 && (
        <Card variant="outlined" className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Stage {level} Competencies for {skill}
          </h4>
          <ul className="space-y-3">
            {competencies.map((competency, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{competency.statement}</p>
                  <p className="text-xs text-gray-600 mt-1">{competency.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            These competencies will be integrated into the generated program activities.
          </p>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Adventure Skills and Staged Skills are progressive competencies that scouts develop over time. Each stage builds on the previous one. The available stages vary by skill.
        </p>
      </div>
    </div>
  );
}
