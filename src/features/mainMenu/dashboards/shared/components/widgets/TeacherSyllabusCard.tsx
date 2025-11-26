import ReactApexChart from 'react-apexcharts';

interface TeacherSyllabusCardProps {
  title?: string;
  completed: number;
  pending: number;
  chartOptions: any;
  chartSeries: number[];
}

const TeacherSyllabusCard = ({
  title = 'Syllabus',
  completed,
  pending,
  chartOptions,
  chartSeries,
}: TeacherSyllabusCardProps) => {
  return (
    <div className="card flex-fill">
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-sm-5">
            <div
              id="plan_chart"
              className="mb-3 mb-sm-0 text-center text-sm-start"
            ></div>
            <ReactApexChart
              id="plan_chart"
              className="mb-3 mb-sm-0 text-center text-sm-start"
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={90}
            />
          </div>
          <div className="col-sm-7">
            <div className=" text-center text-sm-start">
              <h4 className="mb-3">{title}</h4>
              <p className="mb-2">
                <i className="ti ti-circle-filled text-success me-1" />
                Completed : <span className="fw-semibold">{completed}%</span>
              </p>
              <p>
                <i className="ti ti-circle-filled text-danger me-1" />
                Pending :<span className="fw-semibold">{pending}%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSyllabusCard;

