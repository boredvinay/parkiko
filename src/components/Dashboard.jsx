import React from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

export default function Dashboard() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Parking Status</h1>
      <Pivot>
        <PivotItem headerText="Free" itemKey="free">
          {/* TODO: list free spots */}
        </PivotItem>
        <PivotItem headerText="Occupied" itemKey="occupied">
          {/* TODO: list occupied spots */}
        </PivotItem>
        <PivotItem headerText="Reserved" itemKey="reserved">
          {/* TODO: list reserved spots */}
        </PivotItem>
      </Pivot>
    </div>
  );
}
