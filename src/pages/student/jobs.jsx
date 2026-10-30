import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Btn, Badge, Card } from "../../components/ui";

const StudentJobs = ({ user }) => {
  const [drives, setDrives] = useState([]);
  const [filter, setFilter] = useState("All");
  const [applying, setApplying] = useState(null);
  const [appliedDrives, setAppliedDrives] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const [driveData, allApps] = await Promise.all([
        API.drives.getAll(),
        API.applications.getAll(),
      ]);
      setDrives(driveData);
      // Pre-load already applied drives for this user
      const myApplied = allApps
        .filter((a) => a.studentId === user.id)
        .map((a) => a.driveId);
      setAppliedDrives(new Set(myApplied));
    };
    fetchData();
  }, [user.id]);

  const handleApply = async (driveId, companyName) => {
    setApplying(driveId);
    try {
      await API.drives.apply(driveId, user.id);
      setAppliedDrives((prev) => new Set([...prev, driveId]));
      alert(`Successfully applied to ${companyName}!`);
    } catch (err) {
      alert(err.message || "Application failed. Please try again.");
    } finally {
      setApplying(null);
    }
  };

  const filteredDrives = drives.filter((d) => {
    return filter === "All" || d.status === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Placement Drives</h1>
          <p className="text-slate-500 text-sm">
            Explore and apply for upcoming recruitment events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          {["All", "Open", "Ongoing"].map((s) => (
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

      {filteredDrives.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">
            No drives found
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Check back later for new opportunities
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDrives.map((drive) => {
              const isApplied = appliedDrives.has(drive.id);
              const cgpaReq = drive.eligibility.includes("≥")
                ? parseFloat(drive.eligibility.split("≥")[1])
                : 0;
              const isEligible = (user.cgpa || 0) >= cgpaReq;

              return (
                <motion.div
                  key={drive.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        {/* Company Avatar */}
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
                                drive.status === "Open" ? "#DCFCE7" : "#FEF3C7"
                              }
                              color={
                                drive.status === "Open" ? "#166534" : "#92400E"
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

                          {/* Recruitment Rounds */}
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
                        {isApplied ? (
                          <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-green-700 bg-green-50 rounded-xl border border-green-200">
                            Applied
                          </span>
                        ) : !isEligible ? (
                          <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-500 bg-red-50 rounded-xl border border-red-200">
                            Not Eligible
                          </span>
                        ) : drive.status !== "Open" ? (
                          <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                            Closed
                          </span>
                        ) : (
                          <Btn
                            loading={applying === drive.id}
                            onClick={() =>
                              handleApply(drive.id, drive.company)
                            }
                            className="min-w-[120px]"
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
};

export default StudentJobs;
