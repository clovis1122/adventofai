# Day 5: gesture tracker

## Instructions
Build a gesture-controlled flight tracker showing real airplane arrivals, controlled entirely by hand movements.

Tools to use: MediaPipe, Flight API (use OpenSky's /states/all endpoint)

Webapp:
* Create a simple index.html using HTML, CSS and JS.
* Use https://corsproxy.io/ for CORS.
* Show the user's camera, using MediaPipe to track movement. Open Hand = select the previous flight, Closed hand / fist = select the next flight.
* By default, show the top 5 flights in new york state. Allow searching for flights, too.
