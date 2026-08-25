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
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load profile.");
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
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      {editing ? (
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-3xl font-bold">
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