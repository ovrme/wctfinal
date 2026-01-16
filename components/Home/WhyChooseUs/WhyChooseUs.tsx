"use client";
import React from "react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const benefits = [
    { title: "Personalized", desc: "Tailored to your interests.", icon: "👤" },
    { title: "Save Time", desc: "Quick planning.", icon: "⏰" },
    { title: "Local Data", desc: "Covers all 25 provinces.", icon: "🇰🇭" },
    { title: "For Everyone", desc: "Built for all travelers.", icon: "🌍" }
  ];

  return (
    <section className="py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
        {/* Adjusted gap to 0 and used justify-between to force alignment to the edges */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          
          {/* Left Side: Text starts exactly at the left margin */}
          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block"
            >
              Our Value
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.05] tracking-tight"
            >
              Why use our <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Tourism Recommendation System?
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm md:text-base max-w-sm leading-relaxed"
            >
              Experience Cambodia like never before with our precision-engineered 
              recommendation engine.
            </motion.p>
          </div>

          {/* Right Side: Boxes align to the same starting horizontal line as the left text */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {benefits.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: "#f8faff" }}
                // Reduced padding to py-2 to make the box even shorter
                className="py-2 px-4 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center gap-3 transition-colors"
              >
                <div className="flex-shrink-0 text-lg">
                  {item.icon}
                </div>
                
                <div className="flex flex-col">
                  {/* leading-tight and small margins to keep it ultra-compact */}
                  <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}