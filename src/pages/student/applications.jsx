import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../../services/api";
import { Card, Badge } from "../../components/ui";

export default function Applications({ user }) {
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [allApps, allDrives] = await Promise.all([
        API.applications.getAll(),
        API.drives.getAll(),
      ]);
      setApplications(allApps.filter((a) => a.studentId === user.id));
      setDrives(allDrives);
      setLoading(false);
    };
    load();
  }, [user.id]);

  const getDrive = (driveId) => drives.find((d) => d.id === driveId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 text-sm">
          Track the status of all your drive applications
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Applied
          </p>
          <p className="text-3xl font-bold mt-1 text-blue-600">
            {applications.length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Open Drives Applied
          </p>
          <p className="text-3xl font-bold mt-1 text-green-600">
            {applications.filter((a) => {
              const d = getDrive(a.driveId);
              return d && d.status === "Open";
            }).length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            CGPA
          </p>
          <p className="text-3xl font-bold mt-1 text-amber-600">
            {user.cgpa || "N/A"}
          </p>
        </Card>
      </div>

      {/* Application List */}
      {loading ? (
        <Card className="p-12 text-center">
          <span className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block" />
        </Card>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-lg font-semibold">
            No applications yet
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Head to the Jobs page to apply for placement drives
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {applications.map((app) => {
              const drive = getDrive(app.driveId);
              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                          {drive ? drive.company.slice(0, 2) : "??"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-900">
                              {drive ? drive.company : "Unknown Drive"}
                            </h3>
                            {drive && (
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
                            )}
                          </div>
                          {drive && (
                            <p className="text-slate-600 font-medium text-sm">
                              {drive.role} &bull;{" "}
                              <span className="text-blue-600">{drive.ctc}</span>
                            </p>
                          )}
                          {drive && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {drive.rounds.map((round) => (
                                <span
                                  key={round}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase"
                                >
                                  {round}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          label="Applied"
                          bg="#DBEAFE"
                          color="#1D4ED8"
                        />
                        <span className="text-xs text-slate-400">
                          {app.appliedAt}
                        </span>
                        {drive && (
                          <span className="text-xs text-slate-500">
                            Drive: {drive.date}
                          </span>
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
