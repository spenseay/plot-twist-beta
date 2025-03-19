# Plot Twist - Vue.js Implementation

A modern Vue.js implementation of the "Plot Twist" social game, where players place each other on a coordinate chart with randomly generated axes.

## Overview

Plot Twist is a social game where players take turns placing each other on a coordinate chart with dynamically generated axes. Players earn points based on how accurately they place others compared to where those individuals place themselves.

## Features

- Player registration and management
- Random axis generation from a large pool of options
- Turn-based gameplay with clear instructions
- Draggable pin placement on the coordinate chart
- Score calculation based on placement accuracy
- Final results visualization with filtering options

## Technology Stack

- Vue.js 3 with Composition API
- Vite build system
- GitHub Pages for deployment
- Mobile-responsive design

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/plot-twist-vue.git
cd plot-twist-vue
```

2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This will start a local development server at `http://localhost:5173/`.

### Build for Production

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment to GitHub Pages

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages whenever changes are pushed to the `main` branch.

To enable this:

1. Push your code to GitHub
2. Go to your repository settings
3. Ensure GitHub Pages is set up to deploy from the `gh-pages` branch

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` directory to GitHub Pages using your preferred method.

## Project Structure

```
plot-twist-beta/
├── .github/           
│   └── workflows/     # GitHub Actions workflows
│       └── deploy.yml # Deployment configuration
├── node_modules/      # Dependencies (created automatically)
├── public/            # Static assets (may be empty initially)
├── src/               # Source code
│   ├── components/    # Vue components
│   │   ├── AxisDisplay.vue
│   │   ├── GameBoard.vue
│   │   ├── GameSetup.vue
│   │   ├── PinComponent.vue
│   │   ├── ResultsChart.vue
│   │   └── ScoreBoard.vue
│   ├── composables/   # Reusable Vue composition functions
│   │   └── useGameState.js
│   ├── App.vue        # Root component (replace with my version)
│   └── main.js        # Application entry point (keep default)
├── .gitignore         # Git ignore file
├── index.html         # HTML entry point (keep default)
├── package.json       # Package configuration
├── vite.config.js     # Vite configuration (replace with my version)
└── README.md          # Project documentation
```

## Future Enhancements

- Integration with Firebase for persistent data storage
- Multiplayer functionality across devices
- Additional game modes and options
- Enhanced animations and transitions
- User accounts and game history

## License

This project is licensed under the MIT License.