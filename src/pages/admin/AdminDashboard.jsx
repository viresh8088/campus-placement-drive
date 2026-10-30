import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { API } from "../../services/api";
import { Card } from "../../components/ui";

export default function AdminDashboard() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);
  const [internApps, setInternApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [d, a, s, i, ia] = await Promise.all([
        API.drives.getAll(),
        API.applications.getAll(),
        API.students.getAll(),
        API.internships.getAll(),
        API.internships.getApplications(),
      ]);
      setDrives([...d]);
      setApplications([...a]);
      setStudents([...s]);
      setInternships([...i]);
      setInternApps([...ia]);
    };
    
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const placedCount = students.filter((s) => s.status === "Placed").length;
  const openDrives = drives.filter((d) => d.status === "Open").length;

  // Build chart data: applications per drive
  const chartData = drives.map((drive) => ({
    name: drive.company,
    applications: applications.filter((a) => a.driveId === drive.id).length,
  }));

  const stats = [
    { label: "Total Students", value: students.length, color: "blue" },
    { label: "Placed", value: placedCount, color: "green" },
    { label: "Total Drives", value: drives.length, color: "amber" },
    { label: "Drive Applications", value: applications.length, color: "rose" },
    { label: "Total Internships", value: internships.length, color: "purple" },
    { label: "Internship Applications", value: internApps.length, color: "indigo" },
    { label: "Open Drives", value: openDrives, color: "teal" },
    { label: "Placement Rate", value: students.length > 0 ? Math.round((placedCount / students.length) * 100) + "%" : "0%", color: "emerald" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Officer Dashboard</h1>
        <p className="text-slate-500 text-sm">Placement overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Applications per Drive</h2>
          {chartData.length === 0 ? (
            <p className="text-sm text-slate-400">No drives yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Applications per Internship</h2>
          {internships.length === 0 ? (
            <p className="text-sm text-slate-400">No internships yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={internships.map((i) => ({ name: i.company, applications: internApps.filter((a) => a.internshipId === i.id).length }))}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#9333EA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Recent Drive Applications</h2>
          {applications.length === 0 ? (
            <p className="text-sm text-slate-400">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(-5).reverse().map((app) => {
                const drive = drives.find((d) => d.id === app.driveId);
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {app.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{app.studentName}</p>
                        <p className="text-xs text-slate-400">{app.branch} &bull; CGPA {app.cgpa}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{drive ? drive.company : "Unknown"}</p>
                      <p className="text-xs text-slate-400">{app.appliedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Recent Internship Applications</h2>
          {internApps.length === 0 ? (
            <p className="text-sm text-slate-400">No internship applications yet.</p>
          ) : (
            <div className="space-y-3">
              {internApps.slice(-5).reverse().map((app) => {
                const intern = internships.find((i) => i.id === app.internshipId);
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-xs">
                        {app.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{app.studentName}</p>
                        <p className="text-xs text-slate-400">{app.branch} &bull; CGPA {app.cgpa}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-700">{intern ? intern.company : "Unknown"}</p>
                      <p className="text-xs text-slate-400">{app.appliedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
