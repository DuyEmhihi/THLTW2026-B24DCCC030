import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Rate,
  Select,
  Input,
  Space,
  Slider,
  Button,
  Empty,
  Tag,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Destination } from './models';
import { mockDestinations } from './mockData';
import styles from './styles.less';

interface ExploreProps {
  onSelectDestination?: (destination: Destination) => void;
  selectable?: boolean;
}

export const Explore: React.FC<ExploreProps> = ({ onSelectDestination, selectable = false }) => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('rating');

  const typeOptions = ['beach', 'mountain', 'city', 'nature', 'cultural'].map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

  const filteredDestinations = useMemo(() => {
    let result = [...mockDestinations];

    // Search filter
    if (searchText) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(searchText.toLowerCase()) ||
          d.location.toLowerCase().includes(searchText.toLowerCase()) ||
          d.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter.length > 0) {
      result = result.filter((d) => typeFilter.includes(d.type));
    }

    // Price filter
    result = result.filter((d) => d.basePrice >= priceRange[0] && d.basePrice <= priceRange[1]);

    // Rating filter
    if (ratingFilter) {
      result = result.filter((d) => d.rating >= ratingFilter);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchText, typeFilter, priceRange, ratingFilter, sortBy]);

  const typeColor: { [key: string]: string } = {
    beach: 'blue',
    mountain: 'green',
    city: 'orange',
    nature: 'cyan',
    cultural: 'purple',
  };

  return (
    <div className={styles.explore}>
      {/* Filter Section */}
      <Card className={styles.filterCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className={styles.filterTitle}>
            <FilterOutlined /> Bộ Lọc &amp; Sắp Xếp
          </div>

          <div>
            <label className={styles.filterLabel}>Tìm kiếm</label>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm địa điểm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Loại Hình</label>
            <Select
              mode="multiple"
              placeholder="Chọn loại hình"
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Giá ({priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VNĐ)</label>
            <Slider
              range
              min={0}
              max={2000000}
              step={100000}
              value={priceRange}
              onChange={(values) => setPriceRange(values as [number, number])}
              marks={{
                0: '0',
                2000000: '2M',
              }}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Đánh Giá Tối Thiểu</label>
            <Select
              placeholder="Chọn đánh giá"
              options={[
                { label: 'Không giới hạn', value: null },
                { label: '★★★★★ (5.0+)', value: 5 },
                { label: '★★★★☆ (4.0+)', value: 4 },
                { label: '★★★☆☆ (3.0+)', value: 3 },
                { label: '★★☆☆☆ (2.0+)', value: 2 },
              ]}
              value={ratingFilter}
              onChange={setRatingFilter}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Sắp Xếp Theo</label>
            <Select
              placeholder="Chọn cách sắp xếp"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Đánh giá cao nhất', value: 'rating' },
                { label: 'Giá thấp nhất', value: 'price-asc' },
                { label: 'Giá cao nhất', value: 'price-desc' },
                { label: 'Tên A-Z', value: 'name' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
        </Space>
      </Card>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <h2>
          Kết Quả Tìm Kiếm ({filteredDestinations.length} địa điểm)
        </h2>

        {filteredDestinations.length === 0 ? (
          <Empty description="Không tìm thấy địa điểm" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredDestinations.map((destination) => (
              <Col key={destination.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className={styles.destinationCard}
                  onClick={() => onSelectDestination?.(destination)}
                  cover={
                    <div className={styles.imageContainer}>
                      <img
                        alt={destination.name}
                        src={destination.image}
                        className={styles.destinationImage}
                      />
                      <Tag color={typeColor[destination.type]} className={styles.typeTag}>
                        {destination.type}
                      </Tag>
                    </div>
                  }
                >
                  <div className={styles.cardContent}>
                    <h3 className={styles.destinationName}>{destination.name}</h3>
                    <p className={styles.location}>{destination.location}</p>
                    <div className={styles.rating}>
                      <Rate disabled defaultValue={Math.round(destination.rating)} />
                      <span className={styles.ratingText}>
                        {destination.rating} ({destination.reviewCount})
                      </span>
                    </div>
                    <p className={styles.description}>{destination.description.substring(0, 60)}...</p>
                    <div className={styles.price}>
                      <strong>{destination.basePrice.toLocaleString()} VNĐ</strong>
                    </div>
                    {selectable && (
                      <Button
                        type="primary"
                        block
                        onClick={() => onSelectDestination?.(destination)}
                      >
                        Thêm vào lịch trình
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
