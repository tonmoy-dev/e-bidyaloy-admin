import { Calendar } from 'primereact/calendar';
import type { Nullable } from 'primereact/ts-helpers';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  roomNo: string;
  daysRemaining: string;
}

interface StudentSchedulesWidgetProps {
  title?: string;
  viewAllLink?: string;
  exams: ExamItem[];
}

const StudentSchedulesWidget = ({
  title = 'Schedules',
  viewAllLink,
  exams,
}: StudentSchedulesWidgetProps) => {
  const [date, setDate] = useState<Nullable<Date>>(null);

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {viewAllLink && (
          <Link to={viewAllLink} className="link-primary fw-medium">
            View All
          </Link>
        )}
      </div>
      <div className="card-body pb-0">
        <Calendar
          className="datepickers mb-2 custom-cal-react"
          value={date}
          onChange={(e) => setDate(e.value)}
          inline
        />
        <h5 className="mb-3">Exams</h5>
        {exams.map((exam, index) => (
          <div
            key={exam.id}
            className={`p-3 pb-0 ${index === exams.length - 1 ? 'mb-0' : 'mb-3'} border rounded`}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-3">{exam.title}</h5>
              <span className="badge badge-soft-danger d-inline-flex align-items-center mb-3">
                <i className="ti ti-clock me-1" />
                {exam.daysRemaining}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="mb-3">
                <h6 className="mb-1">{exam.subject}</h6>
                <p>
                  <i className="ti ti-clock me-1" />
                  {exam.time}
                </p>
              </div>
              <div className="mb-3 text-end">
                <p className="mb-1">
                  <i className="ti ti-calendar-bolt me-1" />
                  {exam.date}
                </p>
                <p className="text-primary">Room No : {exam.roomNo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSchedulesWidget;

