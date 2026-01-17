<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Turbo Learn AI - Project Instructions

This is a Next.js application that replicates the Turbo Learn AI website with the following features:

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Clerk for user management
- **AI Integration**: OpenAI API for AI-powered features
- **Components**: Radix UI components with shadcn/ui styling
- **Animations**: Framer Motion for smooth transitions

## Key Features
- Modern landing page with hero, features, courses, testimonials, and CTA sections
- Dark/light theme support with next-themes
- Responsive design for all devices
- AI-powered learning platform concept
- User authentication and dashboard
- Interactive UI components
- Performance optimized with Turbopack

## Development Guidelines
- Use TypeScript for all components and utilities
- Follow the existing component structure and naming conventions
- Implement responsive design principles
- Use Tailwind CSS for styling with custom CSS variables
- Integrate with Clerk for authentication features
- Ensure accessibility best practices
- Use Framer Motion for animations and transitions

## File Structure
- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable components
- `/src/lib` - Utility functions and configurations
- `/src/styles` - Global styles and CSS

## Environment Variables
Required environment variables are listed in `.env.example`. Make sure to set up Clerk authentication and OpenAI API keys for full functionality.
