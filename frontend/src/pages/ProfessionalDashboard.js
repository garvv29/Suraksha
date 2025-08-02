import React, { useState, useEffect } from 'react';
import { traineeAPI, trainingAPI } from '../api';
import '../App.css';

const ProfessionalDashboard = ({ user }) => {
  const [trainees, setTrainees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('trainees');
  
  // Modal states
  const [showAddTrainee, setShowAddTrainee] = useState(false);
  const [showEditTrainee, setShowEditTrainee] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [detailTrainee, setDetailTrainee] = useState(null);

  // Search/filter states  
  const [searchTrainee, setSearchTrainee] = useState('');
  const [filterTraineeDept, setFilterTraineeDept] = useState('');
  const [filterTraineeBlock, setFilterTraineeBlock] = useState('');

  // Form data
  const [traineeForm, setTraineeForm] = useState({
    name: '',
    mobile_number: '',
    gender: '',
    age: '',
    department: '',
    designation: '',
    address: '',
    block: '',
    training_date: '',
    cpr_training: false,
    first_aid_kit_given: false,
    life_saving_skills: false,
  });

  const blocks = ['Raipur', 'Birgaon', 'Abhanpur', 'Arang', 'Dhariswa', 'Tilda'];
  const genderOptions = ['Male', 'Female', 'Other'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [traineesResponse, trainingsResponse] = await Promise.all([
        traineeAPI.getAll(user.id, user.role),
        trainingAPI.getAll()
      ]);
      
      if (traineesResponse.data.success) {
        setTrainees(traineesResponse.data.trainees);
      }
      if (trainingsResponse.data.success) {
        setTrainings(trainingsResponse.data.trainings.filter(t => t.conducted_by === user.id));
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrainee = async (e) => {
    e.preventDefault();
    try {
      const response = await traineeAPI.register({
        ...traineeForm,
        registered_by: user.id,
      });
      if (response.data.success) {
        setSuccess('Trainee registered successfully!');
        resetTraineeForm();
        setShowAddTrainee(false);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register trainee');
    }
  };

  const handleEditTrainee = (trainee) => {
    setEditingTrainee(trainee);
    setTraineeForm({
      name: trainee.name,
      mobile_number: trainee.mobile_number,
      gender: trainee.gender || '',
      age: trainee.age || '',
      department: trainee.department,
      designation: trainee.designation || '',
      address: trainee.address || trainee.location || '',
      block: trainee.block || '',
      training_date: trainee.training_date,
      cpr_training: trainee.cpr_training === 1,
      first_aid_kit_given: trainee.first_aid_kit_given === 1,
      life_saving_skills: trainee.life_saving_skills === 1,
    });
    setShowEditTrainee(true);
  };

  const handleUpdateTrainee = async (e) => {
    e.preventDefault();
    try {
      const response = await traineeAPI.update(editingTrainee.id, traineeForm);
      if (response.data.success) {
        setSuccess('Trainee updated successfully!');
        setShowEditTrainee(false);
        setEditingTrainee(null);
        resetTraineeForm();
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update trainee');
    }
  };

  const handleDeleteTrainee = async (traineeId) => {
    if (window.confirm('Are you sure you want to delete this trainee?')) {
      try {
        const response = await traineeAPI.delete(traineeId);
        if (response.data.success) {
          setSuccess('Trainee deleted successfully!');
          fetchData();
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete trainee');
      }
    }
  };

  const resetTraineeForm = () => {
    setTraineeForm({
      name: '',
      mobile_number: '',
      gender: '',
      age: '',
      department: '',
      designation: '',
      address: '',
      block: '',
      training_date: '',
      cpr_training: false,
      first_aid_kit_given: false,
      life_saving_skills: false,
    });
  };

  const closeModal = () => {
    setShowAddTrainee(false);
    setShowEditTrainee(false);
    setEditingTrainee(null);
    resetTraineeForm();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Filter trainees
  const filteredTrainees = trainees.filter(function(t) {
    var name = t.name || '';
    var mobile = t.mobile_number || '';
    var matchesSearch = name.toLowerCase().includes(searchTrainee.toLowerCase()) || mobile.includes(searchTrainee);
    var matchesDept = !filterTraineeDept || t.department === filterTraineeDept;
    var matchesBlock = !filterTraineeBlock || t.block === filterTraineeBlock;
    return matchesSearch && matchesDept && matchesBlock;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-profile">
          <div className="profile-avatar">
            <span>{user.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <div className="profile-badges">
              {user.designation && <span className="profile-badge">{user.designation}</span>}
              {user.department && <span className="profile-badge">{user.department}</span>}
            </div>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-number">{trainees.length}</div>
            <div className="stat-label">Total Trainees</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{trainings.length}</div>
            <div className="stat-label">Training Sessions</div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert error">
          <span>{error}</span>
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}
      
      {success && (
        <div className="alert success">
          <span>{success}</span>
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'trainees' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainees')}
        >
          My Trainees
        </button>
        <button
          className={`tab-button ${activeTab === 'trainings' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainings')}
        >
          Training Sessions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'trainees' && (
        <div className="tab-content">
          <div className="data-header">
            <h2>My Trainees</h2>
            <button className="btn primary" onClick={() => setShowAddTrainee(true)}>
              + Add Trainee
            </button>
          </div>
          
          <div className="data-controls">
            <div className="search-controls">
              <input
                type="text"
                className="search-input"
                placeholder="Search trainees..."
                value={searchTrainee}
                onChange={(e) => setSearchTrainee(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterTraineeDept}
                onChange={(e) => setFilterTraineeDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {[...new Set(trainees.map(t => t.department).filter(Boolean))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={filterTraineeBlock}
                onChange={(e) => setFilterTraineeBlock(e.target.value)}
              >
                <option value="">All Blocks</option>
                {blocks.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="data-summary">
            Showing {filteredTrainees.length} of {trainees.length} trainees
          </div>

          {filteredTrainees.length === 0 ? (
            <div className="empty-state">
              <h3>No trainees found</h3>
              <p>Try adjusting your search criteria or add a new trainee.</p>
            </div>
          ) : (
            <div className="data-grid">
              {filteredTrainees.map(trainee => (
                <div key={trainee.id} className="data-card" onClick={() => setDetailTrainee(trainee)}>
                  <div className="data-card-title">{trainee.name}</div>
                  <div className="data-card-content">
                    <p><strong>Department:</strong> {trainee.department}</p>
                    {trainee.designation && <p><strong>Position:</strong> {trainee.designation}</p>}
                    <p><strong>Location:</strong> {trainee.address || trainee.location}, {trainee.block}</p>
                    <p><strong>Mobile:</strong> {trainee.mobile_number}</p>
                    <p><strong>Gender:</strong> {trainee.gender}, <strong>Age:</strong> {trainee.age}</p>
                  </div>
                  <div className="data-card-footer">
                    <div className="training-badges">
                      {trainee.cpr_training === 1 && <span className="badge success">CPR</span>}
                      {trainee.first_aid_kit_given === 1 && <span className="badge warning">First Aid</span>}
                      {trainee.life_saving_skills === 1 && <span className="badge info">Life Skills</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'trainings' && (
        <div className="tab-content">
          <div className="data-header">
            <h2>Training Sessions</h2>
          </div>
          
          {trainings.length === 0 ? (
            <div className="empty-state">
              <h3>No training sessions found</h3>
              <p>Training sessions you conduct will appear here.</p>
            </div>
          ) : (
            <div className="data-grid">
              {trainings.map(training => (
                <div key={training.id} className="data-card">
                  <div className="data-card-title">{training.title || training.training_topic}</div>
                  <div className="data-card-content">
                    <p><strong>Date:</strong> {new Date(training.training_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {training.training_time}</p>
                    <p><strong>Duration:</strong> {training.duration_hours} hours</p>
                    <p><strong>Location:</strong> {training.address}, {training.block}</p>
                    {training.description && (
                      <p><strong>Description:</strong> {training.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trainee Detail Modal */}
      {detailTrainee && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">{detailTrainee.name} - Trainee Details</h3>
              <button className="modal-close" onClick={() => setDetailTrainee(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Name:</strong> {detailTrainee.name}
                </div>
                <div className="detail-item">
                  <strong>Mobile:</strong> {detailTrainee.mobile_number}
                </div>
                <div className="detail-item">
                  <strong>Gender:</strong> {detailTrainee.gender || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Age:</strong> {detailTrainee.age || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Department:</strong> {detailTrainee.department}
                </div>
                <div className="detail-item">
                  <strong>Position:</strong> {detailTrainee.designation || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Address:</strong> {detailTrainee.address || detailTrainee.location}
                </div>
                <div className="detail-item">
                  <strong>Block:</strong> {detailTrainee.block || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Training Date:</strong> {detailTrainee.training_date}
                </div>
              </div>
              <div className="training-status-section">
                <h4>Training Status</h4>
                <div className="status-grid">
                  <span className={`status-badge ${detailTrainee.cpr_training ? 'success' : 'gray'}`}>
                    CPR Training {detailTrainee.cpr_training ? '✓' : '✗'}
                  </span>
                  <span className={`status-badge ${detailTrainee.first_aid_kit_given ? 'success' : 'gray'}`}>
                    First Aid Kit {detailTrainee.first_aid_kit_given ? '✓' : '✗'}
                  </span>
                  <span className={`status-badge ${detailTrainee.life_saving_skills ? 'success' : 'gray'}`}>
                    Life Saving Skills {detailTrainee.life_saving_skills ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn primary" onClick={() => { handleEditTrainee(detailTrainee); setDetailTrainee(null); }}>
                Edit Trainee
              </button>
              <button className="btn danger" onClick={() => { handleDeleteTrainee(detailTrainee.id); setDetailTrainee(null); }}>
                Delete Trainee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trainee Modal */}
      {showAddTrainee && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3 className="modal-title">Add New Trainee</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleAddTrainee}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.name}
                      onChange={(e) => setTraineeForm({...traineeForm, name: e.target.value})}
                      required
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={traineeForm.mobile_number}
                      onChange={(e) => setTraineeForm({...traineeForm, mobile_number: e.target.value})}
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={traineeForm.gender}
                      onChange={(e) => setTraineeForm({...traineeForm, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      value={traineeForm.age}
                      onChange={(e) => setTraineeForm({...traineeForm, age: e.target.value})}
                      min="1"
                      max="100"
                      placeholder="Enter age"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.department}
                      onChange={(e) => setTraineeForm({...traineeForm, department: e.target.value})}
                      required
                      placeholder="e.g., Emergency, Surgery, etc."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.designation}
                      onChange={(e) => setTraineeForm({...traineeForm, designation: e.target.value})}
                      placeholder="e.g., Nurse, Ward Boy, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-textarea"
                      value={traineeForm.address}
                      onChange={(e) => setTraineeForm({...traineeForm, address: e.target.value})}
                      required
                      placeholder="Enter complete address"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Block *</label>
                    <select
                      className="form-select"
                      value={traineeForm.block}
                      onChange={(e) => setTraineeForm({...traineeForm, block: e.target.value})}
                      required
                    >
                      <option value="">Select Block</option>
                      {blocks.map(block => (
                        <option key={block} value={block}>{block}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Training Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={traineeForm.training_date}
                      onChange={(e) => setTraineeForm({...traineeForm, training_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Training Completed</label>
                  <div className="checkbox-grid">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="add_cpr_training"
                        checked={traineeForm.cpr_training}
                        onChange={(e) => setTraineeForm({...traineeForm, cpr_training: e.target.checked})}
                      />
                      <label htmlFor="add_cpr_training">CPR Training</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="add_first_aid_kit_given"
                        checked={traineeForm.first_aid_kit_given}
                        onChange={(e) => setTraineeForm({...traineeForm, first_aid_kit_given: e.target.checked})}
                      />
                      <label htmlFor="add_first_aid_kit_given">First Aid Kit Given</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="add_life_saving_skills"
                        checked={traineeForm.life_saving_skills}
                        onChange={(e) => setTraineeForm({...traineeForm, life_saving_skills: e.target.checked})}
                      />
                      <label htmlFor="add_life_saving_skills">Life Saving Skills</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Add Trainee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainee Modal */}
      {showEditTrainee && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3 className="modal-title">Edit Trainee</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleUpdateTrainee}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.name}
                      onChange={(e) => setTraineeForm({...traineeForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={traineeForm.mobile_number}
                      onChange={(e) => setTraineeForm({...traineeForm, mobile_number: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={traineeForm.gender}
                      onChange={(e) => setTraineeForm({...traineeForm, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      value={traineeForm.age}
                      onChange={(e) => setTraineeForm({...traineeForm, age: e.target.value})}
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.department}
                      onChange={(e) => setTraineeForm({...traineeForm, department: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={traineeForm.designation}
                      onChange={(e) => setTraineeForm({...traineeForm, designation: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-textarea"
                      value={traineeForm.address}
                      onChange={(e) => setTraineeForm({...traineeForm, address: e.target.value})}
                      required
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Block *</label>
                    <select
                      className="form-select"
                      value={traineeForm.block}
                      onChange={(e) => setTraineeForm({...traineeForm, block: e.target.value})}
                      required
                    >
                      <option value="">Select Block</option>
                      {blocks.map(block => (
                        <option key={block} value={block}>{block}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Training Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={traineeForm.training_date}
                      onChange={(e) => setTraineeForm({...traineeForm, training_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Training Status</label>
                  <div className="checkbox-grid">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="edit_cpr_training"
                        checked={traineeForm.cpr_training}
                        onChange={(e) => setTraineeForm({...traineeForm, cpr_training: e.target.checked})}
                      />
                      <label htmlFor="edit_cpr_training">CPR Training</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="edit_first_aid_kit_given"
                        checked={traineeForm.first_aid_kit_given}
                        onChange={(e) => setTraineeForm({...traineeForm, first_aid_kit_given: e.target.checked})}
                      />
                      <label htmlFor="edit_first_aid_kit_given">First Aid Kit Given</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="edit_life_saving_skills"
                        checked={traineeForm.life_saving_skills}
                        onChange={(e) => setTraineeForm({...traineeForm, life_saving_skills: e.target.checked})}
                      />
                      <label htmlFor="edit_life_saving_skills">Life Saving Skills</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Update Trainee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
