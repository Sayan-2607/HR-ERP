"use client";

import { Card, StatCard, Badge, PageHeader, Table } from "@/components/ui/Card";
import { Briefcase, Users, UserCheck, Award, Plus, MapPin } from "lucide-react";

const jobs = [
  { id: "1", title: "Senior React Developer", dept: "Engineering", location: "Bangalore", applicants: 24, status: "Open", skills: ["React", "TypeScript"] },
  { id: "2", title: "ML Engineer", dept: "Analytics", location: "Hyderabad", applicants: 18, status: "Open", skills: ["Python", "TensorFlow"] },
  { id: "3", title: "Product Designer", dept: "Design", location: "Mumbai", applicants: 31, status: "Open", skills: ["Figma", "UX"] },
  { id: "4", title: "DevOps Architect", dept: "Engineering", location: "Remote", applicants: 12, status: "Open", skills: ["AWS", "K8s"] },
];

const candidates = [
  { name: "Raj Kapoor", role: "Sr React Developer", score: 92, stage: "Technical", exp: "6 years" },
  { name: "Aisha Khan", role: "ML Engineer", score: 88, stage: "HR Round", exp: "4 years" },
  { name: "Deepak Verma", role: "Sr React Developer", score: 85, stage: "Screening", exp: "5 years" },
  { name: "Simi Thomas", role: "Product Designer", score: 82, stage: "Phone Interview", exp: "3 years" },
  { name: "Karan Malhotra", role: "DevOps Architect", score: 79, stage: "Applied", exp: "7 years" },
];

const stages = ["Applied", "Screening", "Phone Interview", "Technical", "HR Round", "Offer", "Hired"];

export default function RecruitmentPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Recruitment ATS" subtitle="AI-powered applicant tracking"
                  action={<button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Post Job</button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Positions" value="4" icon={<Briefcase className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Total Applicants" value="85" icon={<Users className="w-5 h-5" />} trend="+12 this week" trendUp color="#00CEC9" />
        <StatCard title="In Pipeline" value="34" icon={<UserCheck className="w-5 h-5" />} color="#FDCB6E" />
        <StatCard title="Hired (YTD)" value="18" icon={<Award className="w-5 h-5" />} color="#00B894" />
      </div>

      {/* Pipeline stages */}
      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-4">Hiring Pipeline</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage, i) => {
            const count = candidates.filter((c) => c.stage === stage).length;
            return (
              <div key={stage} className="flex-1 min-w-[100px] p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-[10px] text-slate-500 truncate">{stage}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Open jobs */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Open Positions</h3>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{job.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{job.dept}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    </div>
                  </div>
                  <Badge variant="primary">{job.applicants} applicants</Badge>
                </div>
                <div className="flex gap-1 mt-2">
                  {job.skills.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top candidates */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">Top Candidates (AI Ranked)</h3>
          <div className="space-y-3">
            {candidates.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                     style={{ background: c.score >= 90 ? "rgba(0,184,148,0.15)" : c.score >= 80 ? "rgba(108,92,231,0.15)" : "rgba(253,203,110,0.15)",
                              color: c.score >= 90 ? "#00B894" : c.score >= 80 ? "#A29BFE" : "#FDCB6E" }}>
                  {c.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.role} • {c.exp}</p>
                </div>
                <Badge variant={c.stage === "HR Round" ? "success" : c.stage === "Technical" ? "primary" : "default"}>{c.stage}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
