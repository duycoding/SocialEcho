import { memo, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getComPostsAction,
	clearCommunityPostsAction,
} from '../../redux/actions/postActions';
import PostForm from '../form/PostForm';
import Post from '../post/Post';
import FollowingUsersPosts from './FollowingUsersPosts';
import CommonLoading from '../loader/CommonLoading';

const MemoizedPost = memo(Post);

const MainSection = () => {
	const dispatch = useDispatch();

	const communityData = useSelector((state) => state.community?.communityData);
	const communityPosts = useSelector((state) => state.posts?.communityPosts);

	const totalCommunityPosts = useSelector(
		(state) => state.posts?.totalCommunityPosts,
	);

	const [activeTab, setActiveTab] = useState('All posts');
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
	const LIMIT = 10;

	const postError = useSelector((state) => state.posts?.postError);

	useEffect(() => {
		const fetchInitialPosts = async () => {
			if (communityData?._id) {
				dispatch(getComPostsAction(communityData._id, LIMIT, 0)).finally(() => {
					setIsLoading(false);
				});
			}
		};

		fetchInitialPosts();

		return () => {
			dispatch(clearCommunityPostsAction());
		};
	}, [dispatch, communityData]);

	const handleLoadMore = () => {
		if (
			!isLoadMoreLoading &&
			communityPosts.length > 0 &&
			communityPosts.length < totalCommunityPosts
		) {
			setIsLoadMoreLoading(true);
			dispatch(
				getComPostsAction(communityData._id, LIMIT, communityPosts.length),
			).finally(() => {
				setIsLoadMoreLoading(false);
			});
		}
	};

	const memoizedCommunityPosts = useMemo(() => {
		return communityPosts?.map((post) => (
			<MemoizedPost
				key={post._id}
				post={post}
			/>
		));
	}, [communityPosts]);

	if (isLoading || !communityData || !communityPosts) {
		return (
			<div className='main-section flex h-screen items-center justify-center'>
				<CommonLoading />
			</div>
		);
	}

	return (
		<div className='flex flex-col'>
			<ul className='flex'>
				<li
					className={`${
						activeTab === 'All posts'
							? 'rounded-md border-blue-500 bg-primary text-white'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
					} flex-1 cursor-pointer border-b-2 px-1 py-2 text-center font-medium`}
					onClick={() => setActiveTab('All posts')}>
					Tất cả bài đăng
				</li>
				<li
					className={`${
						activeTab === "You're following"
							? 'rounded-md border-blue-500 bg-primary text-white'
							: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
					} flex-1 cursor-pointer border-b-2 px-1 py-2 text-center font-medium`}
					onClick={() => setActiveTab("You're following")}>
					Bạn đang theo dõi
				</li>
			</ul>
			<div className='mt-4 flex flex-col gap-4'>
				{activeTab === 'All posts' && (
					<>
						<div className='mb-4'>
							<PostForm
								communityId={communityData._id}
								communityName={communityData.name}
							/>
						</div>
						{postError && (
							<div className='mx-auto rounded-md border border-red-500 bg-red-100 p-3 text-center text-red-500'>
								{postError}
							</div>
						)}

						<div>{memoizedCommunityPosts}</div>
						{communityPosts.length < totalCommunityPosts && (
							<button
								className='my-3 w-full rounded-md bg-primary p-2 text-sm font-semibold text-white hover:bg-blue-700'
								onClick={handleLoadMore}
								disabled={isLoadMoreLoading}>
								{isLoadMoreLoading ? 'Đang tải...' : 'Tải nhiều bài đăng hơn'}
							</button>
						)}
					</>
				)}
				{activeTab === "You're following" && (
					<FollowingUsersPosts communityData={communityData} />
				)}
			</div>
		</div>
	);
};

export default MainSection;
