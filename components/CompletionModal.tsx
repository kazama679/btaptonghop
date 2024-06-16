import React from 'react';

interface CompletionModalProps {
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ onClose }) => {
  return (
    <div className='modal'>
      <div className='modal-dialog'>
        <div className='modal-header'>
          <h3 className='modal-title'>Hoàn thành công việc</h3>
          <button className='close' onClick={onClose}>&times;</button>
        </div>
        <div className='modal-body'>
          <p>Chúc mừng! Bạn đã hoàn thành tất cả công việc.</p>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-primary' onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default CompletionModal;
