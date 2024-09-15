import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getServicePreferencesAction,
	updateServicePreferencesAction,
} from '../../redux/actions/adminActions';

const Settings = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const servicePreferences = useSelector(
		(state) => state.admin?.servicePreferences,
	);
	const [usePerspectiveAPI, setUsePerspectiveAPI] = useState(false);
	const [
		categoryFilteringServiceProvider,
		setCategoryFilteringServiceProvider,
	] = useState('');
	const [categoryFilteringRequestTimeout, setCategoryFilteringRequestTimeout] =
		useState(0);

	useEffect(() => {
		dispatch(getServicePreferencesAction());
	}, [dispatch]);

	useEffect(() => {
		if (servicePreferences) {
			setUsePerspectiveAPI(servicePreferences.usePerspectiveAPI);
			setCategoryFilteringServiceProvider(
				servicePreferences.categoryFilteringServiceProvider,
			);
			setCategoryFilteringRequestTimeout(
				servicePreferences.categoryFilteringRequestTimeout,
			);
			setIsLoading(false);
		}
	}, [servicePreferences]);

	const handleUpdate = async () => {
		setIsUpdating(true);
		setIsSuccess(false);
		try {
			await dispatch(
				updateServicePreferencesAction({
					usePerspectiveAPI,
					categoryFilteringServiceProvider,
					categoryFilteringRequestTimeout,
				}),
			);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading || !servicePreferences) {
		return <div>Đang tải...</div>;
	}

	return (
		<div className='mt-3 w-full rounded-md border bg-white p-5'>
			<h2 className='mb-4 border-b pb-2 text-center font-semibold text-gray-700'>
				Tùy chọn Dịch vụ
			</h2>

			{isSuccess && (
				<div className='mb-4 rounded bg-green-100 p-2 text-green-800'>
					Cập nhật dịch vụ thành công!
				</div>
			)}

			<div className='mb-4 flex items-center'>
				<div>Use Perspective API for content moderation</div>
				<div className='ml-auto'>
					<input
						className='h-5 w-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
						type='checkbox'
						checked={usePerspectiveAPI}
						onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
					/>
				</div>
			</div>

			<div className='mb-4 flex items-center'>
				<div>Category filtering service provider</div>
				<div className='ml-auto'>
					<select
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
						value={categoryFilteringServiceProvider}
						onChange={(e) =>
							setCategoryFilteringServiceProvider(e.target.value)
						}>
						<option value=''>Select a provider</option>
						<option value='TextRazor'>TextRazor</option>
						<option value='InterfaceAPI'>InterfaceAPI</option>
						<option value='ClassifierAPI'>ClassifierAPI</option>
						<option value='disabled'>Disabled</option>
					</select>
				</div>
			</div>

			<div className='mb-4 flex items-center'>
				<div>Category filtering request timeout (ms)</div>
				<div className='ml-auto'>
					<input
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
						type='number'
						value={categoryFilteringRequestTimeout}
						min={0}
						max={500000}
						required
						onChange={(e) => {
							setCategoryFilteringRequestTimeout(e.target.value);
						}}
					/>
				</div>
			</div>

			<div className='flex justify-end'>
				<button
					className='rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50'
					onClick={handleUpdate}
					disabled={isUpdating}>
					{isUpdating ? 'Updating...' : 'Update'}
				</button>
			</div>
		</div>
	);
};

export default Settings;
