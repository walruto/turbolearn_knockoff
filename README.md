# Turbo Learn AI - AI-Powered Learning Platform

A modern, responsive replica of the Turbo Learn AI website built with Next.js, TypeScript, and Tailwind CSS. This project features a complete learning platform with AI integration, user authentication, and interactive components.

![Turbo Learn AI]([https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop](https://www.clickvieweducation.com/blog/teaching-strategies/good-study-habits))

## Features

- Modern Landing Page - Hero, features, courses, testimonials, and CTA sections
- AI-Powered Learning - Integration with OpenAI for intelligent tutoring
- User Authentication - Complete auth system with Clerk
- Responsive Design - Mobile-first, works on all devices
- Dark/Light Theme - Toggle between themes with next-themes
- Interactive Components - Built with Radix UI and shadcn/ui
- Smooth Animations - Framer Motion for engaging transitions
- Performance Optimized - Built with Next.js 15 and Turbopack

## Tech Stack

- Framework: [Next.js 15](https://nextjs.org/) with App Router
- Language: [TypeScript](https://www.typescriptlang.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Components: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Authentication: [Clerk](https://clerk.com/)
- AI Integration: [OpenAI API](https://platform.openai.com/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- Icons: [Lucide React](https://lucide.dev/)
- Build Tool: [Turbopack](https://turbo.build/pack)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd turbo-learn
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your keys:
   - Get Clerk keys from [clerk.com](https://clerk.com/)
   - Get OpenAI API key from [platform.openai.com](https://platform.openai.com/)

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open your browser
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── sections/          # Page sections
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── courses.tsx
│   │   ├── testimonials.tsx
│   │   └── cta.tsx
│   ├── providers/         # Context providers
│   │   └── theme-provider.tsx
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       └── card.tsx
└── lib/
    └── utils.ts          # Utility functions
```

## Design System

The project uses a custom design system built on top of Tailwind CSS:

- Colors: CSS custom properties for theme support
- Typography: Inter font with responsive sizing
- Spacing: Consistent spacing scale
- Components: Reusable UI components with variants
- Animations: Smooth transitions and micro-interactions

## Authentication

User authentication is handled by Clerk, providing:
- Sign up/Sign in modals
- User profile management
- Protected routes
- Social login options
- Session management

## AI Features

The platform includes AI-powered features:
- Interactive AI tutor
- Personalized learning paths
- Intelligent feedback system
- Course recommendations
- Progress tracking

## Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## Performance

- Next.js 15 with App Router for optimal performance
- Turbopack for fast development builds
- Image optimization with Next.js Image component
- Code splitting for efficient loading
- SEO optimization with metadata API

## Deployment

The project is ready to deploy to various platforms:

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder
3. Set up environment variables

### Docker
```bash
docker build -t turbo-learn .
docker run -p 3000:3000 turbo-learn
```

## 📄 Environment Variables

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Turbo Learn AI](https://turbolearn.ai) for design inspiration
- [shadcn/ui](https://ui.shadcn.com/) for component library
- [Lucide](https://lucide.dev/) for beautiful icons
- [Unsplash](https://unsplash.com/) for stock images

---

**Built with ❤️ by [Your Name]**
