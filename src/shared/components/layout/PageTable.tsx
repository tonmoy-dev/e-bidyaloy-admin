// components/layout/PageTable.tsx
import Table from '../../../core/common/dataTable/index';

type PageTableProps<T> = { columns: any[]; data: T[]; title?: string };

const PageTable = <T extends {}>({ columns, data, title }: PageTableProps<T>) => (
  <div className="card">
    {title && (
      <div className="card-header">
        <h4 className="mb-3">{title}</h4>
      </div>
    )}
    <div className="card-body p-0 py-3">
      <Table columns={columns} dataSource={data} Selection={true} />
    </div>
  </div>
);

export default PageTable;
