const prisma = require("../config/database");

// AI-powered HR assistant with built-in knowledge base fallback
const HR_KNOWLEDGE = {
  leave: "Leave policy: Casual (12), Sick (10), Earned (15), Maternity (26 weeks), Paternity (2 weeks). Apply via Leave module. Leaves require manager approval. Carry-forward: max 5 earned leaves.",
  payroll: "Salary structure: Basic (40%) + HRA (40% of basic) + DA (10%) + Special Allowance (15%). Deductions: PF (12%), ESI (if applicable), TDS. Payslips available by 1st of each month.",
  attendance: "Work hours: 9 AM - 6 PM. Grace period: 15 min. 3+ late arrivals = warning. Clock in via web, mobile, biometric, QR, or geo-fence. WFH requires manager approval.",
  performance: "Review cycles: Quarterly check-ins + Annual review. Rating scale: 1-5. Self-review → Manager review → Calibration. OKR-based goal tracking.",
  policy: "Probation: 6 months. Notice period: 1-3 months based on level. Dress code: Business casual. Remote work: 2 days/week (hybrid). Benefits: Health insurance, meal coupons, gym allowance.",
  benefits: "Health insurance: Family floater ₹5L. Dental: ₹25K/year. Gym: ₹1.5K/month. Meal: ₹2.2K/month tax-free. Education: ₹50K/year. Relocation: As per policy.",
  training: "Mandatory: Compliance, Security, POSH. Budget: ₹50K/year per employee. Platforms: Internal LMS + LinkedIn Learning. Certifications reimbursed upon completion.",
  holidays: "Annual holidays: 12 national + 3 optional (choose from list). Company shutdown: Last week of December. Festival advances available.",
};

const findAnswer = (query) => {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(HR_KNOWLEDGE)) {
    if (q.includes(key)) return answer;
  }
  if (q.includes("salary") || q.includes("ctc") || q.includes("compensation")) return HR_KNOWLEDGE.payroll;
  if (q.includes("wfh") || q.includes("remote") || q.includes("hybrid")) return HR_KNOWLEDGE.policy;
  if (q.includes("insurance") || q.includes("medical") || q.includes("gym")) return HR_KNOWLEDGE.benefits;
  if (q.includes("course") || q.includes("learning") || q.includes("certif")) return HR_KNOWLEDGE.training;
  if (q.includes("holiday") || q.includes("festival")) return HR_KNOWLEDGE.holidays;
  if (q.includes("review") || q.includes("okr") || q.includes("goal") || q.includes("rating")) return HR_KNOWLEDGE.performance;
  if (q.includes("clock") || q.includes("punch") || q.includes("late")) return HR_KNOWLEDGE.attendance;
  return null;
};

exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const employeeId = req.employeeId;

    // Try knowledge base first
    let answer = findAnswer(message);

    // If not found, try contextual queries
    if (!answer) {
      const q = message.toLowerCase();

      if (q.includes("my leave") || q.includes("leave balance")) {
        const balances = await prisma.leaveBalance.findMany({
          where: { employeeId, year: new Date().getFullYear() },
        });
        answer = balances.length
          ? `Your leave balances:\n${balances.map((b) => `• ${b.leaveType}: ${b.remaining}/${b.total} remaining`).join("\n")}`
          : "No leave balance records found. Please contact HR.";
      }

      if (q.includes("my attendance") || q.includes("my hours")) {
        const thisMonth = await prisma.attendance.findMany({
          where: { employeeId, date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
        });
        const present = thisMonth.filter((a) => a.status === "PRESENT").length;
        const avgHours = thisMonth.length ? (thisMonth.reduce((s, a) => s + (a.totalHours || 0), 0) / thisMonth.length).toFixed(1) : 0;
        answer = `This month: ${present} days present, ${avgHours} avg hours/day, ${thisMonth.filter((a) => a.isLateArrival).length} late arrivals.`;
      }

      if (q.includes("team") || q.includes("who is on leave")) {
        const today = new Date();
        const onLeave = await prisma.leaveRequest.findMany({
          where: { status: "APPROVED", fromDate: { lte: today }, toDate: { gte: today } },
          include: { employee: { select: { firstName: true, lastName: true, department: true } } },
        });
        answer = onLeave.length
          ? `Employees on leave today:\n${onLeave.map((l) => `• ${l.employee.firstName} ${l.employee.lastName} (${l.employee.department}) — ${l.leaveType}`).join("\n")}`
          : "No employees on leave today!";
      }

      if (q.includes("attrition") || q.includes("risk")) {
        const risky = await prisma.employee.findMany({
          where: { attritionRisk: { gt: 0.5 }, status: "ACTIVE" },
          select: { firstName: true, lastName: true, department: true, attritionRisk: true },
          orderBy: { attritionRisk: "desc" },
          take: 5,
        });
        answer = risky.length
          ? `⚠️ High attrition risk employees:\n${risky.map((e) => `• ${e.firstName} ${e.lastName} (${e.department}) — ${Math.round(e.attritionRisk * 100)}% risk`).join("\n")}`
          : "No employees currently flagged as high attrition risk.";
      }
    }

    if (!answer) {
      answer = "I can help with questions about leave policy, attendance, payroll, performance reviews, benefits, training, holidays, and more. Try asking about a specific topic!";
    }

    // Log the interaction
    await prisma.auditLog.create({
      data: { userId: req.user.id, action: "AI_CHAT", entity: "ai_assistant", details: { question: message, answered: true } },
    });

    res.json({ message: answer, timestamp: new Date() });
  } catch (err) { next(err); }
};

exports.getSuggestions = async (req, res) => {
  res.json([
    "What is my leave balance?",
    "Show my attendance this month",
    "Who is on leave today?",
    "Explain the leave policy",
    "What are the salary components?",
    "How does performance review work?",
    "What benefits do I have?",
    "Show attrition risk report",
  ]);
};
