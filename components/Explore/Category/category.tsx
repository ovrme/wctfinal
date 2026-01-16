"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion

type Place = {
  id: number;
  name: string;
  location: string;
  main_image?: string;
};

type CategoryGroup = {
  id: number;
  name: string;
  description: string;
  places: Place[];
};

const CategoryExplore = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveTab(data[0].id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const currentCategory = categories.find((cat) => cat.id === activeTab);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-32">

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="text-blue-600 font-bold tracking-[0.4em] text-xs uppercase mb-4 block">
            Discovery
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
            Explore the rich places <br />
            <span className="text-blue-600">in Cambodia</span>
          </h1>
        </motion.div>

        {/* CATEGORY BUTTONS */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-3 max-w-5xl"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(cat.id)}
                className={`px-10 py-4 rounded-2xl font-bold text-sm transition-colors duration-300 ${
                  activeTab === cat.id
                    ? "bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)]"
                    : "bg-white text-gray-400 border border-gray-100 shadow-sm"
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* CONTENT AREA WITH ANIMATE PRESENCE */}
        <AnimatePresence mode="wait">
          {currentCategory && (
            <motion.div
              key={activeTab} // Key ensures animation triggers on tab change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* HEADER */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                  {currentCategory.name}
                </h2>
                <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
                  {currentCategory.description || `Handpicked selection of the most beautiful ${currentCategory.name} spots.`}
                </p>
                <div className="mt-6">
                   <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-blue-100">
                    {currentCategory.places.length} Discovery Found
                  </span>
                </div>
              </div>

              {/* GRID */}
              {currentCategory.places.length > 0 ? (
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {currentCategory.places.map((place) => (
                    <motion.div
                      key={place.id}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        show: { opacity: 1, scale: 1 }
                      }}
                    >
                      <Link
                        href={`/places/${place.id}`}
                        className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 block no-underline"
                      >
                        <div className="relative h-52 overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={place.main_image || "/placeholder.jpg"}
                            className="w-full h-full object-cover"
                            alt={place.name}
                          />
                        </div>

                        <div className="p-6 text-center">
                          <h3 className="text-[15px] md:text-[16px] font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {place.name}
                          </h3>
                          <div className="flex items-center justify-center text-gray-400 font-medium text-xs">
                            <span className="mr-1 text-blue-500 text-sm">📍</span>
                            {place.location}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest group-hover:mr-2 transition-all">
                              View Details
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                              →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-100"
                >
                  <p className="text-gray-400 font-medium italic">
                    No destinations listed in this category yet.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryExplore;