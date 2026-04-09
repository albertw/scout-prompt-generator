'use client';

import { useState, useEffect } from 'react';
import { ProgramForm } from '@/components/program-planner/ProgramForm';
import { PromptPreview } from '@/components/program-planner/PromptPreview';
import { ProgramInput } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generatePrompt, PromptOptions } from '@/lib/prompt-generator';

const defaultFormData: Partial<ProgramInput> = {
  section: 'Scouts',
  programDuration: 6,
  meetingDuration: 90,
  groupSize: 24,
  patrolCount: 4,
  programType: 'skill',
  adventureSkill: '',
  skillLevel: undefined,
  customTheme: '',
  activityBadge: '',
  meetingStructure: 'game-bases-game',
  location: '',
  environment: 'mixed',
  season: undefined,
  includeWeekend: true,
  scoutMethod: 'balanced',
};

// Move validation function outside component to prevent recreation on every render
const isValidFormData = (data: Partial<ProgramInput>): boolean => {
  return !!(
    data.section &&
    data.programDuration &&
    data.meetingDuration &&
    data.groupSize &&
    data.patrolCount &&
    data.programType &&
    data.environment &&
    ((data.programType === 'skill' && data.adventureSkill && data.skillLevel) ||
      (data.programType === 'activity-badge' && data.activityBadge) ||
      (data.programType === 'theme' && data.customTheme))
  );
};

export default function Home() {
  const [formData, setFormData] = useState<Partial<ProgramInput>>(defaultFormData);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  // Update prompt whenever form data changes (debounced)
  useEffect(() => {
    // Generate the prompt
    const updatePrompt = async () => {
      const isValid = isValidFormData(formData);

      if (isValid) {
        try {
          const prompt = await generatePrompt({
            ...formData,
            includeCompetencies: true,
          } as PromptOptions);
          setGeneratedPrompt(prompt);
        } catch (error) {
          console.error('Error generating prompt:', error);
        }
      } else {
        setGeneratedPrompt('');
      }
    };

    // Set up debounce
    const timeoutId = setTimeout(() => {
      updatePrompt();
    }, 300);

    // Cleanup function to clear timeout on unmount or dependency change
    return () => clearTimeout(timeoutId);
  }, [formData]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Scout Prompt Generator
            </h1>
            <p className="text-lg text-gray-600">
              Create detailed scout programme prompts in seconds. Fill in the form below to generate a customized prompt
              that you can use with any AI tool (Claude, ChatGPT, etc.) to create engaging scout programs.
            </p>
            <br></br>

            <p className="text-lg text-gray-600"> We have included the Scouting Ireland Adventure Skills, The Radio Scouting Ireland Skills Program, and selected UK Scouts Staged and Activity badges. You can also specify a custom theme for you program. Please let us know if you would like more included.</p>
              <p className="text-lg text-gray-600">
              <br></br><b>Note:</b> AI tools can (often!) get things wrong so you will likely need to review the output and ask the AI for clarification. But hopefully this will get you off to a good start!
            </p>
                      </div>


          {/* Split View Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="split-view-sticky self-start">
              <ProgramForm
                data={formData}
                onChange={setFormData}
              />
            </div>

            {/* Right: Live Preview */}
            <div>
              <PromptPreview
                prompt={generatedPrompt}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
