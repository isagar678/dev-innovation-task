# Personal Notes & Bookmark Manager Backend

This is the backend API for the Personal Notes & Bookmark Manager app, built with Node.js, Express, and MongoDB.

## Features
- Save, search, update, and delete notes with tags
- Save, search, update, and delete bookmarks with URLs, titles, descriptions, and tags
- Filter and search by text or tags
- URL validation for bookmarks
- (Bonus) Auto-fetch title from bookmark URL if left empty

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or cloud)

### Installation
1. Clone the repository or copy the backend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notes_bookmarks_db
   PORT=5000
   ```
4. Start the server:
   ```bash
   node app.js
   ```

## API Endpoints

### Notes
- `POST   /api/notes`         — Create a note
- `GET    /api/notes`         — List/search notes (`?q=searchTerm&tags=tag1,tag2`)
- `GET    /api/notes/:id`     — Get note by ID
- `PUT    /api/notes/:id`     — Update note
- `DELETE /api/notes/:id`     — Delete note

### Bookmarks
- `POST   /api/bookmarks`         — Create a bookmark
- `GET    /api/bookmarks`         — List/search bookmarks (`?q=searchTerm&tags=tag1,tag2`)
- `GET    /api/bookmarks/:id`     — Get bookmark by ID
- `PUT    /api/bookmarks/:id`     — Update bookmark
- `DELETE /api/bookmarks/:id`     — Delete bookmark

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `PORT`        — Port for the server (default: 5000)

## License
MIT 