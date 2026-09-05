import { useEffect, useState } from "react";

import profileService from "../services/profileService";

import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import CompletionCard from "../components/CompletionCard";
import AcademicCard from "../components/AcademicCard";
import AboutCard from "../components/AboutCard";
import SkillsCard from "../components/SkillsCard";
import LinksCard from "../components/LinksCard";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error("Profile load error:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again to view your profile.");
      } else {
        setError(err.response?.data?.detail || "Could not load profile. Please make sure the server is reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      await profileService.updateProfile(formData);
      await loadProfile();
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold text-slate-700 dark:text-slate-200">
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-lg mt-24 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Unable to Load Profile
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          {error || "Profile information could not be retrieved."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={loadProfile}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      {editing ? (
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="mb-8 text-3xl font-bold text-slate-800 dark:text-white">
            Edit Profile
          </h1>

          <EditProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <>
          <ProfileHeader
            profile={profile}
            onEdit={() => setEditing(true)}
            onProfileUpdated={setProfile}
          />

          <div className="mt-8">
            <ProfileStats profile={profile} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <AboutCard profile={profile} />

              <SkillsCard profile={profile} />

              <AcademicCard profile={profile} />
            </div>

            <div className="space-y-8">
              <CompletionCard profile={profile} />

              <LinksCard profile={profile} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;