import { Modal, Button, Form, Input, InputNumber, Table, message, Popconfirm } from 'antd';
import { useState } from 'react';
import './components/style.less';

const getColumns = (onDelete: (key: number) => void) => [
	{ title: 'STT', dataIndex: 'key', key: 'key' },
	{ title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
	{ title: 'Giá', dataIndex: 'price', key: 'price' },
	{ title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: { key: number }) => (
				<Popconfirm
					title="Bạn có chắc muốn xóa sản phẩm này?"
					onConfirm={() => onDelete(record.key)}
					okText="Có"
					cancelText="Không"
				>
					<a style={{ color: 'red' }}>Xóa</a>
				</Popconfirm>
			),
		},
];

const TrangChu = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [searchValue, setSearchValue] = useState('');
	const [products, setProducts] = useState([
		{ key: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
		{ key: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
		{ key: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
		{ key: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
		{ key: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
	]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async (values: { name: string; price: number; quantity: number; }) => {
		const newProduct = {
			key: products.length + 1,
			name: values.name,
			price: values.price,
			quantity: values.quantity,
		};
		setProducts([...products, newProduct]);
		message.success('Thêm sản phẩm thành công!');
		form.resetFields();
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleDelete = (key: number) => {
		const updatedProducts = products.filter(product => product.key !== key);
		setProducts(updatedProducts);
		message.success('Xóa sản phẩm thành công!');
	};

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchValue.toLowerCase())
	);

	return (
		<> 
			<div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
				<Button type="primary" onClick={showModal}>Thêm sản phẩm</Button>
				<Input.Search
					placeholder="Tìm kiếm sản phẩm..."
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					style={{ maxWidth: 300 }}
				/>
			</div>
		<Modal title="Thêm sản phẩm" visible={isModalVisible} onCancel={handleCancel} footer={null}>
			<Form form={form} onFinish={handleOk} layout="vertical">
				<Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}> 
					<Input placeholder="Nhập tên sản phẩm" />
				</Form.Item>
				<Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá!' }, { type: 'number', min: 1, message: 'Giá phải lớn hơn 0!' }]}> 
					<InputNumber style={{ width: '100%' }} placeholder="Nhập giá" />
				</Form.Item>
				<Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }, { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }]}> 
					<InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Thêm</Button>
					</Form.Item>
				</Form>
			</Modal>
			<Table columns={getColumns(handleDelete)} dataSource={filteredProducts} pagination={false} />
		</>
	);
};

export default TrangChu;
