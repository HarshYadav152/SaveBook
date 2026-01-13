# OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for SaveBook.

## GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `SaveBook` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**

### Step 2: Get Your Credentials

1. After creating the app, you'll see your **Client ID**
2. Click **"Generate a new client secret"** to get your **Client Secret**
3. Copy both values - you'll need them for the next step

### Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the GitHub OAuth variables in `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   ```

3. Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
   
4. Add the generated secret to `.env.local`:
   ```env
   NEXTAUTH_SECRET=your_generated_secret_here
   ```

### Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click the **"Sign in with GitHub"** button
4. You should be redirected to GitHub for authorization
5. After authorization, you'll be redirected back to `/notes`

## Production Setup

For production deployment, update the URLs in your GitHub OAuth app:

- **Homepage URL**: `https://yourdomain.com`
- **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`

And update your environment variables:
```env
NEXTAUTH_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect_uri"**: Make sure your callback URL in GitHub matches exactly with your NextAuth configuration
2. **"Client ID not found"**: Verify your `GITHUB_CLIENT_ID` is correct
3. **"Bad verification code"**: Check your `GITHUB_CLIENT_SECRET` is correct and hasn't expired

### Debug Mode

To enable debug logging, add to your `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

This will show detailed logs in your console to help troubleshoot issues.