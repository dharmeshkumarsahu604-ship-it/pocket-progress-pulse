# Geo-Smart Deployment Guide

## Overview
Geo-Smart is a Progressive Web App (PWA) built with React, TypeScript, and Supabase, designed for geological field work with offline capabilities.

## Prerequisites
- Node.js 18+ or Bun
- Supabase account with project configured
- Environment variables configured

## Environment Variables
Ensure these are set in your deployment environment:
```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

## Deployment Steps

### 1. Build the Application
```bash
npm run build
# or
bun run build
```

### 2. Deploy to Lovable
Click the "Publish" button in the Lovable editor to deploy your app to production.

### 3. Configure Supabase Settings
After deployment, configure these settings in your Supabase dashboard:

#### Authentication Settings
- Enable leaked password protection: https://supabase.com/dashboard/project/{project_id}/auth/policies
- Configure site URL and redirect URLs with your production domain
- Set up email templates for authentication

#### Security Settings
- Review and enable Row Level Security (RLS) on all tables
- Verify edge function permissions
- Configure CORS settings for production domain

#### Performance Settings
- Enable connection pooling for better database performance
- Configure caching headers in storage buckets
- Review and optimize database indexes

## Post-Deployment Checklist

### Security
- ✅ All tables have RLS policies enabled
- ✅ Leaked password protection enabled
- ✅ Edge functions have proper authentication
- ✅ CORS configured for production domain
- ✅ API keys secured and not exposed

### Performance
- ✅ Images optimized and compressed
- ✅ Code splitting implemented
- ✅ Service worker caching configured
- ✅ Database queries optimized
- ✅ CDN configured for static assets

### PWA Features
- ✅ Manifest.json configured
- ✅ App icons (192x192, 512x512) added
- ✅ Service worker registered
- ✅ Offline mode tested
- ✅ Install prompt working

### Monitoring
- ✅ Error logging configured
- ✅ Performance monitoring enabled
- ✅ Database backup scheduled
- ✅ Edge function logs reviewed

## Testing Checklist

### Functionality Tests
- [ ] User registration and login
- [ ] Rock/mineral database browsing
- [ ] AI specimen identification
- [ ] Voice notes recording and transcription
- [ ] Field notes creation and editing
- [ ] Geological sites exploration
- [ ] AI chat assistance
- [ ] Profile management

### Cross-Device Tests
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Tablet devices

### Performance Tests
- [ ] Page load time < 3s
- [ ] Time to Interactive < 5s
- [ ] Lighthouse score > 90
- [ ] Image loading optimized
- [ ] API response time < 1s

### Security Tests
- [ ] XSS prevention verified
- [ ] SQL injection prevented
- [ ] CSRF protection enabled
- [ ] Rate limiting working
- [ ] Input validation functional

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Verify all environment variables

**Authentication Issues**
- Verify Supabase URL configuration
- Check redirect URLs in auth settings
- Ensure RLS policies are correct

**PWA Installation Issues**
- Verify manifest.json is accessible
- Check service worker registration
- Ensure HTTPS is enabled

**Performance Issues**
- Review bundle size and code splitting
- Check database query performance
- Verify image optimization
- Review caching strategy

## Support
For issues or questions:
- Check logs in Supabase dashboard
- Review edge function logs
- Contact support at support@lovable.dev

## Additional Resources
- [Lovable Documentation](https://docs.lovable.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
