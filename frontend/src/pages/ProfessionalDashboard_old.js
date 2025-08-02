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
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);

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

  const [trainingForm, setTrainingForm] = useState({
    title: '',
    address: '',
    block: '',
    date: '',
    time: '',
    duration: '',
    topic: '',
    trainee_count: '',
    description: ''
  });

  const blocks = ['Bastar', 'Bilaspur', 'Durg', 'Raigarh', 'Raipur', 'Surguja'];

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
        setTrainings(trainingsResponse.data.trainings.filter(t => t.professional_id === user.id));
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

  const handleAddTraining = async (e) => {
    e.preventDefault();
    try {
      const response = await trainingAPI.create({
        ...trainingForm,
        professional_id: user.id,
      });
      if (response.data.success) {
        setSuccess('Training session created successfully!');
        resetTrainingForm();
        setShowAddTraining(false);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create training session');
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

  const resetTrainingForm = () => {
    setTrainingForm({
      title: '',
      address: '',
      block: '',
      date: '',
      time: '',
      duration: '',
      topic: '',
      trainee_count: '',
      description: ''
    });
  };

  const closeModal = () => {
    setShowAddTrainee(false);
    setShowEditTrainee(false);
    setShowAddTraining(false);
    setEditingTrainee(null);
    resetTraineeForm();
    resetTrainingForm();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Filter states
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [detailTrainee, setDetailTrainee] = useState(null);

  const filteredTrainees = trainees.filter(function(t) {
    var name = t.name || '';
    var mobile = t.mobile_number || '';
    var matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || mobile.includes(search);
    var matchesDept = !filterDept || t.department === filterDept;
    var matchesBlock = !filterBlock || t.block === filterBlock;
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
        <div className="profile-info-modern">
          <div className="profile-avatar-modern">
            <span>👨‍⚕️</span>
          </div>
          <div className="profile-details-modern">
            <h1>{user.name}</h1>
            <div className="profile-meta-modern">
              {user.designation && <span className="badge badge-primary">{user.designation}</span>}
              {user.department && <span className="badge badge-secondary">{user.department}</span>}
              {user.gender && <span className="badge badge-outline">{user.gender}</span>}
              {user.age && <span className="badge badge-outline">{user.age} years</span>}
            </div>
            {user.specialization && (
              <p className="profile-specialization-modern">
                <strong>Specialization:</strong> {user.specialization}
              </p>
            )}
            {user.experience_years && (
              <p className="profile-experience-modern">
                <strong>Experience:</strong> {user.experience_years} years
              </p>
            )}
            {user.address && (
              <p className="profile-address-modern">
                <strong>Address:</strong> {user.address}
                {user.block && <span>, {user.block} Block</span>}
              </p>
            )}
          </div>
        </div>
        <div className="profile-quick-stats">
          <div className="quick-stat-modern">
            <span className="stat-value">{trainees.length}</span>
            <span className="stat-label">Total Trainees</span>
          </div>
          <div className="quick-stat-modern">
            <span className="stat-value">{trainings.length}</span>
            <span className="stat-label">Training Sessions</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error fade-in">
          <span>{error}</span>
          <button onClick={clearMessages} className="alert-close">×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success fade-in">
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
          <div className="stats-grid">
            <div className="stat-card-modern primary">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.length}</div>
                <div className="stat-label">Total Trainees</div>
              </div>
            </div>
            <div className="stat-card-modern success">
              <div className="stat-icon">🫀</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.cpr_training === 1).length}</div>
                <div className="stat-label">CPR Trained</div>
              </div>
            </div>
            <div className="stat-card-modern warning">
              <div className="stat-icon">🩹</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.first_aid_kit_given === 1).length}</div>
                <div className="stat-label">First Aid Kits Given</div>
              </div>
            </div>
            <div className="stat-card-modern info">
              <div className="stat-icon">⚕️</div>
              <div className="stat-content">
                <div className="stat-number">{trainees.filter(t => t.life_saving_skills === 1).length}</div>
                <div className="stat-label">Life Saving Skills</div>
              </div>
            </div>
            <div className="stat-card-modern secondary">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <div className="stat-number">{trainings.length}</div>
                <div className="stat-label">Training Sessions</div>
              </div>
            </div>
            <div className="stat-card-modern accent">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-number">{trainings.reduce((sum, t) => sum + (parseInt(t.trainee_count) || 0), 0)}</div>
                <div className="stat-label">Total Attendees</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trainees' && (
        <div className="tab-content">
          <div className="section-header">
            <h2 className="section-title">My Trainees</h2>
            <button className="btn btn-primary" onClick={() => setShowAddTrainee(true)}>
              <span>+</span> Add New Trainee
            </button>
          </div>
          
          <div className="filters-section">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or mobile number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {[...new Set(trainees.map(t => t.department).filter(Boolean))].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
            >
              <option value="">All Blocks</option>
              {blocks.map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>

          <div className="results-info">
            <span>Showing {filteredTrainees.length} of {trainees.length} trainees</span>
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
                <div key={trainee.id} className="trainee-card-modern" onClick={() => setDetailTrainee(trainee)}>
                  <div className="card-header">
                    <h3>{trainee.name}</h3>
                    <div className="card-badges">
                      {trainee.gender && <span className="badge badge-sm badge-outline">{trainee.gender}</span>}
                      {trainee.age && <span className="badge badge-sm badge-outline">{trainee.age}y</span>}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-field">
                      <strong>Department:</strong> {trainee.department}
                    </div>
                    {trainee.designation && (
                      <div className="card-field">
                        <strong>Position:</strong> {trainee.designation}
                      </div>
                    )}
                    <div className="card-field">
                      <strong>Location:</strong> {trainee.address || trainee.location}
                      {trainee.block && <span>, {trainee.block}</span>}
                    </div>
                    <div className="card-field">
                      <strong>Mobile:</strong> {trainee.mobile_number}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="training-badges">
                      {trainee.cpr_training === 1 && <span className="badge badge-success">CPR</span>}
                      {trainee.first_aid_kit_given === 1 && <span className="badge badge-warning">First Aid</span>}
                      {trainee.life_saving_skills === 1 && <span className="badge badge-info">Life Skills</span>}
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
          <div className="section-header">
            <h2 className="section-title">Training Sessions</h2>
            <button className="btn btn-primary" onClick={() => setShowAddTraining(true)}>
              <span>+</span> Create Training Session
            </button>
          </div>
          
          {trainings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No training sessions yet</h3>
              <p>Create your first training session to get started.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {trainings.map(training => (
                <div key={training.id} className="training-card-modern">
                  <div className="card-header">
                    <h3>{training.title}</h3>
                    <span className="badge badge-primary">{training.topic}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-field">
                      <strong>📅 Date:</strong> {new Date(training.date).toLocaleDateString()}
                    </div>
                    <div className="card-field">
                      <strong>🕐 Time:</strong> {training.time}
                    </div>
                    <div className="card-field">
                      <strong>⏱️ Duration:</strong> {training.duration}
                    </div>
                    <div className="card-field">
                      <strong>📍 Location:</strong> {training.address}, {training.block}
                    </div>
                    <div className="card-field">
                      <strong>👥 Attendees:</strong> {training.trainee_count}
                    </div>
                    {training.description && (
                      <div className="card-field">
                        <strong>📝 Description:</strong> {training.description}
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
          <div className="modal-content-modern">
            <div className="modal-header-modern">
              <h3>{detailTrainee.name} - Trainee Details</h3>
              <button className="modal-close-btn" onClick={() => setDetailTrainee(null)}>×</button>
            </div>
            <div className="modal-body-modern">
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
              <div className="training-status">
                <h4>Training Status</h4>
                <div className="status-badges">
                  <span className={`badge ${detailTrainee.cpr_training ? 'badge-success' : 'badge-gray'}`}>
                    CPR Training {detailTrainee.cpr_training ? '✓' : '✗'}
                  </span>
                  <span className={`badge ${detailTrainee.first_aid_kit_given ? 'badge-success' : 'badge-gray'}`}>
                    First Aid Kit {detailTrainee.first_aid_kit_given ? '✓' : '✗'}
                  </span>
                  <span className={`badge ${detailTrainee.life_saving_skills ? 'badge-success' : 'badge-gray'}`}>
                    Life Saving Skills {detailTrainee.life_saving_skills ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer-modern">
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
          <div className="modal-content-modern large">
            <div className="modal-header-modern">
              <h3>Add New Trainee</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleAddTrainee}>
              <div className="modal-body-modern">
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
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
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
              
              <div className="modal-footer-modern">
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
          <div className="modal-content-modern large">
            <div className="modal-header-modern">
              <h3>Edit Trainee</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleUpdateTrainee}>
              <div className="modal-body-modern">
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
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
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
              
              <div className="modal-footer-modern">
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

      {/* Add Training Modal */}
      {showAddTraining && (
        <div className="modal-overlay">
          <div className="modal-content-modern">
            <div className="modal-header-modern">
              <h3>Create Training Session</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleAddTraining}>
              <div className="modal-body-modern">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Training Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={trainingForm.title}
                      onChange={(e) => setTrainingForm({...trainingForm, title: e.target.value})}
                      required
                      placeholder="e.g., Basic CPR Training"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Training Topic *</label>
                    <select
                      className="form-select"
                      value={trainingForm.topic}
                      onChange={(e) => setTrainingForm({...trainingForm, topic: e.target.value})}
                      required
                    >
                      <option value="">Select Topic</option>
                      <option value="CPR Training">CPR Training</option>
                      <option value="First Aid">First Aid</option>
                      <option value="Life Saving Skills">Life Saving Skills</option>
                      <option value="Emergency Response">Emergency Response</option>
                      <option value="Basic Life Support">Basic Life Support</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={trainingForm.date}
                      onChange={(e) => setTrainingForm({...trainingForm, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <input
                      type="time"
                      className="form-input"
                      value={trainingForm.time}
                      onChange={(e) => setTrainingForm({...trainingForm, time: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={trainingForm.duration}
                      onChange={(e) => setTrainingForm({...trainingForm, duration: e.target.value})}
                      placeholder="e.g., 2 hours, 3-4 hours"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Trainees</label>
                    <input
                      type="number"
                      className="form-input"
                      value={trainingForm.trainee_count}
                      onChange={(e) => setTrainingForm({...trainingForm, trainee_count: e.target.value})}
                      min="1"
                      placeholder="Expected number of attendees"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-textarea"
                      value={trainingForm.address}
                      onChange={(e) => setTrainingForm({...trainingForm, address: e.target.value})}
                      required
                      placeholder="Training venue address"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Block *</label>
                    <select
                      className="form-select"
                      value={trainingForm.block}
                      onChange={(e) => setTrainingForm({...trainingForm, block: e.target.value})}
                      required
                    >
                      <option value="">Select Block</option>
                      {blocks.map(block => (
                        <option key={block} value={block}>{block}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={trainingForm.description}
                      onChange={(e) => setTrainingForm({...trainingForm, description: e.target.value})}
                      placeholder="Additional details about the training session"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer-modern">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Training
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
