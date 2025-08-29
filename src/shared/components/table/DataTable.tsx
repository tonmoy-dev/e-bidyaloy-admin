interface DataTableProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ header, footer, children }) => (
  <div className="card">
    <div className="card-header pb-0">{header}</div>
    <div className="card-body p-0 py-3">
      {children}
      {footer}
    </div>
  </div>
);

export default DataTable;
