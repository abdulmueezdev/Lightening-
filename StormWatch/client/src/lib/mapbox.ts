declare global {
  interface Window {
    mapboxgl: any;
  }
  namespace mapboxgl {
    class Map {
      constructor(options: any);
      on(event: string, callback: (e?: any) => void): void;
      addControl(control: any, position?: string): void;
      flyTo(options: any): void;
      zoomIn(): void;
      zoomOut(): void;
      remove(): void;
    }
    class NavigationControl {
      constructor();
    }
    class GeolocateControl {
      constructor(options?: any);
    }
    class Marker {
      constructor(element?: HTMLElement);
      setLngLat(lngLat: [number, number]): Marker;
      addTo(map: Map): Marker;
    }
    let accessToken: string;
  }
}

export function initializeMap(container: HTMLElement): mapboxgl.Map | null {
  const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  
  if (!apiKey) {
    console.error('Mapbox API key not found. Please set VITE_MAPBOX_API_KEY in your environment variables.');
    return null;
  }

  // Dynamically load Mapbox GL JS
  if (!window.mapboxgl) {
    // Load CSS first
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = () => {
      setTimeout(() => initMapInstance(), 100); // Small delay to ensure CSS loads
    };
    document.head.appendChild(script);
    return null;
  }

  return initMapInstance();

  function initMapInstance() {
    if (!window.mapboxgl) return null;

    window.mapboxgl.accessToken = apiKey;

    const map = new window.mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 9,
      attributionControl: false,
    });

    // Add navigation controls
    map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.addControl(
      new window.mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    return map;
  }
}
