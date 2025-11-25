import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

export interface FeesCollectionChartProps {
  title?: string;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  dateRangeOptions?: Array<{ label: string; value: string }>;
  chartOptions: any;
  chartSeries: any[];
  chartHeight?: number;
}

const FeesCollectionChart = ({
  title = 'Fees Collection',
  dateRange = 'Last 8 Quater',
  onDateRangeChange,
  dateRangeOptions = [
    { label: 'This Month', value: 'This Month' },
    { label: 'This Year', value: 'This Year' },
    { label: 'Last 12 Quater', value: 'Last 12 Quater' },
    { label: 'Last 16 Quater', value: 'Last 16 Quater' },
  ],
  chartOptions,
  chartSeries,
  chartHeight = 270,
}: FeesCollectionChartProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {onDateRangeChange && (
          <div className="dropdown">
            <Link to="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-calendar me-2" />
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
      <div className="card-body pb-0">
        <ReactApexChart
          id="fees-chart"
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={chartHeight}
        />
      </div>
    </div>
  );
};

export default FeesCollectionChart;

