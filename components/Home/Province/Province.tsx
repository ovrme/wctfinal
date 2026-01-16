"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import "./Province.css";

interface ProvinceData {
  id: number;
  name: string;
  main_image: string; // Matches the column name in your database
}

const Province: React.FC = () => {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch data from your Railway API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("/api/provinces"); // We need to create this route
        const data = await res.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Provinces...</div>;

  return (
    <div className="province-section container my-8 relative">
      <h2 className="px-1 mb-4 text-xl font-bold">25 City-Provinces of Cambodia</h2>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 hover:bg-gray-100 border border-gray-200"
      >
        &#8594;
      </button>

      {/* Horizontal Scroll Container */}
      <div ref={scrollRef} className="province-scroll-container">
        {provinces.map((province) => (
          <Link 
            href={`/provinces/${province.id}`} 
            key={province.id} 
            className="province-card group cursor-pointer"
          >
            <div className="province-img-wrapper overflow-hidden rounded-2xl">
              <img
                src={province.main_image}
                className="province-img group-hover:scale-110 transition-transform duration-500"
                alt={province.name}
              />
            </div>
            <div className="province-name group-hover:text-blue-600 transition-colors">
              {province.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Province;