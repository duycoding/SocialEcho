import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../../redux/actions/adminActions';
import ButtonLoadingSpinner from '../loader/ButtonLoadingSpinner';
import { BiLogOut } from 'react-icons/bi';
import { BsPeople, BsWindowStack } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';

const Tab = ({ activeTab, handleTabClick }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		await dispatch(logoutAction()).then(() => {
			navigate('/admin/signin');
		});
		setLoggingOut(false);
	};

	return (
		<div className='sticky left-0 top-0 z-30 rounded-md border-b border-gray-200 bg-white'>
			<ul className='-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500'>
				<li className='mr-2 flex items-center'>
					<span
						className={`inline-flex cursor-pointer items-center rounded-t-lg border-b-2 px-2 py-2 ${
							activeTab === 'logs'
								? 'rounded-md border-blue-500 bg-primary text-white'
								: 'border-transparent hover:border-gray-300 hover:text-gray-600'
						}`}
						onClick={() => handleTabClick('logs')}>
						<BsWindowStack className='mr-1' />
						Nhật ký hoạt động
					</span>
				</li>
				<li className='mr-2 flex items-center'>
					<span
						className={`inline-flex cursor-pointer items-center rounded-t-lg border-b-2 px-2 py-2 ${
							activeTab === 'settings'
								? 'rounded-md border-blue-500 bg-primary text-white'
								: 'border-transparent hover:border-gray-300 hover:text-gray-600'
						}`}
						onClick={() => handleTabClick('settings')}>
						<IoSettingsOutline className='mr-1' />
						Cài đặt
					</span>
				</li>
				<li className='mr-2 flex items-center'>
					<span
						className={`inline-flex cursor-pointer items-center rounded-t-lg border-b-2 px-2 py-2 ${
							activeTab === 'Community Management'
								? 'rounded-md border-blue-500 bg-primary text-white'
								: 'border-transparent hover:border-gray-300 hover:text-gray-600'
						}`}
						onClick={() => handleTabClick('Community Management')}>
						<BsPeople className='mr-1' />
						Quản lý cộng đồng
					</span>
				</li>
				<li className='mr-2 flex items-center'>
					<span
						className={`inline-flex cursor-pointer items-center rounded-t-md border-b-2 px-2 py-2 ${
							activeTab === 'logout'
								? 'rounded-md border-blue-500 bg-primary text-white'
								: 'border-transparent hover:border-red-600 hover:text-red-600'
						}`}
						onClick={handleLogout}>
						<BiLogOut className='mr-1' />
						<span
							className={`${
								activeTab === 'logout'
									? 'group-hover:text-gray-500'
									: 'group-hover:text-red-600'
							}`}>
							{loggingOut ? (
								<ButtonLoadingSpinner loadingText={'Đang đăng xuất...'} />
							) : (
								'Đăng xuất'
							)}
						</span>
					</span>
				</li>
			</ul>
		</div>
	);
};

export default Tab;
