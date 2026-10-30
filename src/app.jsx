import React, { useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./components/layout/MainLayout";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentJobs from "./pages/student/jobs";
import Applications from "./pages/student/applications";
import ManageDrives from "./pages/admin/ManageDrives";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageInternships from "./pages/admin/ManageInternships";
import StudentInternships from "./pages/student/Internships";
import StudentProfile from "./pages/student/StudentProfile";

export default function App() {
  const [session, setSessionState] = useState(() => {
    const saved = localStorage.getItem("smartplace_session");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("dashboard");

  const setSession = (newSession) => {
    if (newSession) {
      localStorage.setItem("smartplace_session", JSON.stringify(newSession));
    } else {
      localStorage.removeItem("smartplace_session");
    }
    setSessionState(newSession);
  };

  if (!session) {
    if (authMode === "register") {
      return (
        <Register 
          onRegister={(res) => { setPage("dashboard"); setSession(res); }} 
          onNavigateLogin={() => setAuthMode("login")} 
        />
      );
    }
    return (
      <Login 
        onLogin={(res) => { setPage("dashboard"); setSession(res); }} 
        onNavigateRegister={() => setAuthMode("register")} 
      />
    );
  }

  const renderContent = () => {
    if (session.user.role === "officer") {
      if (page === "drives") return <ManageDrives />;
      if (page === "internships") return <ManageInternships />;
      if (page === "students") return <ManageStudents />;
      return <AdminDashboard />;
    }
    
    if (page === "jobs") return <StudentJobs user={session.user} />;
    if (page === "internships") return <StudentInternships user={session.user} />;
    if (page === "profile") return <StudentProfile user={session.user} onUpdateSession={(u) => setSession({ token: session.token, user: { ...session.user, ...u } })} />;
    if (page === "applications") return <Applications user={session.user} />;
    return <StudentDashboard user={session.user} onNavigate={setPage} />;
  };

  return (
    <MainLayout 
      user={session.user} 
      activePage={page} 
      setActivePage={setPage} 
      onLogout={() => setSession(null)}
    >
      {renderContent()}
    </MainLayout>
  );
}