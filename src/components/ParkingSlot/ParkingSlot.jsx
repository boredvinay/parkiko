import React from 'react';
import { TooltipHost, FontIcon } from '@fluentui/react';
import './ParkingSlot.css';

export default function ParkingSlot({ slot, onClick }) {
  const { id, status } = slot;

  return (
    <TooltipHost content={`Slot ${id} — ${status}`} calloutProps={{ gapSpace: 8 }}>
      <div className={`parking-slot ${status}`} onClick={onClick}>
        <FontIcon iconName="Car" aria-hidden="true" />
        <span className="slot-number">{id}</span>
      </div>
    </TooltipHost>
  );
}