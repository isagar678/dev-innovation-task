# Personal Notes & Bookmark Manager Frontend

This is the frontend for the Personal Notes & Bookmark Manager app, built with React (Vite), Tailwind CSS, and shadcn/ui.

## Features
- Minimalist UI for notes and bookmarks
- User authentication (JWT)
- Tag filtering, search, and favorites
- Responsive and accessible design

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)

### Installation
1. Clone the repository or copy the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=https://dev-innovation-task.vercel.app
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

### Common Build Errors & Fixes
If you see errors like:
```
Cannot find module 'react-router-dom' or its corresponding type declarations.
Cannot find module 'react-icons/fa' or its corresponding type declarations.
```
**Do the following:**
1. Make sure these dependencies are in your `package.json`:
   ```json
   "dependencies": {
     "react-router-dom": "^6.x.x",
     "react-icons": "^4.x.x"
   }
   ```
   If not, run:
   ```bash
   npm install react-router-dom react-icons
   ```
2. (Optional, for TypeScript):
   ```bash
   npm install -D @types/react-router-dom
   ```
3. Commit and push both `package.json` and `package-lock.json`.
4. Redeploy on Vercel.
5. If the error persists, go to the Vercel dashboard, select your project, and use "Redeploy" with "Clear build cache".

## Environment Variables
- `VITE_API_URL` — The base URL for your backend API (e.g., https://dev-innovation-task.vercel.app)

## License
MIT
