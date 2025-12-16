# Day 11: Photo Booth

## Instructions

Build a festive photo booth web app that lets Winter Festival visitors take selfies with fun face filters. Visitors will open the app on their phones, see themselves with real-time filters (snowflake crowns, reindeer antlers, frosty beards), capture the perfect shot, and download it to share.

Core Functionality:
- Web app with camera access
- Real-time face detection
- Three festive filters that users can switch between (snowflake crowns, reindeer antlers, frosty beards).
- Photo capture and download
- Mobile-friendly design
- This will all be output in a single HTML file, using JS and CSS as needed.

Tools to use:
- Face Detection: face-api.js or MediaPipe Face Mesh.
- Camera Access: `navigator.mediaDevices.getUserMedia()`
- Filters: Canvas API and overlays
- Download: Canvas `.toDataURL()` + download link
