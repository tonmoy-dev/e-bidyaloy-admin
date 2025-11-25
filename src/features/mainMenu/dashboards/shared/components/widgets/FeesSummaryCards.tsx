export interface FeesSummaryItem {
  id: string;
  label: string;
  value: string;
  badge: {
    text: string;
    color: string;
    icon: string;
  };
}

export interface FeesSummaryCardsProps {
  items: FeesSummaryItem[];
}

const FeesSummaryCards = ({ items }: FeesSummaryCardsProps) => {
  return (
    <div className="col-xxl-3 col-xl-6 d-flex flex-column">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`card flex-fill ${index === items.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <div className="card-body">
            <p className="mb-2">{item.label}</p>
            <div className="d-flex align-items-end justify-content-between">
              <h4>{item.value}</h4>
              <span className={`badge ${item.badge.color}`}>
                <i className={`${item.badge.icon} me-1`} />
                {item.badge.text}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeesSummaryCards;

