'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgramInput } from '@/lib/types';
import { downloadAsFile } from '@/lib/utils';

interface PromptPreviewProps {
  prompt: string;
  formData: Partial<ProgramInput>;
}

export function PromptPreview({ prompt, formData }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    if (!prompt) return;

    const section = formData.section?.toLowerCase() || 'scout';
    const focus = formData.programType === 'skill'
      ? `${formData.adventureSkill?.toLowerCase().replace(/\s+/g, '-')}-stage-${formData.skillLevel}`
      : (formData.customTheme?.toLowerCase().replace(/\s+/g, '-') || 'theme');
    const filename = `scout-prompt-${section}-${focus}-${Date.now()}.txt`;

    downloadAsFile(prompt, filename);
  };

  const wordCount = prompt.split(/\s+/).filter(Boolean).length;
  const charCount = prompt.length;

  return (
    <Card variant="elevated" className="split-view-sticky">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Generated Prompt</h2>
          <p className="text-sm text-gray-500 mt-1">
            {wordCount > 0 ? `${wordCount} words` : 'Fill in the form'} • {charCount > 0 ? `${charCount} characters` : 'to generate prompt'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!prompt}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleCopy}
            disabled={!prompt}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Prompt Content */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 max-h-[calc(100vh-300px)] overflow-y-auto">
          {prompt || 'Fill in the form to generate your prompt...\n\nThe prompt will appear here as you type, updating in real-time.\n\nOnce complete, click "Copy Prompt" to copy it to your clipboard, then paste it into your favorite AI tool (Claude, ChatGPT, etc.) to generate your scout programme.'}
        </pre>
      </div>

      {/* Preview Tags */}
      {formData.section && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">{formData.section}</Badge>
          <Badge variant="outline">{formData.programDuration} weeks</Badge>
          <Badge variant="outline">{formData.meetingDuration} min</Badge>
          <Badge variant="outline">{formData.groupSize} scouts</Badge>
          {formData.programType === 'skill' && formData.adventureSkill && (
            <Badge variant="primary">
              {formData.adventureSkill} Stage {formData.skillLevel}
            </Badge>
          )}
          {formData.programType === 'theme' && formData.customTheme && (
            <Badge variant="primary">{formData.customTheme}</Badge>
          )}
          {formData.environment && (
            <Badge variant="outline">{formData.environment}</Badge>
          )}
          {formData.includeWeekend && (
            <Badge variant="success">Weekend Activity</Badge>
          )}
        </div>
      )}

      {/* Empty State Helper */}
      {!prompt && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Fill in all required fields in the form</li>
            <li>• Choose an Adventure Skill, Activity Badge, or enter a Custom Theme</li>
            <li>• Enter your location and environment</li>
            <li>• Watch the prompt update in real-time!</li>
          </ul>
        </div>
      )}
    </Card>
  );
}
