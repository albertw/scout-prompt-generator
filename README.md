# Scout Prompt Generator

Generate detailed scout programme prompts for AI tools like Claude, ChatGPT, and others.

## Features

- **Staged Skills**: Support for Scouting Ireland adventure skills with progressive stages
- **Activity Badges**: UK Scouts activity badges with detailed requirements
- **Custom Themes**: Create programmes around any theme
- **Multi-Section Support**: Beavers, Cubs, Scouts, Ventures, and Rovers
- **Live Preview**: See your prompt update in real-time as you build it
- **One-Click Copy**: Copy the generated prompt to use with any AI tool

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/scout-prompt-generator.git
cd scout-prompt-generator

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the generator.

### Build for Production

```bash
npm run build
npm run start
```

## How It Works

1. Fill in the form with your programme requirements
2. Select an Adventure Skill, Activity Badge, or Custom Theme
3. Set location and environment preferences
4. Copy the generated prompt
5. Paste it into Claude, ChatGPT, or your preferred AI tool
6. Get a detailed scout programme tailored to your needs

## Data Structure

- **Adventure Skills**: Located in `public/data/adventure-skills.json`
- **Activity Badges**: Located in `public/data/activity-badges.json`

Add new badges or skills by updating these JSON files.

## Contributing

Contributions welcome! Feel free to:
- Add new activity badges
- Improve prompt generation logic
- Enhance the UI/UX
- Fix bugs


## Acknowledgements

Built for the Scouting Ireland community, but applicable to scout groups worldwide.
Content for skills from Scouting Ireland, UK Scouts and Radio Scouting Ireland Documentation.

