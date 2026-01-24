# Decap CMS Setup Instructions

## What I've Done

I've integrated Decap CMS (formerly Netlify CMS) into your kindergarten website. The CMS is now accessible at `/admin/` and configured to use GitHub authentication.

### Files Created/Modified

1. **`admin/index.html`** - The CMS admin interface
2. **`admin/config.yml`** - CMS configuration with all collections

### Collections Configured

All your content is now editable through the CMS:
- **Галерия** (Gallery) - Media items with categories
- **Персонал** (Staff) - Staff members
- **Събития** (Events) - Events for both calendar and events page
- **Статии** (Articles) - Home page articles
- **Често задавани въпроси** (FAQ) - Frequently asked questions
- **Отзиви** (Testimonials) - Parent testimonials

## Next Steps: GitHub OAuth Setup

To enable authentication, you need to create a GitHub OAuth App:

### 1. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `Kindergarten CMS`
   - **Homepage URL**: `https://aleksievborislav.github.io/kindergarten-images/`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Update config.yml

Open `admin/config.yml` and update the backend section:

```yaml
backend:
  name: github
  repo: AleksievBorislav/kindergarten-images
  branch: main
  base_url: https://api.netlify.com # Use Netlify's OAuth service
  auth_endpoint: auth
```

**OR** if you want to use a different OAuth provider, you can set up your own OAuth server.

### 3. Alternative: Test Locally (No Auth)

For testing without authentication, you can use the test backend:

```yaml
backend:
  name: test-repo
```

This allows you to test the CMS interface without GitHub authentication, but changes won't be saved.

### 4. Using the CMS

Once authentication is set up:

1. Navigate to `https://aleksievborislav.github.io/kindergarten-images/admin/`
2. Click "Login with GitHub"
3. Authorize the OAuth app
4. Start editing your content!

All changes will be committed directly to your GitHub repository and will appear on the live site immediately (or after GitHub Pages rebuilds).

## Important Notes

- **Editorial Workflow**: The CMS is configured with editorial workflow, which means changes go through a draft → review → publish flow
- **Media Files**: Images/videos uploaded through the CMS will be stored in the `gallery/` folder
- **JSON Format**: All collections edit the existing JSON files in the `data/` folder
- **Automatic Sync**: Changes made through the CMS are automatically committed to GitHub

## Troubleshooting

If you encounter issues:
1. Check that the repository name in `config.yml` matches your GitHub repo
2. Verify the OAuth app callback URL is correct
3. Make sure you're using the correct branch name (main vs master)
4. Check browser console for any errors
