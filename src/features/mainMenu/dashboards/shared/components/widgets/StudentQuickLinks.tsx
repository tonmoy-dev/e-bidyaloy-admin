import { Link } from 'react-router-dom';

export interface StudentQuickLink {
  id: string;
  title: string;
  link: string;
  icon: string;
  borderColor: string;
  bgColor: string;
}

interface StudentQuickLinksProps {
  links: StudentQuickLink[];
}

const StudentQuickLinks = ({ links }: StudentQuickLinksProps) => {
  return (
    <div className="col-xl-12 d-flex">
      <div className="row flex-fill">
        {links.map((link) => (
          <div key={link.id} className="col-sm-6 col-xl-3 d-flex">
            <Link
              to={link.link}
              className={`card border-0 border-bottom ${link.borderColor} ${link.borderColor.includes('border-2') ? 'border-2' : ''} flex-fill animate-card`}
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <span className={`avatar avatar-md rounded ${link.bgColor} me-2`}>
                    <i className={link.icon} />
                  </span>
                  <h6>{link.title}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentQuickLinks;

