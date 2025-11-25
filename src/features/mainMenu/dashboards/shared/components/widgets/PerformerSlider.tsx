import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";

export interface PerformerItem {
  id: string;
  title: string;
  name: string;
  subtitle: string;
  image: string;
}

interface PerformerSliderProps {
  title: string;
  performers: PerformerItem[];
  bgColor: string;
  sliderSettings?: any;
  className?: string;
}

const PerformerSlider = ({
  title,
  performers,
  bgColor,
  sliderSettings,
  className = "",
}: PerformerSliderProps) => {
  const defaultSettings = {
    dots: false,
    autoplay: false,
    slidesToShow: 1,
    speed: 500,
    ...sliderSettings,
  };

  return (
    <div className={`${bgColor} p-3 br-5 text-center flex-fill mb-4 pb-0 owl-height ${className}`}>
      <Slider {...defaultSettings} className="owl-carousel student-slider h-100">
        {performers.map((performer) => (
          <div key={performer.id} className="item h-100">
            <div className="d-flex justify-content-between flex-column h-100">
              <div>
                <h5 className="mb-3 text-white">{performer.title}</h5>
                <h4 className="mb-1 text-white">{performer.name}</h4>
                <p className="text-light">{performer.subtitle}</p>
              </div>
              <ImageWithBasePath src={performer.image} alt={performer.name} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PerformerSlider;

