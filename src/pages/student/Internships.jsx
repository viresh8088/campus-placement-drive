import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Btn, Badge, Card } from "../../components/ui";

export default function Internships({ user }) {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("All");
  const [applying, setApplying] = useState(null);
  const [appliedSet, setAppliedSet] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      const [data, apps] = await Promise.all([
        API.internships.getAll(),
        API.internships.getApplications(),
      ]);
      setInternships(data);
      const myApplied = apps
        .filter((a) => a.studentId === user.id)
        .map((a) => a.internshipId);
      setAppliedSet(new Set(myApplied));
    };
    load();
  }, [user.id]);

  const handleApply = async (id, company) => {
    setApplying(id);
    try {
      await API.internships.apply(id, user.id);
      setAppliedSet((prev) => new Set([...prev, id]));
      alert(`Successfully applied to ${company} internship!`);
    } catch (err) {
      alert(err.message || "Application failed.");
    } finally {
      setApplying(null);
    }
  };

  const filtered = internships.filter(
    (i) => filter === "All" || i.status === filter
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internships</h1>
          <p className="text-slate-500 text-sm">
            Browse and apply for internship opportunities
          </p>
        </div>
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
      </header>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">No internships found</p>
          <p className="text-slate-400 text-sm mt-1">Check back later for new opportunities</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const isApplied = appliedSet.has(item.id);
              const cgpaReq = item.eligibility.includes("≥")
                ? parseFloat(item.eligibility.split("≥")[1])
                : 0;
              const isEligible = (user.cgpa || 0) >= cgpaReq;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 font-bold text-lg shrink-0">
                          {item.company.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {item.company}
                            </h3>
                            <Badge
                              label={item.status}
                              bg={item.status === "Open" ? "#DCFCE7" : "#FEE2E2"}
                              color={item.status === "Open" ? "#166534" : "#991B1B"}
                            />
                          </div>
                          <p className="text-slate-600 font-medium">
                            {item.role} &bull;{" "}
                            <span className="text-purple-600">{item.stipend}</span>
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                            <span>Duration: <strong className="text-slate-700">{item.duration}</strong></span>
                            <span>Mode: <strong className="text-slate-700">{item.mode}</strong></span>
                            <span>Location: <strong className="text-slate-700">{item.location}</strong></span>
                          </div>
                          <p className="text-slate-400 text-xs mt-1.5 italic">
                            {item.eligibility}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className="text-xs text-slate-500">
                          Deadline: <strong>{item.deadline}</strong>
                        </span>
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-xl border border-green-200">
                            Applied
                          </span>
                        ) : !isEligible ? (
                          <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-500 bg-red-50 rounded-xl border border-red-200">
                            Not Eligible
                          </span>
                        ) : item.status !== "Open" ? (
                          <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                            Closed
                          </span>
                        ) : (
                          <Btn
                            loading={applying === item.id}
                            onClick={() => handleApply(item.id, item.company)}
                            className="min-w-[120px] !bg-purple-600 hover:!bg-purple-700"
                          >
                            Apply Now
                          </Btn>
                        )}
                      </div>
                    </div>
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
