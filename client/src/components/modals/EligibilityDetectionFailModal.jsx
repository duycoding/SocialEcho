import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	confirmPostAction,
	rejectPostAction,
} from '../../redux/actions/postActions';

const EligibilityDetectionFailModal = ({
	closeEligibilityDetectionFailModal,
	showEligibilityDetectionFailModal,
	confirmationToken,
}) => {
	const dispatch = useDispatch();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleDiscard = async () => {
		setIsProcessing(true);
		await dispatch(rejectPostAction(confirmationToken));
		setIsProcessing(false);
		closeEligibilityDetectionFailModal();
	};

	const handleProcess = async () => {
		setIsProcessing(true);
		await dispatch(confirmPostAction(confirmationToken));
		setIsProcessing(false);
		closeEligibilityDetectionFailModal();
	};

	const modalClass = showEligibilityDetectionFailModal
		? 'fixed inset-0 z-50 flex items-center justify-center'
		: 'hidden';

	return (
		<div className={modalClass}>
			<div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
				<div className='z-10 mx-auto max-w-md rounded-md bg-white p-8 shadow-lg'>
					<h2 className='mb-4 text-xl font-semibold'>
						Không thể xác định tính đủ điều kiện của bài đăng
					</h2>
					<p className='mb-4 text-gray-600'>
						Chúng tôi xin lỗi, nhưng hệ thống của chúng tôi không thể xác định
						tính đủ điều kiện của bài đăng của bạn cho cộng đồng này. Bạn vẫn có
						thể tiếp tục đăng bài nếu bạn tin rằng nó phù hợp. Các quản trị viên
						cộng đồng có thể xóa các bài đăng không tuân thủ hướng dẫn, điều này
						có thể dẫn đến việc bị cấm. Cảm ơn bạn đã hiểu.
					</p>
					<div className='flex justify-end'>
						<button
							className='focus:shadow-outline mr-4 rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 focus:outline-none'
							onClick={handleDiscard}
							disabled={isProcessing}>
							Hủy bỏ
						</button>
						<button
							className={`focus:shadow-outline rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 focus:outline-none ${
								isProcessing ? 'cursor-not-allowed opacity-50' : ''
							}`}
							onClick={handleProcess}
							disabled={isProcessing}>
							{isProcessing ? 'Đang đăng...' : 'Vẵn đăng bài'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EligibilityDetectionFailModal;
