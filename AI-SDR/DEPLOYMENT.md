# Deployment Guide for Jazon AI SDR

This guide will help you deploy the Jazon AI SDR application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account or MongoDB connection string
- Lyzr AI API credentials

## Environment Variables

Before deploying, you need to set up the following environment variables in your Vercel project settings:

### Required Variables

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - Get this from MongoDB Atlas or your MongoDB provider

2. **LYZR_API_KEY**
   - Your Lyzr AI API key
   - Contact Lyzr support to obtain this
   - Format: `sk-xxxxxxxxxxxxx`

3. **LYZR_USER_ID**
   - Your email address associated with Lyzr account
   - Example: `your.email@company.com`

### Optional Variables (defaults provided)

4. **OUTREACH_STRATEGY_AGENT_ID**
   - Default: `69453743f6d93e181164e4d0`
   - Custom strategy agent ID if you have one

5. **OUTREACH_COPY_AGENT_ID**
   - Default: `6948162d2be72f04a7d64f65`
   - Custom copy agent ID if you have one

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   cd AI-SDR
   vercel
   ```

4. Follow the prompts to complete deployment

5. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add LYZR_API_KEY
   vercel env add LYZR_USER_ID
   ```

6. Redeploy to apply environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)

2. Import your Git repository (GitHub, GitLab, or Bitbucket)

3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `AI-SDR`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add each required variable from the list above
   - Make sure to add them for Production, Preview, and Development

5. Click "Deploy"

## Post-Deployment

### Verify Deployment

1. Visit your deployed URL
2. Check that the homepage shows the Outreach Campaigns page
3. Verify the sidebar navigation works correctly
4. Test database connectivity by checking if campaigns load

### Common Issues

#### Build Fails
- Check that all environment variables are set correctly
- Verify MongoDB URI is accessible from Vercel's servers
- Review build logs in Vercel dashboard

#### Database Connection Issues
- Ensure MongoDB allows connections from Vercel's IP addresses
- In MongoDB Atlas, add `0.0.0.0/0` to IP whitelist (or Vercel's IPs)
- Verify connection string is correct

#### API Errors
- Check Lyzr API key is valid
- Verify agent IDs are correct
- Review function logs in Vercel dashboard

## Build Verification

To verify the build locally before deploying:

```bash
npm run build
```

The build should complete successfully with no TypeScript errors.

## Production Optimization

The application is pre-configured with:
- ✅ Next.js 16 with Turbopack
- ✅ Static page generation where possible
- ✅ Optimized API routes
- ✅ Server-side rendering for dynamic content
- ✅ TypeScript strict mode
- ✅ ESLint configuration

## Monitoring

After deployment, monitor your application:
- Use Vercel Analytics for performance metrics
- Check function logs for API errors
- Monitor MongoDB Atlas for database performance

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Contact Lyzr support for API-related issues

## Update Deployment

To deploy updates:
1. Push changes to your Git repository
2. Vercel will automatically deploy (if auto-deploy is enabled)
3. Or manually redeploy via CLI: `vercel --prod`

