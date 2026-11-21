# S3 Fitness Gym Bhopal website

A responsive static marketing website built with HTML, CSS, vanilla JavaScript, Bootstrap 5, GSAP and Three.js. Bootstrap, GSAP, Three.js and the Google Fonts are loaded from CDNs, so an internet connection is needed for the complete visual experience.

## Run locally
Serve this folder with a local static server so the Three.js ES module and import map load correctly:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Before publishing
- Confirm the address, phone number and weekly timings with the gym.
- Confirm which days the Zumba sessions run; the supplied poster lists morning and evening times but no days.
- Confirm current membership plans before publishing any pricing or plan details.
- The hero gym tour uses `assets/gym-tour.mp4` with muted looping playback and controls; `assets/Gym video.MOV` is an alternate, larger source video.
- Replace the social preview image if the client supplies a preferred campaign image.
- Connect the domain and publish the folder to Vercel, Netlify or any static host.

WhatsApp enquiries currently open a prefilled message to the supplied phone number. No membership pricing, testimonials or unverified performance claims have been invented.
