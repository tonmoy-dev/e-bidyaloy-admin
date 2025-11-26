export interface Leave {
  id: string;
  type: "Emergency" | "Medical" | "Casual" | "Not Well" | "Fever";
  date: string;
  status: "Pending" | "Approved" | "Declined";
  icon?: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  icon: string;
  iconBgColor: string;
  daysRemaining?: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  endDate?: string;
  borderColor: string;
  icon: string;
  iconBgColor: string;
  participants?: Array<{
    id: string;
    image: string;
  }>;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  teacherName: string;
  teacherImage: string;
  dueDate: string;
  image: string;
  progress?: number;
}

export interface Fee {
  id: string;
  type: string;
  amount: string;
  lastDate: string;
  icon: string;
  iconBgColor: string;
  isDue?: boolean;
  dueAmount?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  halfDay?: number;
  emergency?: number;
}

export interface AttendanceChartData {
  series: number[];
  labels: string[];
  colors: string[];
}

export interface TodoItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  status: "Completed" | "Inprogress" | "Yet to Start";
}

export interface ProfileCardData {
  id: string;
  name: string;
  image: string;
  badge?: string;
  additionalInfo?: Array<{
    label: string;
    value: string;
  }>;
  editLink?: string;
}

export interface DateRangeOption {
  label: string;
  value: string;
}

