import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Site {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  rock_types: string[];
  image_url?: string;
}

interface SiteMapProps {
  sites: Site[];
  userLocation?: { latitude: number; longitude: number } | null;
}

export const SiteMap = ({ sites, userLocation }: SiteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox token is set
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      toast.error('Mapbox token not configured. Please add VITE_MAPBOX_TOKEN to your environment variables.');
      return;
    }

    mapboxgl.accessToken = token;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: userLocation ? [userLocation.longitude, userLocation.latitude] : [78.9629, 20.5937], // Center of India
      zoom: userLocation ? 8 : 4,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl, 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add user location marker if available
      if (userLocation && map.current) {
        new mapboxgl.Marker({ color: '#4682B4' })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML('<div class="text-sm font-semibold">Your Location</div>')
          )
          .addTo(map.current);
      }

      // Add sites data as GeoJSON
      if (map.current) {
        map.current.addSource('sites', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: sites.map((site) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [site.longitude, site.latitude],
              },
              properties: {
                id: site.id,
                name: site.name,
                state: site.state,
                rock_types: site.rock_types.join(', '),
                image_url: site.image_url,
              },
            })),
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Add cluster circles
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'sites',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], '#8B4513', 10, '#708090', 30, '#4682B4'],
            'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Add cluster count labels
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'sites',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });

        // Add unclustered points
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'sites',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#8B4513',
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        });

        // Add click handler for clusters
        map.current.on('click', 'clusters', (e) => {
          if (!map.current) return;
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = features[0].properties.cluster_id;
          const source = map.current.getSource('sites') as mapboxgl.GeoJSONSource;
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !map.current) return;
            const coordinates = (features[0].geometry as any).coordinates;
            map.current.easeTo({
              center: coordinates,
              zoom: zoom,
            });
          });
        });

        // Add click handler for individual sites
        map.current.on('click', 'unclustered-point', (e) => {
          if (!e.features || !e.features[0]) return;
          const coordinates = (e.features[0].geometry as any).coordinates.slice();
          const properties = e.features[0].properties;

          // Create popup
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `<div class="p-2">
                ${properties.image_url ? `<img src="${properties.image_url}" alt="${properties.name}" class="w-full h-32 object-cover rounded mb-2" />` : ''}
                <h3 class="font-bold text-sm mb-1">${properties.name}</h3>
                <p class="text-xs text-muted-foreground mb-1">${properties.state}</p>
                <p class="text-xs mb-2">${properties.rock_types}</p>
                <button onclick="window.navigateToSite('${properties.id}')" class="w-full bg-primary text-primary-foreground text-xs py-1 px-2 rounded hover:bg-primary/90">
                  View Details
                </button>
              </div>`
            )
            .addTo(map.current!);
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }
    });

    // Expose navigation function to window for popup buttons
    (window as any).navigateToSite = (id: string) => {
      navigate(`/sites/${id}`);
    };

    return () => {
      map.current?.remove();
    };
  }, [sites, userLocation, navigate]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};
