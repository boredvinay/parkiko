import React from 'react';
import {
  Stack,
  Image,
  Text,
  Persona,
  PersonaSize
} from '@fluentui/react';
import './Header.css';

import logoImg from '../static/logo.png';

export default function Header({ title, user }) {
  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      tokens={{ padding: '0 16px' }}
      className="app-header"
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Image
          src={logoImg}
          alt="App logo"
          width={32}
          height={32}
          styles={{ root: { borderRadius: 4 } }}
        />
        <Text variant="xLargePlus" nowrap>
          {title}
        </Text>
      </Stack>

      {/* Right: User Persona */}
      {user && (
        <Persona
          imageUrl={user.avatarUrl}
          text={user.name}
          secondaryText={user.email}
          size={PersonaSize.size40}
        />
      )}
    </Stack>
  );
}