"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Type definition for better developer experience
interface Accommodation {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  latitude: string;
  longitude: string;
  main_image: string;
  rating: number;
  total_reviews: number;
  contact_number: string;
  contact_email: string;
}

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AccommodationDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [data, setData] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    const initLeaflet = async () => {
      const L = await import("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletReady(true);
    };

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/accommodations/${id}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    initLeaflet();
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-gray-400">Loading Stay Details...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Accommodation not found.</div>;
  }

  const position: [number, number] = [
    parseFloat(data.latitude) || 0,
    parseFloat(data.longitude) || 0,
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-6 pt-19"> {/* Increased pt-16 for more top margin */}
        
        {/* Simplified Navigation: Single Back Button */}
        <div className="mb-10"> {/* Increased bottom margin to 12 */}
          <Link 
            href="/explore" 
            className="group inline-flex items-center px-6 py-3 bg-white text-gray-700 font-bold rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Explore
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-xl bg-gray-200">
              <img
                src={data.main_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow text-sm font-bold text-gray-800">
                ★ {data.rating} ({data.total_reviews} reviews)
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-4xl font-extrabold text-gray-900">{data.name}</h1>
              <p className="text-gray-500 flex items-center mt-2">
                <span className="mr-2">📍</span> {data.location}
              </p>
              <hr className="my-6 border-gray-100" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this experience</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card - Removed sticky top */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-3xl font-black text-blue-600">${data.price_per_night}</span>
                  <span className="text-gray-400 font-medium ml-1">/ night</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-sm p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <strong>Contact:</strong> {data.contact_number}
                </div>
                <div className="text-sm p-3 bg-green-50 text-green-700 rounded-xl border border-green-100">
                  <strong>Email:</strong> {data.contact_email}
                </div>
              </div>

             <button
                onClick={async () => {
                  await fetch("/api/favorites/accommodations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accommodation_id: data.id })
                  });
                  alert("Saved to favorite ❤️");
                }}
                className="w-full bg-pink-600 text-white py-4 rounded-2xl font-bold"
              >
                ❤️ Add to Favorite
              </button>
            </div>

            {/* Map Card - Removed sticky top and top-[420px] */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 px-2">Location</h3>
              <div className="h-64 w-full rounded-2xl overflow-hidden z-0 bg-gray-100">
                {leafletReady && (
                  <MapContainer
                    key={data.id}
                    center={position}
                    zoom={14}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position}>
                      <Popup>{data.name}</Popup>
                    </Marker>
                  </MapContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}