import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../../core/common/imageWithBasePath';
import type { ProfileCardData } from '../../types/dashboard.types';

interface StudentProfileCardProps {
  data: ProfileCardData;
  quarterlyInfo?: {
    label: string;
    badge: string;
  };
  editLink?: string;
}

const StudentProfileCard = ({
  data,
  quarterlyInfo,
  editLink,
}: StudentProfileCardProps) => {
  return (
    <div className="card bg-dark position-relative">
      <div className="card-body">
        <div className="d-flex align-items-center row-gap-3 mb-3">
          <div className="avatar avatar-xxl rounded flex-shrink-0 me-3">
            <ImageWithBasePath src={data.image} alt="Img" />
          </div>
          <div className="d-block">
            {data.badge && (
              <span className="badge bg-transparent-primary text-primary mb-1">{data.badge}</span>
            )}
            <h3 className="text-truncate text-white mb-1">{data.name}</h3>
            {data.additionalInfo && data.additionalInfo.length > 0 && (
              <div className="d-flex align-items-center flex-wrap row-gap-2 text-gray-2">
                {data.additionalInfo.map((info, index) => (
                  <span
                    key={index}
                    className={
                      index < data.additionalInfo!.length - 1 ? 'border-end me-2 pe-2' : ''
                    }
                  >
                    {info.label} : {info.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between profile-footer flex-wrap row-gap-3 pt-4">
          {quarterlyInfo && (
            <div className="d-flex align-items-center">
              <h6 className="text-white">{quarterlyInfo.label}</h6>
              <span className="badge bg-success d-inline-flex align-items-center ms-2">
                <i className="ti ti-circle-filled fs-5 me-1" />
                {quarterlyInfo.badge}
              </span>
            </div>
          )}
          {editLink && (
            <Link to={editLink} className="btn btn-primary">
              Edit Profile
            </Link>
          )}
        </div>
        <div className="student-card-bg">
          <ImageWithBasePath src="assets/img/bg/circle-shape.png" alt="Bg" />
          <ImageWithBasePath src="assets/img/bg/shape-02.png" alt="Bg" />
          <ImageWithBasePath src="assets/img/bg/shape-04.png" alt="Bg" />
          <ImageWithBasePath src="assets/img/bg/blue-polygon.png" alt="Bg" />
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;

