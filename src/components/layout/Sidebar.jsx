import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Building2, GraduationCap, Users, Briefcase, FileText, Sparkles, User } from "lucide-react";

export default function Sidebar({ active, setActive, user, onLogout }) {
  const isOfficer = user?.role === "officer";

  const menuItems = isOfficer
    ? [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "drives", label: "Manage Drives", icon: <Building2 size={20} /> },
        { id: "internships", label: "Manage Internships", icon: <GraduationCap size={20} /> },
        { id: "students", label: "Students", icon: <Users size={20} /> },
      ]
    : [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "profile", label: "Profile", icon: <User size={20} /> },
        { id: "jobs", label: "Jobs", icon: <Briefcase size={20} /> },
        { id: "internships", label: "Internships", icon: <GraduationCap size={20} /> },
        { id: "applications", label: "Applications", icon: <FileText size={20} /> },
      ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold font-serif text-slate-900">SmartPlace</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="mb-4 px-3 text-xs font-semibold text-slate-400 tracking-wider uppercase">Menu</div>
        {menuItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center justify-center w-6">{item.icon}</span>
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
