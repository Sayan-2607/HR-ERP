const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding WorkSphere AI database...\n");

  // ─── Users & Employees ───
  const password = await bcrypt.hash("admin123", 12);
  const empPassword = await bcrypt.hash("employee123", 12);

  const employees = [
    { email: "admin@worksphere.ai", password, role: "HR_ADMIN", first: "Ananya", last: "Gupta", designation: "HR Director", department: "Human Resources", salary: 180000, gender: "FEMALE", skills: ["HR Strategy", "Talent Management", "Compliance", "Leadership"], attrition: 0.05 },
    { email: "priya.sharma@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Priya", last: "Sharma", designation: "Senior Frontend Developer", department: "Engineering", salary: 120000, gender: "FEMALE", skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"], attrition: 0.15 },
    { email: "vikram.patel@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Vikram", last: "Patel", designation: "Backend Engineer", department: "Engineering", salary: 95000, gender: "MALE", skills: ["Node.js", "Python", "PostgreSQL", "Docker"], attrition: 0.76 },
    { email: "sneha.joshi@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Sneha", last: "Joshi", designation: "UX Designer", department: "Design", salary: 85000, gender: "FEMALE", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], attrition: 0.62 },
    { email: "arjun.mehta@worksphere.ai", password: empPassword, role: "MANAGER", first: "Arjun", last: "Mehta", designation: "Engineering Manager", department: "Engineering", salary: 160000, gender: "MALE", skills: ["Team Leadership", "Architecture", "Agile", "System Design"], attrition: 0.08 },
    { email: "kavya.reddy@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Kavya", last: "Reddy", designation: "Data Scientist", department: "Analytics", salary: 110000, gender: "FEMALE", skills: ["Python", "ML", "TensorFlow", "SQL", "Tableau"], attrition: 0.22 },
    { email: "rahul.singh@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Rahul", last: "Singh", designation: "DevOps Engineer", department: "Engineering", salary: 105000, gender: "MALE", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], attrition: 0.18 },
    { email: "meera.nair@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Meera", last: "Nair", designation: "Product Manager", department: "Product", salary: 140000, gender: "FEMALE", skills: ["Product Strategy", "Analytics", "Roadmapping", "Stakeholder Mgmt"], attrition: 0.12 },
    { email: "amit.roy@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Amit", last: "Roy", designation: "QA Lead", department: "Engineering", salary: 90000, gender: "MALE", skills: ["Selenium", "Cypress", "API Testing", "Test Strategy"], attrition: 0.54 },
    { email: "deepa.krishnan@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Deepa", last: "Krishnan", designation: "Marketing Specialist", department: "Marketing", salary: 75000, gender: "FEMALE", skills: ["SEO", "Content Strategy", "Analytics", "Social Media"], attrition: 0.3 },
    { email: "sanjay.verma@worksphere.ai", password: empPassword, role: "HR_MANAGER", first: "Sanjay", last: "Verma", designation: "HR Manager", department: "Human Resources", salary: 130000, gender: "MALE", skills: ["Recruitment", "Employee Relations", "HRIS", "Payroll"], attrition: 0.1 },
    { email: "nisha.agarwal@worksphere.ai", password: empPassword, role: "EMPLOYEE", first: "Nisha", last: "Agarwal", designation: "Finance Analyst", department: "Finance", salary: 88000, gender: "FEMALE", skills: ["Financial Modeling", "Excel", "SAP", "Budgeting"], attrition: 0.25 },
  ];

  const createdEmployees = [];
  for (let i = 0; i < employees.length; i++) {
    const e = employees[i];
    const user = await prisma.user.create({
      data: {
        email: e.email, password: e.password, role: e.role,
        employee: {
          create: {
            employeeId: `WS-${String(1001 + i).padStart(4, "0")}`,
            firstName: e.first, lastName: e.last, email: e.email,
            designation: e.designation, department: e.department,
            salary: e.salary, gender: e.gender, skills: e.skills,
            joiningDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            status: "ACTIVE", attritionRisk: e.attrition,
            phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            city: ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai", "Pune"][Math.floor(Math.random() * 6)],
            country: "India",
          },
        },
      },
      include: { employee: true },
    });
    createdEmployees.push(user.employee);
    console.log(`  ✓ ${e.first} ${e.last} (${e.designation})`);
  }

  // ─── Leave Balances ───
  const year = new Date().getFullYear();
  for (const emp of createdEmployees) {
    await prisma.leaveBalance.createMany({
      data: [
        { employeeId: emp.id, leaveType: "CASUAL", total: 12, used: Math.floor(Math.random() * 6), remaining: 12 - Math.floor(Math.random() * 6), year },
        { employeeId: emp.id, leaveType: "SICK", total: 10, used: Math.floor(Math.random() * 4), remaining: 10 - Math.floor(Math.random() * 4), year },
        { employeeId: emp.id, leaveType: "EARNED", total: 15, used: Math.floor(Math.random() * 5), remaining: 15 - Math.floor(Math.random() * 5), year },
      ],
    });
  }
  console.log("\n  ✓ Leave balances created");

  // ─── Leave Requests ───
  await prisma.leaveRequest.createMany({
    data: [
      { employeeId: createdEmployees[1].id, leaveType: "CASUAL", fromDate: new Date(2026, 5, 10), toDate: new Date(2026, 5, 12), totalDays: 3, reason: "Family function", status: "PENDING" },
      { employeeId: createdEmployees[2].id, leaveType: "SICK", fromDate: new Date(2026, 5, 5), toDate: new Date(2026, 5, 6), totalDays: 2, reason: "Medical appointment", status: "PENDING" },
      { employeeId: createdEmployees[3].id, leaveType: "EARNED", fromDate: new Date(2026, 5, 20), toDate: new Date(2026, 5, 25), totalDays: 6, reason: "Vacation", status: "APPROVED", approvedBy: createdEmployees[0].id },
      { employeeId: createdEmployees[5].id, leaveType: "CASUAL", fromDate: new Date(2026, 5, 15), toDate: new Date(2026, 5, 15), totalDays: 1, reason: "Personal work", status: "PENDING" },
    ],
  });
  console.log("  ✓ Leave requests created");

  // ─── Attendance (last 7 days) ───
  for (const emp of createdEmployees) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(); date.setDate(date.getDate() - d); date.setHours(0, 0, 0, 0);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const clockIn = new Date(date); clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 45));
      const clockOut = new Date(date); clockOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      const hours = (clockOut - clockIn) / 3600000;
      await prisma.attendance.create({
        data: { employeeId: emp.id, date, clockIn, clockOut, totalHours: Math.round(hours * 10) / 10, status: Math.random() > 0.85 ? "WORK_FROM_HOME" : "PRESENT", method: "WEB", isLateArrival: clockIn.getHours() >= 10 },
      }).catch(() => {}); // skip duplicates
    }
  }
  console.log("  ✓ Attendance records created");

  // ─── Job Postings ───
  await prisma.jobPosting.createMany({
    data: [
      { title: "Senior React Developer", department: "Engineering", location: "Bangalore", description: "Build next-gen HR platform UI", requirements: ["5+ years React", "TypeScript", "Next.js"], skills: ["React", "TypeScript", "Tailwind"], status: "OPEN" },
      { title: "ML Engineer", department: "Analytics", location: "Hyderabad", description: "Develop AI models for HR analytics", requirements: ["3+ years ML", "Python", "TensorFlow"], skills: ["Python", "TensorFlow", "NLP"], status: "OPEN" },
      { title: "Product Designer", department: "Design", location: "Mumbai", description: "Design intuitive HR workflows", requirements: ["3+ years UX", "Figma", "Design systems"], skills: ["Figma", "UX Research", "Prototyping"], status: "OPEN" },
      { title: "DevOps Architect", department: "Engineering", location: "Remote", description: "Scale cloud infrastructure", requirements: ["5+ years DevOps", "AWS/GCP", "Kubernetes"], skills: ["AWS", "K8s", "Terraform"], status: "OPEN" },
    ],
  });
  console.log("  ✓ Job postings created");

  // ─── Courses ───
  await prisma.course.createMany({
    data: [
      { title: "Advanced React Patterns", category: "Engineering", instructor: "Tech Lead", duration: "8 hours", level: "ADVANCED", skills: ["React", "Design Patterns"], status: "ACTIVE" },
      { title: "Leadership Fundamentals", category: "Management", instructor: "HR Team", duration: "12 hours", level: "INTERMEDIATE", skills: ["Leadership", "Communication"], status: "ACTIVE", isRequired: true },
      { title: "Data Privacy & Compliance", category: "Compliance", instructor: "Legal Team", duration: "4 hours", level: "BEGINNER", skills: ["GDPR", "Data Privacy"], status: "ACTIVE", isRequired: true },
      { title: "Machine Learning Basics", category: "Analytics", instructor: "Data Science Lead", duration: "16 hours", level: "BEGINNER", skills: ["Python", "ML", "Statistics"], status: "ACTIVE" },
      { title: "Effective Communication", category: "Soft Skills", instructor: "L&D Team", duration: "6 hours", level: "BEGINNER", skills: ["Communication", "Presentation"], status: "ACTIVE" },
    ],
  });
  console.log("  ✓ Courses created");

  // ─── Recognitions ───
  await prisma.recognition.createMany({
    data: [
      { giverId: createdEmployees[4].id, receiverId: createdEmployees[1].id, badge: "⭐ Star Performer", message: "Outstanding work on the dashboard redesign!", category: "Excellence" },
      { giverId: createdEmployees[0].id, receiverId: createdEmployees[7].id, badge: "🚀 Innovation Champion", message: "Great job launching the new product feature!", category: "Innovation" },
      { giverId: createdEmployees[1].id, receiverId: createdEmployees[6].id, badge: "🤝 Team Player", message: "Always ready to help the team!", category: "Teamwork" },
      { giverId: createdEmployees[7].id, receiverId: createdEmployees[5].id, badge: "📊 Data Wizard", message: "Incredible insights from the Q1 analytics report!", category: "Excellence" },
    ],
  });
  console.log("  ✓ Recognitions created");

  // ─── Helpdesk Tickets ───
  await prisma.ticket.createMany({
    data: [
      { ticketNo: "TKT-001001", employeeId: createdEmployees[1].id, category: "IT_SUPPORT", subject: "VPN not connecting", description: "Unable to connect to office VPN from home", priority: "HIGH", status: "IN_PROGRESS", assignedTo: "IT Team" },
      { ticketNo: "TKT-001002", employeeId: createdEmployees[3].id, category: "HR_QUERY", subject: "WFH policy clarification", description: "Need clarity on new hybrid work policy", priority: "MEDIUM", status: "OPEN" },
      { ticketNo: "TKT-001003", employeeId: createdEmployees[8].id, category: "PAYROLL", subject: "Tax declaration update", description: "Need to update investment declarations for tax saving", priority: "LOW", status: "OPEN" },
      { ticketNo: "TKT-001004", employeeId: createdEmployees[2].id, category: "ACCESS_REQUEST", subject: "AWS console access", description: "Need access to production AWS console for deployment", priority: "URGENT", status: "OPEN" },
    ],
  });
  console.log("  ✓ Helpdesk tickets created");

  // ─── Performance Reviews ───
  for (const emp of createdEmployees.slice(1, 9)) {
    await prisma.performance.create({
      data: {
        employeeId: emp.id, reviewCycle: "Annual", year: 2025,
        selfRating: 3 + Math.random() * 2, managerRating: 3 + Math.random() * 2,
        finalRating: 3 + Math.random() * 2, status: "COMPLETED",
        strengths: "Strong technical skills, good team collaboration",
        improvements: "Could improve documentation and time management",
      },
    });
  }
  console.log("  ✓ Performance reviews created");

  // ─── Goals ───
  await prisma.goal.createMany({
    data: [
      { employeeId: createdEmployees[1].id, title: "Complete React 19 migration", category: "PROJECT", progress: 65, status: "IN_PROGRESS", targetDate: new Date(2026, 6, 30) },
      { employeeId: createdEmployees[1].id, title: "Mentor 2 junior developers", category: "DEVELOPMENT", progress: 40, status: "IN_PROGRESS", targetDate: new Date(2026, 11, 31) },
      { employeeId: createdEmployees[4].id, title: "Reduce deployment time by 50%", category: "TEAM", progress: 80, status: "IN_PROGRESS", targetDate: new Date(2026, 5, 30) },
      { employeeId: createdEmployees[5].id, title: "Build attrition prediction model", category: "PROJECT", progress: 90, status: "IN_PROGRESS", targetDate: new Date(2026, 5, 15) },
    ],
  });
  console.log("  ✓ Goals created");

  // ─── Mood Check-ins ───
  const moods = ["GREAT", "GOOD", "OKAY", "LOW", "BAD"];
  for (const emp of createdEmployees) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(); date.setDate(date.getDate() - d); date.setHours(0, 0, 0, 0);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      await prisma.moodCheckin.create({
        data: { employeeId: emp.id, mood: moods[Math.floor(Math.random() * 5)], date },
      }).catch(() => {});
    }
  }
  console.log("  ✓ Mood check-ins created");

  console.log("\n✅ Database seeded successfully!\n");
  console.log("  Demo credentials:");
  console.log("  HR Admin:  admin@worksphere.ai / admin123");
  console.log("  Employee:  priya.sharma@worksphere.ai / employee123\n");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
