# Deployment Guide

This guide covers different deployment options for the Weather Agent Chat application.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Next.js and configure the build
6. Click "Deploy"

### Environment Variables (if needed):
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_THREAD_ID=your_thread_id
```

## Netlify

### Steps:
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `out` folder (if using static export)
4. Or connect your GitHub repository

### Build Command:
```bash
npm run build
```

### Publish Directory:
```
out
```

## Railway

### Steps:
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project from GitHub
4. Select your repository
5. Railway will automatically detect Next.js

## Manual Deployment

### Build for Production:
```bash
npm run build
npm run start
```

### Static Export (if needed):
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

Then build:
```bash
npm run build
```

## Environment Setup

### Development:
```bash
npm install
npm run dev
```

### Production:
```bash
npm install --production
npm run build
npm run start
```

## Performance Tips

1. **Enable compression** in your hosting provider
2. **Use CDN** for static assets
3. **Set up caching** for API responses
4. **Monitor performance** with tools like Lighthouse

## Troubleshooting

### Build Issues:
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild
- Check for TypeScript errors

### Runtime Issues:
- Verify API endpoint is accessible
- Check environment variables
- Monitor browser console for errors

## Security Considerations

1. **API Keys**: Never commit API keys to the repository
2. **Environment Variables**: Use proper environment variable management
3. **CORS**: Configure CORS settings if needed
4. **Rate Limiting**: Implement rate limiting for API calls

## Monitoring

Consider setting up:
- **Error tracking** (Sentry, LogRocket)
- **Analytics** (Google Analytics, Mixpanel)
- **Performance monitoring** (Web Vitals)
- **Uptime monitoring** (UptimeRobot, Pingdom)
