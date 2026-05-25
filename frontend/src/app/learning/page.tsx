"use client";

import { Card, StatCard, Badge, PageHeader } from "@/components/ui/Card";
import { BookOpen, Clock, Award, TrendingUp, PlayCircle } from "lucide-react";

const courses = [
  { title: "Advanced React Patterns", category: "Engineering", level: "Advanced", duration: "8 hours", enrolled: 45, progress: 72, instructor: "Tech Lead" },
  { title: "Leadership Fundamentals", category: "Management", level: "Intermediate", duration: "12 hours", enrolled: 82, progress: 45, instructor: "HR Team", required: true },
  { title: "Data Privacy & Compliance", category: "Compliance", level: "Beginner", duration: "4 hours", enrolled: 155, progress: 100, instructor: "Legal Team", required: true },
  { title: "Machine Learning Basics", category: "Analytics", level: "Beginner", duration: "16 hours", enrolled: 34, progress: 28, instructor: "Data Science Lead" },
  { title: "Effective Communication", category: "Soft Skills", level: "Beginner", duration: "6 hours", enrolled: 67, progress: 0, instructor: "L&D Team" },
  { title: "Cloud Architecture (AWS)", category: "Engineering", level: "Advanced", duration: "20 hours", enrolled: 23, progress: 15, instructor: "DevOps Lead" },
];

const levelColor = { Beginner: "#00B894", Intermediate: "#FDCB6E", Advanced: "#FD79A8" };

export default function LearningPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Learning Hub" subtitle="Grow your skills" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Available Courses" value="24" icon={<BookOpen className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="In Progress" value="3" icon={<PlayCircle className="w-5 h-5" />} color="#00CEC9" />
        <StatCard title="Completed" value="8" icon={<Award className="w-5 h-5" />} color="#00B894" />
        <StatCard title="Total Hours" value="42h" icon={<Clock className="w-5 h-5" />} color="#FDCB6E" />
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <Card key={i} hover className="group cursor-pointer">
            {/* Thumbnail placeholder */}
            <div className="h-32 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                 style={{ background: `linear-gradient(135deg, ${Object.values(levelColor)[i % 3]}20, rgba(108,92,231,0.1))` }}>
              <BookOpen className="w-10 h-10 text-white/20" />
              {course.required && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">Required</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant="default" >{course.level}</Badge>
            </div>

            <h3 className="text-sm font-semibold text-white mb-1">{course.title}</h3>
            <p className="text-xs text-slate-500 mb-3">{course.instructor} • {course.duration} • {course.enrolled} enrolled</p>

            {course.progress > 0 ? (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.progress === 100 ? "#00B894" : "#6C5CE7" }} />
                </div>
              </div>
            ) : (
              <button className="btn-secondary w-full text-xs py-2">Enroll Now</button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
