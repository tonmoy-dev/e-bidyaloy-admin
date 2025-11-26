import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { all_routes } from '../../router/all_routes';
import AdminDashboardModal from '../adminDashboard/adminDashboardModal';
import ProfileCard from '../dashboards/shared/components/ProfileCard';
import {
  ProgressListWidget,
  SchedulesWidget,
  TeacherAttendanceWidget,
  TeacherTodaysClassWidget,
} from '../dashboards/shared/components/widgets';
import type { ProgressItem } from '../dashboards/shared/components/widgets/ProgressListWidget';
import type { TeacherClassItem } from '../dashboards/shared/components/widgets/TeacherTodaysClassWidget';
import type {
  AttendanceStats,
  Event,
  ProfileCardData,
} from '../dashboards/shared/types/dashboard.types';

const TeacherDashboard = () => {
  const routes = all_routes;
  const [attendanceDateRange, setAttendanceDateRange] = useState<string>('This Week');

  // Sample data - will be replaced with dynamic data later
  const profileData: ProfileCardData = {
    id: 'T594651',
    name: 'Henriques Morgan',
    image: 'assets/img/teachers/teacher-05.jpg',
    badge: '#T594651',
    additionalInfo: [
      { label: 'Classes', value: 'I-A, V-B' },
      { label: 'Subject', value: 'Physics' },
    ],
    editLink: routes.editTeacher,
  };

  const attendanceStats: AttendanceStats = {
    present: 25,
    absent: 2,
    late: 1,
    halfDay: 0,
  };

  const todaysClasses: TeacherClassItem[] = [
    {
      id: '1',
      time: '09:00 - 09:45',
      className: 'Class V, B',
      status: 'Completed',
    },
    {
      id: '2',
      time: '09:00 - 09:45',
      className: 'Class IV, C',
      status: 'Completed',
    },
    {
      id: '3',
      time: '11:30 - 12:150',
      className: 'Class V, B',
      status: 'Inprogress',
    },
    {
      id: '4',
      time: '01:30 - 02:15',
      className: 'Class V, B',
      status: 'Upcoming',
    },
    {
      id: '5',
      time: '02:15 - 03:00',
      className: 'Class V, B',
      status: 'Upcoming',
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

  const events: Event[] = [
    {
      id: '1',
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
    {
      id: '2',
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
      id: '3',
      title: 'Staff Meeting',
      date: '10 July 2024',
      time: '09:10AM - 10:50PM',
      borderColor: 'info',
      icon: 'ti ti-users-group fs-20',
      iconBgColor: 'bg-info-transparent',
      participants: [
        { id: '1', image: 'assets/img/parents/parent-05.jpg' },
        { id: '2', image: 'assets/img/parents/parent-06.jpg' },
        { id: '3', image: 'assets/img/parents/parent-07.jpg' },
      ],
    },
    {
      id: '4',
      title: 'Admission Camp',
      date: '12 July 2024',
      time: '09:10 AM - 10:50 PM',
      borderColor: 'secondary',
      icon: 'ti ti-campfire fs-24',
      iconBgColor: 'bg-secondary-transparent',
      participants: [
        { id: '1', image: 'assets/img/parents/parent-11.jpg' },
        { id: '2', image: 'assets/img/parents/parent-13.jpg' },
      ],
    },
  ];

  function SampleNextArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-next class-slides"
        style={{ ...style, display: 'flex', top: '-72%', left: '22%' }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-prev class-slides"
        style={{ ...style, display: 'flex', top: '-72%', left: '17%' }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-left" style={{ fontSize: '12px' }}></i>
      </div>
    );
  }
  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 24,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const [attendance_chart] = useState<any>({
    chart: {
      height: 290,
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },

    series: [60, 5, 15, 20],
    labels: ['Present', 'Late', 'Half Day', 'Absent'],
    colors: ['#1ABE17', '#1170E4', '#E9EDF4', '#E82646'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'left',
          },
        },
      },
    ],
    legend: {
      position: 'bottom',
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
              <h3 className="page-title mb-1">Teacher Dashboard</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Dashboard</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          {/* Greeting Section */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill bg-info bg-03">
                <div className="card-body">
                  <h1 className="text-white mb-1"> Good Morning Ms.Teena</h1>
                  <p className="text-white mb-3">Have a Good day at work</p>
                  <p className="text-light">
                    Notice : There is a staff meeting at 9AM today, Dont forget to Attend!!!
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Greeting Section */}
          {/* Teacher-Profile */}
          <div className="row">
            <div className="col-xxl-8 col-xl-12">
              <div className="row">
                <div className="col-xxl-12 col-xl-12 d-flex">
                  <ProfileCard
                    data={profileData}
                    className="card bg-dark position-relative flex-fill"
                    showEditButton={true}
                  />
                </div>
                {/* Today's Class */}
                <TeacherTodaysClassWidget classes={todaysClasses} sliderSettings={settings} />
                {/* /Today's Class */}
              </div>

              <div className="row">
                {/* Attendance */}
                <div className="col-xxl-6 col-xl-6 col-md-6 d-flex">
                  <TeacherAttendanceWidget
                    stats={attendanceStats}
                    chartOptions={attendance_chart}
                    chartSeries={attendance_chart.series}
                    dateRange={attendanceDateRange}
                    onDateRangeChange={setAttendanceDateRange}
                    last7DaysData={[
                      { day: 'M', status: 'present' },
                      { day: 'T', status: 'present' },
                      { day: 'W', status: 'present' },
                      { day: 'T', status: 'present' },
                      { day: 'F', status: 'absent' },
                      { day: 'S', status: 'weekend' },
                      { day: 'S', status: 'weekend' },
                    ]}
                    last7DaysRange="14 May 2024 - 21 May 2024"
                    totalWorkingDays={28}
                  />
                </div>
                {/* /Attendance */}
                <div className="col-xxl-6 col-xl-6 col-md-6 d-flex">
                  {/* Class Routine */}
                  <ProgressListWidget
                    title="Class Routine"
                    items={classRoutineItems}
                    addNewModalTarget="#add_class_routine"
                    showImage={true}
                  />
                </div>
                {/* /Class Routine */}
              </div>
            </div>
            {/* Schedules */}
            <div className="col-xxl-4 col-xl-12 d-flex">
              <SchedulesWidget
                events={events}
                addNewModalTarget="#add_event"
                calendarClassName="datepickers mb-4 custom-cal-react"
              />
            </div>
            {/* /Schedules */}
          </div>
        </div>
      </div>
      <AdminDashboardModal />
      {/* /Page Wrapper */}
    </>
  );
};

export default TeacherDashboard;
