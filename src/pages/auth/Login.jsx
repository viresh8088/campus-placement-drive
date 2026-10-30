import React, { useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../services/api";
import { Btn, Input, Card } from "../../components/ui";
import { Sparkles, AlertTriangle, User, Briefcase, GraduationCap } from "lucide-react";

const Login = ({ onLogin, onNavigateRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Authenticates user and returns role-based session 
      const result = await API.auth.login(form.email, form.password);
      onLogin(result);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick testing of Student and Officer roles
  const fillDemo = (role) => {
    if (role === "officer") {
      setForm({ email: "admin@smartplace.com", password: "admin123" });
    } else {
      setForm({ email: "student@demo.com", password: "student123" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5FA] p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl border-t-4 border-t-blue-600">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-5 shadow-lg shadow-blue-500/30 ring-4 ring-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">SmartPlace Login</h2>
            <p className="text-slate-500 text-sm mt-1">Recruitment Management Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="student@demo.com" 
              value={form.email}
              onChange={handleChange("email")}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={form.password}
              onChange={handleChange("password")}
              required 
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                <AlertTriangle className="w-4 h-4 inline mr-1 -mt-0.5" /> {error}
              </div>
            )}

            <Btn type="submit" loading={loading} className="w-full py-3">
              Sign In
            </Btn>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={onNavigateRegister} 
                className="text-blue-600 font-bold hover:underline"
              >
                Register
              </button>
            </p>
          </div>

          {/* Quick Demo Access for Testing */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Quick Demo Login</p>
            <div className="flex gap-2">
              <button 
                onClick={() => fillDemo("student")}
                className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <User className="w-4 h-4 inline mr-1 -mt-0.5" /> Student
              </button>
              <button 
                onClick={() => fillDemo("officer")}
                className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Briefcase className="w-4 h-4 inline mr-1 -mt-0.5" /> Officer
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;