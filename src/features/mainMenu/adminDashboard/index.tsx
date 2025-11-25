import 'bootstrap-daterangepicker/daterangepicker.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from '../../router/all_routes';
import {
  ActionLinksCards,
  AttendanceTabsWidget,
  EarningsExpensesCards,
  FeesCollectionChart,
  FeesSummaryCards,
  LeaveRequestsWidget,
  NoticeBoardWidget,
  PerformanceChart,
  PerformerSlider,
  ProgressListWidget,
  QuickLinksWidget,
  SchedulesWidget,
  StatCard,
  StudentActivityWidget,
  TodoWidget,
  TopSubjectsList,
  WelcomeBanner,
} from '../dashboards/shared/components/widgets';
import type { ActionLink } from '../dashboards/shared/components/widgets/ActionLinksCards';
import type { AttendanceTab } from '../dashboards/shared/components/widgets/AttendanceTabsWidget';
import type { EarningsExpensesCardData } from '../dashboards/shared/components/widgets/EarningsExpensesCards';
import type { FeesSummaryItem } from '../dashboards/shared/components/widgets/FeesSummaryCards';
import type { LeaveRequest } from '../dashboards/shared/components/widgets/LeaveRequestsWidget';
import type { PerformanceMetric } from '../dashboards/shared/components/widgets/PerformanceChart';
import type { PerformerItem } from '../dashboards/shared/components/widgets/PerformerSlider';
import type { ProgressItem } from '../dashboards/shared/components/widgets/ProgressListWidget';
import type { QuickLink } from '../dashboards/shared/components/widgets/QuickLinksWidget';
import type { ActivityItem } from '../dashboards/shared/components/widgets/StudentActivityWidget';
import type { SubjectItem } from '../dashboards/shared/components/widgets/TopSubjectsList';
import type {
  AttendanceChartData,
  AttendanceStats,
  Event,
  Notice,
  TodoItem,
} from '../dashboards/shared/types/dashboard.types';
import AdminDashboardModal from './adminDashboardModal';

const AdminDashboard = () => {
  const routes = all_routes;
  const [attendanceDateRange, setAttendanceDateRange] = useState<string>('Today');
  const [todoDateRange, setTodoDateRange] = useState<string>('Today');

  // Chart configurations
  const [studentDonutChart] = useState<any>({
    chart: {
      height: 218,
      width: 218,
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    colors: ['#3D5EE1', '#6FCCD8'],
    series: [3610, 44],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 180,
          },
        },
      },
    ],
  });
  const [teacherDonutChart] = useState<any>({
    chart: {
      height: 218,
      width: 218,
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    colors: ['#3D5EE1', '#6FCCD8'],
    series: [346, 54],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 180,
          },
        },
      },
    ],
  });
  const [staffDonutChart] = useState<any>({
    chart: {
      height: 218,
      width: 218,
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    colors: ['#3D5EE1', '#6FCCD8'],
    series: [620, 80],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 180,
          },
        },
      },
    ],
  });
  const [classDonutChart] = useState<any>({
    chart: {
      height: 218,
      width: 218,
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    labels: ['Good', 'Average', 'Below Average'],
    legend: { show: false },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        offsetX: -15,
      },
    },
    grid: {
      padding: {
        left: -8,
      },
    },
    colors: ['#3D5EE1', '#EAB300', '#E82646'],
    series: [45, 11, 2],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 180,
          },
        },
      },
    ],
  });
  const [feesBar] = useState<any>({
    chart: {
      height: 275,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'left',
      position: 'top',
      fontSize: '14px',
      labels: {
        colors: '#5D6369',
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded',
      },
    },
    colors: ['#3D5EE1', '#E9EDF4'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    grid: {
      padding: {
        left: -8,
      },
    },
    series: [
      {
        name: 'Collected Fee',
        data: [30, 40, 38, 40, 38, 30, 35, 38, 40],
      },
      {
        name: 'Total Fee',
        data: [45, 50, 48, 50, 48, 40, 40, 50, 55],
      },
    ],
    xaxis: {
      categories: [
        'Q1: 2023',
        'Q1: 2023',
        'Q1: 2023',
        'Q1: 2023',
        'Q1: 2023',
        'uQ1: 2023l',
        'Q1: 2023',
        'Q1: 2023',
        'Q1: 2023',
      ],
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        offsetX: -15,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return '$ ' + val + ' thousands';
        },
      },
    },
  });
  const [totalEarningArea] = useState<any>({
    chart: {
      height: 90,
      type: 'area',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#3D5EE1'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    series: [
      {
        name: 'Earnings',
        data: [50, 55, 40, 50, 45, 55, 50],
      },
    ],
  });
  const [totalExpenseArea] = useState<any>({
    chart: {
      height: 90,
      type: 'area',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#E82646'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    series: [
      {
        name: 'Expense',
        data: [40, 30, 60, 55, 50, 55, 40],
      },
    ],
  });

  // Sample data - will be replaced with dynamic data later
  const events: Event[] = [
    {
      id: '1',
      title: 'Parents, Teacher Meet',
      date: '15 July 2024',
      time: '09:10AM - 10:50PM',
      borderColor: 'skyblue',
      icon: 'ti ti-user-edit text-info fs-20',
      iconBgColor: 'bg-teal-transparent',
      participants: [
        { id: '1', image: 'assets/img/parents/parent-01.jpg' },
        { id: '2', image: 'assets/img/parents/parent-07.jpg' },
        { id: '3', image: 'assets/img/parents/parent-02.jpg' },
      ],
    },
    {
      id: '2',
      title: 'Parents, Teacher Meet',
      date: '15 July 2024',
      time: '09:10AM - 10:50PM',
      borderColor: 'info',
      icon: 'ti ti-user-edit fs-20',
      iconBgColor: 'bg-info-transparent',
      participants: [
        { id: '1', image: 'assets/img/parents/parent-05.jpg' },
        { id: '2', image: 'assets/img/parents/parent-06.jpg' },
        { id: '3', image: 'assets/img/parents/parent-07.jpg' },
      ],
    },
    {
      id: '3',
      title: 'Vacation Meeting',
      date: '07 July 2024',
      endDate: '07 July 2024',
      time: '09:10 AM - 10:50 PM',
      borderColor: 'danger',
      icon: 'ti ti-vacuum-cleaner fs-24',
      iconBgColor: 'bg-danger-transparent',
      participants: [
        { id: '1', image: 'assets/img/parents/parent-11.jpg' },
        { id: '2', image: 'assets/img/parents/parent-13.jpg' },
      ],
    },
  ];

  const notices: Notice[] = [
    {
      id: '1',
      title: 'New Syllabus Instructions',
      date: '11 Mar 2024',
      icon: 'ti ti-books fs-16',
      iconBgColor: 'bg-primary-transparent',
      daysRemaining: 20,
    },
    {
      id: '2',
      title: 'World Environment Day Program.....!!!',
      date: '21 Apr 2024',
      icon: 'ti ti-note fs-16',
      iconBgColor: 'bg-success-transparent',
      daysRemaining: 15,
    },
    {
      id: '3',
      title: 'Exam Preparation Notification!',
      date: '13 Mar 2024',
      icon: 'ti ti-bell-check fs-16',
      iconBgColor: 'bg-danger-transparent',
      daysRemaining: 12,
    },
    {
      id: '4',
      title: 'Online Classes Preparation',
      date: '24 May 2024',
      icon: 'ti ti-notes fs-16',
      iconBgColor: 'bg-skyblue-transparent',
      daysRemaining: 2,
    },
    {
      id: '5',
      title: 'Exam Time Table Release',
      date: '24 May 2024',
      icon: 'ti ti-package fs-16',
      iconBgColor: 'bg-warning-transparent',
      daysRemaining: 6,
    },
  ];

  const todos: TodoItem[] = [
    {
      id: '1',
      title: 'Send Reminder to Students',
      time: '01:00 PM',
      completed: true,
      status: 'Completed',
    },
    {
      id: '2',
      title: 'Create Routine to new staff',
      time: '04:50 PM',
      completed: false,
      status: 'Inprogress',
    },
    {
      id: '3',
      title: 'Extra Class Info to Students',
      time: '04:55 PM',
      completed: false,
      status: 'Yet to Start',
    },
    {
      id: '4',
      title: 'Fees for Upcoming Academics',
      time: '04:55 PM',
      completed: false,
      status: 'Yet to Start',
    },
    {
      id: '5',
      title: 'English - Essay on Visit',
      time: '05:55 PM',
      completed: false,
      status: 'Yet to Start',
    },
  ];

  // Attendance data for Students tab
  const studentAttendanceStats: AttendanceStats = {
    present: 0,
    absent: 1,
    late: 1,
    emergency: 28,
  };

  const studentAttendanceChart: AttendanceChartData = {
    series: [3610, 44],
    labels: ['Present', 'Absent'],
    colors: ['#3D5EE1', '#6FCCD8'],
  };

  // Attendance data for Teachers tab
  const teacherAttendanceStats: AttendanceStats = {
    present: 0,
    absent: 3,
    late: 3,
    emergency: 30,
  };

  const teacherAttendanceChart: AttendanceChartData = {
    series: [346, 54],
    labels: ['Present', 'Absent'],
    colors: ['#3D5EE1', '#6FCCD8'],
  };

  // Attendance data for Staff tab
  const staffAttendanceStats: AttendanceStats = {
    present: 0,
    absent: 1,
    late: 10,
    emergency: 45,
  };

  const staffAttendanceChart: AttendanceChartData = {
    series: [620, 80],
    labels: ['Present', 'Absent'],
    colors: ['#3D5EE1', '#6FCCD8'],
  };

  // Attendance tabs data
  const attendanceTabs: AttendanceTab[] = [
    {
      id: 'students',
      label: 'Students',
      stats: studentAttendanceStats,
      chartData: studentAttendanceChart,
      chartOptions: studentDonutChart,
      viewAllLink: routes.studentAttendance,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      stats: teacherAttendanceStats,
      chartData: teacherAttendanceChart,
      chartOptions: teacherDonutChart,
      viewAllLink: 'teacher-attendance',
    },
    {
      id: 'staff',
      label: 'Staff',
      stats: staffAttendanceStats,
      chartData: staffAttendanceChart,
      chartOptions: staffDonutChart,
      viewAllLink: routes.studentAttendance,
    },
  ];

  // Slider settings for performer sliders
  const performerSliderSettings = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
  };

  // Quick Links data
  const quickLinks: QuickLink[] = [
    {
      id: '1',
      title: 'Calendar',
      link: routes.classTimetable,
      icon: 'ti ti-calendar',
      bgColor: 'bg-success-transparent',
      borderColor: 'border-success',
    },
    {
      id: '2',
      title: 'Fees',
      link: routes.feesGroup,
      icon: 'ti ti-license',
      bgColor: 'bg-secondary-transparent',
      borderColor: 'border-secondary',
    },
    {
      id: '3',
      title: 'Exam Result',
      link: routes.examResult,
      icon: 'ti ti-hexagonal-prism',
      bgColor: 'bg-primary-transparent',
      borderColor: 'border-primary',
    },
    {
      id: '4',
      title: 'Home Works',
      link: routes.classHomeWork,
      icon: 'ti ti-report-money',
      bgColor: 'bg-danger-transparent',
      borderColor: 'border-danger',
    },
    {
      id: '5',
      title: 'Attendance',
      link: routes.studentAttendance,
      icon: 'ti ti-calendar-share',
      bgColor: 'bg-warning-transparent',
      borderColor: 'border-warning',
    },
    {
      id: '6',
      title: 'Reports',
      link: routes.attendanceReport,
      icon: 'ti ti-file-pencil',
      bgColor: 'bg-skyblue-transparent',
      borderColor: 'border-skyblue',
    },
  ];

  // Performer data
  const bestPerformers: PerformerItem[] = [
    {
      id: '1',
      title: 'Best Performer',
      name: 'Rubell',
      subtitle: 'Physics Teacher',
      image: 'assets/img/performer/performer-01.png',
    },
    {
      id: '2',
      title: 'Best Performer',
      name: 'George Odell',
      subtitle: 'English Teacher',
      image: 'assets/img/performer/performer-02.png',
    },
  ];

  const starStudents: PerformerItem[] = [
    {
      id: '1',
      title: 'Star Students',
      name: 'Tenesa',
      subtitle: 'XII, A',
      image: 'assets/img/performer/student-performer-01.png',
    },
    {
      id: '2',
      title: 'Star Students',
      name: 'Michael',
      subtitle: 'XII, B',
      image: 'assets/img/performer/student-performer-02.png',
    },
  ];

  // Class Routine data
  const classRoutineItems: ProgressItem[] = [
    {
      id: '1',
      label: 'Oct 2024',
      progress: 80,
      image: 'assets/img/teachers/teacher-01.jpg',
      progressColor: 'bg-primary',
    },
    {
      id: '2',
      label: 'Nov 2024',
      progress: 80,
      image: 'assets/img/teachers/teacher-02.jpg',
      progressColor: 'bg-warning',
    },
    {
      id: '3',
      label: 'Oct 2024',
      progress: 80,
      image: 'assets/img/teachers/teacher-03.jpg',
      progressColor: 'bg-success',
    },
  ];

  // Performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Top',
      value: 45,
      icon: 'ti ti-arrow-badge-down-filled',
      color: 'text-primary',
    },
    {
      label: 'Average',
      value: 11,
      icon: 'ti ti-arrow-badge-down-filled',
      color: 'text-warning',
    },
    {
      label: 'Below Avg',
      value: 2,
      icon: 'ti ti-arrow-badge-down-filled',
      color: 'text-danger',
    },
  ];

  // Leave requests data
  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      name: 'James',
      role: 'Physics Teacher',
      image: 'assets/img/profiles/avatar-14.jpg',
      leaveType: 'Emergency',
      leaveTypeBadgeColor: 'badge-soft-danger',
      leaveDate: '12 -13 May',
      applyDate: '12 May',
      onApprove: (id) => console.log('Approve leave:', id),
      onReject: (id) => console.log('Reject leave:', id),
    },
    {
      id: '2',
      name: 'Ramien',
      role: 'Accountant',
      image: 'assets/img/profiles/avatar-19.jpg',
      leaveType: 'Casual',
      leaveTypeBadgeColor: 'badge-soft-warning',
      leaveDate: '12 -13 May',
      applyDate: '11 May',
      onApprove: (id) => console.log('Approve leave:', id),
      onReject: (id) => console.log('Reject leave:', id),
    },
  ];

  // Action links data
  const actionLinks: ActionLink[] = [
    {
      id: '1',
      title: 'View Attendance',
      link: routes.studentAttendance,
      icon: 'ti ti-calendar-share fs-24',
      bgColor: 'bg-warning-transparent',
      borderColor: 'bg-warning',
      hoverClass: 'warning-btn-hover',
    },
    {
      id: '2',
      title: 'New Events',
      link: routes.events,
      icon: 'ti ti-speakerphone fs-24',
      bgColor: 'bg-success-transparent',
      borderColor: 'bg-success',
      hoverClass: 'success-btn-hover',
    },
    {
      id: '3',
      title: 'Membership Plans',
      link: routes.membershipplan,
      icon: 'ti ti-sphere fs-24',
      bgColor: 'bg-danger-transparent',
      borderColor: 'bg-danger',
      hoverClass: 'danger-btn-hover',
    },
    {
      id: '4',
      title: 'Finance & Accounts',
      link: routes.studentAttendance,
      icon: 'ti ti-moneybag fs-24',
      bgColor: 'bg-secondary-transparent',
      borderColor: 'bg-secondary',
      hoverClass: 'secondary-btn-hover',
    },
  ];

  // Earnings and Expenses data
  const earningsCard: EarningsExpensesCardData = {
    title: 'Total Earnings',
    value: '$64,522,24',
    icon: 'ti ti-user-dollar',
    iconBgColor: 'bg-primary',
    chartOptions: totalEarningArea,
    chartSeries: totalEarningArea.series,
    chartHeight: 90,
  };

  const expensesCard: EarningsExpensesCardData = {
    title: 'Total Expenses',
    value: '$60,522,24',
    icon: 'ti ti-user-dollar',
    iconBgColor: 'bg-danger',
    chartOptions: totalExpenseArea,
    chartSeries: totalExpenseArea.series,
    chartHeight: 90,
  };

  // Fees Summary data
  const feesSummaryItems: FeesSummaryItem[] = [
    {
      id: '1',
      label: 'Total Fees Collected',
      value: '$25,000,02',
      badge: {
        text: '1.2%',
        color: 'badge-soft-success',
        icon: 'ti ti-chart-line',
      },
    },
    {
      id: '2',
      label: 'Fine Collected till date',
      value: '$4,56,64',
      badge: {
        text: '1.2%',
        color: 'badge-soft-danger',
        icon: 'ti ti-chart-line',
      },
    },
    {
      id: '3',
      label: 'Student Not Paid',
      value: '$545',
      badge: {
        text: '1.2%',
        color: 'badge-soft-info',
        icon: 'ti ti-chart-line',
      },
    },
    {
      id: '4',
      label: 'Total Outstanding',
      value: '$4,56,64',
      badge: {
        text: '1.2%',
        color: 'badge-soft-danger',
        icon: 'ti ti-chart-line',
      },
    },
  ];

  // Top Subjects data
  const topSubjects: SubjectItem[] = [
    { id: '1', name: 'Maths', progress: 20, progressColor: 'bg-primary' },
    { id: '2', name: 'Physics', progress: 30, progressColor: 'bg-secondary' },
    { id: '3', name: 'Chemistry', progress: 40, progressColor: 'bg-info' },
    { id: '4', name: 'Botany', progress: 50, progressColor: 'bg-success' },
    { id: '5', name: 'English', progress: 70, progressColor: 'bg-warning' },
    { id: '6', name: 'Spanish', progress: 80, progressColor: 'bg-danger' },
    { id: '7', name: 'Japanese', progress: 85, progressColor: 'bg-primary' },
  ];

  // Student Activity data
  const studentActivities: ActivityItem[] = [
    {
      id: '1',
      title: '1st place in "Chess"',
      description: 'This event took place in Our School',
      image: 'assets/img/students/student-09.jpg',
    },
    {
      id: '2',
      title: 'Participated in "Carrom"',
      description: 'Justin Lee participated in "Carrom"',
      image: 'assets/img/students/student-12.jpg',
    },
    {
      id: '3',
      title: '1st place in "100M"',
      description: 'This event took place in Our School',
      image: 'assets/img/students/student-11.jpg',
    },
    {
      id: '4',
      title: 'International conference',
      description: 'We attended international conference',
      image: 'assets/img/students/student-10.jpg',
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <>
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Admin Dashboard</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Admin Dashboard
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link
                    to={routes.addStudent}
                    className="btn btn-primary d-flex align-items-center me-3"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add New Student
                  </Link>
                </div>
                <div className="mb-2">
                  <Link to={routes.collectFees} className="btn btn-light d-flex align-items-center">
                    Fees Details
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="alert-message">
                  <div
                    className="alert alert-success rounded-pill d-flex align-items-center justify-content-between border-success mb-4"
                    role="alert"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-1 avatar avatar-sm flex-shrink-0">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-27.jpg"
                          alt="Img"
                          className="img-fluid rounded-circle"
                        />
                      </span>
                      <p>
                        Fahed III,C has paid Fees for the <strong className="mx-1">“Term1”</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close p-0"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    >
                      <span>
                        <i className="ti ti-x" />
                      </span>
                    </button>
                  </div>
                </div>
                {/* Dashboard Content */}
                <WelcomeBanner
                  greeting="Welcome Back, Mr. Herald"
                  subtitle="Have a Good day at work"
                  profileLink="profile"
                  lastUpdated="15 Jun 2024"
                />
                {/* /Dashboard Content */}
              </div>
            </div>
            <div className="row">
              {/* Total Students */}
              <div className="col-xxl-3 col-sm-6 d-flex">
                <StatCard
                  data={{
                    title: 'Total Students',
                    value: 3654,
                    badge: { text: '1.2%', color: 'bg-danger' },
                    icon: {
                      src: 'assets/img/icons/student.svg',
                      alt: 'Students',
                      bgColor: 'bg-danger-transparent',
                    },
                    footer: {
                      active: { label: 'Active', value: 3643 },
                      inactive: { label: 'Inactive', value: 11 },
                    },
                  }}
                />
              </div>
              {/* /Total Students */}
              {/* Total Teachers */}
              <div className="col-xxl-3 col-sm-6 d-flex">
                <StatCard
                  data={{
                    title: 'Total Teachers',
                    value: 284,
                    badge: { text: '1.2%', color: 'bg-pending' },
                    icon: {
                      src: 'assets/img/icons/teacher.svg',
                      alt: 'Teachers',
                      bgColor: 'bg-secondary-transparent',
                    },
                    footer: {
                      active: { label: 'Active', value: 254 },
                      inactive: { label: 'Inactive', value: 30 },
                    },
                  }}
                />
              </div>
              {/* /Total Teachers */}
              {/* Total Staff */}
              <div className="col-xxl-3 col-sm-6 d-flex">
                <StatCard
                  data={{
                    title: 'Total Staff',
                    value: 162,
                    badge: { text: '1.2%', color: 'bg-warning' },
                    icon: {
                      src: 'assets/img/icons/staff.svg',
                      alt: 'Staff',
                      bgColor: 'bg-warning-transparent',
                    },
                    footer: {
                      active: { label: 'Active', value: 161 },
                      inactive: { label: 'Inactive', value: 2 },
                    },
                  }}
                />
              </div>
              {/* /Total Staff */}
              {/* Total Subjects */}
              <div className="col-xxl-3 col-sm-6 d-flex">
                <StatCard
                  data={{
                    title: 'Total Subjects',
                    value: 82,
                    badge: { text: '1.2%', color: 'bg-success' },
                    icon: {
                      src: 'assets/img/icons/subject.svg',
                      alt: 'Subjects',
                      bgColor: 'bg-success-transparent',
                    },
                    footer: {
                      active: { label: 'Active', value: 81 },
                      inactive: { label: 'Inactive', value: 1 },
                    },
                  }}
                />
              </div>
              {/* /Total Subjects */}
            </div>
            <div className="row">
              {/* Schedules */}
              <div className="col-xxl-4 col-xl-6 col-md-12 d-flex">
                <SchedulesWidget
                  events={events}
                  addNewModalTarget="#add_event"
                  calendarClassName="datepickers mb-4"
                />
              </div>
              {/* /Schedules */}
              {/* Attendance */}
              <div className="col-xxl-4 col-xl-6 col-md-12 d-flex flex-column">
                <AttendanceTabsWidget
                  dateRange={attendanceDateRange}
                  onDateRangeChange={setAttendanceDateRange}
                  tabs={attendanceTabs}
                />
                <div className="row flex-fill">
                  {/* Best Performer */}
                  <div className="col-sm-6 d-flex flex-column">
                    <PerformerSlider
                      title="Best Performer"
                      performers={bestPerformers}
                      bgColor="bg-success-800"
                      sliderSettings={performerSliderSettings}
                      className="bg-01"
                    />
                  </div>
                  {/* /Best Performer */}
                  {/* Star Students */}
                  <div className="col-sm-6 d-flex flex-column">
                    <PerformerSlider
                      title="Star Students"
                      performers={starStudents}
                      bgColor="bg-info"
                      sliderSettings={performerSliderSettings}
                      className="bg-02"
                    />
                  </div>
                  {/* /Star Students */}
                </div>
              </div>
              {/* /Attendance */}
              <div className="col-xxl-4 col-md-12 d-flex flex-column">
                {/* Quick Links */}
                <QuickLinksWidget links={quickLinks} itemsPerSlide={2} />
                {/* /Quick Links */}
                {/* Class Routine */}
                <ProgressListWidget
                  title="Class Routine"
                  items={classRoutineItems}
                  addNewModalTarget="#add_class_routine"
                  showImage={true}
                />
                {/* /Class Routine */}
                {/* Class Wise Performance */}
                <PerformanceChart
                  title="Performance"
                  selectedClass="Class II"
                  metrics={performanceMetrics}
                  chartOptions={classDonutChart}
                  chartSeries={classDonutChart.series}
                  classOptions={[
                    { label: 'Class I', value: 'Class I' },
                    { label: 'Class II', value: 'Class II' },
                    { label: 'Class III', value: 'Class III' },
                    { label: 'Class IV', value: 'Class IV' },
                  ]}
                />
                {/* /Class Wise Performance */}
              </div>
            </div>
            <div className="row">
              {/* Fees Collection */}
              <div className="col-xxl-8 col-xl-6 d-flex">
                <FeesCollectionChart
                  title="Fees Collection"
                  dateRange="Last 8 Quater"
                  chartOptions={feesBar}
                  chartSeries={feesBar.series}
                  chartHeight={270}
                  dateRangeOptions={[
                    { label: 'This Month', value: 'This Month' },
                    { label: 'This Year', value: 'This Year' },
                    { label: 'Last 12 Quater', value: 'Last 12 Quater' },
                    { label: 'Last 16 Quater', value: 'Last 16 Quater' },
                  ]}
                />
              </div>
              {/* /Fees Collection */}
              {/* Leave Requests */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <LeaveRequestsWidget
                  title="Leave Requests"
                  requests={leaveRequests}
                  dateRange="Today"
                  dateRangeOptions={[
                    { label: 'This Week', value: 'This Week' },
                    { label: 'Last Week', value: 'Last Week' },
                  ]}
                />
              </div>
              {/* /Leave Requests */}
            </div>
            <div className="row">
              {/* Action Links */}
              <ActionLinksCards links={actionLinks} />
              {/* /Action Links */}
            </div>
            <div className="row">
              {/* Total Earnings */}
              <EarningsExpensesCards earningsCard={earningsCard} expensesCard={expensesCard} />
              {/* /Total Earnings */}
              {/* Notice Board */}
              <div className="col-xxl-5 col-xl-12 order-3 order-xxl-2 d-flex">
                <NoticeBoardWidget
                  notices={notices}
                  viewAllLink={routes.noticeBoard}
                  showDaysRemaining={true}
                />
              </div>
              {/* /Notice Board */}
              {/* Fees Collection */}
              <FeesSummaryCards items={feesSummaryItems} />
              {/* /Fees Collection */}
            </div>
            <div className="row">
              {/* Top Subjects */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <TopSubjectsList
                  title="Top Subjects"
                  selectedClass="Class II"
                  subjects={topSubjects}
                  infoMessage="These Result are obtained from the syllabus completion on the respective Class"
                  classOptions={[
                    { label: 'Class I', value: 'Class I' },
                    { label: 'Class II', value: 'Class II' },
                    { label: 'Class III', value: 'Class III' },
                    { label: 'Class IV', value: 'Class IV' },
                  ]}
                />
              </div>
              {/* /Top Subjects */}
              {/* Student Activity */}
              <div className="col-xxl-4 col-xl-6 d-flex">
                <StudentActivityWidget
                  title="Student Activity"
                  dateRange="This Month"
                  activities={studentActivities}
                  dateRangeOptions={[
                    { label: 'This Month', value: 'This Month' },
                    { label: 'This Year', value: 'This Year' },
                    { label: 'Last Week', value: 'Last Week' },
                  ]}
                />
              </div>
              {/* /Student Activity */}
              {/* Todo */}
              <div className="col-xxl-4 col-xl-12 d-flex">
                <TodoWidget
                  todos={todos}
                  dateRange={todoDateRange}
                  onDateRangeChange={setTodoDateRange}
                  onToggleComplete={(id) => {
                    // Handle toggle - will be implemented with dynamic data
                    console.log('Toggle todo:', id);
                  }}
                />
              </div>
              {/* /Todo */}
            </div>
          </>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AdminDashboardModal />
    </>
  );
};

export default AdminDashboard;
