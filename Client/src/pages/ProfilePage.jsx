import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      setSaving(false);
      navigate("/");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      await updateProfile({
        profilePic: reader.result,
        fullName: name,
        bio,
      });

      setSaving(false);
      navigate("/");
    };

    reader.readAsDataURL(selectedImg);
  };

  const preview = selectedImg
    ? URL.createObjectURL(selectedImg)
    : authUser?.profilePic || assets.avatar_icon;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl md:grid md:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600/20 to-cyan-500/10 p-8 text-center">
          <img
            src={preview}
            alt="Profile preview"
            className="h-36 w-36 rounded-full object-cover ring-4 ring-violet-500/30"
          />
          <h1 className="mt-5 text-2xl font-bold">{name || "Your Name"}</h1>
          <p className="mt-2 max-w-xs text-sm text-gray-400">{bio || "Your bio will appear here."}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-6 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
          >
            ← Back to chat
          </button>

          <h2 className="text-3xl font-bold">Profile details</h2>
          <p className="mt-1 text-sm text-gray-400">Update your display name, bio and profile image.</p>

          <label htmlFor="avatar" className="mt-8 flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img src={preview} alt="" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold">Upload profile image</p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
            </div>
          </label>

          <div className="mt-6 space-y-4">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
            />

            <div>
              <textarea
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                value={bio}
                placeholder="Write profile bio"
                required
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                rows={4}
              />
              <p className="mt-1 text-right text-xs text-gray-500">{bio.length}/150</p>
            </div>
          </div>

          <button
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 p-3 font-semibold text-white shadow-lg shadow-violet-900/30 disabled:opacity-60"
            type="submit"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;