import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

export interface PerformanceMetric {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface PerformanceChartProps {
  title?: string;
  selectedClass?: string;
  onClassChange?: (className: string) => void;
  classOptions?: Array<{ label: string; value: string }>;
  metrics: PerformanceMetric[];
  chartOptions: any;
  chartSeries: number[];
}

const PerformanceChart = ({
  title = 'Performance',
  selectedClass = 'Class II',
  onClassChange,
  classOptions = [
    { label: 'Class I', value: 'Class I' },
    { label: 'Class II', value: 'Class II' },
    { label: 'Class III', value: 'Class III' },
    { label: 'Class IV', value: 'Class IV' },
  ],
  metrics,
  chartOptions,
  chartSeries,
}: PerformanceChartProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onClassChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-school-bell me-2" />
              {selectedClass}
            </Link>
            <ul className="dropdown-menu mt-2 p-3">
              {classOptions.map((option) => (
                <li key={option.value}>
                  <Link
                    to="#"
                    className="dropdown-item rounded-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onClassChange(option.value);
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
        <div className="d-md-flex align-items-center justify-content-between">
          <div className="me-md-3 mb-3 mb-md-0 w-100">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`border border-dashed p-3 ${index === 0 ? 'rounded' : index === metrics.length - 1 ? 'rounded mb-0' : 'rounde mb-1'} d-flex align-items-center justify-content-between`}
              >
                <p className="mb-0 me-2">
                  <i className={`${metric.icon} me-2 ${metric.color}`} />
                  {metric.label}
                </p>
                <h5>{metric.value}</h5>
              </div>
            ))}
          </div>
          <ReactApexChart
            id="class-chart"
            className="text-center text-md-left"
            options={chartOptions}
            series={chartSeries}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

