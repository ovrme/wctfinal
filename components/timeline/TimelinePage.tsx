"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TimelineCard from "./TimelineCard";
import { TimelineDay } from "../../types/travel";

interface Props {
  location: string;
  type: string;
  budget: string;
  days: number;
}

export default function TimelinePage({ location, type, budget, days }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [timelineDays, setTimelineDays] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function generatePlan() {
      try {
        setLoading(true);
        const response = await fetch("/api/generate-timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location, type, budget, days }),
        });
        if (!response.ok) throw new Error("Failed to fetch itinerary");
        const data = await response.json();
        setTimelineDays(data.plan);
      } catch (err) {
        setError("Could not load your trip plan.");
      } finally {
        setLoading(false);
      }
    }
    generatePlan();
  }, [location, type, budget, days]);

  const saveTripPlan = async () => {
    if (!session) {
      alert("Please login to save your trip plan.");
      router.push("/auth/login");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/trip-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location, // Added this
          plan: timelineDays,
        }),
      });

      if (res.ok) {
        alert("Trip Plan Saved Successfully!");
        router.push("/my-plan"); // Redirect to show the saved list
      }
    } catch (error) {
      alert("Error saving trip plan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Generating your perfect itinerary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-18 mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Your Trip Timeline</h2>
      <div className="space-y-8">
        {timelineDays.map((day) => (
          <TimelineCard key={day.day} day={day} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={saveTripPlan}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Trip Plan"}
        </button>
      </div>
    </div>
  );
}