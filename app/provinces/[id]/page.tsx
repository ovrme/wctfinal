"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ✅ Updated type to include image_cover
type Place = {
  id: number;
  name: string;
  main_image: string;
  category: string;
  rating: number;
};

type ProvinceDetail = {
  id: number;
  name: string;
  description: string;
  history: string;
  geography: string;
  area_km2: number;
  population: number;
  main_image: string;
  image_cover?: string; // <-- added this
  places?: Place[]; // optional in case API returns empty
};

export default function ProvinceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [province, setProvince] = useState<ProvinceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProvinceData = async () => {
      try {
        const res = await fetch(`/api/provinces/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ProvinceDetail = await res.json();
        setProvince(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinceData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!province) return <div className="text-center py-40">Province not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-20 bg-white">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-8 text-blue-600 hover:underline flex items-center"
      >
        ← Back Home
      </button>

      {/* Hero Header */}
      <div className="relative h-[400px] rounded-3xl overflow-hidden mb-10 shadow-xl">
        <img
          src={province.image_cover || province.main_image || "/placeholder-province.jpg"}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-10">
          <h1 className="text-5xl font-black text-white uppercase">{province.name}</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <p className="text-xs text-blue-400 font-bold uppercase">Area</p>
          <p className="text-2xl font-bold text-blue-700">{province.area_km2?.toLocaleString()} km²</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase">Population</p>
          <p className="text-2xl font-bold text-gray-800">{province.population?.toLocaleString()} million</p>
        </div>
      </div>

      {/* Description & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{province.description}</p>
          </section>
          <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">History</h2>
            <p className="text-gray-700 leading-relaxed italic">{province.history}</p>
          </section>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 sticky top-32">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Geography</h2>
            <p className="text-amber-800 leading-relaxed text-sm">{province.geography}</p>
          </div>
        </div>
      </div>

      {/* Top Attractions Section */}
      <section className="pt-16 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Attractions in {province.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {province.places && province.places.length > 0 ? (
            province.places.map((place) => (
              <Link href={`/places/${place.id}`} key={place.id} className="group">
                <div className="h-60 rounded-2xl overflow-hidden mb-4 shadow-md border border-gray-100">
                  <img
                    src={place.main_image || "/placeholder.jpg"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    alt={place.name}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {place.name}
                </h3>
                <p className="text-sm text-gray-400 uppercase tracking-widest">{place.category}</p>
                <p className="text-amber-500 text-sm">★ {place.rating || 4.5}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">No attractions found for this province yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
