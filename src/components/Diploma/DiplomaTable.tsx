import React from 'react';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Diploma, GraduationDecision } from '../../services/TH04/typings';

interface DiplomaTableProps {
  diplomas: Diploma[];
  decisions: GraduationDecision[];
  loading?: boolean;
  onEdit?: (diploma: Diploma) => void;
  onDelete?: (id: string) => Promise<void>;
}

const DiplomaTable: React.FC<DiplomaTableProps> = ({
  diplomas,
  decisions,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const getDecisionInfo = (decisionId: string) => {
    return decisions.find(d => d.id === decisionId);
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      width: 100,
      sorter: (a: Diploma, b: Diploma) => a.entryNumber - b.entryNumber,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
      width: 150,
    },
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Quyết định',
      key: 'decision',
      width: 200,
      render: (_: any, record: Diploma) => {
        const decision = getDecisionInfo(record.decisionId);
        return decision ? (
          <div>
            <div>{decision.decisionNumber}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Đợt {decision.batchNumber}
            </div>
          </div>
        ) : 'N/A';
      },
    },
    {
      title: 'Thông tin bổ sung',
      key: 'customFields',
      render: (_: any, record: Diploma) => {
        const fields = Object.entries(record.customFields);
        if (fields.length === 0) return <span style={{ color: '#999' }}>Không có</span>;

        return (
          <div>
            {fields.slice(0, 2).map(([key, value]) => (
              <Tag key={key} style={{ marginBottom: 4 }}>
                {key}: {value}
              </Tag>
            ))}
            {fields.length > 2 && (
              <Tag>+{fields.length - 2} trường khác</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: any, record: Diploma) => (
        <Space size="small">
          {onEdit && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            >
              Sửa
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Bạn có chắc muốn xóa văn bằng này?"
              onConfirm={async () => {
                try {
                  await onDelete(record.id);
                  message.success('Xóa văn bằng thành công');
                } catch (error) {
                  message.error('Xóa văn bằng thất bại');
                }
              }}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={diplomas}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} văn bằng`,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default DiplomaTable;