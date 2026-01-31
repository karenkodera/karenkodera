# Karen Kodera Portfolio Clone

A React-based clone of Karen Kodera's portfolio website with custom cursor, animations, and modern UI.

## Features

- **Custom Cursor**: Animated cursor that responds to hover states
- **Smooth Animations**: Framer Motion powered animations throughout
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Pages**: Home, Play, and About sections
- **Interactive Elements**: Hover effects, highlighted text, project cards
- **AI Chat Simulation**: Simulated chat interface on the About page

## Tech Stack

- React 18
- Vite
- Framer Motion
- React Router DOM

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── CustomCursor.jsx    # Custom cursor component
│   ├── Header.jsx          # Navigation header
│   ├── Hero.jsx            # Hero section with animations
│   ├── ProjectCard.jsx     # Project card component
│   └── Footer.jsx          # Footer component
├── pages/
│   ├── Home.jsx            # Home page with projects
│   ├── Play.jsx            # Play/hobbies page
│   └── About.jsx           # About page with AI chat
├── App.jsx                 # Main app with routing
├── App.css                 # Global styles
└── main.jsx                # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
