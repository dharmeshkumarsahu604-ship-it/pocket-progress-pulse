# Geo-Smart - Geological Field Companion

An AI-powered Progressive Web App (PWA) for geological field work, rock and mineral identification, and field documentation.

## 🌟 Features

### Core Capabilities
- 🪨 **Rock & Mineral Databases**: Comprehensive databases with detailed specimen information
- 🤖 **AI Identification**: Advanced AI-powered specimen identification using camera or gallery images
- 🎤 **Voice Notes**: Multi-language voice recording with automatic transcription
- 📝 **Field Documentation**: Rich field notes with GPS location, photos, and weather data
- 🗺️ **Geological Sites**: Database of geological sites with navigation integration
- 💬 **AI Chat Assistant**: Expert geological guidance and Q&A
- 👤 **User Profiles**: Personal collections and usage statistics

### Technical Features
- ⚡ Progressive Web App (PWA) with offline capabilities
- 📱 Responsive design optimized for field use
- 🔒 Secure authentication and data protection
- 🎨 Beautiful geological-themed UI
- 🚀 Optimized performance with lazy loading and code splitting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite with PWA plugin
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
- **AI**: Lovable AI Gateway (Google Gemini 2.5 Flash)
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Radix UI, shadcn/ui

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd geo-smart
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Set up environment variables**
Create a `.env` file with:
```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

4. **Run the development server**
```bash
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chat/           # Chat interface components
│   ├── fieldnotes/     # Field notes components
│   ├── layout/         # Layout components (header, navigation)
│   ├── minerals/       # Mineral display components
│   ├── rocks/          # Rock display components
│   ├── scanner/        # AI scanner interface components
│   ├── shared/         # Shared utility components
│   ├── sites/          # Geological sites components
│   ├── ui/             # Base UI components (shadcn)
│   └── voice/          # Voice recording components
├── contexts/           # React context providers (Auth)
├── data/              # Mock data for testing
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations (Supabase)
├── lib/               # Utility functions
├── pages/             # Page components (routes)
└── main.tsx           # Application entry point

supabase/
├── functions/         # Edge functions
│   ├── geological-chat/      # AI chat endpoint
│   ├── identify-specimen/    # AI specimen identification
│   └── transcribe-audio/     # Voice transcription
└── migrations/        # Database migrations
```

## 🔑 Key Features Implementation

### AI Integration
The app uses Lovable AI Gateway for:
- **Specimen Identification**: Vision API analyzes images to identify rocks and minerals
- **Chat Assistant**: Conversational AI provides expert geological guidance
- **Voice Transcription**: Speech-to-text converts field observations to text

All AI features include proper error handling for rate limits and service availability.

### Security Implementation
- ✅ Row Level Security (RLS) on all database tables
- ✅ Input validation and sanitization using Zod schemas
- ✅ Secure authentication with Supabase Auth
- ✅ Protected API endpoints with JWT verification
- ✅ XSS prevention with HTML sanitization

### Performance Optimizations
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Compression and lazy loading utilities
- **Service Worker**: PWA caching for offline functionality
- **Query Optimization**: React Query with smart caching
- **Bundle Splitting**: Vendor chunks for better caching

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server (port 8080)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Management
Database changes are managed through Supabase migrations in `supabase/migrations/`. All tables have proper RLS policies and indexes.

### Edge Functions
Backend logic is implemented as Supabase Edge Functions:
- `geological-chat` - Streaming AI chat responses
- `identify-specimen` - AI-powered specimen identification
- `transcribe-audio` - Voice note transcription

## 🚢 Deployment

### Quick Deploy with Lovable
1. Open [Lovable Project](https://lovable.dev/projects/f7e89c8a-0b36-4051-b4a9-f98c220070e0)
2. Click "Publish" button
3. Configure custom domain (optional)

### Post-Deployment Configuration
After deploying, configure these Supabase settings:

1. **Authentication**
   - Enable leaked password protection
   - Set site URL and redirect URLs
   - Configure email templates

2. **Security**
   - Verify RLS policies are enabled
   - Review edge function permissions
   - Configure CORS for production domain

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📱 PWA Features

The app is installable as a Progressive Web App with:
- Offline support for core features
- Background sync for data updates
- Push notifications (optional)
- App-like experience on mobile devices

## 🔒 Security Best Practices

- Never expose API keys in client-side code
- Always validate user input on both client and server
- Use prepared statements for database queries
- Implement proper error handling without exposing sensitive data
- Keep dependencies updated

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Lovable Documentation](https://docs.lovable.dev) - Platform documentation
- [Supabase Documentation](https://supabase.com/docs) - Backend documentation

## 🤝 Contributing

This project follows the PRD (Product Requirements Document) in the custom knowledge base. Key principles:
- Maintain geological theme and earth-tone color palette
- Follow semantic token design system (no hardcoded colors)
- Prioritize mobile-first responsive design
- Ensure offline functionality for field use
- Maintain security best practices

## 📄 License

This project is proprietary and confidential.

## 💬 Support

For issues or questions:
- Review edge function logs in Supabase dashboard
- Check browser console for client-side errors
- Contact support at support@lovable.dev

## 🙏 Acknowledgments

Built with [Lovable](https://lovable.dev) - AI-powered app development platform.
