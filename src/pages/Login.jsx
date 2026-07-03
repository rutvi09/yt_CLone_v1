import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleNext = () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f4f8fd] flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-[1000px] bg-white rounded-[28px] p-6 sm:p-10 md:p-12 shadow-sm">

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

        
          <div>

           
            <div className="mb-10 flex items-center gap-3">
              <svg width="52" height="52" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.69 1.22 9.21 3.6l6.9-6.9C35.91 2.34 30.27 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.02 6.22C12.46 13.36 17.78 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.6c-.54 2.9-2.2 5.36-4.7 7.02l7.3 5.7C43.9 37.6 46.1 31.6 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.58 28.44A14.5 14.5 0 0 1 9.5 24c0-1.54.27-3.02.75-4.44l-8.02-6.22A23.9 23.9 0 0 0 0 24c0 3.84.9 7.47 2.5 10.66l8.08-6.22z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.94-2.14 15.92-5.84l-7.3-5.7c-2.04 1.37-4.66 2.18-8.62 2.18-6.22 0-11.54-3.86-13.42-9.22l-8.08 6.22C6.5 42.62 14.62 48 24 48z"/>
              </svg>

              <span className="text-lg text-gray-700 font-medium">
                
              </span>
            </div>

            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-normal text-gray-900">
              Sign in
            </h1>

            <p className="mt-3 text-lg text-gray-700">
              Use your Google account
            </p>

            {step === 2 && (
              <div className="mt-8 inline-flex items-center border border-gray-300 rounded-full px-4 py-2 text-sm">
                {email}
              </div>
            )}
          </div>

          
          <div>

            {step === 1 ? (
              <>
                <input
                  type="email"
                  placeholder="Email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-4 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none"
                />

                <button
                  type="button"
                  className="mt-3 text-blue-600 text-sm font-medium"
                >
                  Forgot email?
                </button>

                <p className="mt-8 text-sm text-gray-600">
                  Not your computer? Use a private browsing window to sign in.
                </p>

                <button
                  type="button"
                  className="mt-2 text-blue-600 text-sm font-medium"
                >
                  Learn more
                </button>

                {error && (
                  <p className="mt-4 text-red-500 text-sm">
                    {error}
                  </p>
                )}

                <div className="mt-12 flex justify-between items-center">
                 
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none"
                />

               
                {error && (
                  <p className="mt-4 text-red-500 text-sm">
                    {error}
                  </p>
                )}

                <div className="mt-12 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-full"
                  >
                    {loading ? "Signing In..." : "Next"}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      <div className="w-full max-w-[1000px] mt-5 flex justify-between text-xs text-gray-500 px-2">
        <span>English (India)</span>

        <div className="flex gap-6">
          <button>Help</button>
          <button>Privacy</button>
          <button>Terms</button>
        </div>
      </div>

    </div>
  );
};

export default Login;