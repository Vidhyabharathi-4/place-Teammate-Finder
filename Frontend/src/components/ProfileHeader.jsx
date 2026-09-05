import { useRef } from "react";
import {
  Mail,
  GraduationCap,
  Calendar,
  Pencil,
  Star,
  Camera,
  Award,
} from "lucide-react";

import profileService from "../services/profileService";
import { getImageUrl } from "../utils/imageUrl";

function ProfileHeader({ profile, onEdit, onProfileUpdated }) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const updatedProfile =
        await profileService.uploadProfilePhoto(file);

      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }

      alert("Profile photo updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile photo.");
    }
  };

  const imageUrl = getImageUrl(profile?.profile_picture);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800">

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">

        {/* Profile Score */}
        <div className="absolute right-8 top-8 rounded-full bg-white/20 backdrop-blur-lg px-5 py-3">
          <div className="flex items-center gap-2 text-white">
            <Star size={18} fill="white" />
            <span className="font-bold text-lg">
              {profile?.profile_completion ?? 20}% Profile Score
            </span>
          </div>
        </div>

        {/* Avatar + Details */}
        <div className="absolute bottom-8 left-10 flex items-center gap-8">

          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-2xl group"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-blue-200 text-7xl">
                👤
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Camera className="text-white" size={32} />
            </div>
          </div>

          {/* Name */}
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              {profile?.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-lg px-4 py-2 text-white">
                <GraduationCap size={18} />
                <span className="font-medium">
                  {profile?.department || "Department"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-500/30 backdrop-blur-lg px-4 py-2 text-white">
                <Calendar size={18} />
                <span className="font-medium">
                  {profile?.year
                    ? `${profile.year} Year`
                    : "Year"}
                </span>
              </div>

              {profile?.specialization && (
                <div className="flex items-center gap-2 rounded-full bg-yellow-400/30 backdrop-blur-lg px-4 py-2 text-white font-medium border border-yellow-300/40">
                  <Award size={18} />
                  <span>{profile.specialization}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-10 py-6">

        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Mail size={20} />
          <span className="text-lg">
            {profile?.college_email}
          </span>
        </div>

        <button
          onClick={onEdit}
          className="mt-5 lg:mt-0 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <Pencil size={20} />
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default ProfileHeader;