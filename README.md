# README
Welcome to our coding assessment!

This code is a basic prototype to be used as a starting point.

## Getting Started
0. You should have node / npm and yarn installed already
1. Install dependencies with `yarn install`
2. Start development server with `yarn start`

## Overview
* `./src/index.js` in the main entry point to the App
* `./src/components/Call.js` is where most of the logic for the video call lives. This handles joining the call, setting your status, and displaying statuses for other users on the call.
* `./src/utils/room.js` is what return your Daily.co room (see below). You shouldn't need to touch this file
* `./src/utils/firebase.js` contains shared logic for firebase, including your unique slug (see below)
* `./src/utils/daily.js` contains a few helper functions for interacting with Daily.co

### Daily.co
This code makes use of the [daily-js library](https://docs.daily.co/reference/daily-js)  to handle the low level details of the video call. The current prototype uses the prebuilt Iframe for the bulk of the UI. Daily.co will recognize multiple tabs as the same user, so the easiest way to join as multiple participants is to open a second private tab or use a different browser. You could also use the [addFakeParticipant](https://docs.daily.co/reference/daily-js/instance-methods/add-fake-participant) function.  Note that the Iframe doesn't always interact well with hot-reloading - you may need to refresh the page for the call to work properly after editing the code.

To make it easier for you to dive in, we've created several rooms for your usage so you don't have to register yourself on Daily.co.  You will be assigned a room the first time you start the app.  If you find you have a collision and are sharing a room with another applicant, you can delete the first line (`const ROOM_IDX = ...`) from `./src/utils/room.js` and start the app again.

### Firebase Realtime Database
This code use a [Firebase Realtime Database (RTDB)](https://firebase.google.com/docs/database/web/start) to sync statuses in real time across participants in the video call. We have already configured the app to point to our own RTDB for simplicity.  
The first time you run the app you will be assigned a random slug. You can delete the first line in (`export const slug = ...`) from `./src/utils/firebase.js` and start the app again to reset it. The RTDB stores everything in a tree structure, you should nest all your storage under your slug (you can use the `firebaseSlugBase` function in `./src/utils/firebase.js` for this). If you find that you've corrupted the data under your slug, you can wipe it with [set](https://firebase.google.com/docs/database/web/read-and-write#write_data) (e.g. `set(firebaseSlugBase(), {})`). 


## Next Steps
Work on implementing the user stories outlined in the challenge:
- In addition to their status, users should be able to save a list of to-do items
- Users should be able to mark tasks on their to-do list as "done"
- Users should be able to edit or delete items on the to-do list
- To-do lists should be synced across all users in real time

When you are finished, add your discussion to `response.md`

Create a zip file of this directory (excluding `node_modules` if possible) and submit!  We'll review and get back to you within 2-3 business days.