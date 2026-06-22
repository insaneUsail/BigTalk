import React, { useContext, useMemo, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordStrength = useMemo(() => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  }, [password]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setLoading(true);
    await login(currState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    setLoading(false);
  };

  const switchMode = () => {
    setCurrState(currState === "Sign Up" ? "Login" : "Sign Up");
    setIsDataSubmitted(false);
  };

  return (
    <main className="min-h-screen w-full px-4 py-8 flex items-center justify-center">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden p-10 lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/10">
          <div>
            <div className="flex items-center gap-3">
              <img src={assets.logo_icon} className="h-12 w-12" alt="BigTalk logo" />
              <h1 className="text-3xl font-bold">BigTalk</h1>
            </div>

            <h2 className="mt-16 max-w-xl text-5xl font-bold leading-tight">
              Fast, secure and clean real-time conversations.
            </h2>
            <p className="mt-5 max-w-lg text-gray-300">
              Chat instantly with online presence, image sharing and Firebase-backed message storage.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {["Realtime", "Firebase", "Images"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-gray-300">{item}</p>
                <p className="mt-1 text-lg font-semibold">Ready</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <img src={assets.logo_big} className="mx-auto w-36" alt="BigTalk" />
              <p className="mt-3 text-gray-400">Real-time chat made simple.</p>
            </div>

            <form onSubmit={onSubmitHandler} className="rounded-3xl border border-white/10 bg-[#0f172a]/80 p-6 shadow-xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-medium text-cyan-400">
                  {currState === "Sign Up" ? (isDataSubmitted ? "Step 2 of 2" : "Step 1 of 2") : "Welcome back"}
                </p>
                <h2 className="mt-2 text-3xl font-bold">{currState}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {currState === "Sign Up" ? "Create your BigTalk account." : "Login to continue chatting."}
                </p>

                {currState === "Sign Up" && (
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all ${
                        isDataSubmitted ? "w-full" : "w-1/2"
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {currState === "Sign Up" && !isDataSubmitted && (
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    placeholder="Full name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                  />
                )}

                {!isDataSubmitted && (
                  <>
                    <div>
                      <div className="relative">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="Email address"
                          required
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                        />
                        {email && (
                          <span className={`absolute right-4 top-3 text-sm ${isEmailValid ? "text-green-400" : "text-red-400"}`}>
                            {isEmailValid ? "✓" : "✕"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                      />

                      {password && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full bg-white/10">
                            <div
                              className={`h-1.5 rounded-full ${
                                passwordStrength === "Weak"
                                  ? "w-1/3 bg-red-500"
                                  : passwordStrength === "Medium"
                                  ? "w-2/3 bg-orange-400"
                                  : "w-full bg-green-500"
                              }`}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-400">Password strength: {passwordStrength}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {currState === "Sign Up" && isDataSubmitted && (
                  <div>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 150))}
                      rows={4}
                      placeholder="Write a short bio..."
                      required
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">{bio.length}/150</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait..." : currState === "Sign Up" ? (isDataSubmitted ? "Create Account" : "Continue") : "Login Now"}
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                <input type="checkbox" required className="mt-1" />
                <p>Agree to the terms of use and privacy policy.</p>
              </div>

              <p className="mt-6 text-center text-sm text-gray-400">
                {currState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button type="button" onClick={switchMode} className="font-semibold text-cyan-400 hover:text-cyan-300">
                  {currState === "Sign Up" ? "Login here" : "Create one"}
                </button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;