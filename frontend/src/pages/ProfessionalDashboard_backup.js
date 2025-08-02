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
    designation: '',
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
      designation: trainee.designation || '',
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
      designation: '',
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

  // --- Card view state and filter logic ---
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [detailTrainee, setDetailTrainee] = useState(null);
  const filteredTrainees = trainees.filter(function(t) {
    var name = t.name || '';
    var mobile = t.mobile_number || '';
    var matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || mobile.includes(search);
    var matchesDept = !filterDept || t.department === filterDept;
    return matchesSearch && matchesDept;
  });

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
          <div className="stat-label">मेरे प्रशिक्षु</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🫀 {trainees.filter(t => t.cpr_training === 1).length}</div>
          <div className="stat-label">सीपीआर प्रशिक्षित</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🩹 {trainees.filter(t => t.first_aid_kit_given === 1).length}</div>
          <div className="stat-label">फर्स्ट एड किट दिए गए</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">⚕️ {trainees.filter(t => t.life_saving_skills === 1).length}</div>
          <div className="stat-label">जीवन रक्षक कौशल</div>
        </div>
      </div>

      {/* Trainees Management - Card View with Search/Filter */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="card-title">👥 मेरे प्रशिक्षु</h2>
          <button className="btn btn-success" onClick={() => setShowAddTrainee(true)}>
            ➕ नया प्रशिक्षु पंजीकृत करें
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="नाम या मोबाइल से खोजें..."
            value={search || ''}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: 10, borderRadius: 8, border: '1.5px solid #e0e7ff' }}
          />
          <select
            value={filterDept || ''}
            onChange={e => setFilterDept(e.target.value)}
            style={{ minWidth: 140, padding: 10, borderRadius: 8, border: '1.5px solid #e0e7ff' }}
          >
            <option value="">सभी विभाग</option>
            {[...new Set(trainees.map(t => t.department).filter(Boolean))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 10, color: '#764ba2', fontWeight: 600 }}>
          कुल परिणाम: {filteredTrainees.length}
        </div>
        {filteredTrainees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            कोई प्रशिक्षु नहीं मिला।
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {filteredTrainees.map(trainee => (
              <div key={trainee.id} className="trainee-card" style={{ background: '#f8faff', borderRadius: 14, boxShadow: '0 2px 10px #e0e7ff55', padding: 18, cursor: 'pointer', border: '1.5px solid #e0e7ff', transition: 'box-shadow 0.2s' }} onClick={() => setDetailTrainee(trainee)}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4b2997', marginBottom: 6 }}>{trainee.name}</div>
                <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 2 }}>डिपार्टमेंट: <b>{trainee.department || 'N/A'}</b></div>
                {trainee.designation && <div style={{ color: '#555', fontSize: '0.98rem' }}>पद: <b>{trainee.designation}</b></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trainee Detail Modal */}
      {detailTrainee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{detailTrainee.name} - विवरण</h3>
              <button className="close-btn" onClick={() => setDetailTrainee(null)}>×</button>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div><b>नाम:</b> {detailTrainee.name}</div>
              <div><b>मोबाइल:</b> {detailTrainee.mobile_number}</div>
              <div><b>डिपार्टमेंट:</b> {detailTrainee.department}</div>
              <div><b>पद:</b> {detailTrainee.designation || 'N/A'}</div>
              <div><b>स्थान:</b> {detailTrainee.location}</div>
              <div><b>प्रशिक्षण तिथि:</b> {detailTrainee.training_date}</div>
              <div><b>सीपीआर प्रशिक्षण:</b> {detailTrainee.cpr_training ? 'हाँ' : 'नहीं'}</div>
              <div><b>फर्स्ट एड किट:</b> {detailTrainee.first_aid_kit_given ? 'हाँ' : 'नहीं'}</div>
              <div><b>जीवन रक्षक कौशल:</b> {detailTrainee.life_saving_skills ? 'हाँ' : 'नहीं'}</div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => { setShowEditTrainee(true); setEditingTrainee(detailTrainee); setDetailTrainee(null); }}>संपादित करें</button>
              <button className="btn btn-danger" onClick={() => { handleDeleteTrainee(detailTrainee.id); setDetailTrainee(null); }}>हटाएँ</button>
            </div>
          </div>
        </div>
      )}

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
                  placeholder=""
                />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.designation}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    designation: e.target.value
                  })}
                  placeholder="e.g., Nurse, Ward Boy, etc."
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
                  placeholder=""
                />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={traineeForm.designation}
                  onChange={(e) => setTraineeForm({
                    ...traineeForm,
                    designation: e.target.value
                  })}
                  placeholder="e.g., Nurse, Ward Boy, etc."
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
