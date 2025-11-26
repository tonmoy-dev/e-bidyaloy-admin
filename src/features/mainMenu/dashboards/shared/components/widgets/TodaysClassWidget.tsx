import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';

export interface ClassItem {
  id: string;
  subject: string;
  teacherImage: string;
  time: string;
  status: 'Completed' | 'Inprogress' | 'Upcoming';
}

interface TodaysClassWidgetProps {
  title?: string;
  classes: ClassItem[];
  defaultDate?: Dayjs;
  onDateChange?: (date: Dayjs | null) => void;
}

const TodaysClassWidget = ({
  title = "Today's Class",
  classes,
  defaultDate,
  onDateChange,
}: TodaysClassWidgetProps) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}-${year}`;
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    defaultDate || dayjs(formattedDate)
  );

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const getStatusBadge = (status: ClassItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge badge-soft-success shadow-none mb-2">
            <i className="ti ti-circle-filled fs-8 me-1" />
            Completed
          </span>
        );
      case 'Inprogress':
        return (
          <span className="badge badge-soft-warning shadow-none mb-2">
            <i className="ti ti-circle-filled fs-8 me-1" />
            Inprogress
          </span>
        );
      case 'Upcoming':
        return (
          <span className="badge badge-soft-info shadow-none mb-2">
            <i className="ti ti-circle-filled fs-8 me-1" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
        <div className="d-inline-flex align-items-center class-datepick">
          <span className="icon">
            <i className="ti ti-chevron-left me-2" />
          </span>
          <DatePicker
            className="form-control datetimepicker border-0"
            format={{
              format: 'DD-MM-YYYY',
              type: 'mask',
            }}
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="16 May 2024"
          />
          <span className="icon">
            <i className="ti ti-chevron-right" />
          </span>
        </div>
      </div>
      <div className="card-body">
        {classes.map((classItem, index) => (
          <div
            key={classItem.id}
            className={`card ${index === classes.length - 1 ? 'mb-0' : 'mb-3'}`}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap p-3 pb-1">
              <div className="d-flex align-items-center flex-wrap mb-2">
                <span className="avatar avatar-lg flex-shrink-0 rounded me-2">
                  <ImageWithBasePath src={classItem.teacherImage} alt="Profile" />
                </span>
                <div>
                  <h6
                    className={`mb-1 ${
                      classItem.status === 'Completed' ? 'text-decoration-line-through' : ''
                    }`}
                  >
                    {classItem.subject}
                  </h6>
                  <span>
                    <i className="ti ti-clock me-2" />
                    {classItem.time}
                  </span>
                </div>
              </div>
              {getStatusBadge(classItem.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysClassWidget;

