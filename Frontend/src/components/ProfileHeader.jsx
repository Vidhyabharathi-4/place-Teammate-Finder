import { useRef } from "react";
import {
  Mail,
  GraduationCap,
  Calendar,
  Pencil,
  Star,
  Camera,
  Award,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../services/profileService";
import { getImageUrl } from "../utils/imageUrl";

function ProfileHeader({
  profile,
  onEdit,
  onProfileUpdated,
  isOtherUser = false,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (isOtherUser) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updatedProfile = await profileService.uploadProfilePhoto(file);
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
      {!isOtherUser && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {/* Banner */}
      <div className="relative h-40 sm:h-52 md:h-60 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700">
        {/* Profile Score Chip in Top Right */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full bg-black/25 backdrop-blur-md px-3.5 py-1.5 sm:px-5 sm:py-2 border border-white/20">
          <div className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-bold">
            <Star size={16} fill="white" />
            <span>{profile?.profile_completion ?? 20}% Profile Score</span>
          </div>
        </div>
      </div>

      {/* Profile Details Container */}
      <div className="px-6 sm:px-10 pb-8">
        {/* Top Action Row: Avatar overlapping banner + Action button */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 md:-mt-24 mb-4">
          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            className={`relative h-32 w-32 sm:h-36 sm:w-36 md:h-44 md:w-44 shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-slate-800 shadow-xl group bg-white ${
              !isOtherUser ? "cursor-pointer" : ""
            }`}
            title={!isOtherUser ? "Click to change profile picture" : profile?.name}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-blue-200 text-6xl sm:text-7xl">
                👤
              </div>
            )}

            {!isOtherUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="text-white" size={28} />
              </div>
            )}
          </div>

          {/* Action Button: "Message" for other users, "Edit Profile" for self */}
          {isOtherUser ? (
            <button
              onClick={() => navigate(`/chat?user=${profile?.id}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-md transition shrink-0"
            >
              <MessageSquare size={18} />
              <span>Message</span>
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-md transition shrink-0"
            >
              <Pencil size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* User Name & Badges Row */}
        <div className="text-center sm:text-left pt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {profile?.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
            {profile?.department && (
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 px-3.5 py-1 text-xs sm:text-sm font-semibold">
                <GraduationCap size={15} />
                <span>{profile.department}</span>
              </div>
            )}

            {profile?.year && (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1 text-xs sm:text-sm font-semibold">
                <Calendar size={15} />
                <span>Year {profile.year}</span>
              </div>
            )}

            {profile?.specialization && (
              <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-3.5 py-1 text-xs sm:text-sm font-semibold">
                <Award size={15} />
                <span>{profile.specialization}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <Mail size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium break-all">{profile?.college_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;