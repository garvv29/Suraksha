import React, { useState, useEffect } from 'react';
import { traineeAPI } from '../api';

const ProfessionalDashboard = ({ user }) => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddTrainee, setShowAddTrainee] = useState(false);
  const [showEditTrainee, setShowEditTrainee] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);

  // Form data
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
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    setLoading(true);
    try {
      const response = await traineeAPI.getAll(user.id, user.role);
      if (response.data.success) {
        setTrainees(response.data.trainees);
      }
    } catch (error) {
      setError('Failed to fetch trainees');
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
        resetForm();
        setShowAddTrainee(false);
        fetchTrainees();
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
        resetForm();
        fetchTrainees();
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
          fetchTrainees();
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete trainee');
      }
    }
  };

  const resetForm = () => {
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

  const closeModal = () => {
    setShowAddTrainee(false);
    setShowEditTrainee(false);
    setEditingTrainee(null);
    resetForm();
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
      {/* Professional Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <span className="avatar-icon">👨‍⚕️</span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <div className="profile-meta">
              {user.designation && (
                <span className="profile-designation">{user.designation}</span>
              )}
              {user.department && (
                <span className="profile-department">• {user.department}</span>
              )}
            </div>
            {user.specialization && (
              <p className="profile-specialization">🎯 {user.specialization}</p>
            )}
            {user.experience_years && (
              <p className="profile-experience">📅 {user.experience_years} years of experience</p>
            )}
          </div>
        </div>
        <div className="profile-stats">
          <div className="quick-stat">
            <span className="stat-value">{trainees.length}</span>
            <span className="stat-label">Trainees</span>
          </div>
        </div>
      </div>

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
          <div className="stat-number">👥 {trainees.length}</div>
          <div className="stat-label">My Trainees</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🫀 {trainees.filter(t => t.cpr_training === 1).length}</div>
          <div className="stat-label">CPR Trained</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🩹 {trainees.filter(t => t.first_aid_kit_given === 1).length}</div>
          <div className="stat-label">First Aid Kits Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">⚕️ {trainees.filter(t => t.life_saving_skills === 1).length}</div>
          <div className="stat-label">Life Saving Skills</div>
        </div>
      </div>

      {/* Trainees Management */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="card-title">👥 My Trainees</h2>
          <button
            className="btn btn-success"
            onClick={() => setShowAddTrainee(true)}
          >
            ➕ Register New Trainee
          </button>
        </div>

        {trainees.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 40px', 
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '15px',
            border: '2px dashed rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👥</div>
            <h3 style={{ color: '#667eea', marginBottom: '10px' }}>No trainees registered yet</h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Click "Register New Trainee" to get started with your first registration.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
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
                    <td>{trainee.cpr_training ? '✅ Yes' : '❌ No'}</td>
                    <td>{trainee.first_aid_kit_given ? '✅ Yes' : '❌ No'}</td>
                    <td>{trainee.life_saving_skills ? '✅ Yes' : '❌ No'}</td>
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
        )}
      </div>

      {/* Add Trainee Modal */}
      {showAddTrainee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Register New Trainee</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleAddTrainee}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.name}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    name: e.target.value
                  })}
                  required
                  placeholder="Enter trainee's full name"
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
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.department}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    department: e.target.value
                  })}
                  required
                  placeholder="e.g., Emergency, Cardiology, ICU, Surgery"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.location}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    location: e.target.value
                  })}
                  required
                  placeholder="e.g., Block A, Ward 5, etc."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Training Date *</label>
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
                <label className="form-label">Training Completed</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="add_cpr_training"
                      checked={traineeForm.cpr_training}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        cpr_training: e.target.checked
                      })}
                    />
                    <label htmlFor="add_cpr_training">CPR Training Completed</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="add_first_aid_kit_given"
                      checked={traineeForm.first_aid_kit_given}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        first_aid_kit_given: e.target.checked
                      })}
                    />
                    <label htmlFor="add_first_aid_kit_given">First Aid Kit Given</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="add_life_saving_skills"
                      checked={traineeForm.life_saving_skills}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        life_saving_skills: e.target.checked
                      })}
                    />
                    <label htmlFor="add_life_saving_skills">Life Saving Skills Training</label>
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Register Trainee
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
                <label className="form-label">Name *</label>
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
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.department}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    department: e.target.value
                  })}
                  required
                  placeholder="e.g., Emergency, Cardiology, ICU, Surgery"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Location *</label>
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
                <label className="form-label">Training Date *</label>
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
                      id="edit_cpr_training"
                      checked={traineeForm.cpr_training}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        cpr_training: e.target.checked
                      })}
                    />
                    <label htmlFor="edit_cpr_training">CPR Training Completed</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="edit_first_aid_kit_given"
                      checked={traineeForm.first_aid_kit_given}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        first_aid_kit_given: e.target.checked
                      })}
                    />
                    <label htmlFor="edit_first_aid_kit_given">First Aid Kit Given</label>
                  </div>
                  
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="edit_life_saving_skills"
                      checked={traineeForm.life_saving_skills}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        life_saving_skills: e.target.checked
                      })}
                    />
                    <label htmlFor="edit_life_saving_skills">Life Saving Skills Training</label>
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

export default ProfessionalDashboard;
