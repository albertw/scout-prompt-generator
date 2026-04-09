'use client';

import { useState } from 'react';
import { ProgramInput, Section, Environment, Season, ProgramType } from '@/lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { SkillSelector } from './SkillSelector';
import { ActivityBadgeSelector } from './ActivityBadgeSelector';

interface ProgramFormProps {
  data: Partial<ProgramInput>;
  onChange: (data: Partial<ProgramInput>) => void;
}

const sectionOptions: Array<{ value: Section; label: string }> = [
  { value: 'Beavers', label: 'Beavers (6-8 years)' },
  { value: 'Cubs', label: 'Cubs (9-11 years)' },
  { value: 'Scouts', label: 'Scouts (12-15 years)' },
  { value: 'Ventures', label: 'Ventures (15-17 years)' },
  { value: 'Rovers', label: 'Rovers (18-25 years)' },
];

const environmentOptions: Array<{ value: Environment; label: string }> = [
  { value: 'indoor', label: 'Indoor Only' },
  { value: 'outdoor', label: 'Outdoor Only' },
  { value: 'mixed', label: 'Mixed Indoor/Outdoor' },
];

const seasonOptions: Array<{ value: Season; label: string }> = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
];

const programTypeOptions: Array<{ value: ProgramType; label: string }> = [
  { value: 'skill', label: 'Staged Skill' },
  { value: 'activity-badge', label: 'Activity Badge' },
  { value: 'theme', label: 'Custom Theme' },
];

export function ProgramForm({
  data,
  onChange,
}: ProgramFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateField = <K extends keyof ProgramInput>(field: K, value: ProgramInput[K]) => {
    onChange({ ...data, [field]: value });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Card className="border-t-4 border-t-blue-600">
      <form className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Section & Duration */}
        {currentStep === 1 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Section & Duration</h2>
            <div className="space-y-4">
              <Select
                label="Scout Section"
                value={data.section}
                onChange={(e) => updateField('section', e.target.value as Section)}
                options={sectionOptions}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                <Input
                  type="number"
                  label="Program Duration (weeks)"
                  value={data.programDuration}
                  onChange={(e) => updateField('programDuration', parseInt(e.target.value) || 6)}
                  min="1"
                  max="12"
                />

                <Input
                  type="number"
                  label="Meeting Duration (minutes)"
                  value={data.meetingDuration}
                  onChange={(e) => updateField('meetingDuration', parseInt(e.target.value) || 90)}
                  min="30"
                  max="180"
                  step="15"
                />

                <Input
                  type="number"
                  label="Group Size"
                  value={data.groupSize}
                  onChange={(e) => updateField('groupSize', parseInt(e.target.value) || 24)}
                  min="6"
                  max="50"
                />
              </div>

              <Input
                type="number"
                label="Number of Patrolsi or Bases"
                value={data.patrolCount}
                onChange={(e) => updateField('patrolCount', parseInt(e.target.value) || 4)}
                min="1"
                max="10"
              />
            </div>
          </Card>
        )}

        {/* Step 2: Program Focus */}
        {currentStep === 2 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Program Focus</h2>
            <div className="space-y-4">
              <Select
                label="Program Type"
                value={data.programType}
                onChange={(e) => updateField('programType', e.target.value as ProgramType)}
                options={programTypeOptions}
              />

              {data.programType === 'skill' ? (
                <SkillSelector
                  skill={data.adventureSkill || ''}
                  level={data.skillLevel || 1}
                  onSkillChange={(skill) => updateField('adventureSkill', skill)}
                  onLevelChange={(level) => updateField('skillLevel', level)}
                />
              ) : data.programType === 'activity-badge' ? (
                <ActivityBadgeSelector
                  badge={data.activityBadge || ''}
                  section={data.section || 'Scouts'}
                  onBadgeChange={(badge) => updateField('activityBadge', badge)}
                />
              ) : (
                <Input
                  label="Custom Theme"
                  value={data.customTheme || ''}
                  onChange={(e) => updateField('customTheme', e.target.value)}
                  placeholder="e.g., Space Exploration, Medieval Times, Environmental Conservation"
                />
              )}
            </div>
          </Card>
        )}

        {/* Step 3: Location & Context */}
        {currentStep === 3 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location & Context</h2>
            <div className="space-y-4">
              <Input
                label="Location"
                value={data.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g., Dublin, Cork City, Galway..."
                required
              />

              <Select
                label="Environment"
                value={data.environment}
                onChange={(e) => updateField('environment', e.target.value as Environment)}
                options={environmentOptions}
              />

              <Select
                label="Season (optional)"
                value={data.season || ''}
                onChange={(e) => updateField('season', e.target.value as Season)}
                options={[
                  { value: '', label: 'Select season...' },
                  ...seasonOptions,
                ]}
              />
            </div>
          </Card>
        )}

        {/* Step 4: Additional Options */}
        {currentStep === 4 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Options</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    checked={data.includeWeekend}
                    onChange={(e) => updateField('includeWeekend', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">Include Weekend Activity</span>
                    <p className="text-sm text-gray-500">
                      Add a suggested weekend camp, hike, or day-trip at the end of the program
                    </p>
                  </div>
                </label>
              </div>

              {/* Live Preview Info */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Live Preview Active!</h3>
                <p className="text-sm text-green-800">
                  Your prompt is updating in real-time as you make changes. Check the preview on the right
                  to see the generated prompt. When you're happy with it, click "Copy Prompt" to use it
                  with any AI tool.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep <= 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <div className="text-sm text-gray-600">
              <span className="text-green-600 font-medium">✓ All steps complete!</span> Adjust any
              settings above to update your prompt
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}
