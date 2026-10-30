import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Card, Badge, Input, Btn } from "../../components/ui";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    const data = await API.students.getAll();
    setStudents([...data]);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const branches = ["All", ...new Set(students.map((s) => s.branch))];

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchBranch = branchFilter === "All" || s.branch === branchFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchBranch && matchStatus;
  });

  const placedCount = students.filter((s) => s.status === "Placed").length;
  const avgCgpa =
    students.length > 0
      ? (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)
      : "0";

  const openEdit = (student) => {
    setEditingStudent(student.id);
    setEditForm({
      name: student.name,
      email: student.email,
      branch: student.branch,
      cgpa: student.cgpa,
      status: student.status,
      placedAt: student.placedAt || "",
    });
  };

  const handleEditChange = (field) => (e) =>
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.students.update(editingStudent, {
        ...editForm,
        cgpa: parseFloat(editForm.cgpa),
        placedAt: editForm.placedAt || null,
      });
      await fetchStudents();
      setEditingStudent(null);
    } catch {
      alert("Failed to update student.");
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
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 text-sm">
          View and manage all registered students
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: students.length, color: "blue" },
          { label: "Placed", value: placedCount, color: "green" },
          { label: "Avg CGPA", value: avgCgpa, color: "amber" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 text-${stat.color}-600`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, roll no, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
        />
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
        >
          {branches.map((b) => (
            <option key={b} value={b}>
              {b === "All" ? "All Branches" : b}
            </option>
          ))}
        </select>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          {["All", "Placed", "Not Placed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Edit Student
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    value={editForm.name}
                    onChange={handleEditChange("name")}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange("email")}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Branch
                    </label>
                    <select
                      value={editForm.branch}
                      onChange={handleEditChange("branch")}
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
                    type="number"
                    value={editForm.cgpa}
                    onChange={handleEditChange("cgpa")}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Placement Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={handleEditChange("status")}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-800"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Not Placed">Not Placed</option>
                    </select>
                  </div>
                  <Input
                    label="Placed At (Company)"
                    placeholder="e.g. Google"
                    value={editForm.placedAt}
                    onChange={handleEditChange("placedAt")}
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Btn type="submit" loading={saving}>
                    Save Changes
                  </Btn>
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
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

      {/* Student Table */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">
            No students found
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your filters
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Student
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Roll No
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Branch
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    CGPA
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                    Placed At
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((student) => (
                    <motion.tr
                      key={student.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {student.email}
                            </p>
                            {student.phone && (
                              <p className="text-xs text-slate-400 font-mono mt-0.5">
                                {student.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">
                        {student.rollNumber}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {student.branch}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {student.cgpa}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          label={student.status}
                          bg={
                            student.status === "Placed" ? "#DCFCE7" : "#FEF3C7"
                          }
                          color={
                            student.status === "Placed" ? "#166534" : "#92400E"
                          }
                        />
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {student.placedAt || (
                          <span className="text-slate-300">--</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {student.resume_url && (
                            <a
                              href={`http://localhost:5000${student.resume_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              Resume
                            </a>
                          )}
                          <button
                            onClick={() => openEdit(student)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400">
            Showing {filtered.length} of {students.length} students
          </div>
        </Card>
      )}
    </motion.div>
  );
}
