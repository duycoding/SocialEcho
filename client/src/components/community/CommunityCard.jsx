import { useState } from 'react';
import JoinModal from '../modals/JoinModal';
import placeholder from '../../assets/placeholder.png';
import { MdOutlineGroupAdd } from 'react-icons/md';
const CommunityCard = ({ community }) => {
	const [joinModalVisibility, setJoinModalVisibility] = useState({});

	const toggleJoinModal = (communityId, visible) => {
		setJoinModalVisibility((prev) => ({
			...prev,
			[communityId]: visible,
		}));
	};
	return (
		<div className='flex justify-between rounded-md border bg-white px-3 py-3 shadow-2xl shadow-[#f2f5fc]'>
			<div className='flex w-full items-start'>
				<img
					className='mr-4 h-10 w-10 rounded-full object-cover'
					src={community.banner || placeholder}
					alt='community banner'
					loading='lazy'
				/>
				<div className=''>
					<h4 className='line-clamp-1 text-base font-semibold'>
						{community.name}
					</h4>
					<p className='text-gray-700 '>
						{community.members.length} thành viên
					</p>
				</div>
			</div>

			<div className=''>
				<button
					onClick={() => toggleJoinModal(community._id, true)}
					className='group rounded-xl bg-primary px-2.5 py-2.5 shadow-2xl shadow-[#F3F8FF] transition duration-300 hover:border hover:border-primary hover:bg-transparent'>
					<MdOutlineGroupAdd className='text-lg text-white group-hover:text-primary' />
				</button>
				<JoinModal
					show={joinModalVisibility[community._id] || false}
					onClose={() => toggleJoinModal(community._id, false)}
					community={community}
				/>
			</div>
		</div>
	);
};

export default CommunityCard;
