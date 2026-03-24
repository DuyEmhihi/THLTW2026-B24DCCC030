import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, DatePicker, Button, Space, message, List, Typography, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { DiplomaSearchForm, Diploma, GraduationDecision } from '../../services/TH04/typings';

const { Title, Text } = Typography;

interface DiplomaSearchProps {
  onSearch: (values: DiplomaSearchForm) => Promise<Diploma[]>;
  decisions: GraduationDecision[];
  loading?: boolean;
}

const DiplomaSearch: React.FC<DiplomaSearchProps> = ({
  onSearch,
  decisions,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Diploma[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      const paramCount = Object.values(values).filter(value => value && value.toString().trim() !== '').length;

      if (paramCount < 2) {
        message.warning('Phải nhập ít nhất 2 tham số tìm kiếm');
        return;
      }

      setSearching(true);
      const results = await onSearch(values);
      setSearchResults(results);

      if (results.length === 0) {
        message.info('Không tìm thấy văn bằng nào phù hợp');
      } else {
        message.success(`Tìm thấy ${results.length} văn bằng`);
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setSearching(false);
    }
  };

  const getDecisionInfo = (decisionId: string) => {
    return decisions.find(d => d.id === decisionId);
  };

  const formatCustomFields = (customFields: Record<string, any>, diploma: Diploma) => {
    // This would need the fields configuration to properly format
    // For now, just return the raw values
    return Object.entries(customFields).map(([key, value]) => (
      <div key={key}>
        <Text strong>{key}: </Text>
        <Text>{value}</Text>
      </div>
    ));
  };

  return (
    <div>
      <Card title="Tra cứu văn bằng" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
              <Input placeholder="Nhập số hiệu văn bằng" />
            </Form.Item>

            <Form.Item name="entryNumber" label="Số vào sổ">
              <InputNumber placeholder="Nhập số vào sổ" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="studentId" label="Mã sinh viên">
              <Input placeholder="Nhập mã sinh viên" />
            </Form.Item>

            <Form.Item name="name" label="Họ tên">
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item name="birthDate" label="Ngày sinh">
              <DatePicker
                placeholder="Chọn ngày sinh"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={searching}
              size="large"
            >
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {searchResults.length > 0 && (
        <Card title={`Kết quả tìm kiếm (${searchResults.length} văn bằng)`}>
          <List
            dataSource={searchResults}
            renderItem={(diploma) => {
              const decision = getDecisionInfo(diploma.decisionId);
              return (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <Title level={5}>Thông tin văn bằng</Title>
                        <Space direction="vertical" size="small">
                          <div><Text strong>Số vào sổ:</Text> {diploma.entryNumber}</div>
                          <div><Text strong>Số hiệu văn bằng:</Text> {diploma.diplomaNumber}</div>
                          <div><Text strong>Mã sinh viên:</Text> {diploma.studentId}</div>
                          <div><Text strong>Họ tên:</Text> {diploma.name}</div>
                          <div><Text strong>Ngày sinh:</Text> {new Date(diploma.birthDate).toLocaleDateString('vi-VN')}</div>
                        </Space>
                      </div>

                      <div>
                        <Title level={5}>Quyết định tốt nghiệp</Title>
                        {decision && (
                          <Space direction="vertical" size="small">
                            <div><Text strong>Số quyết định:</Text> {decision.decisionNumber}</div>
                            <div><Text strong>Ngày ban hành:</Text> {new Date(decision.decisionDate).toLocaleDateString('vi-VN')}</div>
                            <div><Text strong>Đợt:</Text> {decision.batchNumber}</div>
                            <div><Text strong>Trích yếu:</Text> {decision.summary}</div>
                          </Space>
                        )}

                        {Object.keys(diploma.customFields).length > 0 && (
                          <>
                            <Divider />
                            <Title level={5}>Thông tin bổ sung</Title>
                            <Space direction="vertical" size="small">
                              {formatCustomFields(diploma.customFields, diploma)}
                            </Space>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default DiplomaSearch;