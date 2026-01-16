"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import Recommend from "../Helper/Recommend";

const Hero = () => {
  const videos = [
    "/image/angkor_sr.mp4",
    "/image/phnom_penh.mp4",
    "/image/footage_pp.mp4",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  /*Framer Motion Variants*/
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  /* Animated Text Component*/
  const AnimatedText = ({
    text,
    className,
  }: {
    text: string;
    className: string;
  }) => {
    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ display: "flex", overflow: "hidden" }}
      >
        {Array.from(text).map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

 return (
  <>
    {/* HERO SECTION */}
    <div className="relative w-full h-[120vh] sm:h-screen bg-black overflow-hidden">
      <video
        key={videos[currentVideoIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <AnimatedText
          text="CAMBODIA"
          className="text-[35px] md:text-[55px] lg:text-[75px]
          tracking-[0.7rem] text-white font-bold uppercase text-center"
        />

        <AnimatedText
          text="Kingdom of Wonder"
          className="text-sm md:text-lg tracking-[0.25rem] text-white text-center mt-2"
        />

        {/* Recommendation Form */}
        <Recommend />
      </div>
    </div>
  </>
);

};

export default Hero;
