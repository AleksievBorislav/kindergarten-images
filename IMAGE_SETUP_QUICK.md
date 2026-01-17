# 📸 Setting Up Your Images Repository

Your website is now configured to use images from a separate GitHub repository. Here's how to complete the setup:

## Step 1: Create Images Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `kindergarten-images`
3. **Description**: "Images for kindergarten website"
4. Choose **Public** (required for raw GitHub URLs to work)
5. Click "Create repository"

## Step 2: Add Images Locally

1. Copy your image files into these folders:
   - `assets/gallery/` - for gallery photos (e.g., `playground.jpg`, `art-activity.jpg`, `celebration.jpg`, `learning.jpg`)
   - `assets/staff/` - for staff photos (e.g., `maria-ivanova.jpg`, `petya-petrova.jpg`, `sofia-stancheva.jpg`)

2. Make sure filenames match the ones in your JSON files!

## Step 3: Push Images to GitHub

```bash
cd c:\Users\Borislav\vscode site\assets

git init
git add .
git commit -m "Add kindergarten images"
git remote add origin https://github.com/AleksievBorislav/kindergarten-images.git
git branch -M main
git push -u origin main
```

## Step 4: Verify It Works

1. Go to: https://github.com/AleksievBorislav/kindergarten-images
2. Check if your images appear in the repository
3. Test your website - images should now load!

## 📝 Updating Images

To add or replace images:

1. Add/replace files in `assets/gallery/` or `assets/staff/`
2. Run:
   ```bash
   cd c:\Users\Borislav\vscode site\assets
   git add .
   git commit -m "Update images"
   git push
   ```

## 🔗 Current Image URL Format

All JSON files are already configured with this format:
```
https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/[FOLDER]/[FILENAME]
```

For example:
- `https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/gallery/playground.jpg`
- `https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/staff/maria-ivanova.jpg`

## 📋 Current Image References in JSON

### Gallery Images (`data/gallery.json`)
- `playground.jpg`
- `art-activity.jpg`
- `celebration.jpg`
- `learning.jpg`

### Staff Photos (`data/staff.json`)
- `maria-ivanova.jpg`
- `petya-petrova.jpg`
- `sofia-stancheva.jpg`

---

**Once you push images to the repository, they'll appear on your website automatically!**
