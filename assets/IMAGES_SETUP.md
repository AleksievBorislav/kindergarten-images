# Setup GitHub Images Repository

Follow these steps to create and use your images repository:

## 1. Create a New GitHub Repository for Images

1. Go to https://github.com/new
2. Repository name: `kindergarten-images`
3. Description: "Images for kindergarten website"
4. Choose **Public** (needed for raw GitHub URLs)
5. Click "Create repository"

## 2. Initialize Local Images Folder

```bash
cd c:\Users\Borislav\vscode site\assets
git init
git add .
git commit -m "Initial images"
```

## 3. Connect to GitHub and Push

```bash
git remote add origin https://github.com/AleksievBorislav/kindergarten-images.git
git branch -M main
git push -u origin main
```

## 4. Add Your Images

1. Place image files in:
   - `gallery/` - for gallery photos
   - `staff/` - for staff photos

2. Commit and push:
   ```bash
   git add .
   git commit -m "Add images"
   git push
   ```

## 5. Use Images in Main Website

The JSON files in the main website are already configured to use GitHub raw URLs:

```json
{
  "url": "https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/gallery/image-name.jpg"
}
```

Just replace `image-name.jpg` with your actual filename.

## Image URL Format

```
https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/[FOLDER]/[FILENAME]
```

- `[FOLDER]` = `gallery` or `staff`
- `[FILENAME]` = your image filename (e.g., `playground.jpg`)

## Example URLs

```
Gallery: https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/gallery/playground.jpg
Staff:   https://raw.githubusercontent.com/AleksievBorislav/kindergarten-images/main/staff/teacher-1.jpg
```

---

After setting up the images repo, update the JSON files in `data/` folder with your image URLs!
