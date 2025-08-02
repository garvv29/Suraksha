
import React, { useState, useEffect } from 'react';
import { professionalAPI, traineeAPI, trainingAPI } from '../api';

const AdminDashboard = ({ user }) => {
  const [professionals, setProfessionals] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Block options for Chhattisgarh
  const blockOptions = ['Bastar', 'Bilaspur', 'Durg', 'Raigarh', 'Raipur', 'Surguja'];
  const genderOptions = ['Male', 'Female', 'Other'];

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
  const [filterTrainingStatus, setFilterTrainingStatus] = useState('');

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

        {/* All Trainees Tab - Card View */}
        {activeTab === 'trainees' && (
          <div>
            <h2 className="card-title">🎓 सभी प्रशिक्षु</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="नाम, मोबाइल, पद, विभाग, स्थान खोजें..."
                value={searchTrainee}
                onChange={e => setSearchTrainee(e.target.value)}
                style={{ minWidth: 180, padding: 10, borderRadius: 8, border: '1.5px solid #e0e7ff' }}
              />
              <select
                value={filterTraineeDept || ''}
                onChange={e => setFilterTraineeDept(e.target.value)}
                style={{ minWidth: 140, padding: 10, borderRadius: 8, border: '1.5px solid #e0e7ff' }}
              >
                <option value="">सभी विभाग</option>
                {[...new Set(trainees.map(t => t.department).filter(Boolean))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 10, color: '#764ba2', fontWeight: 600 }}>
              कुल परिणाम: {
                trainees.filter(t => {
                  const q = searchTrainee.toLowerCase();
                  return (
                    (!filterTraineeDept || t.department === filterTraineeDept) &&
                    (
                      t.name?.toLowerCase().includes(q) ||
                      t.mobile_number?.toLowerCase().includes(q) ||
                      (t.designation || '').toLowerCase().includes(q) ||
                      (t.department || '').toLowerCase().includes(q) ||
                      (t.location || '').toLowerCase().includes(q)
                    )
                  );
                }).length
              }
            </div>
            {trainees.filter(t => {
              const q = searchTrainee.toLowerCase();
              return (
                (!filterTraineeDept || t.department === filterTraineeDept) &&
                (
                  t.name?.toLowerCase().includes(q) ||
                  t.mobile_number?.toLowerCase().includes(q) ||
                  (t.designation || '').toLowerCase().includes(q) ||
                  (t.department || '').toLowerCase().includes(q) ||
                  (t.location || '').toLowerCase().includes(q)
                )
              );
            }).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                कोई प्रशिक्षु नहीं मिला।
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                {trainees.filter(t => {
                  const q = searchTrainee.toLowerCase();
                  return (
                    (!filterTraineeDept || t.department === filterTraineeDept) &&
                    (
                      t.name?.toLowerCase().includes(q) ||
                      t.mobile_number?.toLowerCase().includes(q) ||
                      (t.designation || '').toLowerCase().includes(q) ||
                      (t.department || '').toLowerCase().includes(q) ||
                      (t.location || '').toLowerCase().includes(q)
                    )
                  );
                }).map(trainee => (
                  <div key={trainee.id} className="trainee-card" style={{ background: '#f8faff', borderRadius: 14, boxShadow: '0 2px 10px #e0e7ff55', padding: 18, cursor: 'pointer', border: '1.5px solid #e0e7ff', transition: 'box-shadow 0.2s' }} onClick={() => setDetailTrainee(trainee)}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4b2997', marginBottom: 6 }}>{trainee.name}</div>
                    <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 2 }}>डिपार्टमेंट: <b>{trainee.department || 'N/A'}</b></div>
                    {trainee.designation && <div style={{ color: '#555', fontSize: '0.98rem' }}>पद: <b>{trainee.designation}</b></div>}
                  </div>
                ))}
              </div>
            )}
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
                    <div><b>पंजीकृत द्वारा:</b> {detailTrainee.registered_by_name || 'N/A'}</div>
                  </div>
                  <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => { setShowEditTrainee(true); setEditingTrainee(detailTrainee); setDetailTrainee(null); }}>संपादित करें</button>
                    <button className="btn btn-danger" onClick={() => { handleDeleteTrainee(detailTrainee.id); setDetailTrainee(null); }}>हटाएँ</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="card-title">📊 सिस्टम अवलोकन</h2>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>🏥 <strong className="gradient-text">सुरक्षा मेडिकल ट्रेनिंग प्रबंधन प्रणाली</strong> में आपका स्वागत है।</p>
              <p>💡 ऊपर दिए गए टैब्स का उपयोग करके मेडिकल प्रोफेशनल्स का प्रबंधन करें और सभी प्रशिक्षुओं को देखें।</p>
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '15px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                <strong>🎯 मुख्य विशेषताएँ:</strong>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  <li>👥 व्यापक यूज़र प्रबंधन</li>
                  <li>📋 प्रशिक्षण प्रगति ट्रैकिंग</li>
                  <li>📊 रीयल-टाइम आँकड़े</li>
                  <li>🔒 भूमिका आधारित एक्सेस</li>
                </ul>
              </div>
            </div>

            <div className="card" style={{ margin: '32px auto', maxWidth: 700, background: '#f8faff', borderRadius: 18, boxShadow: '0 2px 12px #e0e7ff55', padding: 28 }}>
              <h2 className="card-title" style={{ marginBottom: 18 }}>सिस्टम अवलोकन</h2>
              <p style={{ fontSize: '1.08rem', color: '#333', marginBottom: 16 }}>
                <b>Project SURAKSHA</b> एक वेब पोर्टल है, जिसका उद्देश्य मेडिकल प्रोफेशनल्स (ट्रेनर) द्वारा फ्रंटलाइन वर्कर्स (ट्रेनी) की इमरजेंसी ट्रेनिंग और उनका डेटा सुरक्षित रूप से मैनेज करना है। इसमें दो मुख्य रोल हैं: <b>Admin</b> और <b>Medical Professional</b>。
              </p>
              <ul style={{ fontSize: '1.05rem', color: '#444', marginBottom: 16, paddingLeft: 22 }}>
                <li>मेडिकल प्रोफेशनल्स अपने द्वारा ट्रेन किए गए वर्कर्स को रजिस्टर, एडिट और डिलीट कर सकते हैं।</li>
                <li>हर यूजर को उसकी भूमिका के अनुसार ही डेटा देखने और बदलने की अनुमति है।</li>
                <li>सभी डेटा सुरक्षित तरीके से स्टोर और एक्सेस होता है।</li>
              </ul>
              <h3 style={{ color: '#4b2997', margin: '18px 0 8px 0', fontWeight: 700 }}>Admin के अधिकार:</h3>
              <ul style={{ fontSize: '1.05rem', color: '#444', paddingLeft: 22 }}>
                <li>सभी मेडिकल प्रोफेशनल्स की लिस्ट देख सकते हैं।</li>
                <li>नए प्रोफेशनल्स जोड़ सकते हैं और किसी भी प्रोफेशनल को डिलीट कर सकते हैं।</li>
                <li>सभी ट्रेनी (किसी भी प्रोफेशनल द्वारा रजिस्टर किए गए) का डेटा देख सकते हैं।</li>
                <li>किसी भी ट्रेनी का डेटा एडिट या डिलीट कर सकते हैं।</li>
                <li>(वैकल्पिक) सभी ट्रेनी का डेटा एक्सपोर्ट कर सकते हैं (CSV/PDF में)।</li>
                <li>पूरे सिस्टम की निगरानी और कंट्रोल कर सकते हैं।</li>
              </ul>
              <div style={{ marginTop: 18, color: '#764ba2', fontWeight: 600 }}>
                <b>नोट:</b> Admin के पास पूरे सिस्टम का कंट्रोल होता है — वह सभी प्रोफेशनल्स और ट्रेनी का डेटा देख, जोड़, संपादित और डिलीट कर सकता है。
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
