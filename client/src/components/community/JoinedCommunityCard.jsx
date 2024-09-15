import { Link } from 'react-router-dom';

const JoinedCommunityCard = ({ community }) => {
	return (
		<Link
			to={`/community/${community.name}`}
			className='mb-5 flex w-full flex-col rounded-md border bg-white px-4 py-4 shadow-2xl shadow-[#f2f5fc]'>
			<img
				className=''
				src={community.banner}
				alt=''
				loading='lazy'
			/>
			<h3 className='mb-2 text-lg font-semibold'>{community.name}</h3>
			<p className='mb-2 text-gray-700'>
				{community.members.length} thành viên
			</p>
		</Link>
	);
};

export default JoinedCommunityCard;
