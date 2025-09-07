import type { SessionModel } from '../models/session.model';

const SessionDetailsView = ({ sessionData }: { sessionData: SessionModel }) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="session-detail-info mb-3">
          <p>Name</p>
          <span>{sessionData?.name}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="session-detail-info mb-3">
          <p>Start Date</p>
          <span>{sessionData?.start_date}</span>
        </div>
      </div>
      <div className="col-md-6">
        <div className="session-detail-info mb-3">
          <p>End Date</p>
          <span>{sessionData?.end_date}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsView;
