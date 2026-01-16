# Building the Dist Branch Locally

The GitHub Actions workflow has been disabled because GitHub Actions are disabling `yt-dlp` because it thinks its a bot. This README outlines how to build the `dist` branch locally.

## Full Build (All Years)

```bash
# Run the full workflow with Firefox authentication
./bin/_workflow-local.sh --browser firefox
```

## Build Specific Year

```bash
# Just 2025 with authentication
./bin/_workflow-local.sh --year 2025 --browser firefox

# Just 2024 with authentication
./bin/_workflow-local.sh --year 2024 --browser firefox
```

## Deploy to Dist Branch

After building locally, deploy to the `dist` branch:

```bash
# Make sure you're on the main branch
git checkout main

# Create or switch to dist branch
git checkout -b dist

# Add the built files
git add -f ./data ./dist

# Commit the changes
git commit -m "Update data files for 2025"

# Force push to dist branch (overwrites previous dist)
git push origin dist --force

# Switch back to main
git checkout main
```

## Requirements

- **Firefox** logged into YouTube with access to the private videos
- **yt-dlp** updated to latest version (2025.12.08 or later)
- **Node.js** v19.8.1 or later
- **jq** for JSON processing

## Troubleshooting

If you get authentication errors:
- Make sure you're logged into YouTube in Firefox
- Try clearing your Firefox cookies and logging in again
- Verify the videos are accessible when you visit them in Firefox

If subtitles fail to download:
- Check if auto-captions are enabled on the videos
- YouTube may take time to generate captions for new videos
