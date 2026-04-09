import { ActivityBadge, ActivityRequirement } from './types';

let badgesCache: ActivityBadge[] | null = null;

export async function loadActivityBadges(): Promise<ActivityBadge[]> {
  if (badgesCache !== null) {
    return badgesCache;
  }

  try {
    const response = await fetch('/data/activity-badges.json');
    if (!response.ok) {
      throw new Error(`Failed to load activity badges data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    badgesCache = data.badges || [];
    return badgesCache!;
  } catch (error) {
    console.error('Error loading activity badges:', error);
    return [];
  }
}

export async function getBadgeNames(section?: string): Promise<string[]> {
  const badges = await loadActivityBadges();
  return badges
    .filter(badge => !section || badge.section === section)
    .map(badge => badge.name)
    .sort();
}

export async function getBadgeByName(name: string): Promise<ActivityBadge | undefined> {
  const badges = await loadActivityBadges();
  return badges.find(badge => badge.name.toLowerCase() === name.toLowerCase());
}

export async function getRequirementsForBadge(badgeName: string): Promise<ActivityRequirement[]> {
  const badge = await getBadgeByName(badgeName);
  return badge?.requirements || [];
}
