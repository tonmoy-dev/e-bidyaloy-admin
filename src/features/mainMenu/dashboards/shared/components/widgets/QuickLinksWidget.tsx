import { Link } from "react-router-dom";
import Slider from "react-slick";

export interface QuickLink {
  id: string;
  title: string;
  link: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

interface QuickLinksWidgetProps {
  title?: string;
  links: QuickLink[];
  sliderSettings?: any;
  itemsPerSlide?: number;
}

const QuickLinksWidget = ({
  title = "Quick Links",
  links,
  sliderSettings,
  itemsPerSlide = 2,
}: QuickLinksWidgetProps) => {
  const defaultSettings = {
    dots: false,
    autoplay: false,
    arrows: false,
    slidesToShow: itemsPerSlide,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: itemsPerSlide,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: itemsPerSlide,
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

  // Group links into slides (2 per slide)
  const groupedLinks: QuickLink[][] = [];
  for (let i = 0; i < links.length; i += itemsPerSlide) {
    groupedLinks.push(links.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h4 className="card-title">{title}</h4>
      </div>
      <div className="card-body pb-1">
        <Slider {...defaultSettings} className="owl-carousel link-slider">
          {groupedLinks.map((group, groupIndex) => (
            <div key={groupIndex} className="item">
              {group.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className={`d-block ${link.bgColor} ronded p-2 text-center mb-3 class-hover`}
                >
                  <div className={`avatar avatar-lg border p-1 ${link.borderColor} rounded-circle mb-2`}>
                    <span
                      className={`d-inline-flex align-items-center justify-content-center w-100 h-100 ${link.borderColor.replace(
                        "border-",
                        "bg-"
                      )} rounded-circle`}
                    >
                      <i className={link.icon} />
                    </span>
                  </div>
                  <p className="text-dark">{link.title}</p>
                </Link>
              ))}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default QuickLinksWidget;

