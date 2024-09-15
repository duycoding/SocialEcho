import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getCommunitiesAction,
	getModeratorsAction,
	addModeratorAction,
	removeModeratorAction,
	getCommunityAction,
} from '../../redux/actions/adminActions';

const CommunityManagement = () => {
	const dispatch = useDispatch();
	const communities = useSelector((state) => state.admin?.communities);
	const moderators = useSelector((state) => state.admin?.moderators);
	const community = useSelector((state) => state.admin?.community);

	useEffect(() => {
		dispatch(getCommunitiesAction());
		dispatch(getModeratorsAction());
	}, [dispatch]);

	const [selectedCommunity, setSelectedCommunity] = useState(null);
	const [selectedCommunityData, setSelectedCommunityData] = useState(null);
	const [selectedModerator, setSelectedModerator] = useState(null);
	const [newModerator, setNewModerator] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);
	const [isChangingCommunity, setIsChangingCommunity] = useState(false);

	const handleCommunitySelect = async (community) => {
		setSelectedCommunity(community);
		setIsChangingCommunity(true);
		await dispatch(getCommunityAction(community._id));
		setIsChangingCommunity(false);
	};

	useEffect(() => {
		setSelectedCommunityData(community);
	}, [community]);

	const handleModeratorSelect = (moderator) => {
		setSelectedModerator(moderator);
	};

	const handleRemoveModerator = async (moderator) => {
		setIsUpdating(true);
		await dispatch(
			removeModeratorAction(selectedCommunityData._id, moderator._id),
		);
		await dispatch(getCommunityAction(selectedCommunityData._id));
		await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
		await dispatch(getModeratorsAction());
		setIsUpdating(false);
	};
	const handleAddModerator = async () => {
		setIsUpdating(true);
		await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
		await dispatch(getCommunityAction(selectedCommunityData._id));
		await dispatch(getModeratorsAction());
		setNewModerator('');
		setIsUpdating(false);
	};

	if (!communities || !moderators) {
		return <div>Đang tải...</div>;
	}

	return (
		<div className='mt-3 flex h-[85vh] w-full gap-2 rounded-md border'>
			{/* Left column */}
			<div className='flex w-full flex-col rounded-md border-r bg-white shadow-inner'>
				<h1 className='border-b-2 p-4 text-center text-lg font-bold'>
					Danh sách cộng đồng
				</h1>
				<div className='flex flex-col overflow-y-auto'>
					{communities.map((community) => (
						<div
							key={community._id}
							className={`flex cursor-pointer items-center border-b p-4 hover:bg-background ${
								selectedCommunity?._id === community._id ? 'bg-gray-200' : ''
							}`}
							onClick={() => handleCommunitySelect(community)}>
							<img
								src={community.banner}
								alt={community.name}
								className='mr-2 h-10 w-10 rounded-full md:mr-4'
							/>
							<span className='text-xs text-gray-700 md:text-base'>
								{community.name}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Right column */}
			<div className='flex w-full flex-col rounded-md border-l bg-white px-5 py-5'>
				{isChangingCommunity ? (
					<div className='flex h-screen items-center justify-center'>
						<span className='admin-loader'></span>
					</div>
				) : selectedCommunityData ? (
					<>
						<h1 className='mb-2 border-b border-black pb-1 text-lg font-bold'>
							{selectedCommunityData.name}
						</h1>

						{isUpdating && (
							<div className='mb-4 rounded bg-green-100 p-2 text-green-800'>
								Đang cập nhật...
							</div>
						)}
						<span className='text-sm'>
							Tổng cộng Moderators: {selectedCommunityData.moderatorCount}
						</span>
						<span className='text-sm'>
							Tổng cộng thành viên: {selectedCommunityData.memberCount}
						</span>

						<div className='flex flex-col gap-5 md:flex-row'>
							{/* Moderators list */}
							<div className='flex w-full flex-col gap-2 md:w-1/2'>
								<h2 className='mb-2 font-medium'>Moderators</h2>
								{selectedCommunityData.moderators?.length === 0 && (
									<span>No moderators</span>
								)}
								<div className='flex flex-col'>
									{selectedCommunityData.moderators?.map((moderator) => (
										<div
											key={moderator._id}
											className={`flex cursor-pointer flex-col items-center justify-between gap-2 rounded border p-2 md:flex-row ${
												selectedModerator?._id === moderator._id ? '' : ''
											}`}
											onClick={() => handleModeratorSelect(moderator)}>
											<span className='font-medium'>{moderator.name}</span>
											<button
												disabled={isUpdating}
												className={` rounded bg-red-500 px-4 py-1  text-sm text-white hover:bg-red-700 ${
													isUpdating ? 'cursor-not-allowed opacity-50' : ''
												}`}
												onClick={() => handleRemoveModerator(moderator)}>
												Remove
											</button>
										</div>
									))}
								</div>
							</div>

							{/* Add moderator form */}
							<div className='flex w-full flex-col gap-2 md:w-1/2'>
								<h2 className='mb-2 font-medium'>Add Moderator</h2>
								<div className='flex flex-col gap-2 md:flex-row'>
									<select
										className='block w-full rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
										value={newModerator}
										onChange={(e) => setNewModerator(e.target.value)}>
										<option value=''>Select a moderator</option>
										{moderators?.map((moderator) => (
											<option
												key={moderator._id}
												value={moderator._id}>
												{moderator.name}
											</option>
										))}
									</select>
									<button
										disabled={
											!newModerator ||
											isUpdating ||
											selectedCommunityData.moderators?.find(
												(moderator) => moderator._id === newModerator,
											)
										}
										className={`rounded bg-blue-500 p-2 text-white hover:bg-blue-700 ${
											!newModerator ||
											isUpdating ||
											selectedCommunityData.moderators?.find(
												(moderator) => moderator._id === newModerator,
											)
												? 'cursor-not-allowed opacity-50'
												: ''
										}`}
										onClick={handleAddModerator}>
										Add
									</button>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className='flex h-full flex-col items-center justify-center'>
						<span className='font-medium text-gray-400'>
							Select a community to view details
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommunityManagement;
