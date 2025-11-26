import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import type { AttendanceStats } from '../../types/dashboard.types';

export interface Last7DaysData {
  day: string;
  status: 'present' | 'absent' | 'weekend';
}

interface TeacherAttendanceWidgetProps {
  title?: string;
  stats: AttendanceStats;
  chartOptions: any;
  chartSeries: number[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  last7DaysData?: Last7DaysData[];
  last7DaysRange?: string;
  totalWorkingDays?: number;
}

const TeacherAttendanceWidget = ({
  title = 'Attendance',
  stats,
  chartOptions,
  chartSeries,
  dateRange = 'This Week',
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'This Week', value: 'This Week' },
    { label: 'Last Week', value: 'Last Week' },
    { label: 'Last Month', value: 'Last Month' },
  ],
  last7DaysData,
  last7DaysRange,
  totalWorkingDays,
}: TeacherAttendanceWidgetProps) => {
  const getDayBadgeClass = (status: Last7DaysData['status']) => {
    switch (status) {
      case 'present':
        return 'badge badge-lg bg-success';
      case 'absent':
        return 'badge badge-lg bg-danger';
      case 'weekend':
        return 'badge badge-lg bg-white border text-gray-1';
      default:
        return 'badge badge-lg bg-white border text-default';
    }
  };

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="card-dropdown">
            <Link to="#" className="dropdown-toggle p-2" data-bs-toggle="dropdown">
              <i className="ti ti-calendar-due" />
              {dateRange}
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <ul>
                {dateRangeOptions.map((option) => (
                  <li key={option.value}>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onDateRangeChange(option.value);
                      }}
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="card-body pb-0">
        {last7DaysData && last7DaysRange && (
          <div className="bg-light-300 rounde border p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <h6 className="mb-2">Last 7 Days </h6>
              <p className="mb-2">{last7DaysRange}</p>
            </div>
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {last7DaysData.map((day, index) => (
                <Link key={index} to="#" className={getDayBadgeClass(day.status)}>
                  {day.day}
                </Link>
              ))}
            </div>
          </div>
        )}
        {totalWorkingDays && (
          <p className="mb-3">
            <i className="ti ti-calendar-heart text-primary me-2" />
            No of total working days{' '}
            <span className="fw-medium text-dark"> {totalWorkingDays} Days</span>
          </p>
        )}
        <div className="border rounded p-3">
          <div className="row">
            <div className="col text-center border-end">
              <p className="mb-1">Present</p>
              <h5>{stats.present}</h5>
            </div>
            <div className="col text-center border-end">
              <p className="mb-1">Absent</p>
              <h5>{stats.absent}</h5>
            </div>
            <div className="col text-center border-end">
              <p className="mb-1">Halfday</p>
              <h5>{stats.halfDay || 0}</h5>
            </div>
            <div className="col text-center">
              <p className="mb-1">Late</p>
              <h5>{stats.late}</h5>
            </div>
          </div>
        </div>
        <div className="attendance-chart text-center">
          <ReactApexChart
            id="attendance_chart"
            className="mb-3 mb-sm-0 text-center text-sm-start"
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceWidget;

