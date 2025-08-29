import { Table } from 'antd';
import { useEffect, useState } from 'react';
import type { DatatableProps } from '../../../core/data/interface';

const DataTableBody: React.FC<DatatableProps> = ({ columns, dataSource, Selection }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [Selections, setSelections] = useState<any>(true);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  useEffect(() => {
    return setSelections(Selection);
  }, [Selection]);

  return (
    <>
      <div className="table-top-data d-flex px-3 justify-content-between">
        <div className="page-range"></div>
      </div>
      {!Selections ? (
        <Table
          className="table datanew dataTable no-footer"
          columns={columns}
          rowHoverable={false}
          dataSource={dataSource}
          pagination={{
            locale: { items_per_page: '' },
            nextIcon: <span>Next</span>,
            prevIcon: <span>Prev</span>,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
          }}
        />
      ) : (
        <Table
          className="table datanew dataTable no-footer"
          rowSelection={rowSelection}
          columns={columns}
          rowHoverable={false}
          dataSource={dataSource}
          pagination={{
            locale: { items_per_page: '' },
            nextIcon: <span>Next</span>,
            prevIcon: <span>Prev</span>,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '30'],
          }}
        />
      )}
    </>
  );
};

export default DataTableBody;
