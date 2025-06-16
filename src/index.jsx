import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';
import Dashboard from './components/Dashboard';
import './static/styles/custom.css';

initializeIcons();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Dashboard />);
