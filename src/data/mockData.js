export const DB = {
  users: [
    {
      id: "u1",
      name: "Demo Student",
      email: "student@demo.com",
      password: "demo123",
      role: "student",
      cgpa: 8.5,
      branch: "Computer Science",
      rollNumber: "2tg23cs068"
    },
    {
      id: "u2",
      name: "Placement Officer",
      email: "officer@demo.com",
      password: "demo123",
      role: "officer",
      branch: "Admin"
    }
  ],
  drives: [
    {
      id: "d1",
      company: "Google",
      role: "Software Engineer",
      ctc: "₹ 34 LPA",
      eligibility: "CGPA ≥ 8.0",
      status: "Open",
      date: "2026-04-15",
      rounds: ["Aptitude", "Technical", "HR"]
    },
    {
      id: "d2",
      company: "Microsoft",
      role: "SDE - 1",
      ctc: "₹ 44 LPA",
      eligibility: "CGPA ≥ 8.5",
      status: "Open",
      date: "2026-05-10",
      rounds: ["OA", "DSA", "System Design", "HR"]
    }
  ],
  students: [
    { id: "s1", name: "Demo Student", email: "student@demo.com", rollNumber: "2TG23CS068", branch: "Computer Science", cgpa: 8.5, status: "Placed", placedAt: "Google" },
    { id: "s2", name: "Ananya Sharma", email: "ananya@demo.com", rollNumber: "2TG23CS012", branch: "Computer Science", cgpa: 9.1, status: "Placed", placedAt: "Microsoft" },
    { id: "s3", name: "Rahul Verma", email: "rahul@demo.com", rollNumber: "2TG23EC045", branch: "Electronics", cgpa: 7.8, status: "Not Placed", placedAt: null },
    { id: "s4", name: "Priya Nair", email: "priya@demo.com", rollNumber: "2TG23CS091", branch: "Computer Science", cgpa: 8.9, status: "Placed", placedAt: "Amazon" },
    { id: "s5", name: "Karthik Reddy", email: "karthik@demo.com", rollNumber: "2TG23ME023", branch: "Mechanical", cgpa: 7.2, status: "Not Placed", placedAt: null },
    { id: "s6", name: "Sneha Patil", email: "sneha@demo.com", rollNumber: "2TG23IS034", branch: "ISE", cgpa: 8.7, status: "Placed", placedAt: "Infosys" },
    { id: "s7", name: "Arjun Das", email: "arjun@demo.com", rollNumber: "2TG23CS077", branch: "Computer Science", cgpa: 6.9, status: "Not Placed", placedAt: null },
    { id: "s8", name: "Meera Joshi", email: "meera@demo.com", rollNumber: "2TG23EC058", branch: "Electronics", cgpa: 8.3, status: "Placed", placedAt: "TCS" },
  ],
  applications: [
    { id: "a1", driveId: "d1", studentId: "s1", studentName: "Demo Student", email: "student@demo.com", rollNumber: "2TG23CS068", branch: "Computer Science", cgpa: 8.5, appliedAt: "2026-03-20" },
    { id: "a2", driveId: "d1", studentId: "s2", studentName: "Ananya Sharma", email: "ananya@demo.com", rollNumber: "2TG23CS012", branch: "Computer Science", cgpa: 9.1, appliedAt: "2026-03-21" },
    { id: "a3", driveId: "d1", studentId: "s4", studentName: "Priya Nair", email: "priya@demo.com", rollNumber: "2TG23CS091", branch: "Computer Science", cgpa: 8.9, appliedAt: "2026-03-22" },
    { id: "a4", driveId: "d2", studentId: "s2", studentName: "Ananya Sharma", email: "ananya@demo.com", rollNumber: "2TG23CS012", branch: "Computer Science", cgpa: 9.1, appliedAt: "2026-03-22" },
    { id: "a5", driveId: "d2", studentId: "s6", studentName: "Sneha Patil", email: "sneha@demo.com", rollNumber: "2TG23IS034", branch: "ISE", cgpa: 8.7, appliedAt: "2026-03-23" },
  ],
  skillGap: [],
  alumni: [],
  internships: [
    { id: "i1", company: "Amazon", role: "SDE Intern", stipend: "80K/month", duration: "3 Months", eligibility: "CGPA ≥ 7.5", status: "Open", deadline: "2026-04-20", mode: "On-site", location: "Bangalore" },
    { id: "i2", company: "Flipkart", role: "Data Science Intern", stipend: "60K/month", duration: "6 Months", eligibility: "CGPA ≥ 7.0", status: "Open", deadline: "2026-05-01", mode: "Hybrid", location: "Bangalore" },
    { id: "i3", company: "Adobe", role: "Frontend Intern", stipend: "70K/month", duration: "3 Months", eligibility: "CGPA ≥ 8.0", status: "Open", deadline: "2026-04-25", mode: "Remote", location: "Noida" },
    { id: "i4", company: "Infosys", role: "Cloud Intern", stipend: "25K/month", duration: "2 Months", eligibility: "CGPA ≥ 6.5", status: "Closed", deadline: "2026-03-10", mode: "On-site", location: "Mysuru" },
  ],
  internshipApplications: [
    { id: "ia1", internshipId: "i1", studentId: "s1", studentName: "Demo Student", email: "student@demo.com", rollNumber: "2TG23CS068", branch: "Computer Science", cgpa: 8.5, appliedAt: "2026-03-18" },
    { id: "ia2", internshipId: "i1", studentId: "s4", studentName: "Priya Nair", email: "priya@demo.com", rollNumber: "2TG23CS091", branch: "Computer Science", cgpa: 8.9, appliedAt: "2026-03-19" },
    { id: "ia3", internshipId: "i2", studentId: "s2", studentName: "Ananya Sharma", email: "ananya@demo.com", rollNumber: "2TG23CS012", branch: "Computer Science", cgpa: 9.1, appliedAt: "2026-03-20" },
    { id: "ia4", internshipId: "i3", studentId: "s6", studentName: "Sneha Patil", email: "sneha@demo.com", rollNumber: "2TG23IS034", branch: "ISE", cgpa: 8.7, appliedAt: "2026-03-21" },
  ],
};