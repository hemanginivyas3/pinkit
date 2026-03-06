import React, { useEffect, useState } from "react";
import dataService from "./services/dataService";
import { Home, Car, Users, User, Search, History, AlertCircle } from "lucide-react";

import {
  Vendor,
  Driver,
  CommunityPost,
  RouteFare,
  EssentialService
} from "./types";

type AppData = {
  vendors: Vendor[];
  drivers: Driver[];
  communityPosts: CommunityPost[];
  routeFares: RouteFare[];
  essentialServices: EssentialService[];
};

export default function App() {

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState("home");

  const [appData, setAppData] = useState<AppData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Auto login from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("pinkit_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem("pinkit_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("pinkit_user");
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await dataService.fetchData();
      setAppData(data);

    } catch (err) {
      console.error(err);
      setError("Could not load latest campus services. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-pink-soft">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-[320px]">

          <h1 className="text-3xl font-black mb-4 text-center text-pink-hot">
            PinkIt
          </h1>

          <input
            placeholder="Name"
            className="w-full mb-4 p-3 rounded-xl border"
            onChange={(e) =>
              setUser({ name: e.target.value, email: "demo@campus.com" })
            }
          />

          <button
            onClick={() => handleLogin("Demo User", "demo@campus.com")}
            className="w-full bg-pink-primary text-white p-3 rounded-xl font-bold"
          >
            Enter
          </button>

        </div>
      </div>
    );
  }

  if (isLoading && !appData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">

        <div className="w-10 h-10 border-4 border-pink-soft border-t-pink-primary rounded-full animate-spin" />

        <p className="mt-4 text-slate-500 font-bold">
          Loading campus services...
        </p>

      </div>
    );
  }

  if (error && !appData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">

        <AlertCircle size={50} className="text-pink-primary mb-4" />

        <p className="font-bold mb-4">{error}</p>

        <button
          onClick={fetchAllData}
          className="px-6 py-3 bg-pink-primary text-white rounded-xl"
        >
          Try Again
        </button>

      </div>
    );
  }

  const vendors =
    appData?.vendors.filter((v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const drivers =
    appData?.drivers.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-pink-soft flex justify-center">

      <div className="w-full max-w-2xl bg-white min-h-screen pb-24">

        {/* HEADER */}

        <header className="p-6 border-b flex justify-between items-center">

          <h1 className="text-2xl font-black text-pink-hot">
            PinkIt
          </h1>

          <button
            onClick={fetchAllData}
            className={`p-2 rounded-xl ${isLoading ? "animate-spin" : ""}`}
          >
            <History size={20} />
          </button>

        </header>

        {/* SEARCH */}

        <div className="p-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              placeholder="Search services..."
              className="w-full pl-10 p-3 rounded-xl border"
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>

        </div>

        {/* HOME */}

        {activeTab === "home" && (

          <div className="p-6 flex flex-col gap-4">

            <h2 className="font-black text-xl">
              Campus Services
            </h2>

            {vendors.map((v) => (

              <div
                key={v.id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >

                <h3 className="font-black">
                  {v.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {v.category}
                </p>

                <div className="flex gap-3 mt-4">

                  <a
                    href={`tel:${v.phone}`}
                    className="flex-1 bg-pink-primary text-white p-3 rounded-xl text-center"
                  >
                    Call
                  </a>

                  <a
                    href={`https://wa.me/${v.whatsapp}`}
                    target="_blank"
                    className="flex-1 bg-teal-primary text-white p-3 rounded-xl text-center"
                  >
                    WhatsApp
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* TRANSPORT */}

        {activeTab === "transport" && (

          <div className="p-6 flex flex-col gap-4">

            <h2 className="font-black text-xl">
              Drivers
            </h2>

            {drivers.map((d) => (

              <div
                key={d.id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >

                <h3 className="font-black">
                  {d.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {d.type}
                </p>

                <div className="flex gap-3 mt-4">

                  <a
                    href={`tel:${d.phone}`}
                    className="flex-1 bg-pink-primary text-white p-3 rounded-xl text-center"
                  >
                    Call
                  </a>

                  <a
                    href={`https://wa.me/${d.whatsapp}`}
                    className="flex-1 bg-teal-primary text-white p-3 rounded-xl text-center"
                  >
                    WhatsApp
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* NAVBAR */}

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white border-t flex justify-around py-4">

          <button onClick={() => setActiveTab("home")}>
            <Home />
          </button>

          <button onClick={() => setActiveTab("transport")}>
            <Car />
          </button>

          <button onClick={() => setActiveTab("community")}>
            <Users />
          </button>

          <button onClick={() => setActiveTab("profile")}>
            <User />
          </button>

        </nav>

      </div>

    </div>
  );
}