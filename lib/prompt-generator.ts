import { ProgramInput, ActivityRequirement } from './types';
import { getCompetenciesForSkill } from './adventure-skills';
import { getRequirementsForBadge } from './activity-badges';

export interface PromptOptions extends ProgramInput {
  includeCompetencies: boolean;
}

export async function generatePrompt(options: PromptOptions): Promise<string> {
  const sections: string[] = [];

  // Header
  sections.push(buildHeader(options));

  // Program Details
  sections.push(buildProgramDetails(options));

  // Adventure Skill Competencies (if enabled and skill-based)
  if (options.includeCompetencies && options.programType === 'skill' && options.adventureSkill && options.skillLevel) {
    const competencies = await getCompetenciesForSkill(
      options.adventureSkill,
      options.skillLevel
    );
    sections.push(buildCompetenciesSection(options.adventureSkill, options.skillLevel, competencies));
  } else if (options.programType === 'skill' && options.adventureSkill && options.skillLevel) {
    // Always include at least basic competency info when program type is skill
    const competencies = await getCompetenciesForSkill(
      options.adventureSkill,
      options.skillLevel
    );
    sections.push(buildCompetenciesSection(options.adventureSkill, options.skillLevel, competencies));
  }

  // Activity Badge Requirements (if activity-badge-based)
  if (options.programType === 'activity-badge' && options.activityBadge) {
    const requirements = await getRequirementsForBadge(options.activityBadge);
    sections.push(await buildActivityBadgeSection(options.activityBadge, requirements));
  }

  // SPICES
  sections.push(buildSpicesSection());

  // Location & Context
  sections.push(buildContextSection(options));

  // Structure Requirements
  sections.push(buildStructureRequirements(options));

  // Scout Method
  sections.push(buildScoutMethod(options));

  // Additional Requirements
  sections.push(buildAdditionalRequirements(options));

  // Output Format Instructions
  sections.push(buildOutputFormat(options));

  return sections.join('\n\n');
}

function buildHeader(options: PromptOptions): string {
  const section = options.section;
  const ageGuidance = getAgeGuidance(section);

  return `You are an experienced scout leader and programme planner for Scouting Ireland.

Design a detailed, practical scout programme based on the following parameters.

CRITICAL CONSTRAINTS:
- Activities must require minimal preparation and use common scout equipment
- All base activities must work for patrol-sized groups (~6 scouts)
- Prefer simple, adaptable activities over complex setups
- Every activity must be age-appropriate and realistically runnable in a typical meeting environment
- Assume leaders have limited time and resources - activities should be easy to understand and quick to set up
- If an activity seems too complex for the age group, simplify it while maintaining the learning objective
- All adventure skill competencies MUST be included (but depth of engagement varies by age)

AGE-APPROPRIATE DESIGN FOR ${section.toUpperCase()}:
${ageGuidance}`;
}

function getAgeGuidance(section: string): string {
  const guidance: Record<string, string> = {
    'Beavers': `- Short attention spans: Keep activities brief and engaging
- Simple instructions: Use visual demonstrations, step-by-step guidance
- Game-based learning: Focus on fun, participation, and basic exposure
- More adult guidance: Leaders should actively support and guide
- Competencies: Focus on exposure, participation, and basic understanding
- Independence: Low - Activities should be adult-led with scout participation`,

    'Cubs': `- Developing attention spans: Mix of games and focused activities
- Clear instructions: Break tasks into manageable steps
- Game-based learning with some skill development
- Balanced guidance: Leaders guide but allow increasing scout independence
- Competencies: Focus on participation and developing basic skills
- Independence: Medium - Scouts can take some ownership with leader support`,

    'Scouts': `- Good attention spans: Balance of practical skills and challenges
- Clear instructions with autonomy: Explain the 'why', allow decision-making
- Skill-focused: Mix of games for learning and practical application
- Leader as facilitator: Leaders support but scouts take lead
- Competencies: Focus on developing competence and confidence
- Independence: High - Patrols should work independently with leader oversight`,

    'Ventures': `- Mature attention: Complex projects and self-directed learning
- Minimal instructions: Provide objectives, let them figure out approach
- Challenge-focused: Real-world application and leadership opportunities
- Leader as advisor: Leaders provide guidance when requested
- Competencies: Focus on mastery and leadership/teaching others
- Independence: Very high - Ventures should self-organise and lead`,

    'Rovers': `- Adult-level attention: Self-directed, project-based learning
- Autonomous: Set their own goals and approaches
- Mastery and leadership: Focus on advanced skills and mentoring younger sections
- Leader as mentor: Provide resources and networking, not direct instruction
- Competencies: Focus on mastery and innovation
- Independence: Complete - Rovers manage their own programme`
  };

  return guidance[section] || guidance['Scouts'];
}

function buildProgramDetails(options: PromptOptions): string {
  let focus: string;

  if (options.programType === 'skill') {
    focus = `Adventure Skill: ${options.adventureSkill} Stage ${options.skillLevel}`;
  } else if (options.programType === 'activity-badge') {
    focus = `Activity Badge: ${options.activityBadge}`;
  } else {
    focus = `Theme: ${options.customTheme}`;
  }

  const ageRanges: Record<string, string> = {
    'Beavers': '6-8 years',
    'Cubs': '8-11 years',
    'Scouts': '12-15 years',
    'Ventures': '15-17 years',
    'Rovers': '18+ years',
  };

  return `PROGRAMME DETAILS:
- Section: ${options.section} (Age: ${ageRanges[options.section] || 'N/A'})
- Duration: ${options.programDuration} weeks
- Meeting length: ${options.meetingDuration} minutes
- Group size: ${options.groupSize} scouts in ${options.patrolCount} patrols

PROGRAMME FOCUS:
${focus}`;
}

function buildCompetenciesSection(
  skill: string,
  stage: number,
  competencies: Array<{ statement: string; explanation: string }>
): string {
  if (competencies.length === 0) {
    return `ADVENTURE SKILL: ${skill} - STAGE ${stage}

No specific competencies found for this skill and stage. Please focus on building foundational skills related to ${skill}.`;
  }

  return `ADVENTURE SKILL COMPETENCIES: ${skill} - STAGE ${stage}

The following Scouting Ireland competencies MUST ALL be included in the programme:

${competencies.map(c => `• ${c.statement}
   - ${c.explanation}`).join('\n\n')}

COMPETENCY REQUIREMENTS:
- ALL competencies must be meaningfully engaged with across the programme - do not skip any
- Do not overload individual meetings: Focus on a small number of competencies per session while ensuring all are covered across the programme
- Each base should focus on 1 (or at most 2) primary competencies
- Key skills should be repeated across multiple weeks using different activities to reinforce learning
- Each competency must be: Introduced → Practised → Reinforced
- Younger sections: Focus on exposure, participation, and basic understanding
- Older sections: Aim for developing competence and confidence
- Final week: Include a challenge that brings together key competencies
- Progression: Each week should build on previous competencies

Note: The depth of engagement with each competency should match the age group's developmental stage. Younger scouts participate and explore; older scouts develop competence and mastery.`;
}

async function buildActivityBadgeSection(
  badgeName: string,
  requirements: ActivityRequirement[]
): Promise<string> {
  if (requirements.length === 0) {
    return `ACTIVITY BADGE: ${badgeName}

No specific requirements found. Please focus on building skills related to ${badgeName}.`;
  }

  let section = `ACTIVITY BADGE: ${badgeName}

The following badge requirements should be integrated into the programme activities:

`;

  requirements.forEach((req) => {
    section += `${req.number}. ${req.text}\n`;
    if (req.subRequirements && req.subRequirements.length > 0) {
      req.subRequirements.forEach((sub, i) => {
        section += `   ${req.number}.${i + 1} ${sub}\n`;
      });
    }
    section += '\n';
  });

  section += `These requirements should be progressively addressed throughout the programme, with scouts building competence and confidence in each area.`;

  return section;
}

function buildSpicesSection(): string {
  return `SPICES FOCUS: social, physical, intellectual, character, emotional, spiritual

Apply SPICES naturally across the programme as a whole. Ensure a balanced spread across the weeks, but do not force them into every activity. Each activity should naturally incorporate 1-2 relevant SPICES.`;
}

function buildContextSection(options: PromptOptions): string {
  const location = options.location || 'Your Location';
  let section = `CONTEXT:
- Location: ${location}
- Environment: ${options.environment}`;

  if (options.season) {
    section += `\n- Season: ${options.season}`;
  }

  return section;
}

function buildStructureRequirements(options: PromptOptions): string {
  const section = options.section;
  const patrolGuidance = getPatrolGuidance(section);

  return `MEETING STRUCTURE (must fit within ${options.meetingDuration} minutes):
- Opening game: 10-15 minutes (energiser, sets the theme)
- 4 bases: ~15 minutes each (60 minutes total) - skill-building activities
- Closing game: 10-15 minutes (reinforce learning, fun finisher)

ENERGY BALANCE:
- Balance high-energy and low-energy activities within each meeting to maintain engagement and avoid fatigue
- Mix active bases with quieter, focused activities

PATROL SYSTEM (${section}):
${patrolGuidance}`;
}

function getPatrolGuidance(section: string): string {
  const guidance: Record<string, string> = {
    'Beavers': `- Lodges (small groups): Rotate together with adult support
- Activities: Adult-led with beaver participation
- Instructions: Visual demonstrations, step-by-step guidance
- Independence: Low - leaders actively guide and support`,

    'Cubs': `- Sixes (small groups): Can rotate with some independence
- Activities: Leader-guided with increasing cub ownership
- Instructions: Clear steps with support available
- Independence: Medium - sixers can help lead with leader oversight`,

    'Scouts': `- Patrols: Should rotate independently
- Activities: Patrol-led with leader as facilitator
- Instructions: Provide objectives, patrol leaders run the base
- Independence: High - patrols work independently, leaders available for support`,

    'Ventures': `- Patrols/teams: Self-directed rotation
- Activities: Venture-organised and run
- Instructions: Minimal - provide objectives, they figure it out
- Independence: Very high - leaders provide guidance when requested`,

    'Rovers': `- Crews: Fully autonomous
- Activities: Self-designed and managed
- Instructions: None needed - rovers set their own approach
- Independence: Complete - rovers manage their own programme`
  };

  return guidance[section] || guidance['Scouts'];
}

function buildScoutMethod(options: PromptOptions): string {
  return `PROGRESSION MODEL:
Each week must build logically on the previous one:
- Early weeks: Introduction through games and simple, fun activities
- Middle weeks: Practice and reinforce through hands-on application
- Later weeks: Apply skills in more complex scenarios
- Final week: Challenge activity that brings together key competencies

SKILL REINFORCEMENT:
- Key skills should be repeated across multiple weeks using different activities to reinforce learning
- Use varied approaches to practice the same competency (games, challenges, practical applications)
- Build confidence through repeated exposure in different contexts

The SCOUT METHOD should be incorporated throught the program:
- Law & Promise.
- Learning by Doing.
- Personal Progression.
- Symbolic Framework.
- Service and Commitment.
- Young People and Adults working together.
- Small Group System

WEATHER & ENVIRONMENT:
- Provide indoor alternatives for all outdoor activities
- Consider Irish weather patterns (rain, wind, variable temperatures)
- ${options.season ? `Season: ${options.season} - plan for typical ${options.season} conditions` : 'Current season: Consider typical weather patterns'}
- Indoor alternatives should be genuinely engaging, not afterthoughts`;
}

function buildAdditionalRequirements(options: PromptOptions): string {
  const requirements: string[] = [];

  if (options.includeWeekend) {
    requirements.push('- Include a weekend/overnight activity suggestion (camp, hike, or day-trip) - appropriate to the section age');
  }

  requirements.push('- Focus on practical, easy-to-run activities with minimal preparation');
  requirements.push('- Use common scout equipment and resources');
  requirements.push('- Avoid overly complex or unrealistic activities');
  requirements.push('- Ensure all activities are age-appropriate and safe');
  requirements.push('- Balance fun with skill development (more fun for younger sections)');
  requirements.push('- Build in flexibility for leaders to adapt to their group');
  requirements.push('- Irish context: Consider typical Irish scout facilities and environments');
  requirements.push('- Simplification guidance: If an activity seems too complex for the age group, simplify it while maintaining the learning objective');

  return `ADDITIONAL REQUIREMENTS:\n${requirements.join('\n')}`;
}

function buildOutputFormat(options: PromptOptions): string {
  let format = `GENERATION RULE (STRICT ENFORCEMENT):
- You MUST generate ALL ${options.programDuration} weeks in FULL detail in a SINGLE response
- You are NOT allowed to summarise, compress, or skip any week
- You are NOT allowed to use placeholders such as: "same as above", "similar to previous week", "as before", "full detail continues", or any equivalent
- You MUST continue writing until all ${options.programDuration} weeks are complete
- Partial answers are NOT allowed

- Each week MUST contain:
  - Opening game (fully detailed with step-by-step instructions)
  - 4 bases (each fully detailed)
  - Closing game (fully detailed)

- EVERY activity MUST include:
  - Minimum 4 numbered steps in instructions
  - Materials list
  - Duration
  - SPICES
  - Safety notes
  - Indoor alternative

- If ANY activity is missing these, the response is invalid

PROHIBITED OUTPUT:
The following will result in an incorrect answer:
- Any shortened week (Weeks 2–${options.programDuration} must match Week 1 detail level)
- Any use of placeholders or summaries
- Any activity without full instructions
- Any reference to "see above" or similar wording

If any of the above occur, regenerate that section in full detail.

WRITING STYLE:
- Write as if giving instructions to a new leader with no prior experience
- Use clear, practical, no-fluff language
- Avoid vague descriptions — be explicit and actionable

REAL-WORLD EXECUTION TEST:
Before output, ensure:
- Each activity can be set up in under 5 minutes by a leader
- Uses only common scout equipment
- Works with patrol-sized groups without chaos
- Instructions are simple enough for an inexperienced leader

If not, simplify the activity.

OUTPUT FORMAT:

For each week provide:

**Week [N]: [Theme]**

*Objectives:*
- [List 2-3 learning objectives - age-appropriate and achievable]

*Opening Game:*
- Name: [Game name - fun and age-appropriate]
- Description: [Brief description]
- Rules/Instructions: [Numbered step-by-step instructions - minimum 4 clear steps, detailed enough to run without prior knowledge]
- Materials: [List of common scout materials]
- Duration: [Time in minutes - 10-15 mins]
- SPICES: [1-2 relevant SPICES - pick what naturally fits]
- Indoor alternative: [Engaging alternative for bad weather]

*Bases:* (4 bases, ~15 minutes each, designed for patrol-sized groups)
Each base should focus on 1 (or at most 2) primary competencies

*Base 1: [Activity Name]*
- Description: [What scouts will do - clear and concise]
- Instructions: [Numbered step-by-step instructions - minimum 4 clear steps, detailed enough to run without prior knowledge]
- Materials: [List of common scout materials]
- Duration: [Time in minutes]
- Learning Outcomes: [What scouts will learn - realistic for age group]
- Primary Competency: [Which 1-2 competencies this base primarily addresses]
- SPICES: [1-2 relevant SPICES - don't force, pick what naturally fits]
- Difficulty: [beginner/intermediate/advanced - appropriate to week]
- Safety Notes: [Any safety considerations - keep practical]
- Indoor alternative: [Engaging alternative for bad weather]

[Repeat for Bases 2-4]

*Closing Game:*
- Name: [Game name - reinforces learning, fun finish]
- Description: [Brief description]
- Rules/Instructions: [Numbered step-by-step instructions - minimum 4 clear steps, detailed enough to run without prior knowledge]
- Materials: [List of common scout materials]
- Duration: [Time in minutes - 10-15 mins]
- SPICES: [1-2 relevant SPICES - pick what naturally fits]
- Indoor alternative: [Engaging alternative for bad weather]

*Weekly Summary:*
- Competencies addressed: [List the specific competencies worked on this week - a focused subset, not all]
- Materials needed: [Combined list - common scout equipment]
- Progression: [How this week builds on previous learning]
- Notes for leaders: [Practical tips, flexibility, adaptations]`;

  if (options.includeWeekend) {
    format += `

**Weekend Activity:**
- Activity name: [Age-appropriate weekend activity]
- Type: [camp/hike/day-trip/overnight - appropriate to section]
- Description: [Brief description]
- Suggested locations: [1-2 realistic locations for ${options.location} area]
- Preparation: [What needs to be prepared - keep manageable]
- Requirements: [Equipment, permissions, training - realistic for section]
- Competencies: [Which competencies this activity addresses]
- Age-appropriate considerations: [Specific to ${options.section}]`;
  }

  format += `

**Programme Progression Summary:**
Provide a final summary showing:
- How competencies are introduced, practised, and reinforced through the programme
- Age-appropriate expectations and milestones for ${options.section}
- How each week builds on previous learning
- How the final challenge brings together key competencies
- Practical notes for leaders: Flexibility, adaptations, Irish context

---

SELF-VALIDATION (MANDATORY BEFORE OUTPUT):
You MUST check:
1. Are all ${options.programDuration} weeks present and fully detailed?
2. Does every game and base include at least 4 instruction steps?
3. Does every activity include ALL required fields?
4. Are later weeks as detailed as Week 1?
5. Can a leader run every activity WITHOUT prior knowledge?

If ANY answer is "No", you MUST fix the response before output.`;

  return format;
}

export function isValidFormData(data: Partial<ProgramInput>): boolean {
  return !!(
    data.section &&
    data.programDuration &&
    data.meetingDuration &&
    data.groupSize &&
    data.patrolCount &&
    data.programType &&
    data.location &&
    data.environment &&
    ((data.programType === 'skill' && data.adventureSkill && data.skillLevel) ||
      (data.programType === 'activity-badge' && data.activityBadge) ||
      (data.programType === 'theme' && data.customTheme))
  );
}
