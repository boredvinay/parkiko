// index.jsx
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as microsoftTeams from '@microsoft/teams-js';
import { loadTheme, initializeIcons } from '@fluentui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard'

// 1) Preload the Fluent UI icons
initializeIcons();

// 2) Define your light + dark theme palettes
const lightPalette = {
  themePrimary: '#0078d4',
  neutralLighterAlt: '#faf9f8',
  white: '#ffffff',
  black: '#000000',
  /* …override any other slots you need… */
};
const darkPalette = {
  themePrimary: '#6cb8f6',
  neutralLighterAlt: '#1b1a19',
  white: '#1b1a19',
  black: '#f3f2f1',
  /* …override neutrals so text shows on dark… */
};

// 3) Function to apply theme by name
function applyTeamsTheme(themeName) {
  if (themeName === 'dark') {
    loadTheme({ palette: darkPalette });
  } else {
    // default & contrast both can use light base
    loadTheme({ palette: lightPalette });
  }
}

// 4) Initialize React under QueryClientProvider
const queryClient = new QueryClient();

function Bootstrap() {
  useEffect(() => {
    microsoftTeams.app.initialize();

    // on first load pick up the current theme
    microsoftTeams.app.getContext().then((ctx) => {
      applyTeamsTheme(ctx.theme);
    });

    // register a handler for runtime theme changes
    microsoftTeams.app.registerOnThemeChangeHandler((newTheme) => {
      applyTeamsTheme(newTheme);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Bootstrap />, document.getElementById('root'));
