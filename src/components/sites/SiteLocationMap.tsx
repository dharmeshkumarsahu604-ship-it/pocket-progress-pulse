import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SiteLocationMapProps {
  latitude: number;
  longitude: number;
  siteName: string;
}

export const SiteLocationMap: React.FC<SiteLocationMapProps> = ({
  latitude,
  longitude,
  siteName,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Fetch Mapbox token from edge function
        const { data, error: fnError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (fnError || !data?.token) {
          setError('Map unavailable - missing API key');
          return;
        }

        mapboxgl.accessToken = data.token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/outdoors-v12',
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
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;

        // Add marker at site location
        new mapboxgl.Marker({ element: markerEl })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${siteName}</h3>
                <p class="text-xs text-gray-600">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</p>
              </div>
            `)
          )
          .addTo(map.current);

        map.current.on('load', () => {
          setMapLoaded(true);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map');
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, siteName]);

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
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
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
