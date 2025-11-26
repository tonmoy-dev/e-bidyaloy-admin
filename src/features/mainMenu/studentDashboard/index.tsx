import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { all_routes } from '../../router/all_routes';
import {
  AttendanceWidget,
  NoticeBoardWidget,
  StudentFeesReminderWidget,
  StudentProfileCard,
  StudentQuickLinks,
  StudentSchedulesWidget,
  StudentTodaysClassWidget,
} from '../dashboards/shared/components/widgets';
import type { StudentQuickLink } from '../dashboards/shared/components/widgets/StudentQuickLinks';
import type { ExamItem } from '../dashboards/shared/components/widgets/StudentSchedulesWidget';
import type { ClassItem } from '../dashboards/shared/components/widgets/StudentTodaysClassWidget';
import type {
  AttendanceChartData,
  AttendanceStats,
  Fee,
  Notice,
  ProfileCardData,
} from '../dashboards/shared/types/dashboard.types';

const StudentDasboard = () => {
  const routes = all_routes;
  const [attendanceDateRange, setAttendanceDateRange] = useState<string>('This Week');

  // Sample data - will be replaced with dynamic data later
  const profileData: ProfileCardData = {
    id: 'ST1234546',
    name: 'Angelo Riana',
    image: 'assets/img/students/student-13.jpg',
    badge: '#ST1234546',
    additionalInfo: [
      { label: 'Class', value: 'III, C' },
      { label: 'Roll No', value: '36545' },
    ],
    editLink: routes.editStudent,
  };

  const attendanceStats: AttendanceStats = {
    present: 25,
    absent: 2,
    late: 0,
    halfDay: 0,
  };

  const todaysClasses: ClassItem[] = [
    {
      id: '1',
      subject: 'English',
      teacherImage: 'assets/img/parents/parent-07.jpg',
      time: '09:00 - 09:45 AM',
      status: 'Completed',
    },
    {
      id: '2',
      subject: 'Chemistry',
      teacherImage: 'assets/img/parents/parent-02.jpg',
      time: '10:45 - 11:30 AM',
      status: 'Completed',
    },
    {
      id: '3',
      subject: 'Physics',
      teacherImage: 'assets/img/profiles/avatar-17.jpg',
      time: '11:30 - 12:15 AM',
      status: 'Inprogress',
    },
  ];

  const quickLinks: StudentQuickLink[] = [
    {
      id: '1',
      title: 'Pay Fees',
      link: routes.studentFees,
      icon: 'ti ti-report-money fs-16',
      borderColor: 'border-primary border-2',
      bgColor: 'bg-primary',
    },
    {
      id: '2',
      title: 'Exam Result',
      link: routes.studentResult,
      icon: 'ti ti-hexagonal-prism-plus fs-16',
      borderColor: 'border-success',
      bgColor: 'bg-success',
    },
    {
      id: '3',
      title: 'Calendar',
      link: routes.studentTimeTable,
      icon: 'ti ti-calendar fs-16',
      borderColor: 'border-warning',
      bgColor: 'bg-warning',
    },
    {
      id: '4',
      title: 'Attendance',
      link: routes.studentLeaves,
      icon: 'ti ti-calendar-share fs-16',
      borderColor: 'border-dark border-2',
      bgColor: 'bg-dark',
    },
  ];

  const exams: ExamItem[] = [
    {
      id: '1',
      title: '1st Quarterly',
      subject: 'Mathematics',
      date: '06 May 2024',
      time: '01:30 - 02:15 PM',
      roomNo: '15',
      daysRemaining: '19 Days More',
    },
    {
      id: '2',
      title: '2nd Quarterly',
      subject: 'Physics',
      date: '07 May 2024',
      time: '01:30 - 02:15 PM',
      roomNo: '15',
      daysRemaining: '20 Days More',
    },
  ];

  const attendanceChartData: AttendanceChartData = {
    series: [60, 5, 15, 20],
    labels: ['Present', 'Late', 'Half Day', 'Absent'],
    colors: ['#1ABE17', '#1170E4', '#E9EDF4', '#E82646'],
  };

  const fees: Fee[] = [
    {
      id: '1',
      type: 'Transport Fees',
      amount: '$2500',
      lastDate: '25 May 2024',
      icon: 'ti ti-bus-stop fs-16',
      iconBgColor: 'bg-info-transparent',
    },
    {
      id: '2',
      type: 'Book Fees',
      amount: '$2500',
      lastDate: '25 May 2024',
      icon: 'ti ti-books fs-16',
      iconBgColor: 'bg-success-transparent',
    },
    {
      id: '3',
      type: 'Exam Fees',
      amount: '$2500',
      lastDate: '25 May 2024',
      icon: 'ti ti-report-money fs-16',
      iconBgColor: 'bg-info-transparent',
    },
    {
      id: '4',
      type: 'Mess Fees',
      amount: '$2500',
      lastDate: '27 May 2024',
      icon: 'ti ti-meat fs-16',
      iconBgColor: 'bg-skyblue-transparent',
      isDue: true,
      dueAmount: '$2500 + $150',
    },
    {
      id: '5',
      type: 'Hostel',
      amount: '$2500',
      lastDate: '25 May 2024',
      icon: 'ti ti-report-money fs-16',
      iconBgColor: 'bg-danger-transparent',
    },
  ];

  const notices: Notice[] = [
    {
      id: '1',
      title: 'New Syllabus Instructions',
      date: '11 Mar 2024',
      icon: 'ti ti-books fs-16',
      iconBgColor: 'bg-primary-transparent',
    },
    {
      id: '2',
      title: 'World Environment Day Program.....!!!',
      date: '21 Apr 2024',
      icon: 'ti ti-note fs-16',
      iconBgColor: 'bg-success-transparent',
    },
    {
      id: '3',
      title: 'Exam Preparation Notification!',
      date: '13 Mar 2024',
      icon: 'ti ti-bell-check fs-16',
      iconBgColor: 'bg-danger-transparent',
    },
    {
      id: '4',
      title: 'Online Classes Preparation',
      date: '24 May 2024',
      icon: 'ti ti-notes fs-16',
      iconBgColor: 'bg-skyblue-transparent',
    },
    {
      id: '5',
      title: 'Exam Time Table Release',
      date: '24 May 2024',
      icon: 'ti ti-package fs-16',
      iconBgColor: 'bg-warning-transparent',
    },
    {
      id: '6',
      title: 'English Exam Preparation',
      date: '23 Mar 2024',
      icon: 'ti ti-bell-check fs-16',
      iconBgColor: 'bg-danger-transparent',
    },
  ];

  const [exam_result_chart] = useState<any>({
    chart: {
      type: 'bar',
      height: 310,
    },
    series: [
      {
        name: 'Marks',
        data: [100, 92, 90, 82, 90], // Corresponding scores for Maths, Physics, Chemistry, English, Spanish
      },
    ],
    xaxis: {
      categories: ['Mat', 'Phy', 'Che', 'Eng', 'Sci'],
    },
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: '50%',
        colors: {
          backgroundBarColors: ['#E9EDF4', '#fff'],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 5,
        },
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#E9EDF4', '#3D5EE1', '#E9EDF4', '#E9EDF4', '#E9EDF4'], // Set specific colors for each bar
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + '%';
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + '%';
      },
      offsetY: -20,
      style: {
        fontSize: '14px',
        colors: ['#304758'],
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },

    legend: {
      show: false,
    },
  });
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-xxl-8 d-flex">
              <div className="row flex-fill">
                {/* Profile */}
                <div className="col-xl-6 d-flex">
                  <div className="flex-fill">
                    <StudentProfileCard
                      data={profileData}
                      quarterlyInfo={{ label: '1st Quarterly', badge: 'Pass' }}
                      editLink={routes.editStudent}
                    />
                    <StudentTodaysClassWidget classes={todaysClasses} />
                  </div>
                </div>
                {/* /Profile */}
                {/* Attendance */}
                <div className="col-xl-6 d-flex">
                  <AttendanceWidget
                    stats={attendanceStats}
                    chartData={attendanceChartData}
                    dateRange={attendanceDateRange}
                    onDateRangeChange={setAttendanceDateRange}
                    dateRangeOptions={[
                      { label: 'This Week', value: 'This Week' },
                      { label: 'Last Week', value: 'Last Week' },
                      { label: 'Last Month', value: 'Last Month' },
                    ]}
                    totalWorkingDays={28}
                    showLast7Days={true}
                    last7DaysData={[
                      { day: 'M', status: 'present' },
                      { day: 'T', status: 'present' },
                      { day: 'W', status: 'present' },
                      { day: 'T', status: 'present' },
                      { day: 'F', status: 'absent' },
                      { day: 'S', status: 'present' },
                      { day: 'S', status: 'present' },
                    ]}
                    last7DaysRange="14 May 2024 - 21 May 2024"
                    chartHeight={255}
                  />
                </div>
                {/* /Attendance */}
                {/* Quick Links */}
                <StudentQuickLinks links={quickLinks} />
                {/* /Quick Links */}
              </div>
            </div>
            {/* Schedules */}
            <div className="col-xxl-4 d-flex">
              <StudentSchedulesWidget exams={exams} viewAllLink={routes.feesAssign} />
            </div>
            {/* /Schedules */}
          </div>
          <div className="row">
            {/* Notice Board */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <NoticeBoardWidget
                notices={notices}
                viewAllLink={routes.noticeBoard}
                showDaysRemaining={false}
              />
            </div>
            {/* /Notice Board */}
            {/* Exam Result */}
            <div className="col-xxl-4 col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Exam Result</h4>
                  <div className="dropdown">
                    <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="ti ti-calendar me-2" />
                      1st Quarter
                    </Link>
                    <ul className="dropdown-menu mt-2 p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          1st Quarter
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          2nd Quarter
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center flex-wrap">
                    <span className="badge badge-soft-primary badge-md me-1 mb-3">Mat : 100 </span>
                    <span className="badge badge-soft-success badge-md me-1 mb-3">Phy: 92</span>
                    <span className="badge badge-soft-warning badge-md me-1 mb-3">Che : 90</span>
                    <span className="badge badge-soft-danger badge-md mb-3">Eng : 80</span>
                  </div>
                  <ReactApexChart
                    id="exam-result-chart"
                    options={exam_result_chart}
                    series={exam_result_chart.series}
                    type="bar"
                    height={310}
                  />
                </div>
              </div>
            </div>
            {/* /Exam Result */}
            {/* Fees Reminder */}
            <div className="col-xxl-4 d-flex">
              <StudentFeesReminderWidget fees={fees} viewAllLink={routes.feesAssign} />
            </div>
            {/* Fees Reminder */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default StudentDasboard;
