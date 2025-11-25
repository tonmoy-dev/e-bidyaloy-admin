import { useState } from "react";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import type { AttendanceStats, AttendanceChartData } from "../../types/dashboard.types";

interface AttendanceWidgetProps {
  title?: string;
  stats: AttendanceStats;
  chartData: AttendanceChartData;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  viewAllLink?: string;
  showLast7Days?: boolean;
  last7DaysData?: Array<{ day: string; status: "present" | "absent" | "late" | "halfday" }>;
  last7DaysRange?: string;
  totalWorkingDays?: number;
  chartHeight?: number;
}

const AttendanceWidget = ({
  title = "Attendance",
  stats,
  chartData,
  dateRange = "Today",
  onDateRangeChange,
  dateRangeOptions = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "Last Week", value: "Last Week" },
  ],
  viewAllLink,
  showLast7Days = false,
  last7DaysData = [],
  last7DaysRange,
  totalWorkingDays,
  chartHeight = 210,
}: AttendanceWidgetProps) => {
  const [chartOptions] = useState({
    chart: {
      height: chartHeight,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "left",
          },
        },
      },
    ],
  });

  const getDayBadgeClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-success";
      case "absent":
        return "bg-danger";
      case "late":
        return "bg-warning";
      case "halfday":
        return "bg-info";
      default:
        return "bg-white border text-default";
    }
  };

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link
              to="#"
              className="bg-white dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-calendar-due me-1" />
              {dateRange}
            </Link>
            <ul className="dropdown-menu mt-2 p-3">
              {dateRangeOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    to="#"
                    className="dropdown-item rounded-1"
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
        )}
      </div>
      <div className="card-body">
        {showLast7Days && last7DaysData.length > 0 && (
          <div className="bg-light-300 rounded border p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap mb-1">
              <h6 className="mb-2">Last 7 Days</h6>
              {last7DaysRange && (
                <p className="fs-12 mb-2">{last7DaysRange}</p>
              )}
            </div>
            <div className="d-flex align-items-center rounded gap-1 flex-wrap">
              {last7DaysData.map((day, index) => (
                <Link
                  key={index}
                  to="#"
                  className={`badge badge-lg ${getDayBadgeClass(
                    day.status
                  )} text-white`}
                >
                  {day.day}
                </Link>
              ))}
            </div>
          </div>
        )}

        {totalWorkingDays !== undefined && (
          <p className="mb-3">
            <i className="ti ti-calendar-heart text-primary me-2" />
            No of total working days{" "}
            <span className="fw-medium text-dark">{totalWorkingDays} Days</span>
          </p>
        )}

        <div className="border rounded p-3 mb-3">
          <div className="row">
            <div className="col text-center border-end">
              <p className="mb-1">Present</p>
              <h5>{stats.present}</h5>
            </div>
            <div className="col text-center border-end">
              <p className="mb-1">Absent</p>
              <h5>{stats.absent}</h5>
            </div>
            {stats.halfDay !== undefined && (
              <div className="col text-center border-end">
                <p className="mb-1">Halfday</p>
                <h5>{stats.halfDay}</h5>
              </div>
            )}
            {stats.late !== undefined && (
              <div className={`col text-center ${stats.halfDay === undefined ? "" : ""}`}>
                <p className="mb-1">Late</p>
                <h5>{stats.late}</h5>
              </div>
            )}
            {stats.emergency !== undefined && (
              <div className="col text-center">
                <p className="mb-1">Emergency</p>
                <h5>{stats.emergency}</h5>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="donut"
            height={chartHeight}
          />
          {viewAllLink && (
            <Link to={viewAllLink} className="btn btn-light mt-3">
              <i className="ti ti-calendar-share me-1" />
              View All
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceWidget;

