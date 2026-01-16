"use client";
import { useEffect } from "react"; // Added useEffect
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // FIX: Redirection must happen in useEffect, not during render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-20">Loading...</p>;
  }

  // If no session is found, we return null while the useEffect handles the redirect
  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="max-w-xl mx-auto mt-32 mb-32 p-8 bg-white shadow-xl rounded-3xl border">
      <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-6">
        My Profile
      </h2>

      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700">
          {user?.name?.charAt(0)}
        </div>

        <div className="text-center">
          <p className="text-xl font-bold">{user?.name}</p>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        <div className="w-full mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Account Type</span>
            <span>User</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Provider</span>
            <span>Local / Google</span>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}