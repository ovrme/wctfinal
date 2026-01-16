'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, MapPin } from "lucide-react";

const TimelinePage = dynamic(
  () => import("../../components/timeline/TimelinePage"), 
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
);

function MyPlanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const budget = searchParams.get("budget") || "";
  const people = parseInt(searchParams.get("people") || "1");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  let days = 1;
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  if (location) {
    return <TimelinePage location={location} type={type} budget={budget} days={days} />;
  }

  const favorites: any[] = [];

  return (
    <div className="min-h-screen mt-16 bg-slate-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="bg-white rounded-[2.5rem] p-8 lg:p-16 shadow-sm border flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-[#C39B50]" />
          </div>
          <h1 className="text-3xl font-black mb-4">No active plan yet</h1>
          <p className="text-gray-500 max-w-md mb-8">
            Start by choosing a destination to generate your trip.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#C39B50] text-white px-8 py-4 rounded-2xl font-bold"
          >
            Start Planning
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            My Favorites
          </h2>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center text-gray-500 shadow-sm border">
              ❤️ No favorite places added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl shadow-sm border p-5">
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MyPlanContent />
    </Suspense>
  );
}