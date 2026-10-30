import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../services/api";
import { Card, Badge } from "../../components/ui";

export default function Dashboard({ user, onNavigate }) {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [allDrives, allApps] = await Promise.all([
        API.drives.getAll(),
        API.applications.getAll(),
      ]);
      setDrives(allDrives);
      setApplications(allApps.filter((a) => a.studentId === user.id));
    };
    load();
  }, [user.id]);

  const openDrives = drives.filter((d) => d.status === "Open");
  const appliedIds = new Set(applications.map((a) => a.driveId));

  const stats = [
    { label: "Open Drives", value: openDrives.length, color: "blue" },
    { label: "My Applications", value: applications.length, color: "green" },
    { label: "Total Drives", value: drives.length, color: "amber" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user.name || user.email}
        </h1>
        <p className="text-slate-500 text-sm">
          Here's your placement overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
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

      {/* Recent Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Latest Drives</h3>
              {onNavigate && (
                <button
                  onClick={() => onNavigate("jobs")}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View All
                </button>
              )}
            </div>
            <div className="space-y-3">
              {drives.length === 0 ? (
                <p className="text-sm text-slate-400">No drives available yet.</p>
              ) : (
                drives.slice(0, 4).map((drive) => {
                  const applied = appliedIds.has(drive.id);
                  return (
                    <div
                      key={drive.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
                          {drive.company.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900">
                            {drive.company}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {drive.role} &bull; {drive.ctc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          label={drive.status}
                          bg={drive.status === "Open" ? "#DCFCE7" : "#FEF3C7"}
                          color={drive.status === "Open" ? "#166534" : "#92400E"}
                        />
                        {applied && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">
                            APPLIED
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Quick Info */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="font-bold text-slate-900 mb-3">Your Profile</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Roll No</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {user.rollNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch</span>
                <span className="font-semibold text-slate-800">
                  {user.branch || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CGPA</span>
                <span className="font-semibold text-slate-800">
                  {user.cgpa || "N/A"}
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-slate-900 mb-3">Notifications</h3>
            {applications.length > 0 ? (
              <ul className="text-sm space-y-2 text-slate-600">
                {applications.slice(0, 3).map((app) => {
                  const drive = drives.find((d) => d.id === app.driveId);
                  return (
                    <li key={app.id} className="flex items-start gap-2">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      Applied to {drive ? drive.company : "a drive"} on{" "}
                      {app.appliedAt}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                No notifications yet. Apply to drives to get started.
              </p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
