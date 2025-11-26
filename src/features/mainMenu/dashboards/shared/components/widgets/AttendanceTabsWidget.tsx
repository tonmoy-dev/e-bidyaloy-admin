import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import type { AttendanceStats, AttendanceChartData } from '../../types/dashboard.types';

export interface AttendanceTab {
  id: string;
  label: string;
  stats: AttendanceStats;
  chartData: AttendanceChartData;
  chartOptions: any;
  viewAllLink?: string;
}

export interface AttendanceTabsWidgetProps {
  title?: string;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  tabs: AttendanceTab[];
}

const AttendanceTabsWidget = ({
  title = 'Attendance',
  dateRange = 'Today',
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'This Week', value: 'This Week' },
    { label: 'Last Week', value: 'Last Week' },
  ],
  tabs,
}: AttendanceTabsWidgetProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
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
        <div className="list-tab mb-4">
          <ul className="nav">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <Link
                  to="#"
                  className={activeTab === tab.id ? 'active' : ''}
                  data-bs-toggle="tab"
                  data-bs-target={`#${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="tab-content">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${activeTab === tab.id ? 'active show' : ''}`}
              id={tab.id}
            >
              <div className="row gx-3">
                {tab.stats.emergency !== undefined && (
                  <div className="col-sm-4">
                    <div className="card bg-light-300 shadow-none border-0">
                      <div className="card-body p-3 text-center">
                        <h5>{tab.stats.emergency}</h5>
                        <p className="fs-12">Emergency</p>
                      </div>
                    </div>
                  </div>
                )}
                {tab.stats.absent !== undefined && (
                  <div className="col-sm-4">
                    <div className="card bg-light-300 shadow-none border-0">
                      <div className="card-body p-3 text-center">
                        <h5>{tab.stats.absent}</h5>
                        <p className="fs-12">Absent</p>
                      </div>
                    </div>
                  </div>
                )}
                {tab.stats.late !== undefined && (
                  <div className="col-sm-4">
                    <div className="card bg-light-300 shadow-none border-0">
                      <div className="card-body p-3 text-center">
                        <h5>{tab.stats.late}</h5>
                        <p className="fs-12">Late</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <ReactApexChart
                  id={`${tab.id}-chart`}
                  className="mb-4"
                  options={tab.chartOptions}
                  series={tab.chartData.series}
                  type="donut"
                  height={210}
                />
                {tab.viewAllLink && (
                  <Link to={tab.viewAllLink} className="btn btn-light">
                    <i className="ti ti-calendar-share me-1" />
                    View All
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTabsWidget;

