"use client";
import React from "react";
import { motion, Variants, easeOut } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { title: "Choose Preferences", desc: "Select categories like Beach or Culture.", icon: "🎯" },
    { title: "System Analysis", desc: "Our database finds the best matching spots.", icon: "⚙️" },
    { title: "Get Results", desc: "View personalized province and place cards.", icon: "✨" },
    { title: "Explore & Plan", desc: "Navigate to details and start your trip!", icon: "📍" }
  ];

  // Container variant to stagger the children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Individual item variant
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: easeOut } // ✅ fixed easing
    },
  };

  return (
    <section className="bg-slate-50 py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          How It Works
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="text-center relative"
            >
              <div className="text-4xl mb-4 bg-white w-20 h-20 flex items-center justify-center rounded-full mx-auto shadow-md border border-gray-100 hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed px-4">{step.desc}</p>
              
              {/* Animated Arrow for Desktop */}
              {index < 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.3, ease: easeOut }} // ✅ add easing here too
                  className="hidden md:block absolute top-10 -right-4 text-blue-300 text-2xl"
                >
                  →
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
