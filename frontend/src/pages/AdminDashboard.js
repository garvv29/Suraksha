import React, { useState, useEffect } from 'react';
import { professionalAPI, traineeAPI } from '../api';

const AdminDashboard = ({ user }) => {
  const [professionals, setProfessionals] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [showEditTrainee, setShowEditTrainee] = useState(false);
  const [showEditProfessional, setShowEditProfessional] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [editingProfessional, setEditingProfessional] = useState(null);

  // Form data
  const [professionalForm, setProfessionalForm] = useState({
    name: '',
    username: '',
    mobile_number: '',
    designation: '',
    department: '',
    specialization: '',
    experience_years: '',
  });

  const [traineeForm, setTraineeForm] = useState({
    name: '',
    mobile_number: '',
    department: '',
    location: '',
    training_date: '',
    cpr_training: false,
    first_aid_kit_given: false,
    life_saving_skills: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profResponse, traineeResponse] = await Promise.all([
        professionalAPI.getAll(),
        traineeAPI.getAll(user.id, user.role),
      ]);

      if (profResponse.data.success) {
        setProfessionals(profResponse.data.professionals);
      }
      if (traineeResponse.data.success) {
        setTrainees(traineeResponse.data.trainees);
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessional = async (e) => {
    e.preventDefault();
    try {
      const response = await professionalAPI.register(professionalForm);
      if (response.data.success) {
        setSuccess('Professional added successfully!');
        setProfessionalForm({ 
          name: '', 
          username: '', 
          mobile_number: '', 
          designation: '', 
          department: '', 
          specialization: '', 
          experience_years: '', 
        });
        setShowAddProfessional(false);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add professional');
    }
  };

  const handleEditTrainee = (trainee) => {
    setEditingTrainee(trainee);
    setTraineeForm({
      name: trainee.name,
      mobile_number: trainee.mobile_number,
      department: trainee.department,
      location: trainee.location,
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
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update trainee');
    }
  };

  const handleUpdateProfessional = async (e) => {
    e.preventDefault();
    try {
      const response = await professionalAPI.update(editingProfessional.id, professionalForm);
      if (response.data.success) {
        setSuccess('Medical professional updated successfully!');
        setShowEditProfessional(false);
        setEditingProfessional(null);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update professional');
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

  const handleEditProfessional = (professional) => {
    setEditingProfessional(professional);
    setProfessionalForm({
      name: professional.name,
      username: professional.username,
      mobile_number: professional.mobile_number,
      designation: professional.designation || '',
      department: professional.department || '',
      specialization: professional.specialization || '',
      experience_years: professional.experience_years || '',
    });
    setShowEditProfessional(true);
  };

  const handleDeleteProfessional = async (professionalId) => {
    if (window.confirm('Are you sure you want to delete this medical professional?')) {
      try {
        const response = await professionalAPI.delete(professionalId);
        if (response.data.success) {
          setSuccess('Medical professional deleted successfully!');
          fetchData();
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete professional');
      }
    }
  };

  const closeModal = () => {
    setShowAddProfessional(false);
    setShowEditTrainee(false);
    setShowEditProfessional(false);
    setEditingTrainee(null);
    setEditingProfessional(null);
    setProfessionalForm({ 
      name: '', 
      username: '', 
      mobile_number: '', 
      designation: '', 
      department: '', 
      specialization: '', 
      experience_years: '', 
    });
    setTraineeForm({
      name: '',
      mobile_number: '',
      department: '',
      location: '',
      training_date: '',
      cpr_training: false,
      first_aid_kit_given: false,
      life_saving_skills: false,
    });
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && (
        <div className="alert alert-error fade-in">
          {error}
          <button onClick={clearMessages} style={{ float: 'right', background: 'none', border: 'none' }}>×</button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success fade-in">
          {success}
          <button onClick={clearMessages} style={{ float: 'right', background: 'none', border: 'none' }}>×</button>
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">👨‍⚕️ {professionals.length}</div>
          <div className="stat-label">Medical Professionals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🎓 {trainees.length}</div>
          <div className="stat-label">Total Trainees</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🫀 {trainees.filter(t => t.cpr_training === 1).length}</div>
          <div className="stat-label">CPR Trained</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'professionals' ? 'active' : ''}`}
            onClick={() => setActiveTab('professionals')}
          >
            👨‍⚕️ Medical Professionals
          </button>
          <button
            className={`nav-tab ${activeTab === 'trainees' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainees')}
          >
            🎓 All Trainees
          </button>
        </div>

        {/* Medical Professionals Tab */}
        {activeTab === 'professionals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="card-title">👨‍⚕️ Medical Professionals</h2>
              <button
                className="btn btn-success"
                onClick={() => setShowAddProfessional(true)}
              >
                ➕ Add New Professional
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>👤 ID</th>
                    <th>👨‍⚕️ Doctor Name</th>
                    <th>🔑 Username</th>
                    <th>📱 Mobile Number</th>
                    <th>🏷️ Designation</th>
                    <th>🏢 Department</th>
                    <th>📅 Joined Date</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {professionals.map((prof) => (
                    <tr key={prof.id}>
                      <td>{prof.id}</td>
                      <td>{prof.name}</td>
                      <td>{prof.username}</td>
                      <td>{prof.mobile_number}</td>
                      <td>{prof.designation || 'N/A'}</td>
                      <td>{prof.department || 'N/A'}</td>
                      <td>{new Date(prof.created_at).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn-primary btn-small"
                            onClick={() => {
                              console.log('Edit clicked for:', prof);
                              handleEditProfessional(prof);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => {
                              console.log('Delete clicked for:', prof.id);
                              handleDeleteProfessional(prof.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Trainees Tab */}
        {activeTab === 'trainees' && (
          <div>
            <h2 className="card-title">🎓 All Trainees</h2>
            <div className="table-container">
              <table className="table trainees-table">
                <thead>
                  <tr>
                    <th>👤 Trainee Name</th>
                    <th>📱 Mobile Number</th>
                    <th>🏢 Department</th>
                    <th>📍 Location</th>
                    <th>📅 Training Date</th>
                    <th>🫀 CPR Training</th>
                    <th>🩹 First Aid Kit</th>
                    <th>⚕️ Life Saving Skills</th>
                    <th>👨‍⚕️ Registered By</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainees.map((trainee) => (
                    <tr key={trainee.id}>
                      <td>{trainee.name}</td>
                      <td>{trainee.mobile_number}</td>
                      <td>{trainee.department}</td>
                      <td>{trainee.location}</td>
                      <td>{trainee.training_date}</td>
                      <td>{trainee.cpr_training ? '✅' : '❌'}</td>
                      <td>{trainee.first_aid_kit_given ? '✅' : '❌'}</td>
                      <td>{trainee.life_saving_skills ? '✅' : '❌'}</td>
                      <td>{trainee.registered_by_name}</td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleEditTrainee(trainee)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDeleteTrainee(trainee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="card-title">📊 System Overview</h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>🏥 Welcome to the <strong className="gradient-text">Suraksha Medical Training Management System</strong>.</p>
              <p>💡 Use the tabs above to manage medical professionals and view all trainees in the system.</p>
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                <strong>🎯 Key Features:</strong>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>👥 Comprehensive user management</li>
                  <li>📋 Training progress tracking</li>
                  <li>📊 Real-time statistics</li>
                  <li>🔒 Role-based access control</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Professional Modal */}
      {showAddProfessional && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Medical Professional</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleAddProfessional}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.name}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.username}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    username: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number (Will be used as password)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={professionalForm.mobile_number}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    mobile_number: e.target.value
                  })}
                  required
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.designation}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    designation: e.target.value
                  })}
                  placeholder="e.g., Senior Consultant, Associate Professor"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={professionalForm.department}
                    onChange={(e) => setProfessionalForm({
                      ...professionalForm,
                      department: e.target.value
                    })}
                    placeholder="e.g., Cardiology, Emergency Medicine"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={professionalForm.specialization}
                    onChange={(e) => setProfessionalForm({
                      ...professionalForm,
                      specialization: e.target.value
                    })}
                    placeholder="e.g., Interventional Cardiology"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={professionalForm.experience_years}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    experience_years: e.target.value
                  })}
                  min="0"
                  max="50"
                  placeholder="0"
                />
              </div>
              
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Add Professional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Professional Modal */}
      {showEditProfessional && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Medical Professional</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleUpdateProfessional}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.name}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.username}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    username: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={professionalForm.mobile_number}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    mobile_number: e.target.value
                  })}
                  required
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.designation}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    designation: e.target.value
                  })}
                  placeholder="e.g., Senior Consultant, Associate Professor"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.department}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    department: e.target.value
                  })}
                  placeholder="e.g., Cardiology, Emergency Medicine"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  value={professionalForm.specialization}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    specialization: e.target.value
                  })}
                  placeholder="e.g., Interventional Cardiology"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Experience (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={professionalForm.experience_years}
                  onChange={(e) => setProfessionalForm({
                    ...professionalForm,
                    experience_years: e.target.value
                  })}
                  min="0"
                  max="50"
                  placeholder="0"
                />
              </div>
              
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Update Professional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trainee Modal */}
      {showEditTrainee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Trainee</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleUpdateTrainee}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.name}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={traineeForm.mobile_number}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    mobile_number: e.target.value
                  })}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.department}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    department: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.location}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    location: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Training Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={traineeForm.training_date}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    training_date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Training Status</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="cpr_training"
                      checked={traineeForm.cpr_training}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        cpr_training: e.target.checked
                      })}
                    />
                    <label htmlFor="cpr_training">CPR Training</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="first_aid_kit_given"
                      checked={traineeForm.first_aid_kit_given}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        first_aid_kit_given: e.target.checked
                      })}
                    />
                    <label htmlFor="first_aid_kit_given">First Aid Kit Given</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="life_saving_skills"
                      checked={traineeForm.life_saving_skills}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        life_saving_skills: e.target.checked
                      })}
                    />
                    <label htmlFor="life_saving_skills">Life Saving Skills</label>
                  </div>
                </div>
              </div>
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
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

export default AdminDashboard;
