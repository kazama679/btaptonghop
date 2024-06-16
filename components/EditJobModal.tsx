import React from 'react';

interface EditJobModalProps {
    newName: string;
    onChangeName: (name: string) => void;
    onCancel: () => void;
    onUpdate: (newName: string) => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ newName, onChangeName, onCancel, onUpdate }) => {
    return (
        <div id="editJobModal" className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Chỉnh sửa công việc</h4>
                        <button
                            type="button"
                            className="close"
                            aria-hidden="true"
                            onClick={onCancel}
                        >
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Nhập tên mới cho công việc:</p>
                        <input
                            type="text"
                            className="form-control"
                            value={newName}
                            onChange={(e) => onChangeName(e.target.value)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={onCancel}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => onUpdate(newName)} 
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditJobModal;
