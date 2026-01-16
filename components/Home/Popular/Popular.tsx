"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Update the type to match your API response
type Place = {
  id: number;
  name: string;
  location: string;
  category: string;
  main_image?: string; // optional property
};

const Popular = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch places from API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // Scroll horizontally
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) return <p className="text-center my-10">Loading popular destinations...</p>;
  if (places.length === 0) return <p className="text-center my-10">No places found.</p>;

  return (
    <div className="popular_place container my-8 relative px-4">
      <h2 className="px-1 mb-4 text-xl font-bold">Popular Destinations in Cambodia</h2>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 hover:bg-gray-100"
      >
        &#8594;
      </button>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 py-3 scrollbar-hide scroll-smooth"
      >
        {places.map((place) => (
          <div
            key={place.id}
            className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={place.main_image || "/placeholder.jpg"}
                className="w-full h-full object-cover"
                alt={place.name}
              />
            </div>

            <div className="p-3">
              <h5 className="font-bold text-sm truncate">{place.name}</h5>
              <p className="text-xs text-gray-500 truncate">{place.location}</p>
              <p className="text-xs text-gray-400 uppercase">{place.category}</p>
              <Link
                href={`/places/${place.id}`}
                className="mt-2 inline-block text-xs text-blue-500 hover:underline"
              >
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popular;
