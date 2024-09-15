import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LeaveModal from '../modals/LeaveModal';
import { getCommunityAction } from '../../redux/actions/communityActions';
import placeholder from '../../assets/placeholder.png';
import CommonLoading from '../loader/CommonLoading';

import {
	useBannerLoading,
	useIsModeratorUpdated,
} from '../../hooks/useCommunityData';
import { HiUserGroup, HiOutlineCheckBadge } from 'react-icons/hi2';

const Rightbar = () => {
	const [showLeaveModal, setShowLeaveModal] = useState(false);

	const dispatch = useDispatch();
	const { communityName } = useParams();

	const toggleLeaveModal = useCallback(() => {
		setShowLeaveModal((prevState) => !prevState);
	}, []);

	useEffect(() => {
		dispatch(getCommunityAction(communityName));
	}, [dispatch, communityName]);

	const communityData = useSelector((state) => state.community?.communityData);

	const isModeratorOfThisCommunity = useSelector(
		(state) => state.auth?.isModeratorOfThisCommunity,
	);

	const { name, description, members, rules, banner } = useMemo(
		() => communityData || {},
		[communityData],
	);

	const bannerLoaded = useBannerLoading(banner);
	const isModeratorUpdated = useIsModeratorUpdated(isModeratorOfThisCommunity);

	if (!communityData) {
		return (
			<div className='flex justify-center'>
				<CommonLoading />
			</div>
		);
	}

	return (
		<div className='rounded-md bg-white '>
			<div className='flex flex-col '>
				<h2 className='text-lg font-bold'>{name}</h2>
				<div className='mb-4 flex items-center gap-2 text-primary'>
					<HiUserGroup />
					<span className='mr-2'>
						{members?.length || 0}{' '}
						{members?.length === 1 ? 'thành viên' : 'thành viên'}
					</span>
				</div>
			</div>

			{bannerLoaded ? (
				<img
					src={banner}
					alt='community banner'
					className='mb-4 h-40 w-full rounded-md object-cover'
					onError={(e) => {
						e.target.src = placeholder;
					}}
				/>
			) : (
				<img
					src={placeholder}
					alt='community banner placeholder'
					className='mb-4 h-40 w-full rounded-md object-cover'
				/>
			)}

			<h3>{description}</h3>

			<div className='my-4'>
				{isModeratorOfThisCommunity && (
					<Link
						to={`/community/${communityName}/moderator`}
						className='my-2 flex w-full items-center justify-center rounded-md bg-primary px-4 py-1 text-sm text-white shadow-md shadow-gray-50 hover:bg-primary-600'>
						Moderation Panel
					</Link>
				)}

				{isModeratorUpdated && !isModeratorOfThisCommunity && (
					<button
						onClick={toggleLeaveModal}
						className='my-2 flex w-full items-center justify-center rounded-md border border-red-400 px-4 py-1 text-sm text-red-400 shadow-md shadow-red-50 hover:bg-red-400 hover:text-white'>
						Rời khỏi cộng đồng
					</button>
				)}
				{
					<LeaveModal
						show={showLeaveModal}
						toggle={toggleLeaveModal}
						communityName={communityName}
					/>
				}
			</div>
			{rules && rules.length > 0 && (
				<div className='mb-4 text-slate-900'>
					<span className='font-bold'>Community Guidelines:</span>
					<ul className='flex flex-col gap-2 '>
						{rules.map((rule) => (
							<li
								key={rule._id}
								className='flex items-start gap-2 '>
								<HiOutlineCheckBadge className='mt-1 flex-shrink-0 text-lg' />
								{rule.rule}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Rightbar;
