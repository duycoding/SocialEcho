const ContextAuthModal = ({
	isModalOpen,
	setIsModalOpen,
	setIsConsentGiven,
	isModerator,
}) => {
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{isModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75'>
					<div className='w-full max-w-lg rounded-md bg-white p-8'>
						<h2 className='mb-4 text-xl font-bold text-gray-800'>
							Xác thực dựa trên ngữ cảnh
						</h2>
						{isModerator ? (
							<p className='mb-6 text-gray-600'>
								Tính năng này không khả dụng cho người kiếm duyệt.
							</p>
						) : (
							<p className='mb-6 text-gray-600'>
								Để tăng cường bảo mật cho tài khoản của bạn, chúng tôi cung cấp
								tính năng xác thực dựa trên ngữ cảnh. Bằng cách bật tính năng
								này, chúng tôi sẽ xử lý một số thông tin nhất định về thiết bị
								và vị trí của bạn, bao gồm vị trí hiện tại, thiết bị, thông tin
								trình duyệt và địa chỉ IP của bạn. Thông tin này sẽ được sử dụng
								để xác minh danh tính của bạn khi bạn đăng nhập từ một vị trí
								hoặc thiết bị mới, và sẽ được mã hóa và giữ bí mật. Xin lưu ý
								rằng yêu cầu xác minh qua email để bật tính năng này. Bạn có
								muốn bật xác thực dựa trên ngữ cảnh và tăng cường bảo mật cho
								tài khoản của mình không?
							</p>
						)}
						<div className='flex justify-end'>
							<button
								onClick={() => {
									setIsConsentGiven(false);
									handleCloseModal();
								}}
								className='mr-4 text-gray-500 hover:text-gray-900 hover:underline focus:outline-none'>
								{isModerator ? 'Đóng' : 'Không, cảm ơn'}
							</button>
							<button
								onClick={() => {
									setIsConsentGiven(true);
									handleCloseModal();
								}}
								className={`${
									isModerator
										? 'hidden'
										: 'bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50'
								} rounded-md px-4 py-2 text-white`}>
								Có, đồng ý
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ContextAuthModal;
