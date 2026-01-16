import Hero from "@/components/Home/Hero/Hero";
import React from "react";
import Popular from "@/components/Home/Popular/Popular";
import Province from "@/components/Home/Province/Province";
import HowItWorks from "@/components/Home/Howitwork/Howitwork";
import WhyChooseUs from "@/components/Home/WhyChooseUs/WhyChooseUs";

const page= () => {
  return (
    <div className="Homepage bg-white text-black text-5xl">
      <Hero />
      <HowItWorks />
      <Popular />
      <Province />
      <WhyChooseUs />
    </div>
  );
}

export default page;