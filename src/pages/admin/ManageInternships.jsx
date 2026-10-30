import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Card, Input, Btn, Badge } from "../../components/ui";

const emptyForm = {
  company: "",
  role: "",
  stipend: "",
  duration: "",
  eligibility: "",
  status: "Open",
  deadline: "",
  mode: "On-site",
  location: "",
};

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = async () => {
    const [items, apps] = await Promise.all([
      API.internships.getAll(),
      API.internships.getApplications(),
    ]);
    setInternships([...items]);
    const grouped = {};
    apps.forEach((a) => {
      if (!grouped[a.internshipId]) grouped[a.internshipId] = [];
      grouped[a.internshipId].push(a);
    });
    setApplications(grouped);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      company: item.company,
      role: item.role,
      stipend: item.stipend,
      duration: item.duration,
      eligibility: item.eligibility,
      status: item.status,
      deadline: item.deadline,
      mode: item.mode,
      location: item.location,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await API.internships.update(editingId, form);
      } else {
        await API.internships.create(form);
      }
      await fetchData();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this internship?")) return;
    setDeleting(id);
    try {
      await API.internships.delete(id);
      await fetchData();
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = internships.filter(
    (i) => filter === "All" || i.status === filter
  );

  const totalApps = Object.values(applications).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Internships</h1>
          <p className="text-slate-500 text-sm">Create, edit, and manage internship listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {["All", "Open", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === s
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Btn onClick={openAdd} className="gap-1.5 !bg-purple-600 hover:!bg-purple-700">
            <span className="text-lg leading-none">+</span> New Internship
          </Btn>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Internships</p>
          <p className="text-3xl font-bold mt-1 text-purple-600">{internships.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{totalApps}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Internships</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">{internships.filter((i) => i.status === "Open").length}</p>
        </Card>
      </div>

      {/* Form */}
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
                {editingId ? "Edit Internship" : "Add New Internship"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Company" placeholder="e.g. Amazon" value={form.company} onChange={handleChange("company")} required />
                  <Input label="Role" placeholder="e.g. SDE Intern" value={form.role} onChange={handleChange("role")} required />
                  <Input label="Stipend" placeholder="e.g. 80K/month" value={form.stipend} onChange={handleChange("stipend")} required />
                  <Input label="Duration" placeholder="e.g. 3 Months" value={form.duration} onChange={handleChange("duration")} required />
                  <Input label="Eligibility" placeholder="e.g. CGPA >= 7.5" value={form.eligibility} onChange={handleChange("eligibility")} required />
                  <Input label="Location" placeholder="e.g. Bangalore" value={form.location} onChange={handleChange("location")} required />
                  <Input label="Deadline" type="date" value={form.deadline} onChange={handleChange("deadline")} required />
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Status</label>
                      <select value={form.status} onChange={handleChange("status")} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm text-slate-800">
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700">Mode</label>
                      <select value={form.mode} onChange={handleChange("mode")} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm text-slate-800">
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Btn type="submit" loading={saving} className="!bg-purple-600 hover:!bg-purple-700">
                    {editingId ? "Update" : "Create Internship"}
                  </Btn>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">No internships found</p>
          <p className="text-slate-400 text-sm mt-1">Click "New Internship" to create one</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const apps = applications[item.id] || [];
              const isExpanded = expandedId === item.id;
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 font-bold text-lg shrink-0">
                            {item.company.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{item.company}</h3>
                              <Badge label={item.status} bg={item.status === "Open" ? "#DCFCE7" : "#FEE2E2"} color={item.status === "Open" ? "#166534" : "#991B1B"} />
                            </div>
                            <p className="text-slate-600 font-medium">{item.role} &bull; <span className="text-purple-600">{item.stipend}</span></p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                              <span>Duration: <strong className="text-slate-700">{item.duration}</strong></span>
                              <span>Mode: <strong className="text-slate-700">{item.mode}</strong></span>
                              <span>Location: <strong className="text-slate-700">{item.location}</strong></span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1 italic">{item.eligibility}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <span className="text-xs text-slate-500">Deadline: <strong>{item.deadline}</strong></span>
                          <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${apps.length > 0 ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-slate-50 text-slate-400"}`}>
                            {apps.length} Applied
                            <span className={`ml-1 transition-transform inline-block ${isExpanded ? "rotate-180" : ""}`}>&#9660;</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">Edit</button>
                            <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50">{deleting === item.id ? "..." : "Delete"}</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applicants */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t border-slate-100 bg-slate-50/50">
                            {apps.length === 0 ? (
                              <div className="p-6 text-center text-slate-400 text-sm">No students have applied yet.</div>
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
                                    {apps.map((app) => (
                                      <tr key={app.id} className="border-b border-slate-100 last:border-b-0">
                                        <td className="px-5 py-3">
                                          <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
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
                                  {apps.length} student{apps.length !== 1 ? "s" : ""} applied
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
