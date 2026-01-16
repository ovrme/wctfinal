"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });
    if (res?.error) setLoginError("Invalid email or password");
    else router.push("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registerEmail, password: registerPassword, full_name: fullName }),
    });
    const data = await res.json();
    if (res.ok) setIsLogin(true);
    else setRegisterError(data.error || "Registration failed");
  };

  return (
    <div className="min-h-screen mt-32 mb-32 flex items-center justify-center p-3 sm:p-6 lg:p-12">
      <div className="max-w-6xl w-full rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Visual Side - Now visible on all screens */}
        {/* On mobile: h-64 (top), On desktop: lg:w-1/2 (left) */}
        <div className="relative w-full h-72 lg:h-auto lg:w-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-br from-[#926231]/90 via-[#C39B50]/80 to-[#E9D19E]/70 z-10" />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8iHsliRw28sLuhG3A1it26w2Jw5FBVT35IA&s" // replace with your image
            alt="Experience"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 p-8 lg:p-16 h-full flex flex-col justify-end text-white">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2">Adventure awaits.</h1>
            <p className="text-blue-100 text-sm lg:text-lg opacity-90">Create an account to unlock exclusive travel experiences.</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-gray-500 text-sm lg:text-base">
              {isLogin ? "Log in to manage your trips." : "Sign up to start your journey today."}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="bg-gray-100 p-1.5 rounded-2xl flex mb-10 w-full max-w-[280px] mx-auto lg:mx-0">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 ${
                isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 ${
                !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <div className="transition-opacity duration-300">
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
              {(loginError || registerError) && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100 animate-shake">
                  {isLogin ? loginError : registerError}
                </div>
              )}
              
              <div className="space-y-4">
                {!isLogin && (
                  <div className="group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>
                )}
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={isLogin ? loginEmail : registerEmail}
                    onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={isLogin ? loginPassword : registerPassword}
                    onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* The "Margin" between inputs and button (via mt-10) */}
              <div className="mt-10 pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}