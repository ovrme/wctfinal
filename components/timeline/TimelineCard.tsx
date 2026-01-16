"use client";

import { useState } from "react";
import MapRoute from "./MapRoute";
import { TimelineDay } from "../../types/travel";

interface Props {
  day: TimelineDay;
}

export default function TimelineCard({ day }: Props) {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggle = (id: number) => {
    setCompleted(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Build timeline data
  const timeline = [
    ...day.places.map(p => ({ ...p, label: "Place" })),
    ...day.foods.map(f => ({ ...f, label: "Food" })),
    day.accommodation
      ? { ...day.accommodation, label: "Hotel" }
      : null
  ].filter(Boolean) as any[];

  // Time schedules
  const placeTimes = [8, 10, 13, 15];
  const foodTimes = [12, 18];

  let placeIndex = 0;
  let foodIndex = 0;

  return (
    <div className="border rounded-lg p-5 mb-6 bg-white shadow-md">

      <h2 className="text-xl font-bold text-blue-600 mb-4">
        Your Trip Plan — Day {day.day}
      </h2>

      {/* Timeline */}
      <div className="space-y-5">

        {timeline.map((item) => {
          const isDone = completed.includes(item.id);

          let timeLabel = "";

          if (item.label === "Place") {
            timeLabel = placeTimes[placeIndex] + ":00";
            placeIndex++;
          }

          if (item.label === "Food") {
            timeLabel = foodTimes[foodIndex] + ":00";
            foodIndex++;
          }

          return (
            <div
              key={`${item.label}-${item.id}`}
              className={`flex gap-4 items-start ${isDone ? "opacity-50" : ""}`}
            >

              {/* Time */}
              <div className="w-20 text-right text-sm font-bold text-gray-500">
                {timeLabel || "—"}
              </div>

              {/* Dot */}
              <button
                onClick={() => toggle(item.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                {isDone && "✓"}
              </button>

              {/* Card */}
              <div className="flex-1 bg-gray-50 p-3 rounded-lg border">

                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-bold">
                      {item.label}
                    </p>
                    <p className={`font-bold ${isDone ? "line-through" : ""}`}>
                      {item.place || item.name}
                    </p>
                  </div>

                  <button
                    onClick={() => toggle(item.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      isDone
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isDone ? "COMPLETED" : "PENDING"}
                  </button>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>
                )}

                {item.type && (
                  <p className="text-xs text-green-600 mt-1">
                    🍽 {item.type}
                  </p>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Map */}
      <div className="mt-6 h-64 rounded-lg overflow-hidden border">
        <MapRoute places={timeline} />
      </div>

    </div>
  );
}
