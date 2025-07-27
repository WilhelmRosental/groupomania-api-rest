# Images Upload Directory

This directory stores uploaded images from posts.

## Structure
- All uploaded images are stored here with unique filenames
- Format: `image-{timestamp}-{random}.{extension}`

## Security
- Only image files are allowed (MIME type check)
- Maximum file size: 5MB
- Files are stored with sanitized names