# Fix: Update ORIGINS Environment Variable

## The Problem

The OAuth server expects the origin in a specific format: **without** `https://` or `http://`

## The Fix

In your Render dashboard:

1. Go to **Environment** tab
2. Find the `ORIGINS` variable
3. Change the value from:
   ```
   https://aleksievborislav.github.io
   ```
   
   To (remove the `https://`):
   ```
   aleksievborislav.github.io
   ```

4. Click **"Save Changes"**

The service will automatically redeploy and should work this time!

## All Environment Variables Should Be:

| Key | Value |
|-----|-------|
| `OAUTH_CLIENT_ID` | `Ov23li1EHScyVPjCcxx9` |
| `OAUTH_CLIENT_SECRET` | `eb8826d833defa4d8691dd424245adaef338ed3a` |
| `ORIGINS` | `aleksievborislav.github.io` |

## After It Deploys Successfully

You'll see a message like "Your service is live 🎉" and you'll get a URL like:
```
https://kindergarten-cms-oauth.onrender.com
```

Share that URL with me and I'll update your config.yml!
