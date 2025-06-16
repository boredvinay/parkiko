import React from 'react';
import ParkingSlot from '../ParkingSlot/ParkingSlot';
import './ParkingMap.css';

export default function ParkingMap({
  slots,
  onSelect,
  minCellWidth = 80,
}) {
  return (
    <div
      className="parking-grid"
      style={{
        /* 
         * auto-fit columns no smaller than minCellWidth,
         * and ensure each row is at least minCellWidth tall
         */
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCellWidth}px, 1fr))`,
        gridAutoRows:        `${minCellWidth}px`,
      }}
    >
      {slots.map((slot) => (
        <ParkingSlot
          key={slot.id}
          slot={slot}
          onClick={() => onSelect(slot)}
        />
      ))}
    </div>
  );
}