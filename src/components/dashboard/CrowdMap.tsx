import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initialize map only once
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView([23.1828, 75.7681], 15);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add crowd points as circle markers
    crowdPoints.forEach((point) => {
      const percentage = Math.round((point.count / point.capacity) * 100);
      const color = getColorByDensity(point.density);

      const circle = L.circleMarker([point.lat, point.lon], {
        radius: 15,
        fillColor: color,
        fillOpacity: 0.7,
        color: '#fff',
        weight: 2,
      }).addTo(map);

      // Add popup
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 0.875rem; margin-bottom: 4px;">${point.name}</h3>
          <div style="font-size: 0.75rem;">
            <p style="color: #6b7280; margin: 4px 0;">
              Crowd Density: <span style="font-weight: 600;">${percentage}%</span>
            </p>
            <p style="color: #6b7280; margin: 4px 0;">
              Count: <span style="font-weight: 600;">${point.count.toLocaleString()}</span> / ${point.capacity.toLocaleString()}
            </p>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: white; background-color: ${color};">
                ${point.density.toUpperCase()} DENSITY
              </span>
            </div>
          </div>
        </div>
      `;
      circle.bindPopup(popupContent);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="relative w-full h-full rounded-lg overflow-hidden border border-border"
      style={{ minHeight: '100%' }}
    />
  );
};

export default CrowdMap;
