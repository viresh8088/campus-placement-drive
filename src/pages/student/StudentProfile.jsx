import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, Input, Btn } from "../../components/ui";
import { API } from "../../services/api";

export default function StudentProfile({ user, onUpdateSession }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    branch: user.branch || "CS",
    roll_number: user.roll_number || "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Using FormData to handle file upload
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    
    try {
      const updatedUser = await API.users.updateProfile(user.id, formData);
      onUpdateSession(updatedUser); // Propagate user update to App.jsx session
      alert("Profile updated successfully!");
    } catch(err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm">
          Update your personal details and resume
        </p>
      </header>

      <Card className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Full Name" 
              value={form.name} 
              onChange={handleChange("name")} 
              required 
            />
            <Input 
              label="Email Address" 
              value={user.email} 
              disabled // Email cannot be changed here
            />
            <Input 
              label="Phone Number" 
              value={form.phone} 
              onChange={handleChange("phone")} 
              placeholder="e.g. +91 9876543210"
            />
            <Input 
              label="Roll Number" 
              value={form.roll_number} 
              onChange={handleChange("roll_number")} 
              placeholder="e.g. CS26B1020"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Branch
              </label>
              <select
                value={form.branch}
                onChange={handleChange("branch")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
              >
                <option value="Computer Science and Engineering (CSE)">Computer Science and Engineering (CSE)</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Electronics and Communication Engineering (ECE)">Electronics and Communication Engineering (ECE)</option>
                <option value="Electrical and Electronics Engineering (EEE)">Electrical and Electronics Engineering (EEE)</option>
                <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
              </select>
            </div>
            <Input 
              label="CGPA" 
              value={user.cgpa || "0"} 
              disabled // Cannot be updated by student directly
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Resume (PDF file)</label>
            <div className="flex flex-col gap-3">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 transition-all cursor-pointer border border-slate-200 rounded-xl"
              />
              {user.resume_url && !resumeFile && (
                 <a href={`http://localhost:5000${user.resume_url}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
                   View currently uploaded resume
                 </a>
              )}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-end">
             <Btn type="submit" loading={saving} className="px-8">
               Save Profile
             </Btn>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
