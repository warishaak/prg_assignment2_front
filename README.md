# Frontend - BrewLog - Personal Coffee Journal

## Project Overview

BrewLog is a personal coffee journal application that helps coffee enthusiasts track their coffee experiences. This web-based application allows users to log coffee drinks, rate them, and store photo memories of their coffee adventures.


## Features

1. **Coffee Drinks Tracker**
- Add new coffee drinks with names, coffee shop locations, and ratings
- View all your logged coffee drinks in a sortable table
- Edit existing drinks to update details
- Delete drinks you no longer want to track
- Sort drinks by rating to quickly find your favorites

2. **Photo Memories**
- Upload PNG photos of your coffee experiences
- Create a visual gallery of your coffee journey
- Delete photos you no longer want to keep
- All photos are securely stored in Supabase storage

3. **User-Friendly Interface**
- Clean, coffee-themed design
- Responsive layout that works on multiple devices
- Simple navigation between features

## Setup Instructions
1. Clone the repository:
   - git clone https://gitlab.booking.com/kaleemw/prg_assignment2_front.git

2. Install dependencies: Run `npm install` in your terminal to install all necessary dependencies.
2. Set up Supabase:
   - Create a .env file in the root directory with the following variables:
   ```bash
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server: Run `node server.js` in your terminal.
5. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Database Management
The project uses Supabase as the database provider:

The [companion backend app](https://sturdy-lamp-pj754qw7ggwqh6gwv.github.dev/) will be used to manage the database 

## Architecture and Implementation Details

**Backend**
- Express.js server that handles API requests and serves static files
- Supabase integration for database and storage
- RESTful API endpoints for CRUD operations on coffee drinks and photos
- Proxy architecture to securely interact with Supabase

**Frontend**
- HTML, CSS, and JavaScript implementation
- Responsive design using CSS Grid and Flexbox
- Module-based JavaScript for better code organization
- Asynchronous API calls with Fetch API

## Good Programming Practices 

**Separation of Concerns**

- Backend API handling separate from frontend views
- Modular JavaScript files for different features

**Error Handling**

- Comprehensive try/catch blocks for API calls
- User-friendly error messages
- Console logging for debugging

**Performance Optimization**

- Async/await for non-blocking operations
- Efficient DOM manipulation
- Minimalistic CSS for faster page loading

**User Experience**

- Confirmation messages for destructive actions
- Immediate feedback after user actions
- Intuitive interface with visual cues