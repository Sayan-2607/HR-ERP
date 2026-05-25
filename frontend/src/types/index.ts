export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'HR_ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE';
  employee: Employee | null;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  designation: string;
  department: string;
  team?: string;
  status: string;
  joiningDate: string;
  employmentType: string;
  skills: string[];
  attritionRisk?: number;
  salary?: number;
  gender?: string;
  city?: string;
  country?: string;
}

export interface Attendance {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours?: number;
  status: string;
  method?: string;
  isLateArrival: boolean;
}

export interface LeaveRequest {
  id: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: string;
  employee?: Employee;
  createdAt: string;
}

export interface LeaveBalance {
  id: string;
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

export interface Payroll {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  grossSalary: number;
  netSalary: number;
  totalDeduct: number;
  status: string;
  employee?: Employee;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  skills: string[];
  _count?: { applications: number };
}

export interface Application {
  id: string;
  candidateName: string;
  email: string;
  aiScore?: number;
  stage: string;
  job?: { title: string; department: string };
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor?: string;
  duration?: string;
  level: string;
  skills: string[];
  _count?: { enrollments: number };
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  status: string;
  targetDate?: string;
}

export interface Recognition {
  id: string;
  badge: string;
  message: string;
  likes: number;
  giver: { firstName: string; lastName: string };
  receiver: { firstName: string; lastName: string };
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNo: string;
  category: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
  employee?: Employee;
}

export interface MoodCheckin {
  id: string;
  mood: string;
  note?: string;
  date: string;
}

export type PageId = 'dashboard' | 'employees' | 'attendance' | 'leave' | 'payroll' | 'recruitment' | 'performance' | 'learning' | 'engagement' | 'helpdesk' | 'analytics' | 'ai-assistant' | 'settings';
