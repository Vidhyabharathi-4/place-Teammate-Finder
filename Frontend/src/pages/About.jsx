import { useState, useEffect } from "react";
import { Info, GraduationCap, Code, Heart, Server } from "lucide-react";
import api from "../services/api";

function About() {
  const [backendInfo, setBackendInfo] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    api.get("/")
      .then((res) => {
        setBackendInfo(res.data);
        setServerOnline(true);
      })
      .catch(() => {
        setServerOnline(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-8">

      <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">

        <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">

          <div className="flex items-center gap-4">

            <Info size={40} />

            <div>

              <h1 className="text-4xl font-bold">
                About TeamMate Finder
              </h1>

              <p className="text-blue-100 mt-2">
                College Exclusive Team Finding Platform
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-8 p-8">

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6">

            <div className="flex items-center gap-3 mb-3">

              <GraduationCap className="text-blue-600 dark:text-blue-400" />

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Purpose
              </h2>

            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-8">
              TeamMate Finder helps Rathinam students
              find teammates for hackathons, academic
              projects, competitions and innovation
              challenges using only verified college
              accounts.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6">

            <div className="flex items-center gap-3 mb-3">

              <Code className="text-green-600 dark:text-green-400" />

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Application & Tech Stack
              </h2>

            </div>

            <p className="text-slate-700 dark:text-slate-300">
              Version : <b className="text-slate-900 dark:text-white">{backendInfo?.version || "1.0.0"}</b>
            </p>

            <p className="text-slate-700 dark:text-slate-300 mt-1">
              Developed using React, FastAPI, SQLAlchemy and MySQL.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium">
              <Server size={16} className={serverOnline ? "text-green-600" : "text-amber-500"} />
              <span className="text-slate-600 dark:text-slate-400">
                Backend Status:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                serverOnline
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              }`}>
                {serverOnline ? "Online & Healthy" : "Checking Connection..."}
              </span>
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6">

            <div className="flex items-center gap-3 mb-3">

              <Heart className="text-red-500" />

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Developed By
              </h2>

            </div>

            <p className="text-slate-800 dark:text-white font-medium">
              M. Vidhya Bharathi
            </p>

            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              B.Sc Computer Science with AI & DS
            </p>

            <p className="text-slate-500 dark:text-slate-400">
              Rathinam Group of Institutions
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;