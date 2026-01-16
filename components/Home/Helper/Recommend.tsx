"use client";
import React, { useState } from "react";
import { FaMap } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

const tourismTypes = ["Nature", "Beach", "Historical", "Culture", "Adventure", "Mountain"];
const budgetRanges = ["$50 - $100", "$100 - $300", "$300 - $700", "$700+"];

const cambodiaProvinces = [
  "Phnom Penh", "Battambang", "Siem Reap", "Kampong Cham", "Kampong Chhnang",
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
  "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Preah Vihear",
  "Prey Veng", "Pursat", "Ratanakiri", "Svay Rieng", "Takeo", "Tboung Khmum", "Banteay Meanchey",
  "Stung Treng", "Sihanoukville"
];

const Recommend = () => {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [tourismType, setTourismType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [people, setPeople] = useState<number | "">(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleRedirect = () => {
    // --- VALIDATION LOGIC ---
    if (!location || !tourismType || !budgetRange || !people || !startDate || !endDate) {
      alert("⚠️ Please fill in all fields (Location, Type, Budget, Dates, and People) before proceeding!");
      return; // Stop the function here
    }

    // If all fields are filled, construct the URL
    const params = new URLSearchParams({
      location: location,
      type: tourismType,
      budget: budgetRange,
      people: people.toString(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });

    router.push(`/my_plan?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center mt-6 sm:mt-12 px-2 text-white">
      <div className="relative w-full max-w-[540px] bg-white/20 backdrop-blur-md rounded-xl p-4 grid grid-cols-1 gap-3 shadow-lg border border-white/30">
        <h5 className="text-center font-semibold mb-2 text-sm">
          Where do you want to Travel?
        </h5>

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium">Budget</p>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full text-[10px] bg-white/90 text-gray-800 rounded px-2 py-1 outline-none"
            >
              <option value="">Range</option>
              {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <FaMap className="w-3 h-3 text-blue-400" />
              <p className="text-[12px] font-medium">Location</p>
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-[10px] bg-white/90 text-gray-800 rounded px-2 py-1 outline-none"
            >
              <option value="">Province</option>
              {cambodiaProvinces.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium">Type</p>
            <select
              value={tourismType}
              onChange={(e) => setTourismType(e.target.value)}
              className="w-full text-[10px] bg-white/90 text-gray-800 rounded px-2 py-1 outline-none"
            >
              <option value="">Select</option>
              {tourismTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium">Start Date</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="MM/DD"
              className="w-full text-[10px] px-2 py-1 rounded bg-white/90 outline-none text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium">End Date</p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="MM/DD"
              minDate={startDate || undefined}
              className="w-full text-[10px] px-2 py-1 rounded bg-white/90 outline-none text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-medium">People</p>
            <input
              type="number"
              min={1}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full text-[10px] bg-white/90 text-gray-800 rounded px-2 py-1 outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={handleRedirect}
            className="w-full h-8 bg-[#112340] hover:bg-[#1a355e] text-white text-[10px] font-bold rounded transition-all uppercase"
          >
            See Your Trip Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;