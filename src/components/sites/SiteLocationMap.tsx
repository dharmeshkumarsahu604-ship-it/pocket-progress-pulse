import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mountain, Satellite } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SiteLocationMapProps {
  latitude: number;
  longitude: number;
  siteName: string;
}

type MapStyle = 'terrain' | 'satellite';

const MAP_STYLES: Record<MapStyle, string> = {
  terrain: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
};

export const SiteLocationMap: React.FC<SiteLocationMapProps> = ({
  latitude,
  longitude,
  siteName,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('terrain');
  const [token, setToken] = useState<string | null>(null);

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (fnError || !data?.token) {
          setError('Map unavailable - missing API key');
          return;
        }
        setToken(data.token);
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Failed to load map');
      }
    };
    fetchToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[mapStyle],
      center: [longitude, latitude],
      zoom: 12,
      interactive: true,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100 }),
      'bottom-left'
    );

    // Create custom marker element
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.innerHTML = `
      <div style="width: 32px; height: 32px; background: hsl(var(--primary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `;

    // Add marker at site location
    markerRef.current = new mapboxgl.Marker({ element: markerEl })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; font-size: 14px; margin: 0;">${siteName}</h3>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</p>
          </div>
        `)
      )
      .addTo(map.current);

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      markerRef.current?.remove();
      map.current?.remove();
    };
  }, [token, latitude, longitude, siteName]);

  // Handle style changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(MAP_STYLES[mapStyle]);
      
      // Re-add marker after style change
      map.current.once('style.load', () => {
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker';
        markerEl.innerHTML = `
          <div style="width: 32px; height: 32px; background: hsl(var(--primary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;

        markerRef.current = new mapboxgl.Marker({ element: markerEl })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: 600; font-size: 14px; margin: 0;">${siteName}</h3>
                <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</p>
              </div>
            `)
          )
          .addTo(map.current!);
      });
    }
  }, [mapStyle, mapLoaded, latitude, longitude, siteName]);

  const handleStyleChange = (value: string) => {
    if (value === 'terrain' || value === 'satellite') {
      setMapStyle(value);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
          <ToggleGroup
            type="single"
            value={mapStyle}
            onValueChange={handleStyleChange}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem
              value="terrain"
              aria-label="Terrain view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3 py-1.5 text-xs"
            >
              <Mountain className="h-3.5 w-3.5 mr-1.5" />
              Terrain
            </ToggleGroupItem>
            <ToggleGroupItem
              value="satellite"
              aria-label="Satellite view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3 py-1.5 text-xs"
            >
              <Satellite className="h-3.5 w-3.5 mr-1.5" />
              Satellite
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
              <p className="text-muted-foreground text-sm">Loading map...</p>
            </div>
          )}
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </CardContent>
    </Card>
  );
};
