import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../core/common/imageWithBasePath';

export interface WelcomeBannerProps {
  greeting: string;
  subtitle?: string;
  profileImage?: string;
  profileLink?: string;
  lastUpdated?: string;
  backgroundShapes?: Array<{
    src: string;
    alt: string;
    className: string;
  }>;
}

const WelcomeBanner = ({
  greeting,
  subtitle = 'Have a Good day at work',
  profileImage,
  profileLink = 'profile',
  lastUpdated,
  backgroundShapes = [
    { src: 'assets/img/bg/shape-04.png', alt: 'img', className: 'img-fluid shape-01' },
    { src: 'assets/img/bg/shape-01.png', alt: 'img', className: 'img-fluid shape-02' },
    { src: 'assets/img/bg/shape-02.png', alt: 'img', className: 'img-fluid shape-03' },
    { src: 'assets/img/bg/shape-03.png', alt: 'img', className: 'img-fluid shape-04' },
  ],
}: WelcomeBannerProps) => {
  return (
    <div className="card bg-dark">
      <div className="overlay-img">
        {backgroundShapes.map((shape, index) => (
          <ImageWithBasePath
            key={index}
            src={shape.src}
            alt={shape.alt}
            className={shape.className}
          />
        ))}
      </div>
      <div className="card-body">
        <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
          <div className="mb-3 mb-xl-0">
            <div className="d-flex align-items-center flex-wrap mb-2">
              <h1 className="text-white me-2">{greeting}</h1>
              {profileLink && (
                <Link
                  to={profileLink}
                  className="avatar avatar-sm img-rounded bg-gray-800 dark-hover"
                >
                  <i className="ti ti-edit text-white" />
                </Link>
              )}
            </div>
            {subtitle && <p className="text-white">{subtitle}</p>}
          </div>
          {lastUpdated && (
            <p className="text-white custom-text-white">
              <i className="ti ti-refresh me-1" />
              Updated Recently on {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

