import ReactApexChart from 'react-apexcharts';

export interface EarningsExpensesCardData {
  title: string;
  value: string;
  icon: string;
  iconBgColor: string;
  chartOptions: any;
  chartSeries: any[];
  chartHeight?: number;
}

export interface EarningsExpensesCardsProps {
  earningsCard: EarningsExpensesCardData;
  expensesCard: EarningsExpensesCardData;
}

const EarningsExpensesCards = ({ earningsCard, expensesCard }: EarningsExpensesCardsProps) => {
  return (
    <div className="col-xxl-4 col-xl-6 d-flex flex-column">
      <div className="card flex-fill">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">{earningsCard.title}</h6>
              <h2>{earningsCard.value}</h2>
            </div>
            <span className={`avatar avatar-lg ${earningsCard.iconBgColor}`}>
              <i className={earningsCard.icon} />
            </span>
          </div>
        </div>
        <ReactApexChart
          id="total-earning"
          options={earningsCard.chartOptions}
          series={earningsCard.chartSeries}
          type="area"
          height={earningsCard.chartHeight || 90}
        />
      </div>
      <div className="card flex-fill">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">{expensesCard.title}</h6>
              <h2>{expensesCard.value}</h2>
            </div>
            <span className={`avatar avatar-lg ${expensesCard.iconBgColor}`}>
              <i className={expensesCard.icon} />
            </span>
          </div>
        </div>
        <ReactApexChart
          id="total-expenses"
          options={expensesCard.chartOptions}
          series={expensesCard.chartSeries}
          type="area"
          height={expensesCard.chartHeight || 90}
        />
      </div>
    </div>
  );
};

export default EarningsExpensesCards;

