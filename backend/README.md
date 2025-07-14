# Personal Notes & Bookmark Manager Backend

This is the backend API for the Personal Notes & Bookmark Manager app, built with Node.js, Express, and MongoDB.

## Features
- Save, search, update, and delete notes with tags
- Save, search, update, and delete bookmarks with URLs, titles, descriptions, and tags
- Filter and search by text or partial tag (case-insensitive, partial match)
- Mark notes and bookmarks as favorites (toggle, filter by favorite)
- URL validation for bookmarks
- (Bonus) Auto-fetch title from bookmark URL if left empty (see limitations below)

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
- `GET    /api/notes`         — List/search notes (`?q=searchTerm&tags=tag1,tag2&favorite=true`)
- `GET    /api/notes/:id`     — Get note by ID
- `PUT    /api/notes/:id`     — Update note
- `DELETE /api/notes/:id`     — Delete note
- `PATCH  /api/notes/:id/favorite` — Toggle favorite status

### Bookmarks
- `POST   /api/bookmarks`         — Create a bookmark
- `GET    /api/bookmarks`         — List/search bookmarks (`?q=searchTerm&tags=tag1,tag2&favorite=true`)
- `GET    /api/bookmarks/:id`     — Get bookmark by ID
- `PUT    /api/bookmarks/:id`     — Update bookmark
- `DELETE /api/bookmarks/:id`     — Delete bookmark
- `PATCH  /api/bookmarks/:id/favorite` — Toggle favorite status

### Auth
- `POST   /api/auth/register`     — Register user
- `POST   /api/auth/login`        — Login user (returns JWT)

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `PORT`        — Port for the server (default: 5000)
- `JWT_SECRET`  — Secret for JWT signing (optional, default: 'changeme')

## Bonus: Bookmark Title Autofetch Limitations
- If the title is left blank when creating or editing a bookmark, the backend will attempt to fetch the page title from the URL.
- **Some websites block bots or automated requests.** If the backend cannot fetch the title (e.g., due to a 403 Forbidden error), the title will be set to "Untitled". Users can manually enter a title if needed.

## License
MIT
