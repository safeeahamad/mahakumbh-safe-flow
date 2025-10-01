import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CrowdPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  density: 'high' | 'medium' | 'low';
  count: number;
  capacity: number;
}

const crowdPoints: CrowdPoint[] = [
  {
    id: '1',
    name: 'Mahakaleshwar Temple',
    lat: 23.1828,
    lon: 75.7681,
    density: 'high',
    count: 15920,
    capacity: 20000,
  },
  {
    id: '2',
    name: 'Main Entrance Gate 1',
    lat: 23.1850,
    lon: 75.7670,
    density: 'high',
    count: 12340,
    capacity: 15000,
  },
  {
    id: '3',
    name: 'Food Court',
    lat: 23.1810,
    lon: 75.7695,
    density: 'medium',
    count: 3210,
    capacity: 5000,
  },
  {
    id: '4',
    name: 'Ram Ghat',
    lat: 23.1795,
    lon: 75.7715,
    density: 'low',
    count: 1250,
    capacity: 8000,
  },
  {
    id: '5',
    name: 'Parking Area A',
    lat: 23.1865,
    lon: 75.7645,
    density: 'low',
    count: 6992,
    capacity: 10000,
  },
  {
    id: '6',
    name: 'Exit Gate 2',
    lat: 23.1840,
    lon: 75.7710,
    density: 'low',
    count: 5430,
    capacity: 10000,
  },
];

const getColorByDensity = (density: 'high' | 'medium' | 'low'): string => {
  switch (density) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#f97316'; // orange
    case 'low':
      return '#3b82f6'; // blue
  }
};

const CrowdMap = () => {
  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[23.1828, 75.7681]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {crowdPoints.map((point) => {
          const percentage = Math.round((point.count / point.capacity) * 100);
          return (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lon]}
              radius={15}
              pathOptions={{
                fillColor: getColorByDensity(point.density),
                fillOpacity: 0.7,
                color: '#fff',
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{point.name}</h3>
                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground">
                      Crowd Density: <span className="font-semibold">{percentage}%</span>
                    </p>
                    <p className="text-muted-foreground">
                      Count: <span className="font-semibold">{point.count.toLocaleString()}</span> / {point.capacity.toLocaleString()}
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <span 
                        className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: getColorByDensity(point.density) }}
                      >
                        {point.density.toUpperCase()} DENSITY
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CrowdMap;
