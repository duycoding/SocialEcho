import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getLogsAction,
	deleteLogsAction,
} from '../../redux/actions/adminActions';
import CurrentTime from '../shared/CurrentTime';
import ButtonLoadingSpinner from '../loader/ButtonLoadingSpinner';
import CommonLoading from '../loader/CommonLoading';
import { FcRefresh } from 'react-icons/fc';

const Logs = () => {
	const [loading, setLoading] = useState(true);
	const [clearing, setClearing] = useState(false);

	const dispatch = useDispatch();
	const logs = useSelector((state) => state.admin?.logs);

	const fetchLogs = async () => {
		try {
			setLoading(true);
			await dispatch(getLogsAction());
		} finally {
			setLoading(false);
		}
	};

	const handleCleanup = async () => {
		try {
			setClearing(true);
			await dispatch(deleteLogsAction());
		} finally {
			setClearing(false);
		}
	};

	const handleRefresh = async () => {
		try {
			setLoading(true);
			await fetchLogs();
		} catch (error) {}
	};

	useEffect(() => {
		fetchLogs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logs?.length]);

	if (loading || !logs) {
		return (
			<div className='mt-5 flex items-center justify-center'>
				<CommonLoading />
			</div>
		);
	}

	return (
		<div className='mt-3 flex flex-col items-center justify-center rounded-md bg-white'>
			<div className='relative rounded p-4 shadow-md md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1200px]'>
				<div className='mb-4 flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-800'>
						Nhật ký hoạt động người dùng
					</h1>
					<CurrentTime />
				</div>

				<div className='mb-4 flex items-center justify-between border-b border-gray-200 pb-2'>
					<div className='text-sm italic text-gray-600'>{`Có tất cả ${logs.length} hoạt động trong 7 ngày qua`}</div>

					<div className='flex items-center space-x-2'>
						<button onClick={handleRefresh}>
							<FcRefresh />
						</button>
						<button
							className={`rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 ${
								clearing ? 'cursor-not-allowed opacity-50' : ''
							} ${logs.length === 0 ? 'hidden' : ''}`}
							onClick={handleCleanup}
							disabled={clearing || logs.length === 0}>
							{clearing ? (
								<ButtonLoadingSpinner loadingText='Đang xóa...' />
							) : (
								'Xóa nhật ký'
							)}
						</button>
					</div>
				</div>

				{!loading ? (
					logs.length === 0 ? (
						<div className='text-lg text-gray-500'>No logs found</div>
					) : (
						<>
							<div className='relative h-[430px] overflow-auto'>
								<div className='w-full rounded'>
									<div className='grid grid-cols-5 items-center gap-5 border-b py-2 font-semibold text-gray-800'>
										<p className='text-center'>Timestamp</p>
										<p>Message</p>
										<p>Email Used</p>
										<p>Level</p>
										<p>Context Data</p>
									</div>
									{logs.map((log) => (
										<div
											key={log._id}
											className='grid grid-cols-5 items-center gap-5 border-b py-2 text-sm text-gray-700'>
											<span className='flex-col items-center justify-center text-center font-mono'>
												<p>{log.relativeTimestamp}</p>
												<p className='text-xs'>{log.formattedTimestamp}</p>
											</span>
											<td
												className={`${
													log.level === 'info'
														? 'text-blue-500'
														: log.level === 'warn'
														? 'text-orange-500'
														: log.level === 'error'
														? 'text-red-600'
														: ''
												}`}>
												<span className='capitalize'>{log.type}: </span>
												<span>{log.message}</span>
											</td>
											<p>{log.email}</p>
											<td className=''>
												<span
													className={`rounded-full px-2 py-1 text-sm font-semibold ${
														log.level === 'error'
															? 'bg-red-500 text-white'
															: log.level === 'warn'
															? 'bg-orange-500 text-white'
															: 'bg-blue-500 text-white'
													}`}>
													{log.level}
												</span>
											</td>
											<td className=''>
												<ul className='list-inside list-disc'>
													{log.contextData &&
														Object.entries(log.contextData).map(
															([key, value]) => (
																<li key={key}>
																	<span className='font-medium text-blue-500'>
																		{key}:{' '}
																	</span>
																	{value}
																</li>
															),
														)}
												</ul>
											</td>
										</div>
									))}
								</div>
							</div>

							<div className='mt-2 flex justify-center text-sm italic text-gray-600'>
								logs are automatically deleted after 7 days
							</div>
						</>
					)
				) : null}
			</div>
		</div>
	);
};

export default Logs;
