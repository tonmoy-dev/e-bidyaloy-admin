import { Calendar } from 'primereact/calendar';
import type { Nullable } from 'primereact/ts-helpers';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';
import type { Event } from '../../types/dashboard.types';

interface SchedulesWidgetProps {
  title?: string;
  events: Event[];
  addNewLink?: string;
  addNewModalTarget?: string;
  showCalendar?: boolean;
  calendarClassName?: string;
}

const SchedulesWidget = ({
  title = 'Schedules',
  events,
  addNewLink,
  addNewModalTarget,
  showCalendar = true,
  calendarClassName = 'datepickers mb-4 custom-cal-react',
}: SchedulesWidgetProps) => {
  const [date, setDate] = useState<Nullable<Date>>(null);

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        {(addNewLink || addNewModalTarget) && (
          <Link
            to={addNewLink || '#'}
            className="link-primary fw-medium me-2"
            data-bs-toggle={addNewModalTarget ? 'modal' : undefined}
            data-bs-target={addNewModalTarget}
          >
            <i className="ti ti-square-plus me-1" />
            Add New
          </Link>
        )}
      </div>
      <div className="card-body">
        {showCalendar && (
          <Calendar
            className={calendarClassName}
            value={date}
            onChange={(e) => setDate(e.value)}
            inline
          />
        )}
        {events.length > 0 && (
          <>
            <h4 className="mb-3">Upcoming Events</h4>
            <div className={showCalendar ? 'event-scroll' : 'event-wrapper event-scroll'}>
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`border-start border-${event.borderColor} border-3 shadow-sm p-3 ${
                    event.id !== events[events.length - 1].id ? 'mb-3' : 'mb-0'
                  }`}
                >
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <span className={`avatar p-1 me-2 ${event.iconBgColor} flex-shrink-0`}>
                      <i className={`${event.icon} fs-20`} />
                    </span>
                    <div className="flex-fill">
                      <h6 className="mb-1">{event.title}</h6>
                      <p className="d-flex align-items-center">
                        <i className="ti ti-calendar me-1" />
                        {event.endDate ? `${event.date} - ${event.endDate}` : event.date}
                      </p>
                    </div>
                  </div>
                  {event.time && (
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="mb-0">
                        <i className="ti ti-clock me-1" />
                        {event.time}
                      </p>
                      {event.participants && event.participants.length > 0 && (
                        <div className="avatar-list-stacked avatar-group-sm">
                          {event.participants.map((participant) => (
                            <span key={participant.id} className="avatar border-0">
                              <ImageWithBasePath
                                src={participant.image}
                                className="rounded-circle"
                                alt="img"
                              />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulesWidget;
