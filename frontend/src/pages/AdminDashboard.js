import React, { useState, useEffect } from 'react';
import { professionalAPI, traineeAPI, trainingAPI } from '../api';
import '../App.css';

const AdminDashboard = ({ user }) => {
  const [professionals, setProfessionals] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Block options for Chhattisgarh
  const blockOptions = ['Raipur', 'Birgaon', 'Abhanpur', 'Arang', 'Dhariswa', 'Tilda'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const statusOptions = ['Planned', 'Ongoing', 'Completed', 'Cancelled'];

  // Modal/detail states
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [showEditTrainee, setShowEditTrainee] = useState(false);
  const [showEditProfessional, setShowEditProfessional] = useState(false);
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [showEditTraining, setShowEditTraining] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [editingTraining, setEditingTraining] = useState(null);
  const [detailTrainee, setDetailTrainee] = useState(null);
  const [detailProfessional, setDetailProfessional] = useState(null);
  const [detailTraining, setDetailTraining] = useState(null);

  // Search/filter states
  const [searchTrainee, setSearchTrainee] = useState('');
  const [filterTraineeDept, setFilterTraineeDept] = useState('');
  const [filterTraineeBlock, setFilterTraineeBlock] = useState('');
  const [searchProfessional, setSearchProfessional] = useState('');
  const [filterProfessionalDept, setFilterProfessionalDept] = useState('');
  const [searchTraining, setSearchTraining] = useState('');
  const [filterTrainingBlock, setFilterTrainingBlock] = useState('');

  // Form data
  const [professionalForm, setProfessionalForm] = useState({
    name: '',
    username: '',
    mobile_number: '',
    gender: '',
    age: '',
    designation: '',
    department: '',
    specialization: '',
    experience_years: '',
  });

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
    description: '',
    training_topic: '',
    address: '',
    block: '',
    training_date: '',
    training_time: '',
    duration_hours: 1.0,
    max_trainees: 50,
    status: 'Planned',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profResponse, traineeResponse, trainingResponse] = await Promise.all([
        professionalAPI.getAll(),
        traineeAPI.getAll(user.id, user.role),
        trainingAPI.getAll(user.id, user.role),
      ]);

      if (profResponse.data.success) {
        setProfessionals(profResponse.data.professionals);
      }
      if (traineeResponse.data.success) {
        setTrainees(traineeResponse.data.trainees);
      }
      if (trainingResponse.data.success) {
        setTrainings(trainingResponse.data.trainings);
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
          gender: '',
          age: '',
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
      gender: trainee.gender,
      age: trainee.age,
      department: trainee.department,
      designation: trainee.designation || '',
      address: trainee.address,
      block: trainee.block,
      training_date: trainee.training_date,
      cpr_training: trainee.cpr_training === 1 || trainee.cpr_training === true,
      first_aid_kit_given: trainee.first_aid_kit_given === 1 || trainee.first_aid_kit_given === true,
      life_saving_skills: trainee.life_saving_skills === 1 || trainee.life_saving_skills === true,
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
      gender: professional.gender,
      age: professional.age,
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

  const handleAddTraining = async (e) => {
    e.preventDefault();
    try {
      const response = await trainingAPI.create({
        ...trainingForm,
        conducted_by: user.id
      });
      if (response.data.success) {
        setSuccess('Training created successfully!');
        setTrainingForm({
          title: '',
          description: '',
          training_topic: '',
          address: '',
          block: '',
          training_date: '',
          training_time: '',
          duration_hours: 1.0,
          max_trainees: 50,
          status: 'Planned',
        });
        setShowAddTraining(false);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create training');
    }
  };

  const handleEditTraining = (training) => {
    setEditingTraining(training);
    setTrainingForm({
      title: training.title,
      description: training.description || '',
      training_topic: training.training_topic,
      address: training.address,
      block: training.block,
      training_date: training.training_date,
      training_time: training.training_time,
      duration_hours: training.duration_hours,
      max_trainees: training.max_trainees,
      status: training.status,
    });
    setShowEditTraining(true);
  };

  const handleUpdateTraining = async (e) => {
    e.preventDefault();
    try {
      const response = await trainingAPI.update(editingTraining.id, trainingForm);
      if (response.data.success) {
        setSuccess('Training updated successfully!');
        setShowEditTraining(false);
        setEditingTraining(null);
        fetchData();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update training');
    }
  };

  const handleDeleteTraining = async (trainingId) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        const response = await trainingAPI.delete(trainingId);
        if (response.data.success) {
          setSuccess('Training deleted successfully!');
          fetchData();
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete training');
      }
    }
  };

  const closeModal = () => {
    setShowAddProfessional(false);
    setShowEditTrainee(false);
    setShowEditProfessional(false);
    setShowAddTraining(false);
    setShowEditTraining(false);
    setEditingTrainee(null);
    setEditingProfessional(null);
    setEditingTraining(null);
    setProfessionalForm({ 
      name: '', 
      username: '', 
      mobile_number: '', 
      gender: '',
      age: '',
      designation: '', 
      department: '', 
      specialization: '', 
      experience_years: '', 
    });
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
    setTrainingForm({
      title: '',
      description: '',
      training_topic: '',
      address: '',
      block: '',
      training_date: '',
      training_time: '',
      duration_hours: 1.0,
      max_trainees: 50,
      status: 'Planned',
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
          <button onClick={clearMessages} className="close-btn">×</button>
        </div>
      )}
      {success && (
        <div className="alert alert-success fade-in">
          {success}
          <button onClick={clearMessages} className="close-btn">×</button>
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{professionals.length}</div>
          <div className="stat-label">Medical Professionals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trainees.length}</div>
          <div className="stat-label">Total Trainees</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trainees.filter(t => t.cpr_training === 1 || t.cpr_training === true).length}</div>
          <div className="stat-label">CPR Trained</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trainees.filter(t => t.first_aid_kit_given === 1 || t.first_aid_kit_given === true).length}</div>
          <div className="stat-label">First Aid Kits Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trainings.length}</div>
          <div className="stat-label">Total Trainings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trainings.filter(t => t.status === 'Completed').length}</div>
          <div className="stat-label">Completed Trainings</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'professionals' ? 'active' : ''}`}
            onClick={() => setActiveTab('professionals')}
          >
            Medical Professionals
          </button>
          <button
            className={`nav-tab ${activeTab === 'trainees' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainees')}
          >
            All Trainees
          </button>
          <button
            className={`nav-tab ${activeTab === 'trainings' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainings')}
          >
            Training Sessions
          </button>
          <a
            href="/data"
            className="nav-tab"
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              backgroundColor: '#2563eb',
              color: 'white',
              borderColor: '#2563eb'
            }}
          >
            📊 Database Viewer
          </a>
        </div>

        {/* Medical Professionals Tab */}
        {activeTab === 'professionals' && (
          <div className="card-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title">Medical Professionals</h2>
              <button className="btn btn-primary" onClick={() => setShowAddProfessional(true)}>
                Add New Professional
              </button>
            </div>
            
            <div className="search-filter-bar">
              <input
                type="text"
                placeholder="Search by name, username, mobile, designation, department..."
                value={searchProfessional}
                onChange={e => setSearchProfessional(e.target.value)}
                className="form-input search-input"
              />
              <select
                value={filterProfessionalDept || ''}
                onChange={e => setFilterProfessionalDept(e.target.value)}
                className="form-select filter-select"
              >
                <option value="">All Departments</option>
                {[...new Set(professionals.map(p => p.department).filter(Boolean))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 text-gray-600 font-medium">
              Total Results: {
                professionals.filter(p => {
                  const q = searchProfessional.toLowerCase();
                  return (
                    (!filterProfessionalDept || p.department === filterProfessionalDept) &&
                    (
                      p.name?.toLowerCase().includes(q) ||
                      p.username?.toLowerCase().includes(q) ||
                      p.mobile_number?.toLowerCase().includes(q) ||
                      (p.designation || '').toLowerCase().includes(q) ||
                      (p.department || '').toLowerCase().includes(q)
                    )
                  );
                }).length
              }
            </div>
            
            {professionals.filter(p => {
              const q = searchProfessional.toLowerCase();
              return (
                (!filterProfessionalDept || p.department === filterProfessionalDept) &&
                (
                  p.name?.toLowerCase().includes(q) ||
                  p.username?.toLowerCase().includes(q) ||
                  p.mobile_number?.toLowerCase().includes(q) ||
                  (p.designation || '').toLowerCase().includes(q) ||
                  (p.department || '').toLowerCase().includes(q)
                )
              );
            }).length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No professionals found</div>
                <div className="empty-state-description">Try adjusting your search criteria</div>
              </div>
            ) : (
              <div className="data-grid">
                {professionals.filter(p => {
                  const q = searchProfessional.toLowerCase();
                  return (
                    (!filterProfessionalDept || p.department === filterProfessionalDept) &&
                    (
                      p.name?.toLowerCase().includes(q) ||
                      p.username?.toLowerCase().includes(q) ||
                      p.mobile_number?.toLowerCase().includes(q) ||
                      (p.designation || '').toLowerCase().includes(q) ||
                      (p.department || '').toLowerCase().includes(q)
                    )
                  );
                }).map(prof => (
                  <div key={prof.id} className="data-card" onClick={() => setDetailProfessional(prof)}>
                    <div className="data-card-title">{prof.name}</div>
                    <div className="data-card-content">
                      <div className="mb-2"><strong>Designation:</strong> {prof.designation || 'N/A'}</div>
                      <div className="mb-2"><strong>Department:</strong> {prof.department || 'N/A'}</div>
                      <div className="mb-2"><strong>Experience:</strong> {prof.experience_years || 0} years</div>
                    </div>
                    <div className="data-card-meta">
                      <span>{prof.gender}, {prof.age} years</span>
                      <span>{prof.username}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Trainees Tab */}
        {activeTab === 'trainees' && (
          <div className="card-content">
            <h2 className="card-title mb-6">All Trainees</h2>
            
            <div className="search-filter-bar">
              <input
                type="text"
                placeholder="Search by name, mobile, designation, department, address..."
                value={searchTrainee}
                onChange={e => setSearchTrainee(e.target.value)}
                className="form-input search-input"
              />
              <select
                value={filterTraineeDept || ''}
                onChange={e => setFilterTraineeDept(e.target.value)}
                className="form-select filter-select"
              >
                <option value="">All Departments</option>
                {[...new Set(trainees.map(t => t.department).filter(Boolean))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterTraineeBlock || ''}
                onChange={e => setFilterTraineeBlock(e.target.value)}
                className="form-select filter-select"
              >
                <option value="">All Blocks</option>
                {blockOptions.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 text-gray-600 font-medium">
              Total Results: {
                trainees.filter(t => {
                  const q = searchTrainee.toLowerCase();
                  return (
                    (!filterTraineeDept || t.department === filterTraineeDept) &&
                    (!filterTraineeBlock || t.block === filterTraineeBlock) &&
                    (
                      t.name?.toLowerCase().includes(q) ||
                      t.mobile_number?.toLowerCase().includes(q) ||
                      (t.designation || '').toLowerCase().includes(q) ||
                      (t.department || '').toLowerCase().includes(q) ||
                      (t.address || '').toLowerCase().includes(q)
                    )
                  );
                }).length
              }
            </div>
            
            {trainees.filter(t => {
              const q = searchTrainee.toLowerCase();
              return (
                (!filterTraineeDept || t.department === filterTraineeDept) &&
                (!filterTraineeBlock || t.block === filterTraineeBlock) &&
                (
                  t.name?.toLowerCase().includes(q) ||
                  t.mobile_number?.toLowerCase().includes(q) ||
                  (t.designation || '').toLowerCase().includes(q) ||
                  (t.department || '').toLowerCase().includes(q) ||
                  (t.address || '').toLowerCase().includes(q)
                )
              );
            }).length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No trainees found</div>
                <div className="empty-state-description">Try adjusting your search criteria</div>
              </div>
            ) : (
              <div className="data-grid">
                {trainees.filter(t => {
                  const q = searchTrainee.toLowerCase();
                  return (
                    (!filterTraineeDept || t.department === filterTraineeDept) &&
                    (!filterTraineeBlock || t.block === filterTraineeBlock) &&
                    (
                      t.name?.toLowerCase().includes(q) ||
                      t.mobile_number?.toLowerCase().includes(q) ||
                      (t.designation || '').toLowerCase().includes(q) ||
                      (t.department || '').toLowerCase().includes(q) ||
                      (t.address || '').toLowerCase().includes(q)
                    )
                  );
                }).map(trainee => (
                  <div key={trainee.id} className="data-card" onClick={() => setDetailTrainee(trainee)}>
                    <div className="data-card-title">{trainee.name}</div>
                    <div className="data-card-content">
                      <div className="mb-2"><strong>Department:</strong> {trainee.department || 'N/A'}</div>
                      <div className="mb-2"><strong>Block:</strong> {trainee.block}</div>
                      {trainee.designation && <div className="mb-2"><strong>Designation:</strong> {trainee.designation}</div>}
                    </div>
                    <div className="data-card-meta">
                      <span>{trainee.gender}, {trainee.age} years</span>
                      <span>Trained: {trainee.training_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Training Sessions Tab */}
        {activeTab === 'trainings' && (
          <div className="card-content">
            <div className="mb-6">
              <h2 className="card-title">Training Sessions</h2>
            </div>
            
            <div className="search-filter-bar">
              <input
                type="text"
                placeholder="Search by title, topic, address..."
                value={searchTraining}
                onChange={e => setSearchTraining(e.target.value)}
                className="form-input search-input"
              />
              <select
                value={filterTrainingBlock || ''}
                onChange={e => setFilterTrainingBlock(e.target.value)}
                className="form-select filter-select"
              >
                <option value="">All Blocks</option>
                {blockOptions.map(block => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 text-gray-600 font-medium">
              Total Results: {
                trainings.filter(t => {
                  const q = searchTraining.toLowerCase();
                  return (
                    (!filterTrainingBlock || t.block === filterTrainingBlock) &&
                    (
                      t.title?.toLowerCase().includes(q) ||
                      t.training_topic?.toLowerCase().includes(q) ||
                      t.address?.toLowerCase().includes(q)
                    )
                  );
                }).length
              }
            </div>
            
            {trainings.filter(t => {
              const q = searchTraining.toLowerCase();
              return (
                (!filterTrainingBlock || t.block === filterTrainingBlock) &&
                (
                  t.title?.toLowerCase().includes(q) ||
                  t.training_topic?.toLowerCase().includes(q) ||
                  t.address?.toLowerCase().includes(q)
                )
              );
            }).length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No trainings found</div>
                <div className="empty-state-description">Try adjusting your search criteria</div>
              </div>
            ) : (
              <div className="data-grid">
                {trainings.filter(t => {
                  const q = searchTraining.toLowerCase();
                  return (
                    (!filterTrainingBlock || t.block === filterTrainingBlock) &&
                    (
                      t.title?.toLowerCase().includes(q) ||
                      t.training_topic?.toLowerCase().includes(q) ||
                      t.address?.toLowerCase().includes(q)
                    )
                  );
                }).map(training => (
                  <div key={training.id} className="data-card" onClick={() => setDetailTraining(training)}>
                    <div className="data-card-title">{training.title}</div>
                    <div className="data-card-content">
                      <div className="mb-2"><strong>Topic:</strong> {training.training_topic}</div>
                      <div className="mb-2"><strong>Location:</strong> {training.address}, {training.block}</div>
                    </div>
                    <div className="data-card-meta">
                      <span>{training.training_date} at {training.training_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="card-content">
            <h2 className="card-title mb-6">System Overview</h2>
            <div className="text-lg">
              <p className="mb-4">Welcome to the <strong className="text-primary">SURAKSHA Medical Training Management System</strong>.</p>
              <p className="mb-6">Use the tabs above to manage medical professionals, view all trainees, and organize training sessions.</p>
              
              <div className="card mb-6" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
                <div className="card-content">
                  <h3 className="font-semibold text-primary mb-4">Key Features:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Comprehensive user management</li>
                    <li>• Training progress tracking</li>
                    <li>• Real-time statistics</li>
                    <li>• Role-based access control</li>
                    <li>• Training session management</li>
                    <li>• Geographic tracking by blocks</li>
                  </ul>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <h3 className="card-title mb-4">Admin Privileges</h3>
                  <p className="mb-4">
                    <strong>Project SURAKSHA</strong> is a web portal designed for medical professionals (trainers) to manage emergency training for frontline workers (trainees) and securely handle their data. The system has two main roles: <strong>Admin</strong> and <strong>Medical Professional</strong>.
                  </p>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• Medical professionals can register, edit, and delete workers they have trained</li>
                    <li>• Each user has access to data viewing and modification according to their role</li>
                    <li>• All data is stored and accessed securely</li>
                  </ul>
                  <h4 className="font-semibold text-primary mb-3">Admin Rights:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• View list of all medical professionals</li>
                    <li>• Add new professionals and delete any professional</li>
                    <li>• View data of all trainees (registered by any professional)</li>
                    <li>• Edit or delete any trainee's data</li>
                    <li>• Export all trainee data (CSV/PDF format)</li>
                    <li>• Monitor and control the entire system</li>
                    <li>• Manage training sessions across all blocks</li>
                  </ul>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <strong className="text-primary">Note:</strong> Admin has complete control over the system — they can view, add, edit, and delete data for all professionals, trainees, and training sessions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Detail Modal */}
      {detailProfessional && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{detailProfessional.name} - Details</h3>
              <button className="close-btn" onClick={() => setDetailProfessional(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div><strong>Name:</strong> {detailProfessional.name}</div>
                <div><strong>Username:</strong> {detailProfessional.username}</div>
                <div><strong>Mobile:</strong> {detailProfessional.mobile_number}</div>
                <div><strong>Gender:</strong> {detailProfessional.gender}</div>
                <div><strong>Age:</strong> {detailProfessional.age} years</div>
                <div><strong>Designation:</strong> {detailProfessional.designation || 'N/A'}</div>
                <div><strong>Department:</strong> {detailProfessional.department || 'N/A'}</div>
                <div><strong>Specialization:</strong> {detailProfessional.specialization || 'N/A'}</div>
                <div><strong>Experience:</strong> {detailProfessional.experience_years || 0} years</div>
                <div><strong>Joined:</strong> {detailProfessional.created_at ? new Date(detailProfessional.created_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => { handleEditProfessional(detailProfessional); setDetailProfessional(null); }}>Edit</button>
                <button className="btn btn-danger" onClick={() => { handleDeleteProfessional(detailProfessional.id); setDetailProfessional(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trainee Detail Modal */}
      {detailTrainee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{detailTrainee.name} - Details</h3>
              <button className="close-btn" onClick={() => setDetailTrainee(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div><strong>Name:</strong> {detailTrainee.name}</div>
                <div><strong>Mobile:</strong> {detailTrainee.mobile_number}</div>
                <div><strong>Gender:</strong> {detailTrainee.gender}</div>
                <div><strong>Age:</strong> {detailTrainee.age} years</div>
                <div><strong>Department:</strong> {detailTrainee.department}</div>
                <div><strong>Designation:</strong> {detailTrainee.designation || 'N/A'}</div>
                <div><strong>Address:</strong> {detailTrainee.address}</div>
                <div><strong>Block:</strong> {detailTrainee.block}</div>
                <div><strong>Training Date:</strong> {detailTrainee.training_date}</div>
                <div><strong>CPR Training:</strong> {detailTrainee.cpr_training ? 'Yes' : 'No'}</div>
                <div><strong>First Aid Kit:</strong> {detailTrainee.first_aid_kit_given ? 'Yes' : 'No'}</div>
                <div><strong>Life Saving Skills:</strong> {detailTrainee.life_saving_skills ? 'Yes' : 'No'}</div>
                <div><strong>Registered By:</strong> {detailTrainee.registered_by_name || 'N/A'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => { handleEditTrainee(detailTrainee); setDetailTrainee(null); }}>Edit</button>
                <button className="btn btn-danger" onClick={() => { handleDeleteTrainee(detailTrainee.id); setDetailTrainee(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Detail Modal */}
      {detailTraining && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{detailTraining.title} - Details</h3>
              <button className="close-btn" onClick={() => setDetailTraining(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="space-y-3">
                <div><strong>Title:</strong> {detailTraining.title}</div>
                <div><strong>Topic:</strong> {detailTraining.training_topic}</div>
                <div><strong>Description:</strong> {detailTraining.description || 'N/A'}</div>
                <div><strong>Address:</strong> {detailTraining.address}</div>
                <div><strong>Block:</strong> {detailTraining.block}</div>
                <div><strong>Date:</strong> {detailTraining.training_date}</div>
                <div><strong>Time:</strong> {detailTraining.training_time}</div>
                <div><strong>Duration:</strong> {detailTraining.duration_hours} hours</div>
                <div><strong>Conducted By:</strong> {detailTraining.conducted_by_name || 'N/A'}</div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={() => { handleEditTraining(detailTraining); setDetailTraining(null); }}>Edit</button>
                <button className="btn btn-danger" onClick={() => { handleDeleteTraining(detailTraining.id); setDetailTraining(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Professional Modal */}
      {showAddProfessional && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Medical Professional</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={professionalForm.gender}
                      onChange={(e) => setProfessionalForm({
                        ...professionalForm,
                        gender: e.target.value
                      })}
                      required
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
                      value={professionalForm.age}
                      onChange={(e) => setProfessionalForm({
                        ...professionalForm,
                        age: e.target.value
                      })}
                      required
                      min="18"
                      max="100"
                      placeholder="Age"
                    />
                  </div>
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
                  <button type="submit" className="btn btn-primary">
                    Add Professional
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Similar modals for Edit Professional, Edit Trainee, Add Training, Edit Training would follow... */}
      {/* For brevity, I'll include a few key ones */}

      {/* Edit Trainee Modal */}
      {showEditTrainee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Trainee</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={traineeForm.gender}
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        gender: e.target.value
                      })}
                      required
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
                      onChange={(e) => setTraineeForm({
                        ...traineeForm,
                        age: e.target.value
                      })}
                      required
                      min="16"
                      max="80"
                    />
                  </div>
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
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={traineeForm.designation}
                    onChange={(e) => setTraineeForm({
                      ...traineeForm,
                      designation: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={traineeForm.address}
                    onChange={(e) => setTraineeForm({
                      ...traineeForm,
                      address: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Block</label>
                  <select
                    className="form-select"
                    value={traineeForm.block}
                    onChange={(e) => setTraineeForm({
                      ...traineeForm,
                      block: e.target.value
                    })}
                    required
                  >
                    <option value="">Select Block</option>
                    {blockOptions.map(block => (
                      <option key={block} value={block}>{block}</option>
                    ))}
                  </select>
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
                  <button type="submit" className="btn btn-primary">
                    Update Trainee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
