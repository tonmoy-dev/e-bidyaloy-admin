import { Link } from 'react-router-dom';

export interface ActionLink {
  id: string;
  title: string;
  link: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  hoverClass: string;
}

export interface ActionLinksCardsProps {
  links: ActionLink[];
}

const ActionLinksCards = ({ links }: ActionLinksCardsProps) => {
  return (
    <>
      {links.map((link) => (
        <div key={link.id} className="col-xl-3 col-md-6 d-flex">
          <Link
            to={link.link}
            className={`card ${link.bgColor} border border-5 border-white animate-card flex-fill`}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span className={`avatar avatar-lg ${link.borderColor} rounded flex-shrink-0 me-2`}>
                    <i className={link.icon} />
                  </span>
                  <div className="overflow-hidden">
                    <h6 className="fw-semibold text-default">{link.title}</h6>
                  </div>
                </div>
                <span className={`btn btn-white ${link.hoverClass} avatar avatar-sm p-0 flex-shrink-0 rounded-circle`}>
                  <i className="ti ti-chevron-right fs-14" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default ActionLinksCards;

