"use client";
import { create } from "zustand";

export interface LeaveRequest { id: string; employee: string; type: string; from: string; to: string; days: number; reason: string; status: "Pending"|"Approved"|"Rejected"; }
export interface TicketMessage { id: string; sender: string; text: string; time: string; isHR: boolean; }
export interface Ticket { id: string; ticketNo: string; employee: string; category: string; subject: string; description: string; priority: string; status: string; created: string; messages: TicketMessage[]; }
export interface Recognition { id: string; giver: string; receiver: string; badge: string; message: string; likes: number; time: string; likedByMe: boolean; }
export interface Goal { id: string; title: string; category: string; progress: number; target: string; }
export interface Course { id: string; title: string; category: string; level: string; duration: string; instructor: string; enrolled: number; progress: number; myEnrolled: boolean; required?: boolean; }
export interface Employee { id: string; employeeId: string; name: string; designation: string; department: string; status: string; email: string; skills: string[]; }
export interface PayrollRecord { id: string; employee: string; month: string; basic: number; hra: number; allowances: number; deductions: number; net: number; status: "Generated"|"Processing"|"Paid"; }
export interface JobPosting { id: string; title: string; department: string; type: string; applicants: number; status: "Open"|"Closed"|"Draft"; posted: string; }
export interface Candidate { id: string; name: string; role: string; stage: string; rating: number; applied: string; }
export interface Notification { id: string; text: string; time: string; read: boolean; }

let _id = 200;
const nid = () => String(++_id);
const now = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

interface DS {
  // Leave
  leaveRequests: LeaveRequest[];
  leaveBalances: { type: string; total: number; used: number; remaining: number; color: string; }[];
  addLeave: (r: Omit<LeaveRequest,"id"|"status">) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
  // Tickets
  tickets: Ticket[];
  addTicket: (t: Omit<Ticket,"id"|"ticketNo"|"created"|"messages"|"status">) => void;
  updateTicketStatus: (id: string, s: string) => void;
  addTicketMsg: (tid: string, m: Omit<TicketMessage,"id"|"time">) => void;
  // Recognition
  recognitions: Recognition[];
  addRecognition: (r: Omit<Recognition,"id"|"likes"|"time"|"likedByMe">) => void;
  likeRecognition: (id: string) => void;
  // Goals
  goals: Goal[];
  addGoal: (g: Omit<Goal,"id">) => void;
  updateGoalProgress: (id: string, p: number) => void;
  // Courses
  courses: Course[];
  enrollCourse: (id: string) => void;
  // Employees
  employees: Employee[];
  addEmployee: (e: Omit<Employee,"id">) => void;
  // Attendance
  clockedIn: boolean; clockInTime: string;
  weeklyAttendance: { day: string; hours: number; clockIn?: string; clockOut?: string; status: string; }[];
  clockIn: () => void; clockOut: () => void;
  // Mood
  moodHistory: { day: string; mood: string; }[];
  todayMood: string | null;
  submitMood: (m: string) => void;
  // Payroll
  payrollRecords: PayrollRecord[];
  generatePayroll: (emp: string, month: string) => void;
  processPayroll: (id: string) => void;
  // Recruitment
  jobPostings: JobPosting[];
  candidates: Candidate[];
  addJobPosting: (j: Omit<JobPosting,"id"|"applicants"|"posted">) => void;
  closeJob: (id: string) => void;
  updateCandidateStage: (id: string, stage: string) => void;
  // Notifications
  notifications: Notification[];
  addNotification: (text: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  // Settings
  settings: { emailNotifs: boolean; pushNotifs: boolean; slackNotifs: boolean; theme: string; language: string; timezone: string; };
  updateSettings: (s: Partial<DS["settings"]>) => void;
}

export const useDataStore = create<DS>((set) => ({
  // ──── LEAVE ────
  leaveBalances: [
    { type: "Casual Leave", total: 12, used: 4, remaining: 8, color: "#6C5CE7" },
    { type: "Sick Leave", total: 10, used: 2, remaining: 8, color: "#00CEC9" },
    { type: "Earned Leave", total: 15, used: 3, remaining: 12, color: "#FD79A8" },
  ],
  leaveRequests: [
    { id:"l1", employee:"Priya Sharma", type:"Casual", from:"2026-06-10", to:"2026-06-12", days:3, reason:"Family function", status:"Pending" },
    { id:"l2", employee:"Vikram Patel", type:"Sick", from:"2026-06-05", to:"2026-06-06", days:2, reason:"Medical appointment", status:"Pending" },
    { id:"l3", employee:"Sneha Joshi", type:"Earned", from:"2026-06-20", to:"2026-06-25", days:6, reason:"Vacation", status:"Approved" },
    { id:"l4", employee:"Kavya Reddy", type:"Casual", from:"2026-06-15", to:"2026-06-15", days:1, reason:"Personal work", status:"Pending" },
  ],
  addLeave: (r) => set(s => ({ leaveRequests: [...s.leaveRequests, { ...r, id: nid(), status:"Pending" }], notifications: [{ id: nid(), text: `Leave request from ${r.employee}`, time: "Just now", read: false }, ...s.notifications] })),
  approveLeave: (id) => set(s => ({ leaveRequests: s.leaveRequests.map(r => r.id===id ? { ...r, status:"Approved" as const } : r), notifications: [{ id: nid(), text: "Leave approved", time: "Just now", read: false }, ...s.notifications] })),
  rejectLeave: (id) => set(s => ({ leaveRequests: s.leaveRequests.map(r => r.id===id ? { ...r, status:"Rejected" as const } : r), notifications: [{ id: nid(), text: "Leave rejected", time: "Just now", read: false }, ...s.notifications] })),

  // ──── TICKETS ────
  tickets: [
    { id:"t1", ticketNo:"TKT-001001", employee:"Priya Sharma", category:"IT Support", subject:"VPN not connecting", description:"Unable to connect to office VPN since morning. Error 619.", priority:"High", status:"In Progress", created:"2h ago", messages:[
      { id:"m1", sender:"Priya Sharma", text:"Getting error 619 on VPN client since 9 AM. Tried restarting.", time:"10:30 AM", isHR:false },
      { id:"m2", sender:"IT Support", text:"We're looking into it. Try reinstalling the VPN client.", time:"11:15 AM", isHR:true },
    ]},
    { id:"t2", ticketNo:"TKT-001002", employee:"Sneha Joshi", category:"HR Query", subject:"WFH policy clarification", description:"Need clarity on the new hybrid policy", priority:"Medium", status:"Open", created:"5h ago", messages:[] },
    { id:"t3", ticketNo:"TKT-001003", employee:"Amit Roy", category:"Payroll", subject:"Tax declaration update", description:"Need to update investment declarations for FY2026", priority:"Low", status:"Open", created:"1d ago", messages:[] },
    { id:"t4", ticketNo:"TKT-001004", employee:"Vikram Patel", category:"Access Request", subject:"AWS console access", description:"Need production AWS console access for deployment", priority:"Urgent", status:"Open", created:"30m ago", messages:[] },
  ],
  addTicket: (t) => set(s => {
    const ticketNo = `TKT-${String(1005+s.tickets.length).padStart(6,"0")}`;
    return { tickets: [{ ...t, id: nid(), ticketNo, created:"Just now", messages:[], status:"Open" }, ...s.tickets], notifications: [{ id: nid(), text: `New ticket: ${t.subject}`, time:"Just now", read:false }, ...s.notifications] };
  }),
  updateTicketStatus: (id, status) => set(s => ({ tickets: s.tickets.map(t => t.id===id ? { ...t, status } : t) })),
  addTicketMsg: (tid, m) => set(s => ({ tickets: s.tickets.map(t => t.id===tid ? { ...t, messages: [...t.messages, { ...m, id: nid(), time: now() }] } : t) })),

  // ──── RECOGNITION ────
  recognitions: [
    { id:"r1", giver:"Arjun Mehta", receiver:"Priya Sharma", badge:"Star Performer", message:"Outstanding work on the dashboard redesign!", likes:12, time:"2h ago", likedByMe:false },
    { id:"r2", giver:"Ananya Gupta", receiver:"Meera Nair", badge:"Innovation Champion", message:"Great job launching the new product feature!", likes:8, time:"5h ago", likedByMe:false },
    { id:"r3", giver:"Priya Sharma", receiver:"Rahul Singh", badge:"Team Player", message:"Always ready to help with deployments!", likes:15, time:"1d ago", likedByMe:false },
  ],
  addRecognition: (r) => set(s => ({ recognitions: [{ ...r, id: nid(), likes:0, time:"Just now", likedByMe:false }, ...s.recognitions], notifications: [{ id: nid(), text: `${r.giver} recognized ${r.receiver}!`, time:"Just now", read:false }, ...s.notifications] })),
  likeRecognition: (id) => set(s => ({ recognitions: s.recognitions.map(r => r.id===id ? { ...r, likes: r.likedByMe ? r.likes-1 : r.likes+1, likedByMe: !r.likedByMe } : r) })),

  // ──── GOALS ────
  goals: [
    { id:"g1", title:"Complete React 19 migration", category:"Project", progress:65, target:"Jun 30" },
    { id:"g2", title:"Mentor 2 junior developers", category:"Development", progress:40, target:"Dec 31" },
    { id:"g3", title:"Reduce deployment time by 50%", category:"Team", progress:80, target:"Jun 30" },
    { id:"g4", title:"Build attrition prediction model", category:"Project", progress:90, target:"Jun 15" },
  ],
  addGoal: (g) => set(s => ({ goals: [...s.goals, { ...g, id: nid() }] })),
  updateGoalProgress: (id, p) => set(s => ({ goals: s.goals.map(g => g.id===id ? { ...g, progress: Math.min(100,p) } : g) })),

  // ──── COURSES ────
  courses: [
    { id:"c1", title:"Advanced React Patterns", category:"Engineering", level:"Advanced", duration:"8 hrs", instructor:"Tech Lead", enrolled:45, progress:72, myEnrolled:true },
    { id:"c2", title:"Leadership Fundamentals", category:"Management", level:"Intermediate", duration:"12 hrs", instructor:"HR Team", enrolled:82, progress:45, myEnrolled:true, required:true },
    { id:"c3", title:"Data Privacy & Compliance", category:"Compliance", level:"Beginner", duration:"4 hrs", instructor:"Legal Team", enrolled:155, progress:100, myEnrolled:true, required:true },
    { id:"c4", title:"Machine Learning Basics", category:"Analytics", level:"Beginner", duration:"16 hrs", instructor:"Data Science Lead", enrolled:34, progress:28, myEnrolled:true },
    { id:"c5", title:"Effective Communication", category:"Soft Skills", level:"Beginner", duration:"6 hrs", instructor:"L&D Team", enrolled:67, progress:0, myEnrolled:false },
    { id:"c6", title:"Cloud Architecture (AWS)", category:"Engineering", level:"Advanced", duration:"20 hrs", instructor:"DevOps Lead", enrolled:23, progress:0, myEnrolled:false },
  ],
  enrollCourse: (id) => set(s => ({ courses: s.courses.map(c => c.id===id ? { ...c, progress:5, enrolled:c.enrolled+1, myEnrolled:true } : c) })),

  // ──── EMPLOYEES ────
  employees: [
    { id:"e1", employeeId:"WS-1001", name:"Ananya Gupta", designation:"HR Director", department:"Human Resources", status:"Active", email:"ananya@worksphere.ai", skills:["HR Strategy","Leadership"] },
    { id:"e2", employeeId:"WS-1002", name:"Priya Sharma", designation:"Sr. Frontend Developer", department:"Engineering", status:"Active", email:"priya@worksphere.ai", skills:["React","TypeScript"] },
    { id:"e3", employeeId:"WS-1003", name:"Vikram Patel", designation:"Backend Engineer", department:"Engineering", status:"Active", email:"vikram@worksphere.ai", skills:["Node.js","Python"] },
    { id:"e4", employeeId:"WS-1004", name:"Sneha Joshi", designation:"UX Designer", department:"Design", status:"Active", email:"sneha@worksphere.ai", skills:["Figma","UX Research"] },
    { id:"e5", employeeId:"WS-1005", name:"Arjun Mehta", designation:"Engineering Manager", department:"Engineering", status:"Active", email:"arjun@worksphere.ai", skills:["Architecture","Agile"] },
    { id:"e6", employeeId:"WS-1006", name:"Kavya Reddy", designation:"Data Scientist", department:"Analytics", status:"Active", email:"kavya@worksphere.ai", skills:["ML","Python"] },
    { id:"e7", employeeId:"WS-1007", name:"Rahul Singh", designation:"DevOps Engineer", department:"Engineering", status:"Active", email:"rahul@worksphere.ai", skills:["AWS","K8s"] },
    { id:"e8", employeeId:"WS-1008", name:"Meera Nair", designation:"Product Manager", department:"Product", status:"Active", email:"meera@worksphere.ai", skills:["Strategy","Analytics"] },
    { id:"e9", employeeId:"WS-1009", name:"Amit Roy", designation:"QA Lead", department:"Engineering", status:"Active", email:"amit@worksphere.ai", skills:["Testing","Selenium"] },
    { id:"e10",employeeId:"WS-1010",name:"Deepa Menon", designation:"Content Writer", department:"Marketing", status:"Active", email:"deepa@worksphere.ai", skills:["SEO","Copywriting"] },
  ],
  addEmployee: (e) => set(s => ({ employees: [...s.employees, { ...e, id: nid() }] })),

  // ──── ATTENDANCE ────
  clockedIn: false, clockInTime: "",
  weeklyAttendance: [
    { day:"Mon", hours:8.5, clockIn:"9:02 AM", clockOut:"5:32 PM", status:"Present" },
    { day:"Tue", hours:9.2, clockIn:"8:48 AM", clockOut:"6:00 PM", status:"Present" },
    { day:"Wed", hours:8.0, clockIn:"9:10 AM", clockOut:"5:10 PM", status:"Present" },
    { day:"Thu", hours:9.1, clockIn:"8:55 AM", clockOut:"6:05 PM", status:"Present" },
    { day:"Fri", hours:0, status:"Today" },
  ],
  clockIn: () => set({ clockedIn: true, clockInTime: now() }),
  clockOut: () => set(s => ({ clockedIn: false, weeklyAttendance: s.weeklyAttendance.map(a => a.status==="Today" ? { ...a, hours:8.0, clockIn:s.clockInTime, clockOut:now(), status:"Present" } : a) })),

  // ──── MOOD ────
  moodHistory: [ { day:"Mon", mood:"GREAT" }, { day:"Tue", mood:"GOOD" }, { day:"Wed", mood:"GOOD" }, { day:"Thu", mood:"OKAY" } ],
  todayMood: null,
  submitMood: (m) => set(s => ({ todayMood: m, moodHistory: [...s.moodHistory, { day:"Fri", mood:m }] })),

  // ──── PAYROLL ────
  payrollRecords: [
    { id:"p1", employee:"Priya Sharma", month:"May 2026", basic:85000, hra:34000, allowances:15000, deductions:18500, net:115500, status:"Paid" },
    { id:"p2", employee:"Vikram Patel", month:"May 2026", basic:75000, hra:30000, allowances:12000, deductions:16200, net:100800, status:"Paid" },
    { id:"p3", employee:"Sneha Joshi", month:"May 2026", basic:70000, hra:28000, allowances:10000, deductions:15400, net:92600, status:"Processing" },
    { id:"p4", employee:"Arjun Mehta", month:"May 2026", basic:120000, hra:48000, allowances:20000, deductions:28500, net:159500, status:"Paid" },
    { id:"p5", employee:"Kavya Reddy", month:"May 2026", basic:90000, hra:36000, allowances:14000, deductions:19800, net:120200, status:"Generated" },
  ],
  generatePayroll: (emp, month) => set(s => {
    const basic = 60000+Math.floor(Math.random()*40000);
    const hra = Math.round(basic*0.4); const allow = Math.round(basic*0.15); const ded = Math.round(basic*0.22);
    return { payrollRecords: [...s.payrollRecords, { id: nid(), employee: emp, month, basic, hra, allowances: allow, deductions: ded, net: basic+hra+allow-ded, status:"Generated" }] };
  }),
  processPayroll: (id) => set(s => ({ payrollRecords: s.payrollRecords.map(p => p.id===id ? { ...p, status: p.status==="Generated" ? "Processing" as const : "Paid" as const } : p) })),

  // ──── RECRUITMENT ────
  jobPostings: [
    { id:"j1", title:"Senior Frontend Engineer", department:"Engineering", type:"Full-time", applicants:24, status:"Open", posted:"2 weeks ago" },
    { id:"j2", title:"Product Designer", department:"Design", type:"Full-time", applicants:18, status:"Open", posted:"1 week ago" },
    { id:"j3", title:"Data Engineer", department:"Analytics", type:"Full-time", applicants:12, status:"Open", posted:"3 days ago" },
    { id:"j4", title:"Marketing Intern", department:"Marketing", type:"Internship", applicants:45, status:"Closed", posted:"1 month ago" },
  ],
  candidates: [
    { id:"ca1", name:"Rohit Verma", role:"Sr. Frontend Engineer", stage:"Technical Round", rating:4.2, applied:"5 days ago" },
    { id:"ca2", name:"Neha Kapoor", role:"Product Designer", stage:"Portfolio Review", rating:4.5, applied:"3 days ago" },
    { id:"ca3", name:"Siddharth Das", role:"Data Engineer", stage:"HR Round", rating:3.8, applied:"1 week ago" },
    { id:"ca4", name:"Aisha Khan", role:"Sr. Frontend Engineer", stage:"Screening", rating:4.0, applied:"2 days ago" },
    { id:"ca5", name:"Karan Bose", role:"Data Engineer", stage:"Offer Sent", rating:4.6, applied:"2 weeks ago" },
  ],
  addJobPosting: (j) => set(s => ({ jobPostings: [{ ...j, id: nid(), applicants:0, posted:"Just now" }, ...s.jobPostings] })),
  closeJob: (id) => set(s => ({ jobPostings: s.jobPostings.map(j => j.id===id ? { ...j, status:"Closed" as const } : j) })),
  updateCandidateStage: (id, stage) => set(s => ({ candidates: s.candidates.map(c => c.id===id ? { ...c, stage } : c) })),

  // ──── NOTIFICATIONS ────
  notifications: [
    { id:"n1", text:"Your leave request has been approved", time:"1h ago", read:false },
    { id:"n2", text:"New ticket assigned: VPN Issue", time:"3h ago", read:false },
    { id:"n3", text:"Arjun Mehta recognized you!", time:"1d ago", read:true },
  ],
  addNotification: (text) => set(s => ({ notifications: [{ id: nid(), text, time:"Just now", read:false }, ...s.notifications] })),
  markRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id===id ? { ...n, read:true } : n) })),
  markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read:true })) })),

  // ──── SETTINGS ────
  settings: { emailNotifs:true, pushNotifs:true, slackNotifs:false, theme:"dark", language:"English", timezone:"Asia/Kolkata" },
  updateSettings: (s) => set(st => ({ settings: { ...st.settings, ...s } })),
}));
