import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Card, Input, Btn, Badge } from "../../components/ui";

const emptyForm = {
  company: "",
  role: "",
  ctc: "",
  eligibility: "",
  status: "Open",
  date: "",
  rounds: "",
};

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expandedDrive, setExpandedDrive] = useState(null);

  const fetchDrives = async () => {
    const data = await API.drives.getAll();
    setDrives([...data]);
  };

  const fetchAllApplications = async () => {
    const allApps = await API.applications.getAll();
    const grouped = {};
    allApps.forEach((app) => {
      if (!grouped[app.driveId]) grouped[app.driveId] = [];
      grouped[app.driveId].push(app);
    });
    setApplications(grouped);
  };

  useEffect(() => {
    const load = () => {
      fetchDrives();
      fetchAllApplications();
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (drive) => {
    setForm({
      company: drive.company,
      role: drive.role,
      ctc: drive.ctc,
      eligibility: drive.eligibility,
      status: drive.status,
      date: drive.date,
      rounds: drive.rounds.join(", "),
    });
    setEditingId(drive.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      rounds: form.rounds
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await API.drives.update(editingId, payload);
      } else {
        await API.drives.create(payload);
      }
      await fetchDrives();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this drive?")) return;
    setDeleting(id);
    try {
      await API.drives.delete(id);
      await fetchDrives();
    } catch {
      alert("Failed to delete drive.");
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpand = (driveId) => {
    setExpandedDrive((prev) => (prev === driveId ? null : driveId));
  };

  const filteredDrives = drives.filter(
    (d) => filter === "All" || d.status === filter
  );

  const totalApplications = Object.values(applications).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Drives</h1>
          <p className="text-slate-500 text-sm">
            Create, edit, and manage placement drives
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {["All", "Open", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === s
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Btn onClick={openAddForm} className="gap-1.5">
            <span className="text-lg leading-none">+</span> New Drive
          </Btn>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Drives</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{drives.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{totalApplications}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Drives</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">{drives.filter((d) => d.status === "Open").length}</p>
        </Card>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {editingId ? "Edit Drive" : "Add New Drive"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="e.g. Google"
                    value={form.company}
                    onChange={handleChange("company")}
                    required
                  />
                  <Input
                    label="Role"
                    placeholder="e.g. Software Engineer"
                    value={form.role}
                    onChange={handleChange("role")}
                    required
                  />
                  <Input
                    label="CTC / Package"
                    placeholder="e.g. 34 LPA"
                    value={form.ctc}
                    onChange={handleChange("ctc")}
                    required
                  />
                  <Input
                    label="Eligibility"
                    placeholder="e.g. CGPA >= 8.0"
                    value={form.eligibility}
                    onChange={handleChange("eligibility")}
                    required
                  />
                  <Input
                    label="Drive Date"
                    type="date"
                    value={form.date}
                    onChange={handleChange("date")}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={handleChange("status")}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Rounds (comma-separated)"
                  placeholder="e.g. Aptitude, Technical, HR"
                  value={form.rounds}
                  onChange={handleChange("rounds")}
                  required
                />
                <div className="flex items-center gap-3 pt-2">
                  <Btn type="submit" loading={saving}>
                    {editingId ? "Update Drive" : "Create Drive"}
                  </Btn>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drive List */}
      {filteredDrives.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">
            No drives found
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Click "New Drive" to create one
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDrives.map((drive) => {
              const driveApps = applications[drive.id] || [];
              const isExpanded = expandedDrive === drive.id;

              return (
                <motion.div
                  key={drive.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-600 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
                            {drive.company.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">
                                {drive.company}
                              </h3>
                              <Badge
                                label={drive.status}
                                bg={
                                  drive.status === "Open"
                                    ? "#DCFCE7"
                                    : drive.status === "Ongoing"
                                    ? "#FEF3C7"
                                    : "#FEE2E2"
                                }
                                color={
                                  drive.status === "Open"
                                    ? "#166534"
                                    : drive.status === "Ongoing"
                                    ? "#92400E"
                                    : "#991B1B"
                                }
                              />
                            </div>
                            <p className="text-slate-600 font-medium">
                              {drive.role} &bull;{" "}
                              <span className="text-blue-600">{drive.ctc}</span>
                            </p>
                            <p className="text-slate-400 text-xs mt-1 italic">
                              {drive.eligibility}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {drive.rounds.map((round) => (
                                <span
                                  key={round}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase"
                                >
                                  {round}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <span className="text-sm text-slate-500 font-medium">
                            {drive.date}
                          </span>
                          {/* Application count badge */}
                          <button
                            onClick={() => toggleExpand(drive.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              driveApps.length > 0
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-slate-50 text-slate-400"
                            }`}
                          >
                            {driveApps.length} Applied
                            <span className={`ml-1 transition-transform inline-block ${isExpanded ? "rotate-180" : ""}`}>
                              &#9660;
                            </span>
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditForm(drive)}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(drive.id)}
                              disabled={deleting === drive.id}
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deleting === drive.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Applicants Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 bg-slate-50/50">
                            {driveApps.length === 0 ? (
                              <div className="p-6 text-center text-slate-400 text-sm">
                                No students have applied yet.
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                  <thead>
                                    <tr className="border-b border-slate-200">
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Student</th>
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Roll No</th>
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Branch</th>
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">CGPA</th>
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Applied On</th>
                                      <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">Resume</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {driveApps.map((app) => (
                                      <tr key={app.id} className="border-b border-slate-100 last:border-b-0">
                                        <td className="px-5 py-3">
                                          <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                              {app.studentName.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div>
                                              <p className="font-semibold text-slate-900">{app.studentName}</p>
                                              <p className="text-xs text-slate-400">{app.email}</p>
                                              {app.phone && <p className="text-[10px] font-mono text-slate-500 mt-0.5">{app.phone}</p>}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-xs text-slate-600">{app.rollNumber}</td>
                                        <td className="px-5 py-3 text-slate-600">{app.branch}</td>
                                        <td className="px-5 py-3 font-bold text-slate-800">{app.cgpa}</td>
                                        <td className="px-5 py-3 text-slate-500">{app.appliedAt}</td>
                                        <td className="px-5 py-3">
                                          {app.resume_url ? (
                                            <a href={`http://localhost:5000${app.resume_url}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-1.5 transition-colors inline-block text-center">
                                              Resume PDF
                                            </a>
                                          ) : (
                                            <span className="text-xs text-slate-300">N/A</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="px-5 py-2.5 text-xs text-slate-400 border-t border-slate-100">
                                  {driveApps.length} student{driveApps.length !== 1 ? "s" : ""} applied
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
