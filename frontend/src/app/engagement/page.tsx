"use client";

import { useState } from "react";
import { Card, StatCard, Badge, PageHeader, Avatar } from "@/components/ui/Card";
import { Heart, Smile, ThumbsUp, Award, Send } from "lucide-react";

const moods = [
  { emoji: "😄", label: "Great", value: "GREAT", color: "#00B894" },
  { emoji: "🙂", label: "Good", value: "GOOD", color: "#6C5CE7" },
  { emoji: "😐", label: "Okay", value: "OKAY", color: "#FDCB6E" },
  { emoji: "😔", label: "Low", value: "LOW", color: "#FD79A8" },
  { emoji: "😩", label: "Bad", value: "BAD", color: "#FF7675" },
];

const recognitions = [
  { giver: "Arjun Mehta", receiver: "Priya Sharma", badge: "⭐ Star Performer", message: "Outstanding work on the dashboard redesign!", category: "Excellence", likes: 12, time: "2h ago" },
  { giver: "Ananya Gupta", receiver: "Meera Nair", badge: "🚀 Innovation Champion", message: "Great job launching the new product feature!", category: "Innovation", likes: 8, time: "5h ago" },
  { giver: "Priya Sharma", receiver: "Rahul Singh", badge: "🤝 Team Player", message: "Always ready to help the team with deployments!", category: "Teamwork", likes: 15, time: "1d ago" },
  { giver: "Meera Nair", receiver: "Kavya Reddy", badge: "📊 Data Wizard", message: "Incredible insights from the Q1 analytics report!", category: "Excellence", likes: 6, time: "1d ago" },
  { giver: "Vikram Patel", receiver: "Arjun Mehta", badge: "🎯 Mentor of the Month", message: "Thanks for the guidance on system design patterns!", category: "Mentorship", likes: 20, time: "2d ago" },
];

const moodHistory = [
  { day: "Mon", mood: "GREAT" }, { day: "Tue", mood: "GOOD" }, { day: "Wed", mood: "GOOD" },
  { day: "Thu", mood: "OKAY" }, { day: "Fri", mood: "GREAT" },
];

export default function EngagementPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSubmit = () => {
    if (selectedMood) { setSubmitted(true); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Engagement" subtitle="Mood check-ins & recognition wall" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Team Happiness" value="82%" icon={<Smile className="w-5 h-5" />} trend="+3% this week" trendUp color="#00B894" />
        <StatCard title="Recognitions Given" value="47" icon={<Award className="w-5 h-5" />} color="#6C5CE7" />
        <StatCard title="Check-in Rate" value="91%" icon={<Heart className="w-5 h-5" />} color="#FD79A8" />
        <StatCard title="Top Badge" value="⭐ Star" icon={<ThumbsUp className="w-5 h-5" />} color="#FDCB6E" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Mood check-in */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">How are you feeling today?</h3>
          {!submitted ? (
            <>
              <div className="flex justify-between mb-4">
                {moods.map((m) => (
                  <button key={m.value} onClick={() => setSelectedMood(m.value)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                            selectedMood === m.value ? "scale-110" : "hover:scale-105 opacity-60 hover:opacity-100"}`}
                          style={selectedMood === m.value ? { background: `${m.color}15`, border: `1px solid ${m.color}40` } : {}}>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] text-slate-400">{m.label}</span>
                  </button>
                ))}
              </div>
              <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)}
                        placeholder="Add a note (optional)..." className="input-dark mb-3 resize-none" rows={2} />
              <button onClick={handleMoodSubmit} disabled={!selectedMood}
                      className="btn-primary w-full disabled:opacity-40">Submit Check-in</button>
            </>
          ) : (
            <div className="text-center py-6">
              <span className="text-4xl mb-2 block">{moods.find((m) => m.value === selectedMood)?.emoji}</span>
              <p className="text-sm text-white font-medium">Thanks for checking in!</p>
              <p className="text-xs text-slate-500 mt-1">Your mood has been recorded</p>
            </div>
          )}

          {/* Week strip */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500 mb-2">This week</p>
            <div className="flex gap-2">
              {moodHistory.map((d, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-lg">{moods.find((m) => m.value === d.mood)?.emoji}</span>
                  <p className="text-[10px] text-slate-500">{d.day}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recognition wall */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recognition Wall 🎉</h3>
            <button className="btn-primary text-xs flex items-center gap-1"><Send className="w-3 h-3" /> Give Recognition</button>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {recognitions.map((r, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={r.giver} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="text-white font-medium">{r.giver}</span> recognized{" "}
                      <span className="text-white font-medium">{r.receiver}</span>
                    </p>
                    <p className="text-[10px] text-slate-500">{r.time}</p>
                  </div>
                  <Badge variant="primary">{r.category}</Badge>
                </div>
                <div className="pl-10">
                  <p className="text-sm font-medium text-purple-300 mb-1">{r.badge}</p>
                  <p className="text-sm text-slate-400">{r.message}</p>
                  <button className="flex items-center gap-1 mt-2 text-xs text-slate-500 hover:text-purple-400 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> {r.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
