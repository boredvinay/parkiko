import React, { useEffect, useState } from 'react';
import {
  Spinner,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  Modal,
  Persona,
  PersonaSize,
  ChoiceGroup
} from '@fluentui/react';
import * as microsoftTeams from '@microsoft/teams-js';

import Header from './Header';
import ParkingMap from './ParkingMap/ParkingMap';
import { useParkingSlots } from '../hooks/useParkingSlots';

const FILTER_OPTIONS = [
  { key: 'all',      text: 'All Spots' },
  { key: 'free',     text: 'Free' },
  { key: 'occupied', text: 'Occupied' },
  { key: 'reserved', text: 'Reserved' },
];

export default function Dashboard({ user }) {
  const { isLoading, isError, error, slots } = useParkingSlots();
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);

  if (isLoading) return <Spinner label="Loading parking data…" />;
  if (isError)
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        {error.message}
      </MessageBar>
    );

  const filtered = slots.filter(s => filter === 'all' || s.status === filter);

  return (
    <Stack tokens={{ padding: 0 }}>
      <Header
        title="Parkiko"
        user={user}
      />

      <Stack tokens={{ padding: 16, childrenGap: 20 }}>
        <ChoiceGroup
          options={FILTER_OPTIONS}
          selectedKey={filter}
          onChange={(_, o) => setFilter(o.key)}
          labelHidden={true}
          styles={{
            root: { margin: 0, padding: 0, background: 'transparent' },
             flexContainer: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
          }}
        />

        {/* stats bar */}
        <Text>
          Total: <b>{slots.length}</b> &nbsp;|&nbsp;
          Free: <b>{slots.filter(s => s.status==='free').length}</b> &nbsp;|&nbsp;
          Occ: <b>{slots.filter(s => s.status==='occupied').length}</b> &nbsp;|&nbsp;
          Res: <b>{slots.filter(s => s.status==='reserved').length}</b>
        </Text>

        {/* capped-width grid */}
        <ParkingMap
          slots={filtered}
          minCellWidth={90}
          onSelect={setDetail}
        />

        {/* detail modal */}
        <Modal
          isOpen={!!detail}
          onDismiss={() => setDetail(null)}
          isBlocking={false}
        >
          {detail && (
            <Stack tokens={{ padding: 24, childrenGap: 12 }}>
              <Text variant="large">Slot {detail.id}</Text>
              {detail.status === 'free' ? (
                <Text>This spot is free.</Text>
              ) : (
                <>
                  <Persona
                    text={detail.current_vehicle_plate}
                    secondaryText={`Status: ${detail.status}`}
                    size={PersonaSize.size40}
                  />
                  <Text><b>Plate:</b> {detail.current_vehicle_plate}</Text>
                </>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Stack>
  );
}
