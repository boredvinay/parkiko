import React, { useEffect, useState } from 'react';
import { Pivot, PivotItem } from '@fluentui/react';
import { Spinner } from '@fluentui/react/lib/Spinner';

export default function Dashboard() {
  const [free, setFree] = useState([]);
  const [occupied, setOccupied] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [freeRes, occRes, resRes] = await Promise.all([
          fetch('/api/spaces/available'),
          fetch('/api/spaces/occupied'),
          fetch('/api/spaces/reserved'),
        ]);

        if (!freeRes.ok || !occRes.ok || !resRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [freeData, occData, resData] = await Promise.all([
          freeRes.json(),
          occRes.json(),
          resRes.json(),
        ]);

        setFree(freeData);
        setOccupied(occData);
        setReserved(resData);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Spinner label="Loading parking data..." />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Parking Status</h1>
      <Pivot>
        <PivotItem headerText="Free" itemKey="free">
          {free.length ? (
            <ul>
              {free.map((space) => (
                <li key={space.space_number}>{space.space_number}</li>
              ))}
            </ul>
          ) : (
            <div>No free spots</div>
          )}
        </PivotItem>
        <PivotItem headerText="Occupied" itemKey="occupied">
          {occupied.length ? (
            <ul>
              {occupied.map((space) => (
                <li key={space.space_number}>
                  {space.space_number} - {space.current_vehicle_plate}
                </li>
              ))}
            </ul>
          ) : (
            <div>No occupied spots</div>
          )}
        </PivotItem>
        <PivotItem headerText="Reserved" itemKey="reserved">
          {reserved.length ? (
            <ul>
              {reserved.map((space) => (
                <li key={space.space_number}>
                  {space.space_number} - {space.current_vehicle_plate}
                </li>
              ))}
            </ul>
          ) : (
            <div>No reserved spots</div>
          )}
        </PivotItem>
      </Pivot>
    </div>
  );
}
