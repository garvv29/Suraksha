import React, { useState, useEffect } from 'react';
import { traineeAPI, trainingAPI } from '../api';

const ProfessionalDashboard = ({ user }) => {
  const [trainees, setTrainees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
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
        <div className="spinner-modern"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Professional Profile Header */}
      <div className="profile-header-modern">
        <div className="profile-avatar-large">
          <span>👨‍⚕️</span>
        </div>
        <div className="profile-content">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-meta">
            {user.designation && <span className="profile-badge primary">{user.designation}</span>}
            {user.department && <span className="profile-badge secondary">{user.department}</span>}
            {user.gender && <span className="profile-badge outline">{user.gender}</span>}
            {user.age && <span className="profile-badge outline">{user.age} years</span>}
          </div>
          {user.specialization && (
            <div className="profile-detail">
              <strong>Specialization:</strong> {user.specialization}
            </div>
          )}
          {user.experience_years && (
            <div className="profile-detail">
              <strong>Experience:</strong> {user.experience_years} years
            </div>
          )}
        </div>
        <div className="profile-stats">
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
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'trainees' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainees')}
        >
          👥 My Trainees
        </button>
        <button
          className={`tab-button ${activeTab === 'trainings' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainings')}
        >
          🎓 Training Sessions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="stats-overview">
            <div className="stat-card primary">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.length}</div>
                <div className="stat-label">Total Trainees</div>
                <div className="stat-description">Registered under your supervision</div>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon">🫀</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.cpr_training === 1).length}</div>
                <div className="stat-label">CPR Trained</div>
                <div className="stat-description">Completed CPR certification</div>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">🩹</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.first_aid_kit_given === 1).length}</div>
                <div className="stat-label">First Aid Kits Given</div>
                <div className="stat-description">Received first aid equipment</div>
              </div>
            </div>
            
            <div className="stat-card info">
              <div className="stat-icon">⚕️</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.life_saving_skills === 1).length}</div>
                <div className="stat-label">Life Saving Skills</div>
                <div className="stat-description">Advanced life support training</div>
              </div>
            </div>
            
            <div className="stat-card secondary">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-number">{trainings.length}</div>
                <div className="stat-label">Training Sessions</div>
                <div className="stat-description">Conducted by you</div>
              </div>
            </div>
            
            <div className="stat-card accent">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <div className="stat-number">{[...new Set(trainees.map(t => t.block).filter(Boolean))].length}</div>
                <div className="stat-label">Blocks Covered</div>
                <div className="stat-description">Geographic reach</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trainees' && (
        <div className="tab-content">
          <div className="content-header">
            <h2 className="content-title">
              <span className="content-icon">👥</span>
              My Trainees
            </h2>
            <button className="btn btn-primary" onClick={() => setShowAddTrainee(true)}>
              <span>+</span> Add New Trainee
            </button>
          </div>
          
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or mobile number..."
                value={searchTrainee}
                onChange={(e) => setSearchTrainee(e.target.value)}
              />
            </div>
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

          <div className="results-summary">
            Showing {filteredTrainees.length} of {trainees.length} trainees
          </div>

          {filteredTrainees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No trainees found</h3>
              <p>Try adjusting your search criteria or add a new trainee.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredTrainees.map(trainee => (
                <div key={trainee.id} className="content-card" onClick={() => setDetailTrainee(trainee)}>
                  <div className="card-header">
                    <h3 className="card-title">{trainee.name}</h3>
                    <div className="card-badges">
                      {trainee.gender && <span className="badge outline">{trainee.gender}</span>}
                      {trainee.age && <span className="badge outline">{trainee.age}y</span>}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-field">
                      <span className="field-label">Department:</span>
                      <span className="field-value">{trainee.department}</span>
                    </div>
                    {trainee.designation && (
                      <div className="card-field">
                        <span className="field-label">Position:</span>
                        <span className="field-value">{trainee.designation}</span>
                      </div>
                    )}
                    <div className="card-field">
                      <span className="field-label">Location:</span>
                      <span className="field-value">{trainee.address || trainee.location}, {trainee.block}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">Mobile:</span>
                      <span className="field-value">{trainee.mobile_number}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="training-status">
                      {trainee.cpr_training === 1 && <span className="status-badge success">CPR</span>}
                      {trainee.first_aid_kit_given === 1 && <span className="status-badge warning">First Aid</span>}
                      {trainee.life_saving_skills === 1 && <span className="status-badge info">Life Skills</span>}
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
          <div className="content-header">
            <h2 className="content-title">
              <span className="content-icon">🎓</span>
              Training Sessions
            </h2>
          </div>
          
          {trainings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No training sessions found</h3>
              <p>Training sessions you conduct will appear here.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {trainings.map(training => (
                <div key={training.id} className="content-card">
                  <div className="card-header">
                    <h3 className="card-title">{training.title}</h3>
                    <span className="badge primary">{training.training_topic}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-field">
                      <span className="field-label">📅 Date:</span>
                      <span className="field-value">{new Date(training.training_date).toLocaleDateString()}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">🕐 Time:</span>
                      <span className="field-value">{training.training_time}</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">⏱️ Duration:</span>
                      <span className="field-value">{training.duration_hours} hours</span>
                    </div>
                    <div className="card-field">
                      <span className="field-label">📍 Location:</span>
                      <span className="field-value">{training.address}, {training.block}</span>
                    </div>
                    {training.description && (
                      <div className="card-field">
                        <span className="field-label">📝 Description:</span>
                        <span className="field-value">{training.description}</span>
                      </div>
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
              <button className="btn btn-primary" onClick={() => { handleEditTrainee(detailTrainee); setDetailTrainee(null); }}>
                Edit Trainee
              </button>
              <button className="btn btn-danger" onClick={() => { handleDeleteTrainee(detailTrainee.id); setDetailTrainee(null); }}>
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
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
