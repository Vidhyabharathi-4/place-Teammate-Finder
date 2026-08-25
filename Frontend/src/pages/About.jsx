import { Info, GraduationCap, Code, Heart } from "lucide-react";

function About() {
  return (
    <div className="mx-auto max-w-5xl p-8">

      <div className="rounded-3xl bg-white shadow-lg border border-slate-200">

        <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">

          <div className="flex items-center gap-4">

            <Info size={40} />

            <div>

              <h1 className="text-4xl font-bold">
                About TeamMate Finder
              </h1>

              <p className="mt-2 text-blue-100">
                College Exclusive Team Finding Platform
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-8 p-8">

          <div className="rounded-2xl border p-6">

            <div className="flex items-center gap-3 mb-3">

              <GraduationCap className="text-blue-600" />

              <h2 className="text-2xl font-bold">
                Purpose
              </h2>

            </div>

            <p className="text-slate-600 leading-8">
              TeamMate Finder helps Rathinam students
              find teammates for hackathons, academic
              projects, competitions and innovation
              challenges using only verified college
              accounts.
            </p>

          </div>

          <div className="rounded-2xl border p-6">

            <div className="flex items-center gap-3 mb-3">

              <Code className="text-green-600" />

              <h2 className="text-2xl font-bold">
                Version
              </h2>

            </div>

            <p className="text-slate-700">
              Version : <b>1.0.0</b>
            </p>

            <p className="text-slate-700">
              Developed using React, FastAPI and MySQL.
            </p>

          </div>

          <div className="rounded-2xl border p-6">

            <div className="flex items-center gap-3 mb-3">

              <Heart className="text-red-500" />

              <h2 className="text-2xl font-bold">
                Developed By
              </h2>

            </div>

            <p className="text-slate-700">
              M. Vidhya Bharathi
            </p>

            <p className="text-slate-500">
              B.Sc Computer Science with AI & DS
            </p>

            <p className="text-slate-500">
              Rathinam Group of Institutions
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;