import React, { useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../services/api";
import { Btn, Input, Card } from "../../components/ui";
import { Sparkles, AlertTriangle, GraduationCap } from "lucide-react";

const branchMap = {
  cs: "Computer Science",
  ec: "Electronics",
  me: "Mechanical",
  cv: "Civil",
  is: "Information Science",
  ee: "Electrical",
  te: "Telecommunication"
};

const Register = ({ onRegister, onNavigateLogin }) => {
  const [form, setForm] = useState({ 
    name: "",
    email: "", 
    phone: "", 
    password: "", 
    rollNumber: "",
    branch: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    const newForm = { ...form, [key]: value };
    
    if (key === "rollNumber") {
      const match = Object.keys(branchMap).find(code => value.toLowerCase().includes(code));
      if (match) {
        newForm.branch = branchMap[match];
      } else {
        newForm.branch = "";
      }
    }
    
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await API.auth.register(form);
      onRegister(result); // Automatically transition into app
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5FA] p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl border-t-4 border-t-amber-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-5 shadow-lg shadow-blue-500/30 ring-4 ring-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Join SmartPlace</h2>
            <p className="text-slate-500 text-sm mt-1">Create your student account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input 
              label="Full Name" 
              placeholder="e.g. John Doe" 
              value={form.name}
              onChange={handleChange("name")}
              required 
            />
            <Input 
              label="University Roll Number" 
              placeholder="e.g. 2tg23cs068" 
              value={form.rollNumber}
              onChange={handleChange("rollNumber")}
              required 
            />
            
            {form.branch && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-800 flex items-center justify-between"
              >
                <span>Matching Branch:</span>
                <span className="bg-white px-2 py-1 rounded-md shadow-sm text-blue-600 border border-blue-100">{form.branch}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Email" 
                type="email" 
                placeholder="student@demo.com" 
                value={form.email}
                onChange={handleChange("email")}
                required 
              />
              <Input 
                label="Phone" 
                type="tel" 
                placeholder="9876543210" 
                value={form.phone}
                onChange={handleChange("phone")}
                required 
              />
            </div>
            
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

            <Btn type="submit" loading={loading} className="w-full py-3 mt-2">
              Create Account
            </Btn>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={onNavigateLogin} 
                className="text-blue-600 font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
