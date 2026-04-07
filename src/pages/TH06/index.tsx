import React, { useState } from 'react';
import { Tabs, Layout, Button, Drawer, Badge } from 'antd';
import {
  CompassOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Explore } from './Explore';
import { CreateItinerary } from './CreateItinerary';
import { BudgetManagement } from './BudgetManagement';
import { Admin } from './Admin';
import styles from './styles.less';

const { Header, Content } = Layout;

export default function TravelPlanningApp() {
  const [activeTab, setActiveTab] = useState('explore');
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  const tabItems = [
    {
      key: 'explore',
      label: (
        <span>
          <CompassOutlined />
          Khám Phá
        </span>
      ),
      children: <Explore selectable={true} />,
    },
    {
      key: 'itinerary',
      label: (
        <span>
          <CalendarOutlined />
          Lịch Trình
        </span>
      ),
      children: <CreateItinerary />,
    },
    {
      key: 'budget',
      label: (
        <span>
          <DollarOutlined />
          Ngân Sách
        </span>
      ),
      children: <BudgetManagement />,
    },
    {
      key: 'admin',
      label: (
        <span>
          <SettingOutlined />
          Quản Trị
        </span>
      ),
      children: <Admin />,
    },
  ];

  return (
    <Layout className={styles.mainLayout}>
      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✈️</span>
            <span className={styles.logoText}>Travel Planner</span>
          </div>
          <Button
            type="text"
            icon={<MenuOutlined />}
            className={styles.menuButton}
            onClick={() => setMobileDrawerVisible(true)}
          />
        </div>
      </Header>

      <Content className={styles.content}>
        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            tabBarGutter={16}
            className={styles.tabs}
          />
        </div>

        {/* Mobile Navigation */}
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          className={styles.mobileDrawer}
        >
          <div className={styles.mobileMenu}>
            {tabItems.map((item) => (
              <div
                key={item.key}
                className={`${styles.mobileMenuItem} ${
                  activeTab === item.key ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab(item.key);
                  setMobileDrawerVisible(false);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </Drawer>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {tabItems.map((item) => (
            <div
              key={item.key}
              style={{ display: activeTab === item.key ? 'block' : 'none' }}
            >
              {item.children}
            </div>
          ))}
        </div>
      </Content>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Travel Planning App. Khám phá thế giới, lên kế hoạch thông minh.</p>
        <p className={styles.footerSubtext}>Responsive Design • Desktop • Tablet • Mobile</p>
      </footer>
    </Layout>
  );
}
