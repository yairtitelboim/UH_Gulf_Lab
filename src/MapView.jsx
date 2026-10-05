import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { STATUS_COLORS } from './statusColors.js';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const TEXAS_CENTER = [-99.5, 31.2];

function toGeoJSON(projects) {
  return {
    type: 'FeatureCollection',
    features: projects
      .filter((p) => p.lat != null && p.lon != null)
      .map((p) => ({
        type: 'Feature',
        id: p.id,
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: p,
      })),
  };
}

export default function MapView({ projects, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // Create the map once.
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: TEXAS_CENTER,
      zoom: 5,
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      map.addSource('projects', { type: 'geojson', data: toGeoJSON([]) });
      map.addLayer({
        id: 'projects-circles',
        type: 'circle',
        source: 'projects',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 5, 10, 12],
          'circle-color': [
            'match', ['get', 'status'],
            ...Object.entries(STATUS_COLORS).flat(),
            STATUS_COLORS.unknown,
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'projects-circles', (e) => onSelect(e.features[0].properties.id));
      map.on('mouseenter', 'projects-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'projects-circles', () => { map.getCanvas().style.cursor = ''; });
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Push new data into the map whenever projects change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => map.getSource('projects')?.setData(toGeoJSON(projects));
    if (map.isStyleLoaded() && map.getSource('projects')) update();
    else map.once('load', update);
  }, [projects]);

  // Fly to the selected project.
  useEffect(() => {
    const project = projects.find((p) => p.id === selectedId);
    if (project && mapRef.current) {
      mapRef.current.flyTo({ center: [project.lon, project.lat], zoom: 9 });
    }
  }, [selectedId, projects]);

  return <div ref={containerRef} className="map" />;
}
