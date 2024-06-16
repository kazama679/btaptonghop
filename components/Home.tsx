import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteJob from './DeleteJob';
import EditJobModal from './EditJobModal';
import CompletionModal from './CompletionModal';

interface Job {
    id: number;
    name: string;
    status: boolean;
}

const Home: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
    const [newJobName, setNewJobName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [filterCriteria, setFilterCriteria] = useState<string>('all');
    const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        setLoading(true);
        axios.get('http://localhost:8080/jobs')
            .then((response) => {
                setTimeout(() => {
                    setJobs(response.data);
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }

    const handleDeleteClick = (job: Job) => {
        setJobToDelete(job);
    }

    const handleDeleteConfirm = () => {
        if (jobToDelete) {
            axios.delete(`http://localhost:8080/jobs/${jobToDelete.id}`)
                .then(() => {
                    setJobToDelete(null);
                    fetchJobs();
                })
                .catch((err) => {
                    console.error('Error deleting job:', err);
                });
        }
    }

    const handleDeleteCancel = () => {
        setJobToDelete(null);
    }

    const handleAddJob = () => {
        if (newJobName.trim() === '') {
            setErrorMessage('Tên công việc không được phép để trống');
            return;
        }

        if (jobs.some(job => job.name.toLowerCase() === newJobName.toLowerCase())) {
            setErrorMessage('Tên công việc không được phép trùng');
            return;
        }

        const newJob: Job = {
            id: jobs.length ? Math.max(...jobs.map(job => job.id)) + 1 : 1,
            name: newJobName,
            status: false
        };

        axios.post('http://localhost:8080/jobs', newJob)
            .then(() => {
                fetchJobs();
                setNewJobName('');
                setErrorMessage('');
            })
            .catch((err) => {
                console.error('Error adding job:', err);
            });
    }

    const handleCheckboxChange = (job: Job) => {
        const updatedJobs = jobs.map(item => {
            if (item.id === job.id) {
                return {
                    ...item,
                    status: !item.status
                };
            }
            return item;
        });

        setJobs(updatedJobs);
    }

    const handleEditClick = (job: Job) => {
        setJobToEdit(job);
    }

    const handleEditCancel = () => {
        setJobToEdit(null);
    }

    const handleEditConfirm = (newName: string) => {
        if (newName.trim() === '') {
            setErrorMessage('Tên công việc không được phép để trống');
            return;
        }

        if (jobs.some(job => job.name.toLowerCase() === newName.toLowerCase())) {
            setErrorMessage('Tên công việc không được phép trùng');
            return;
        }

        if (jobToEdit) {
            const updatedJob: Job = {
                ...jobToEdit,
                name: newName
            };

            axios.put(`http://localhost:8080/jobs/${jobToEdit.id}`, updatedJob)
                .then(() => {
                    setJobToEdit(null);
                    fetchJobs();
                    setErrorMessage('');
                })
                .catch((err) => {
                    console.error('Error updating job:', err);
                });
        }
    }

    const handleFilterChange = (criteria: string) => {
        setFilterCriteria(criteria);
    }

    const filteredJobs = jobs.filter(job => {
        if (filterCriteria === 'completed') {
            return job.status === true;
        } else if (filterCriteria === 'inProgress') {
            return job.status === false;
        }
        return true; 
    });

    const handleCompletionModalClose = () => {
        console.log('Close completion modal');
    }

    const handleDeleteCompletedJobs = () => {
        const completedJobIds = jobs.filter(job => job.status === true).map(job => job.id);

        if (completedJobIds.length > 0) {
            axios.delete(`http://localhost:8080/jobs/${completedJobIds.join(',')}`)
                .then(() => {
                    fetchJobs();
                })
                .catch((err) => {
                    console.error('Error deleting completed jobs:', err);
                });
        }
    }

    const handleDeleteAllJobs = () => {
        axios.delete('http://localhost:8080/jobs')
            .then(() => {
                fetchJobs();
            })
            .catch((err) => {
                console.error('Error deleting all jobs:', err);
            });
    }

    const completedJobs = jobs.filter(job => job.status === true);

    return (
        <div>
            {loading ? (
                <div className='loading'>Đang tải dữ liệu...</div>
            ) : (
                <div>
                    <div className='h3'>Quản lý công việc</div>
                    <div className='update-job'>
                        <input
                            className='update-job-input'
                            type="text"
                            placeholder='Nhập tên công việc'
                            value={newJobName}
                            onChange={(e) => setNewJobName(e.target.value)}
                        /><br />
                        {errorMessage && <div className='error-message'>{errorMessage}</div>}
                        <button className='update-job-button' onClick={handleAddJob}>Thêm công việc</button>
                    </div>
                    <div className='list-check'>
                        <button className={`list-check-child ${filterCriteria === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>Tất cả</button>
                        <button className={`list-check-child ${filterCriteria === 'completed' ? 'active' : ''}`} onClick={() => handleFilterChange('completed')}>Hoàn thành</button>
                        <button className={`list-check-child ${filterCriteria === 'inProgress' ? 'active' : ''}`} onClick={() => handleFilterChange('inProgress')}>Đang thực hiện</button>
                    </div>
                    <div className='all-job'>
                        {filteredJobs.map((item) => (
                            <div className='job' key={item.id}>
                                <div className='job-child'>
                                    <input
                                        className='job-checkbox'
                                        type="checkbox"
                                        checked={item.status}
                                        onChange={() => handleCheckboxChange(item)}
                                    />
                                    <p style={{ textDecoration: item.status ? 'line-through' : 'none' }}>{item.name}</p>
                                </div>
                                <div className='job-child'>
                                    <i className="fa-solid fa-pen" onClick={() => handleEditClick(item)}></i>
                                    <i className="fa-solid fa-trash" onClick={() => handleDeleteClick(item)}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='delete-job'>
                        <button className='delete-job-child delete-job-complete' onClick={handleDeleteCompletedJobs}>Xóa công việc hoàn thành</button>
                        <button className='delete-job-child delete-job-all' onClick={handleDeleteAllJobs}>Xóa tất cả công việc</button>
                    </div>
                </div>
            )}
            <DeleteJob
                jobId={jobToDelete ? jobToDelete.id : null}
                jobName={jobToDelete ? jobToDelete.name : ''}
                onDelete={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
            {jobToEdit && (
                <EditJobModal
                    newName={jobToEdit.name}
                    onChangeName={handleEditConfirm}
                    onCancel={handleEditCancel}
                    onUpdate={handleEditConfirm} 
                />
            )}
            {completedJobs.length === jobs.length && (
                <CompletionModal onClose={handleCompletionModalClose} />
            )}
        </div>
    );
}

export default Home;
