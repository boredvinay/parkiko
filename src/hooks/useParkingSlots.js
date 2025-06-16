import { useQueries } from '@tanstack/react-query';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export function useParkingSlots() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['occupied'],
        queryFn: () => fetchJson('/api/spaces/occupied'),
      },
      {
        queryKey: ['reserved'],
        queryFn: () => fetchJson('/api/spaces/reserved'),
      },
      {
        queryKey: ['available'],
        queryFn: () => fetchJson('/api/spaces/available'),
      },
    ],
  });

  const isLoading = results.some(r => r.isLoading);
  const isError   = results.some(r => r.isError);
  const error     = results.find(r => r.error)?.error;

  if (isLoading) return { isLoading, isError: false, slots: [] };
  if (isError)   return { isLoading: false, isError: true, error };

  const [occupiedData, reservedData, availableData] = results.map(r => r.data);

  // build maps for quick lookup
  const occMap = Object.fromEntries(
    occupiedData.map(o => [o.space_number, o.current_vehicle_plate])
  );
  const resMap = Object.fromEntries(
    reservedData.map(r => [r.space_number, r.current_vehicle_plate])
  );

  // union of all space numbers
  const allNumbers = new Set([
    ...availableData.map(a => a.space_number),
    ...occupiedData.map(o => o.space_number),
    ...reservedData.map(r => r.space_number),
  ]);

  const slots = Array.from(allNumbers)
    .sort((a, b) => a - b)
    .map(num => {
      let status = 'free';
      let plate  = null;
      if (occMap[num] != null) {
        status = 'occupied';
        plate  = occMap[num];
      } else if (resMap[num] != null) {
        status = 'reserved';
        plate  = resMap[num];
      }
      return {
        id: num,
        status,
        current_vehicle_plate: plate,
      };
    });

  return { isLoading: false, isError: false, slots };
}