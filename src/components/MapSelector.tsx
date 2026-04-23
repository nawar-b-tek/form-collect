import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/src/lib/utils';
import { LocateFixed, Search, X, MapPin } from 'lucide-react';

interface MapSelectorProps {
  center: [number, number];
  onLocationChange: (lat: number, lng: number, address: string) => void;
  zone: 'home' | 'work';
}

function MapEvents({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapSelector({ center, onLocationChange, zone }: MapSelectorProps) {
  const [position, setPosition] = useState<[number, number]>(center);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const markerRef = useRef<L.Marker>(null);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();
      onLocationChange(lat, lng, data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (error) {
      onLocationChange(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoading(false);
    }
  };

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchAddress(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleManualMove = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const useGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng);
    });
  };

  const handleSuggestionClick = (sugg: any) => {
    const lat = parseFloat(sugg.lat);
    const lng = parseFloat(sugg.lon);
    setPosition([lat, lng]);
    onLocationChange(lat, lng, sugg.display_name);
    setSearchQuery('');
    setSuggestions([]);
  };

  // Custom icon based on zone
  const customIcon = L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${zone === 'home' ? '#e84a2f' : '#16a34a'};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 10px rgba(0,0,0,0.2)"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="space-y-4">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent-blue transition-colors" />
        <input 
          type="text"
          placeholder="Search for an address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-11 py-3 bg-white border-2 border-border rounded-xl text-sm focus:border-accent-blue outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(''); setSuggestions([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-2xl z-[1000] overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-3 hover:bg-paper transition-colors border-b border-border last:border-0 group"
              >
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-muted mt-0.5 shrink-0 group-hover:text-accent-blue" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-ink">{s.display_name.split(',')[0]}</p>
                    <p className="text-[10px] text-muted truncate">{s.display_name.split(',').slice(1).join(',').trim()}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={useGPS}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-muted hover:text-accent-blue hover:border-accent-blue hover:bg-accent-blue/5 transition-all text-sm font-medium"
      >
        <LocateFixed className="w-4 h-4" />
        Use my current GPS position
      </button>

      <div className={cn(
        "map-container",
        zone === 'home' ? "selected-home" : "selected-work"
      )}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            draggable={true}
            icon={customIcon}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                handleManualMove(pos.lat, pos.lng);
              },
            }}
            ref={markerRef}
          />
          <MapEvents onMove={handleManualMove} />
          <FlyToPosition position={position} />
        </MapContainer>
      </div>
    </div>
  );
}

function FlyToPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 16);
  }, [position, map]);
  return null;
}
