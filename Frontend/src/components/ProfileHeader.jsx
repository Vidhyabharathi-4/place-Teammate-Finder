import { useRef, useState, useEffect } from "react";
import {
  Mail,
  GraduationCap,
  Calendar,
  Pencil,
  Camera,
  Award,
  MessageSquare,
  BadgeCheck,
  Share2,
  Copy,
  Check,
  UserPlus,
  UserCheck,
  Hash,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import profileService from "../services/profileService";
import { getImageUrl } from "../utils/imageUrl";
import { useAuth } from "../context/AuthContext";

function ProfileHeader({
  profile,
  onEdit,
  onProfileUpdated,
  isOtherUser = false,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user: currentUser } = useAuth();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(18);

  const candidateId = `RTC-${String(profile?.id || 1).padStart(4, "0")}`;
  const profileUrl = `${window.location.origin}/profile/${profile?.id}`;

  // Initialize Follow State from localStorage
  useEffect(() => {
    if (isOtherUser && profile?.id && currentUser?.id) {
      const storageKey = `followed_candidates_${currentUser.id}`;
      const savedFollows = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const following = savedFollows.includes(profile.id);
      setIsFollowing(following);
      setFollowerCount(18 + (following ? 1 : 0));
    }
  }, [isOtherUser, profile?.id, currentUser?.id]);

  const toggleFollow = () => {
    if (!currentUser?.id || !profile?.id) return;
    const storageKey = `followed_candidates_${currentUser.id}`;
    const savedFollows = JSON.parse(localStorage.getItem(storageKey) || "[]");

    let updatedFollows;
    if (isFollowing) {
      updatedFollows = savedFollows.filter((id) => id !== profile.id);
      setIsFollowing(false);
      setFollowerCount((prev) => Math.max(0, prev - 1));
    } else {
      updatedFollows = [...savedFollows, profile.id];
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
    localStorage.setItem(storageKey, JSON.stringify(updatedFollows));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(candidateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

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
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all">
      {/* Hidden File Input for Avatar */}
      {!isOtherUser && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {/* Modern SaaS Cover Banner with Gradient Mesh & Ambient Backlight */}
      <div className="relative h-44 sm:h-56 md:h-64 bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-auto">
          {/* Institution Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white/90 border border-white/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rathinam Campus Talent</span>
          </div>

          {/* Profile Strength Indicator */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/10 shadow-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-white text-xs font-bold tracking-wide">
              {profile?.profile_completion ?? 20}% Profile Strength
            </span>
          </div>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-5 sm:px-8 lg:px-10 pb-8">
        {/* Action Row: Avatar overlapping cover + Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-20 sm:-mt-24 md:-mt-28 mb-5">
          {/* Avatar with Status Ring */}
          <div className="relative group">
            <div
              onClick={handleAvatarClick}
              className={`relative h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 rounded-full border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ${
                !isOtherUser ? "cursor-pointer" : ""
              }`}
              title={!isOtherUser ? "Click to change profile picture" : profile?.name}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={profile?.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-5xl sm:text-6xl select-none">
                  {(profile?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}

              {!isOtherUser && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs">
                  <Camera className="text-white mb-1" size={24} />
                  <span className="text-[11px] font-semibold text-white">Change Photo</span>
                </div>
              )}
            </div>

            {/* Online Status Dot */}
            <span
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-xs"
              title="Active Candidate"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            {isOtherUser ? (
              <>
                {/* Send Direct Message Button */}
                <button
                  onClick={() => navigate(`/chat?user=${profile?.id}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 shadow-md shadow-blue-500/25 transition transform active:scale-98"
                >
                  <MessageSquare size={16} />
                  <span>Send Direct Message</span>
                </button>

                {/* Follow / Following Button */}
                <button
                  onClick={toggleFollow}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold text-xs sm:text-sm px-4 py-2.5 border transition ${
                    isFollowing
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2.5 transition"
                  title="Copy Profile URL"
                >
                  {copiedLink ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                  <span className="hidden sm:inline">{copiedLink ? "Copied!" : "Share"}</span>
                </button>
              </>
            ) : (
              <>
                {/* Edit Profile Button */}
                <button
                  onClick={onEdit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 shadow-md shadow-blue-500/25 transition"
                >
                  <Pencil size={16} />
                  <span>Edit Profile</span>
                </button>

                {/* Share Profile Button */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 transition"
                >
                  {copiedLink ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                  <span>{copiedLink ? "Profile Link Copied!" : "Share Profile"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Candidate Identity, Handles & Badges */}
        <div className="space-y-3 text-center sm:text-left">
          {/* Name & Verification */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile?.name}
            </h1>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold shrink-0 self-center sm:self-auto shadow-2xs">
              <BadgeCheck size={15} className="text-blue-600 dark:text-blue-400" />
              <span>Verified Student</span>
            </div>
          </div>

          {/* Candidate ID & Handle Row (LinkedIn style) */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs">
            {/* Click to Copy Candidate ID */}
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-mono font-bold"
              title="Click to copy Candidate ID"
            >
              <Hash size={13} className="text-slate-400" />
              <span>{candidateId}</span>
              {copiedId ? <Check size={12} className="text-green-600" /> : <Copy size={12} className="text-slate-400" />}
            </button>

            {/* Register Number */}
            {profile?.register_number && (
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-medium">
                REG: {profile.register_number}
              </span>
            )}

            {/* Follower Stats */}
            <span className="text-slate-500 dark:text-slate-400 font-medium pl-1">
              <strong className="text-slate-800 dark:text-slate-200">{followerCount}</strong> followers
            </span>
          </div>

          {/* Academic Credentials Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            {profile?.department && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                <GraduationCap size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{profile.department}</span>
              </div>
            )}

            {profile?.year && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Year {profile.year}</span>
              </div>
            )}

            {profile?.specialization && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold">
                <Award size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>{profile.specialization} Track</span>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <Mail size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium break-all">{profile?.college_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;