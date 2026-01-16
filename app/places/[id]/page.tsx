"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic imports for Leaflet (prevent SSR issues)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type PlaceDetail = {
  id: number;
  name: string;
  description: string;
  category: string;
  history?: string;
  entry_fee: number;
  best_season: string;
  total_reviews: number;
  rating?: number;
  main_image?: string;
  latitude?: number;
  longitude?: number;
};

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Leaflet icon fix
    const fixIcons = async () => {
      const L = (await import("leaflet")).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    };
    fixIcons();

    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/places/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Place not found");
        setPlace(data);

        const suggRes = await fetch(`/api/places/suggestions?category=${data.category}&exclude=${id}`);
        const suggData = await suggRes.json();
        setSuggestions(suggData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!place) return <div className="text-center py-40 font-bold text-gray-500">Place not found.</div>;

  const hasLocation = typeof place.latitude === "number" && typeof place.longitude === "number";

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 bg-white">
      
      {/* 1. NAVIGATION */}
      <nav className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </button>
      </nav>

      {/* 2. HERO SECTION: Image Left, Box Right (Shorter Version) */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-12">
        
        {/* Left: Main Visual */}
        <div className="lg:w-2/3 h-[250px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-lg relative">
          <img
            src={place.main_image || "/placeholder.jpg"}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            {place.category}
          </div>
        </div>

        {/* Right: Info Action Box */}
        <div className="lg:w-1/3 bg-white rounded-[2rem] p-7 border border-gray-100 shadow-lg flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">{place.name}</h1>
            
            <div className="flex items-center text-amber-500 mb-6 text-sm">
              <span className="text-lg">★</span>
              <span className="ml-1.5 text-gray-800 font-bold">{place.rating || "4.5"}</span>
              <span className="ml-1.5 text-gray-400 font-medium">({place.total_reviews})</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400 text-sm italic font-medium">Entry Fee</span>
                <span className="text-xl font-black text-blue-600">${place.entry_fee}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400 text-sm italic font-medium">Best Season</span>
                <span className="text-md font-bold text-gray-800">{place.best_season}</span>
              </div>
            </div>
          </div>

          {/* Shorter Compact Button */}
          <button
            onClick={async () => {
              await fetch("/api/favorites/places", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ place_id: place.id })
              });
              alert("Saved to favorite ❤️");
            }}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold"
          >
            ❤️ Add to Favorite
          </button>
        </div>
      </div>

      {/* 3. CONTENT SECTION: Description & History (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
            Overview
          </h2>
          <p className="text-gray-600 leading-relaxed text-md bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            {place.description}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-3"></span>
            History
          </h2>
          <p className="text-gray-600 leading-relaxed italic border-l-4 border-amber-200 pl-6 py-1 text-md">
            {place.history || "Historical details are being updated for this location."}
          </p>
        </section>
      </div>

      {/* 4. MAP & SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
        <div className="lg:col-span-2">
           <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">How to get there</h2>
           {hasLocation ? (
             <div className="w-full h-[350px] rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-md">
                <MapContainer center={[place.latitude!, place.longitude!]} zoom={15} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[place.latitude!, place.longitude!]}>
                    <Popup>{place.name}</Popup>
                  </Marker>
                </MapContainer>
             </div>
           ) : (
             <div className="bg-gray-100 h-[300px] rounded-[2rem] flex items-center justify-center text-gray-400 italic">Map not available</div>
           )}
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Similar Places</h2>
          <div className="space-y-4">
            {suggestions.slice(0, 3).map((sug) => (
              <Link href={`/places/${sug.id}`} key={sug.id} className="flex gap-4 group cursor-pointer bg-white p-2 rounded-xl hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={sug.main_image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">{sug.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">{sug.category}</p>
                  <p className="text-amber-500 text-xs mt-1 font-bold">★ {sug.rating || "4.5"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}