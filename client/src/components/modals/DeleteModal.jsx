import { Fragment, useRef, useState, memo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { deletePostAction } from '../../redux/actions/postActions';
import LoadingSpinner from '../loader/ButtonLoadingSpinner';
import { useNavigate } from 'react-router-dom';
const DeleteModal = memo(({ showModal, postId, onClose, prevPath }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const deleteHandler = async () => {
		setLoading(true);
		await dispatch(deletePostAction(postId));
		navigate(prevPath ? prevPath : '/');
		setLoading(false);
		onClose();
	};

	const cancelButtonRef = useRef(null);

	return (
		<Transition.Root
			show={showModal}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				initialFocus={cancelButtonRef}
				onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm'>
								<div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
									<div className='flex flex-col items-center'>
										<div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-dashed bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth='1.5'
												stroke='currentColor'
												className='h-6 w-6'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
												/>
											</svg>
										</div>
										<p className='mt-3 text-center text-base font-semibold text-slate-800'>
											Bạn có chắc muốn xóa không? <br /> Hành động này không thể
											khôi phục
										</p>
									</div>
								</div>
								<div className='justify-center gap-5 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
									<button
										type='button'
										className='w-full rounded-md  border
                    border-red-500 
                     px-2 py-1 text-sm font-semibold text-red-500 transition duration-300 hover:bg-red-500 hover:text-white sm:w-auto'
										onClick={deleteHandler}
										disabled={loading}>
										{loading ? (
											<LoadingSpinner loadingText='Đang xóa...' />
										) : (
											'Xóa'
										)}
									</button>
									<button
										disabled={loading}
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-dashed bg-white px-3  py-2 text-sm font-semibold text-gray-500 shadow-sm  hover:bg-slate-100 sm:mt-0 sm:w-auto'
										onClick={() => {
											onClose();
										}}
										ref={cancelButtonRef}>
										Hủy
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
});

export default DeleteModal;
