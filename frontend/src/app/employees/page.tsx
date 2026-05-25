"use client";

import { useState } from "react";
import { Card, StatCard, Badge, Avatar, PageHeader, Table } from "@/components/ui/Card";
import { Users, Search, Plus, Filter, UserCheck, UserX, Star } from "lucide-react";

const employees = [
  { id: "1", employeeId: "WS-1001", name: "Ananya Gupta", designation: "HR Director", department: "Human Resources", status: "ACTIVE", joinDate: "2023-03-15", email: "ananya@worksphere.ai", skills: ["HR Strategy", "Leadership"] },
  { id: "2", employeeId: "WS-1002", name: "Priya Sharma", designation: "Sr. Frontend Developer", department: "Engineering", status: "ACTIVE", joinDate: "2023-06-01", email: "priya@worksphere.ai", skills: ["React", "TypeScript"] },
  { id: "3", employeeId: "WS-1003", name: "Vikram Patel", designation: "Backend Engineer", department: "Engineering", status: "ACTIVE", joinDate: "2023-09-10", email: "vikram@worksphere.ai", skills: ["Node.js", "Python"] },
  { id: "4", employeeId: "WS-1004", name: "Sneha Joshi", designation: "UX Designer", department: "Design", status: "ACTIVE", joinDate: "2023-07-20", email: "sneha@worksphere.ai", skills: ["Figma", "UX Research"] },
  { id: "5", employeeId: "WS-1005", name: "Arjun Mehta", designation: "Engineering Manager", department: "Engineering", status: "ACTIVE", joinDate: "2023-01-10", email: "arjun@worksphere.ai", skills: ["Architecture", "Agile"] },
  { id: "6", employeeId: "WS-1006", name: "Kavya Reddy", designation: "Data Scientist", department: "Analytics", status: "ACTIVE", joinDate: "2023-11-05", email: "kavya@worksphere.ai", skills: ["ML", "Python"] },
  { id: "7", employeeId: "WS-1007", name: "Rahul Singh", designation: "DevOps Engineer", department: "Engineering", status: "ACTIVE", joinDate: "2024-01-15", email: "rahul@worksphere.ai", skills: ["AWS", "K8s"] },
  { id: "8", employeeId: "WS-1008", name: "Meera Nair", designation: "Product Manager", department: "Product", status: "ACTIVE", joinDate: "2023-04-22", email: "meera@worksphere.ai", skills: ["Strategy", "Analytics"] },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = ["All", ...new Set(employees.map((e) => e.department))];
  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || e.department === department;
    return matchSearch && matchDept;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Employee Hub" subtitle="Manage your workforce"
                  action={<button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Employee</button>} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Employees" value="168" icon={<Users className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Active" value="162" icon={<UserCheck className="w-5 h-5" />} color="#00B894" />
        <StatCard title="On Notice" value="3" icon={<UserX className="w-5 h-5" />} color="#FF7675" />
        <StatCard title="New This Month" value="5" icon={<Star className="w-5 h-5" />} trend="+2 vs last month" trendUp color="#FDCB6E" />
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search by name, role..." className="input-dark pl-10" />
          </div>
          <div className="flex gap-2">
            {departments.map((d) => (
              <button key={d} onClick={() => setDepartment(d)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        department === d ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-slate-400 border border-white/[0.06] hover:border-purple-500/20"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Employee table */}
      <Card>
        <Table headers={["Employee", "Department", "Designation", "Status", "Join Date", "Skills"]}>
          {filtered.map((emp) => (
            <tr key={emp.id} className="hover:bg-white/[0.02] cursor-pointer transition-colors">
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <Avatar name={emp.name} />
                  <div>
                    <p className="text-sm font-medium text-white">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.employeeId}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 text-sm text-slate-300">{emp.department}</td>
              <td className="py-3 px-3 text-sm text-slate-300">{emp.designation}</td>
              <td className="py-3 px-3"><Badge variant="success">Active</Badge></td>
              <td className="py-3 px-3 text-sm text-slate-400">{emp.joinDate}</td>
              <td className="py-3 px-3">
                <div className="flex gap-1">
                  {emp.skills.map((s) => <Badge key={s} variant="primary">{s}</Badge>)}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
