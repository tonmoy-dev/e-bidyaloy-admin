import 'bootstrap-daterangepicker/daterangepicker.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import {
  ActionLinksCards,
  AttendanceTabsWidget,
  NoticeBoardWidget,
  ProgressListWidget,
  QuickLinksWidget,
  SchedulesWidget,
  StatCard,
  WelcomeBanner,
} from '../dashboards/shared/components/widgets';
import type { ActionLink } from '../dashboards/shared/components/widgets/ActionLinksCards';
import type { AttendanceTab } from '../dashboards/shared/components/widgets/AttendanceTabsWidget';
import type { ProgressItem } from '../dashboards/shared/components/widgets/ProgressListWidget';
import type { QuickLink } from '../dashboards/shared/components/widgets/QuickLinksWidget';
import type {
  AttendanceChartData,
  AttendanceStats,
  Event,
  Notice,
} from '../dashboards/shared/types/dashboard.types';
import AdminDashboardModal from './adminDashboardModal';

const AdminDashboard = () => {
  const routes = all_routes;
  const [attendanceDateRange, setAttendanceDateRange] = useState<string>('Today');

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
      title: 'Students',
      link: routes.studentList,
      icon: 'ti ti-user-plus',
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
      title: 'Assignments',
      link: routes.assignments,
      icon: 'ti ti-clipboard-list fs-24',
      bgColor: 'bg-danger-transparent',
      borderColor: 'bg-danger',
      hoverClass: 'danger-btn-hover',
    },
    {
      id: '4',
      title: 'Academic Application',
      link: routes.AcademicApplication,
      icon: 'ti ti-lifebuoy fs-24',
      bgColor: 'bg-secondary-transparent',
      borderColor: 'bg-secondary',
      hoverClass: 'secondary-btn-hover',
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
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                {/* Dashboard Content */}
                <WelcomeBanner
                  greeting="Welcome Back"
                  subtitle="Have a Good day !!!"
                  profileLink="profile"
                  lastUpdated="Today"
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
                {/* Class Routine */}
                <ProgressListWidget
                  title="Class Routine"
                  items={classRoutineItems}
                  addNewModalTarget="#add_class_routine"
                  showImage={true}
                />
                {/* /Class Routine */}
              </div>
              {/* /Attendance */}
              <div className="col-xxl-4 col-md-12 d-flex flex-column">
                {/* Quick Links */}
                <QuickLinksWidget links={quickLinks} itemsPerSlide={2} />
                {/* /Quick Links */}

                {/* Notice Board */}
                <NoticeBoardWidget
                  notices={notices}
                  viewAllLink={routes.noticeBoard}
                  showDaysRemaining={true}
                />
                {/* /Notice Board */}
              </div>
            </div>

            <div className="row">
              {/* Action Links */}
              <ActionLinksCards links={actionLinks} />
              {/* /Action Links */}
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
