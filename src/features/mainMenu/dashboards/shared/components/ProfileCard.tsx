import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../../core/common/imageWithBasePath';
import type { ProfileCardData } from '../types/dashboard.types';

interface ProfileCardProps {
  data: ProfileCardData;
  className?: string;
  showEditButton?: boolean;
  editButtonText?: string;
  customFooter?: ReactNode;
}

const ProfileCard = ({
  data,
  className = 'card bg-dark position-relative flex-fill',
  showEditButton = false,
  editButtonText = 'Edit Profile',
  customFooter,
}: ProfileCardProps) => {
  return (
    <div className={className}>
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
              <div className="d-flex align-items-center flex-wrap row-gap-2 text-light">
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
        {customFooter ? (
          <div className="d-flex align-items-center justify-content-between   flex-wrap row-gap-3 pt-4">
            {customFooter}
          </div>
        ) : (
          showEditButton &&
          data.editLink && (
            <div className="d-flex align-items-center justify-content-between   flex-wrap row-gap-3 pt-4">
              <Link to={data.editLink} className="btn btn-primary">
                {editButtonText}
              </Link>
            </div>
          )
        )}
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

export default ProfileCard;
