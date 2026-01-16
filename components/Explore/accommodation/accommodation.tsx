"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, Variants, easeOut } from "framer-motion";

type Accommodation = {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  image_url?: string;
  rating?: number;
};

const Accommodation = () => {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/accommodations")
      .then((res) => res.json())
      .then((data) => {
        const formatted: Accommodation[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              title: item.name,
              location: item.location,
              price: item.price_per_night,
              type: item.accommodation_type, // fixed typo
              image_url: item.main_image,
              rating: item.rating,
            }))
          : [];
        setItems(formatted);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // ---------------- Animation Variants ----------------
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  if (loading) return <p className="text-center my-10">Loading stays...</p>;
  if (items.length === 0) return null;

  return (
    <div className="accommodation_section container mx-auto my-12 relative px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900">
          Explore Our Top-Rated Stays
        </h2>
        <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
          Handpicked accommodations for your next journey.
        </p>
      </motion.div>

      {/* Scroll button */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 z-10 border border-gray-200 hidden md:block"
      >
        &#8594;
      </button>

      {/* Scroll container with motion */}
      <motion.div
        ref={scrollRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide scroll-smooth"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={item.image_url || "/placeholder-hotel.jpg"}
                className="w-full h-full object-cover"
                alt={item.title}
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h5 className="font-bold text-sm truncate w-2/3">{item.title}</h5>
                <span className="text-xs font-bold text-blue-600">${item.price}</span>
              </div>

              <div className="flex items-center text-xs text-yellow-500 mt-2">
                {"★".repeat(Math.round(item.rating || 0))}
                <span className="ml-1 text-gray-500">({item.rating || 0})</span>
              </div>

              <p className="text-xs text-gray-400 mt-2 font-semibold uppercase">{item.type}</p>
              <p className="text-xs text-gray-500 mt-1">{item.location}</p>

              <Link
                href={`/accommodations/${item.id}`}
                className="mt-4 block text-center text-xs font-bold bg-gray-900 text-white py-2.5 rounded-xl hover:bg-black transition-colors"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Accommodation;
