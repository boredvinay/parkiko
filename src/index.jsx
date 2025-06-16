// index.jsx
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as microsoftTeams from '@microsoft/teams-js';
import { loadTheme, initializeIcons } from '@fluentui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard'

initializeIcons();

const lightPalette = {
  themePrimary:       '#0078d4',
  neutralLighterAlt:  '#faf9f8',
  neutralLight:       '#f3f2f1',
  neutralQuaternaryAlt: '#e1dfdd',
  white:              '#ffffff',
  black:              '#000000',
};
const darkPalette = {
  themePrimary:       '#6cb8f6',
  neutralLighterAlt:  '#1b1a19',
  neutralLight:       '#201f1e',
  neutralQuaternaryAlt: '#292827',
  white:              '#1b1a19',
  black:              '#f3f2f1',
};

function applyFluentTheme(palette) {
  loadTheme({ palette });

  const root = document.documentElement;
  Object.entries(palette).forEach(([slot, color]) => {
    root.style.setProperty(`--${slot}`, color);
  });
}

const queryClient = new QueryClient();

function Bootstrap() {
  const [teamsUser, setTeamsUser] = useState(null);

  useEffect(() => {
    microsoftTeams.app.initialize();

    microsoftTeams.app.getContext().then((ctx) => {
      const theme = ctx.theme === 'dark' ? darkPalette : lightPalette;
      applyFluentTheme(theme);

      const email = ctx.userPrincipalName || ctx.loginHint || '';
      const name  = email.split('@')[0] || '';
      setTeamsUser({ name, email });
    });

    microsoftTeams.app.registerOnThemeChangeHandler((newTheme) => {
      applyFluentTheme(newTheme === 'dark' ? darkPalette : lightPalette);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard teamsUser={teamsUser} />
    </QueryClientProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Bootstrap />, document.getElementById('root'));
