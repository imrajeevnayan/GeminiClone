# Gemini Clone

A beautiful, production-ready chat interface that integrates with Google's Gemini API.

## Features

- 🎯 Modern chat interface inspired by Google Gemini
- 💬 Real-time responses from Gemini API
- 📚 Persistent conversation history
- 🎨 Beautiful, responsive design
- 🔒 Secure API key management via environment variables

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Get your Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the API key

5. Add your API key to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Security

- API keys are stored securely in environment variables
- No sensitive data is stored in localStorage
- Environment variables are prefixed with `VITE_` for Vite compatibility

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons
- Google Gemini API for AI responses

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```