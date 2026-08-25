import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import teamService from "../services/teamService";
import TeamCard from "../components/TeamCard";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.team_name?.toLowerCase().includes(search.toLowerCase())
    );
  console.log("Filtered Teams:", filtered);

    setFilteredTeams(filtered);
  }, [search, teams]);

  const fetchTeams = async () => {
    try {
      const data = await teamService.getAllTeams();
      console.log("API DATA:", data);
      
      setTeams(data);
      setFilteredTeams(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-semibold">
        Loading Teams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-600 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Browse Teams
        </h1>

        <p className="text-gray-500 mt-2">
          Find the perfect team for your next project or hackathon.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={20}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Team List */}
      {filteredTeams.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No Teams Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try searching with a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;