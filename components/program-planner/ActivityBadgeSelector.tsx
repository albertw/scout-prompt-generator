'use client';

import { useState, useEffect } from 'react';
import { getBadgeNames, getRequirementsForBadge } from '@/lib/activity-badges';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { ActivityRequirement } from '@/lib/types';

interface ActivityBadgeSelectorProps {
  badge: string;
  section: string;  // Current selected section
  onBadgeChange: (badge: string) => void;
}

export function ActivityBadgeSelector({ badge, section, onBadgeChange }: ActivityBadgeSelectorProps) {
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [requirements, setRequirements] = useState<ActivityRequirement[]>([]);

  useEffect(() => {
    loadBadges();
  }, [section]);

  useEffect(() => {
    if (badge) {
      loadRequirements();
    } else {
      setRequirements([]);
    }
  }, [badge]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const badgeNames = await getBadgeNames(section);
      setBadges(badgeNames);
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = async () => {
    if (!badge) return;
    try {
      setLoadingRequirements(true);
      const reqs = await getRequirementsForBadge(badge);
      setRequirements(reqs);
    } catch (error) {
      console.error('Failed to load requirements:', error);
    } finally {
      setLoadingRequirements(false);
    }
  };

  const badgeOptions = badges.map((b) => ({ value: b, label: b }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Activity Badge</h3>

      <Select
        label="Select Activity Badge"
        value={badge}
        onChange={(e) => onBadgeChange(e.target.value)}
        options={[
          { value: '', label: 'Select a badge...' },
          ...badgeOptions
        ]}
      />

      {badges.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>No activity badges available</strong> for the {section} section. Try selecting a different section or program type.
          </p>
        </div>
      )}

      {requirements.length > 0 && (
        <Card variant="outlined" className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Badge Requirements</h4>
          <ul className="space-y-3">
            {requirements.map((req) => (
              <li key={req.number}>
                <p className="text-sm font-medium text-gray-900">{req.number}. {req.text}</p>
                {req.title && (
                  <p className="text-xs text-gray-600 mt-1 italic">{req.title}</p>
                )}
                {req.subRequirements && req.subRequirements.length > 0 && (
                  <ul className="ml-6 mt-2 text-xs text-gray-600 space-y-1">
                    {req.subRequirements.map((sub, i) => (
                      <li key={i}>{req.number}.{i + 1} {sub}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            These requirements will be integrated into the generated program activities.
          </p>
        </Card>
      )}

      {badge && loadingRequirements && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-600">Loading requirements...</p>
        </div>
      )}

      <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
        <p className="text-sm text-purple-800">
          <strong>Note:</strong> Activity Badges are from UK Scouts and have specific requirements that must be completed to earn the badge. Unlike Staged Skills, these badges don't have progressive stages.
        </p>
      </div>
    </div>
  );
}
