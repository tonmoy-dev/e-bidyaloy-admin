import { Link } from 'react-router-dom';
import Slider from 'react-slick';

export interface LessonPlanItem {
  id: string;
  className: string;
  classNameBgColor: string;
  title: string;
  progress: number;
  progressColor: string;
  rescheduleLink: string;
  shareLink?: string;
}

interface TeacherSyllabusSliderProps {
  title?: string;
  lessonPlans: LessonPlanItem[];
  viewAllLink?: string;
  sliderSettings?: any;
}

const TeacherSyllabusSlider = ({
  title = 'Syllabus / Lesson Plan',
  lessonPlans,
  viewAllLink,
  sliderSettings,
}: TeacherSyllabusSliderProps) => {
  const defaultSettings = {
    dots: false,
    autoplay: false,
    arrows: false,
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
        <h4 className="card-title">{title}</h4>
        {viewAllLink && (
          <Link to={viewAllLink} className="link-primary fw-medium">
            View All
          </Link>
        )}
      </div>
      <div className="card-body">
        <Slider {...defaultSettings} className="owl-carousel owl-theme lesson">
          {lessonPlans.map((plan) => (
            <div key={plan.id} className="item">
              <div className="card mb-0">
                <div className="card-body">
                  <div className={`${plan.classNameBgColor} rounded p-2 fw-semibold mb-3 text-center`}>
                    {plan.className}
                  </div>
                  <div className="border-bottom mb-3">
                    <h5 className="mb-3">{plan.title}</h5>
                    <div className="progress progress-xs mb-3">
                      <div
                        className={`progress-bar ${plan.progressColor}`}
                        role="progressbar"
                        style={{ width: `${plan.progress}%` }}
                        aria-valuenow={plan.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Link to={plan.rescheduleLink} className="fw-medium">
                      <i className="ti ti-edit me-1" />
                      Reschedule
                    </Link>
                    {plan.shareLink && (
                      <Link to={plan.shareLink} className="link-primary">
                        <i className="ti ti-share-3 me-1" />
                        Share
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TeacherSyllabusSlider;

