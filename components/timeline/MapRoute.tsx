"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ---------- Leaflet Icon Fix ----------
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------- Dynamic Imports ----------
const MapContainer = dynamic(
  () => import("react-leaflet").then(m => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(m => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(m => m.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then(m => m.Polyline),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then(m => m.Popup),
  { ssr: false }
);

// ---------- Types ----------
interface Place {
  id?: number;
  place?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  type?: string;
  description?: string;
}

interface Props {
  places: Place[];
}

// ---------- Component ----------
export default function MapRoute({ places }: Props) {
  const path = places
    .filter(p => p.latitude != null && p.longitude != null)
    .map(p => [p.latitude!, p.longitude!] as [number, number]);

  if (!path.length) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 italic bg-gray-100 rounded-xl">
        No map coordinates available
      </div>
    );
  }

  const center = path[0];

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {path.map((p, i) => (
          <Marker key={i} position={p}>
            <Popup>
              {places[i].place ||
                places[i].name ||
                places[i].type ||
                "Location"}
            </Popup>
          </Marker>
        ))}

        <Polyline positions={path} />
      </MapContainer>
    </div>
  );
}
