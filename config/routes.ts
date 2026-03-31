export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/bai1',
		name: 'Bai1',
		icon: 'ShoppingOutlined',
		component: './Bai1',
	},
	{
		path: '/bai2',
		name: 'Bai2',
		icon: 'ShoppingCartOutlined',
		component: './Bai2',
	},
	{
		path: '/th01',
		name: 'TH01-Bai1',
		component: './TH01',
	},
	{
		path: '/th01-b2',
		name: 'TH01-Bai2',
		component: './TH01_b2',
	},
	{
		path: '/th02',
		name: 'TH02-Bai1',
		component: './Th02_b1',
	},
	{
		path: '/th02-b2',
		name: 'TH02-Bai2',
		component: './TH02_b2',
		},
	{
		path: '/th3',
		name: 'TH3',
		component: './TH3',
	},
	{
		path: '/th04',
		name: 'TH04',
		component: './TH04',
	},
	{
		path: '/th05',
		name: 'TH05',
		component: './TH05',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
