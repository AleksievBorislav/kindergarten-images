# Final Step: Update GitHub OAuth Callback URL

## What I've Done

✅ Updated `admin/config.yml` with your OAuth server URL  
✅ OAuth server is running at: `https://kindergarten-cms-oauth.onrender.com`

## Last Step: Update GitHub OAuth App

You need to update the callback URL in your GitHub OAuth App:

1. Go to: https://github.com/settings/developers
2. Click on your OAuth App (the one with Client ID: `Ov23li1EHScyVPjCcxx9`)
3. Update **Authorization callback URL** to:
   ```
   https://kindergarten-cms-oauth.onrender.com/callback
   ```
4. Click **"Update application"**

## Test Your CMS

Once you've updated the callback URL:

1. **Commit and push** your changes to GitHub:
   ```bash
   git add admin/config.yml
   git commit -m "Configure Decap CMS with OAuth"
   git push
   ```

2. **Wait** for GitHub Pages to rebuild (1-2 minutes)

3. **Access the CMS** at:
   ```
   https://aleksievborislav.github.io/kindergarten-images/admin/
   ```

4. **Click "Login with GitHub"**

5. **Authorize** the app when prompted

6. **Start editing** your content! 🎉

## What You Can Edit

- **Галерия** - Gallery media and categories
- **Персонал** - Staff members
- **Събития** - Events (for both calendar and events page)
- **Статии** - Home page articles
- **FAQ** - Frequently asked questions
- **Отзиви** - Testimonials

All changes will be automatically committed to your GitHub repository!
