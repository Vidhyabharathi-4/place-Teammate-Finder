import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Filter, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import teamService from "../services/teamService";
import TeamCard from "../components/TeamCard";

const SPECIALIZATION_OPTIONS = [
  "All Specializations",
  "R-Smart",
  "R-Smart-Pro",
  "Intellect",
  "Intellect Engineering",
  "Arts / Others",
];

const YEAR_OPTIONS = ["All Years", "1", "2", "3", "4", "5"];

function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All Specializations");
  const [year, setYear] = useState("All Years");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }
      if (specialization && specialization !== "All Specializations") {
        params.specialization = specialization;
      }
      if (year && year !== "All Years") {
        params.year = Number(year);
      }
      if (department.trim()) {
        params.department = department.trim();
      }

      const data = await teamService.getAllTeams(params);
      setTeams(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, specialization, year, department]);

  useEffect(() => {
    // Debounce search/filter execution
    const timer = setTimeout(() => {
      fetchTeams();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchTeams]);

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("All Specializations");
    setYear("All Years");
    setDepartment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

      {/* Header with Title & Create Team Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Browse Teams
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Discover student teams and collaborate based on your specialization and skills.
          </p>
        </div>

        <Link
          to="/teams/create"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md shrink-0"
        >
          <Plus size={20} />
          Create Team
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-200 font-semibold">
          <Filter size={18} className="text-blue-600 dark:text-blue-400" />
          <span>Filters & Teammate Discovery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search Input */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-3.5 text-gray-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search team name, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 py-2.5 pl-10 pr-4 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PRIMARY FILTER: Specialization */}
          <div>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 py-2.5 px-3 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SPECIALIZATION_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 py-2.5 px-3 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {YEAR_OPTIONS.map((yr) => (
                <option
                  key={yr}
                  value={yr}
                  className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  {yr === "All Years" ? yr : `Year ${yr}`}
                </option>
              ))}
            </select>
          </div>

          {/* Department / Reset */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Department (e.g. CS)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 py-2.5 px-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {(search ||
              specialization !== "All Specializations" ||
              year !== "All Years" ||
              department) && (
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="px-3 rounded-xl border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition flex items-center justify-center"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-600 dark:text-slate-300">
          Loading Teams...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex justify-center items-center h-64 text-red-600 dark:text-red-400 text-lg font-medium">
          {error}
        </div>
      )}

      {/* Team Cards Grid */}
      {!loading && !error && teams.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            No Teams Found
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            {specialization !== "All Specializations"
              ? `No teams found for specialization "${specialization}". Try another track or reset filters.`
              : "No teams matched your current filters. Try searching with different keywords."}
          </p>

          <button
            onClick={handleResetFilters}
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition"
          >
            <RotateCcw size={16} />
            Reset All Filters
          </button>
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;