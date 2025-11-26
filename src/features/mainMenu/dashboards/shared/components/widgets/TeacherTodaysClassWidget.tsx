import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import Slider from 'react-slick';

export interface TeacherClassItem {
  id: string;
  time: string;
  className: string;
  status: 'Completed' | 'Inprogress' | 'Upcoming';
}

interface TeacherTodaysClassWidgetProps {
  title?: string;
  classes: TeacherClassItem[];
  defaultDate?: Dayjs;
  onDateChange?: (date: Dayjs | null) => void;
  sliderSettings?: any;
}

const TeacherTodaysClassWidget = ({
  title = "Today's Class",
  classes,
  defaultDate,
  onDateChange,
  sliderSettings,
}: TeacherTodaysClassWidgetProps) => {
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

  const getStatusBadge = (status: TeacherClassItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="text-decoration-line-through badge badge-danger badge-lg mb-2">
            <i className="ti ti-clock me-1" />
            {classes.find((c) => c.status === status)?.time}
          </span>
        );
      case 'Inprogress':
      case 'Upcoming':
        return (
          <span className="badge badge-primary badge-lg mb-2">
            <i className="ti ti-clock me-1" />
            {classes.find((c) => c.status === status)?.time}
          </span>
        );
      default:
        return null;
    }
  };

  const defaultSettings = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    ...sliderSettings,
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h4 className="me-2">{title}</h4>
          <div className="owl-nav slide-nav2 text-end nav-control" />
        </div>
        <div className="d-inline-flex align-items-center class-datepick">
          <span className="icon">
            <i className="ti ti-chevron-left" />
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
        <Slider {...defaultSettings} className="owl-carousel owl-theme task-slider">
          {classes.map((classItem) => (
            <div key={classItem.id} className="item">
              <div className="bg-light-400 rounded p-3">
                {classItem.status === 'Completed' ? (
                  <span className="text-decoration-line-through badge badge-danger badge-lg mb-2">
                    <i className="ti ti-clock me-1" />
                    {classItem.time}
                  </span>
                ) : (
                  <span className="badge badge-primary badge-lg mb-2">
                    <i className="ti ti-clock me-1" />
                    {classItem.time}
                  </span>
                )}
                <p className="text-dark">{classItem.className}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TeacherTodaysClassWidget;

