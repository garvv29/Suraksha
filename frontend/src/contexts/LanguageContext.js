import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    welcome: 'Welcome',
    admin: 'Administrator',
    medical_professional: 'Medical Professional',
    logout: 'Logout',
    
    // Navigation
    overview: 'Overview',
    professionals: 'Medical Professionals',
    trainees: 'All Trainees',
    trainings: 'Training Sessions',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Login
    welcome_back: 'Welcome Back',
    sign_in_to_continue: 'Sign in to your account to continue',
    login_title: 'Welcome Back',
    login_subtitle: 'Sign in to access your dashboard',
    username: 'Username',
    password: 'Password',
    sign_in: 'Sign In',
    signing_in: 'Signing in...',
    select_role: 'Select Your Role',
    administrator: 'Administrator',
    system_management: 'System Management',
    training_management: 'Training Management',
    enter_username: 'Enter your username',
    enter_password: 'Enter your password',
    
    // Forms
    name: 'Name',
    mobile: 'Mobile Number',
    mobile_number: 'Mobile Number',
    gender: 'Gender',
    age: 'Age',
    designation: 'Designation',
    department: 'Department',
    specialization: 'Specialization',
    experience: 'Experience (Years)',
    experience_years: 'Experience (Years)',
    address: 'Address',
    block: 'Block',
    training_date: 'Training Date',
    training_time: 'Training Time',
    duration: 'Duration (Hours)',
    max_trainees: 'Max Trainees',
    title: 'Title',
    description: 'Description',
    training_topic: 'Training Topic',
    status: 'Status',
    
    // Common buttons and actions
    edit: 'Edit',
    delete: 'Delete',
    update: 'Update',
    create: 'Create',
    view: 'View',
    details: 'Details',
    back: 'Back',
    
    // Field labels
    topic: 'Topic',
    location: 'Location',
    date: 'Date',
    time: 'Time',
    created_at: 'Created At',
    updated_at: 'Updated At',
    
    // Search and filter
    search_by_name: 'Search by name, username, mobile, designation, department...',
    search_trainings: 'Search by title, topic, address...',
    search_trainees: 'Search by name, mobile, department, block...',
    all_departments: 'All Departments',
    all_blocks: 'All Blocks',
    total_results: 'Total Results',
    
    // Empty states
    no_professionals_found: 'No professionals found',
    no_trainees_found: 'No trainees found',
    no_trainings_found: 'No trainings found',
    adjust_search_criteria: 'Try adjusting your search criteria',
    
    // Status options
    planned: 'Planned',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Gender options
    male: 'Male',
    female: 'Female',
    other: 'Other',
    
    // Placeholders
    search_trainees_placeholder: 'Search trainees...',
    enter_full_name: 'Enter full name',
    enter_mobile_number: '10-digit mobile number',
    enter_age: 'Enter age',
    department_example: 'e.g., Emergency, Surgery, etc.',
    designation_example: 'e.g., Nurse, Ward Boy, etc.',
    enter_address: 'Enter complete address',
    enter_training_title: 'Enter training title',
    enter_training_description: 'Describe the training session',
    enter_topic: 'e.g., CPR, First Aid, etc.',
    enter_duration: 'Duration in hours',
    enter_max_trainees: 'Maximum number of trainees',
    
    // Dashboard
    dashboard: 'Dashboard',
    add_new_professional: 'Add New Professional',
    add_new_trainee: 'Add New Trainee',
    add_new_training: 'Add New Training',
    view_details: 'View Details',
    edit_profile: 'Edit Profile',
    delete_record: 'Delete Record',
    total_professionals: 'Total Professionals',
    total_trainees: 'Total Trainees',
    total_trainings: 'Total Training Sessions',
    recent_activity: 'Recent Activity',
    
    // Modal titles
    add_new_medical_professional: 'Add New Medical Professional',
    conducted_by: 'Conducted by',
    trainings: 'Trainings',
    students: 'Students',
    sort_by_name: 'Sort by Name',
    sort_by_trainings: 'Sort by Trainings',
    sort_by_students: 'Sort by Students',
    sort_by_experience: 'Sort by Experience',
    
    // Messages
    success: 'Success',
    error: 'Error',
    no_data: 'No data available',
    
    // Brand
    brand_name: 'SURAKSHA',
    brand_subtitle: 'Advanced Medical Training Management System'
  },
  hi: {
    // Header
    welcome: 'स्वागत है',
    admin: 'व्यवस्थापक',
    medical_professional: 'मेडिकल प्रोफेशनल',
    logout: 'लॉगआउट',
    
    // Navigation
    overview: 'सिंहावलोकन',
    professionals: 'चिकित्सा पेशेवर',
    trainees: 'सभी प्रशिक्षु',
    trainings: 'प्रशिक्षण सत्र',
    
    // Common
    search: 'खोजें',
    filter: 'फ़िल्टर',
    add: 'जोड़ें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    submit: 'सबमिट करें',
    loading: 'लोड हो रहा है...',
    
    // Login
    welcome_back: 'वापसी पर स्वागत है',
    sign_in_to_continue: 'जारी रखने के लिए अपने खाते में साइन इन करें',
    login_title: 'वापसी पर स्वागत है',
    login_subtitle: 'अपने डैशबोर्ड तक पहुंचने के लिए साइन इन करें',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    sign_in: 'साइन इन',
    signing_in: 'साइन इन हो रहा है...',
    select_role: 'अपनी भूमिका चुनें',
    administrator: 'व्यवस्थापक',
    system_management: 'सिस्टम प्रबंधन',
    training_management: 'प्रशिक्षण प्रबंधन',
    enter_username: 'अपना उपयोगकर्ता नाम दर्ज करें',
    enter_password: 'अपना पासवर्ड दर्ज करें',
    
    // Forms
    name: 'नाम',
    mobile: 'मोबाइल नंबर',
    mobile_number: 'मोबाइल नंबर',
    gender: 'लिंग',
    age: 'आयु',
    designation: 'पदनाम',
    department: 'विभाग',
    specialization: 'विशेषज्ञता',
    experience: 'अनुभव (वर्ष)',
    experience_years: 'अनुभव (वर्ष)',
    address: 'पता',
    block: 'ब्लॉक',
    training_date: 'प्रशिक्षण दिनांक',
    training_time: 'प्रशिक्षण समय',
    duration: 'अवधि (घंटे)',
    max_trainees: 'अधिकतम प्रशिक्षु',
    title: 'शीर्षक',
    description: 'विवरण',
    training_topic: 'प्रशिक्षण विषय',
    status: 'स्थिति',
    
    // Common buttons and actions
    edit: 'संपादित करें',
    delete: 'हटाएं',
    update: 'अपडेट करें',
    create: 'बनाएं',
    view: 'देखें',
    details: 'विवरण',
    back: 'वापस',
    
    // Field labels
    topic: 'विषय',
    location: 'स्थान',
    date: 'दिनांक',
    time: 'समय',
    created_at: 'बनाया गया',
    updated_at: 'अपडेट किया गया',
    
    // Search and filter
    search_by_name: 'नाम, उपयोगकर्ता नाम, मोबाइल, पदनाम, विभाग से खोजें...',
    search_trainings: 'शीर्षक, विषय, पता से खोजें...',
    search_trainees: 'नाम, मोबाइल, विभाग, ब्लॉक से खोजें...',
    all_departments: 'सभी विभाग',
    all_blocks: 'सभी ब्लॉक',
    total_results: 'कुल परिणाम',
    
    // Empty states
    no_professionals_found: 'कोई प्रोफेशनल नहीं मिला',
    no_trainees_found: 'कोई प्रशिक्षु नहीं मिला',
    no_trainings_found: 'कोई प्रशिक्षण नहीं मिला',
    adjust_search_criteria: 'अपने खोज मापदंड को समायोजित करने का प्रयास करें',
    
    // Status options
    planned: 'नियोजित',
    ongoing: 'चालू',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    
    // Gender options
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    
    // Placeholders
    search_trainees_placeholder: 'प्रशिक्षुओं की खोज करें...',
    enter_full_name: 'पूरा नाम दर्ज करें',
    enter_mobile_number: '10-अंकीय मोबाइल नंबर',
    enter_age: 'आयु दर्ज करें',
    department_example: 'जैसे, आपातकाल, सर्जरी, आदि।',
    designation_example: 'जैसे, नर्स, वार्ड बॉय, आदि।',
    enter_address: 'पूरा पता दर्ज करें',
    enter_training_title: 'प्रशिक्षण शीर्षक दर्ज करें',
    enter_training_description: 'प्रशिक्षण सत्र का वर्णन करें',
    enter_topic: 'जैसे, CPR, प्राथमिक चिकित्सा, आदि।',
    enter_duration: 'घंटों में अवधि',
    enter_max_trainees: 'अधिकतम प्रशिक्षुओं की संख्या',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    add_new_professional: 'नया प्रोफेशनल जोड़ें',
    add_new_trainee: 'नया प्रशिक्षु जोड़ें',
    add_new_training: 'नया प्रशिक्षण जोड़ें',
    view_details: 'विवरण देखें',
    edit_profile: 'प्रोफाइल संपादित करें',
    delete_record: 'रिकॉर्ड हटाएं',
    total_professionals: 'कुल प्रोफेशनल्स',
    total_trainees: 'कुल प्रशिक्षु',
    total_trainings: 'कुल प्रशिक्षण सत्र',
    recent_activity: 'हाल की गतिविधि',
    
    // Modal titles
    add_new_medical_professional: 'नया मेडिकल प्रोफेशनल जोड़ें',
    conducted_by: 'द्वारा आयोजित',
    trainings: 'प्रशिक्षण',
    students: 'छात्र',
    sort_by_name: 'नाम के अनुसार क्रमबद्ध करें',
    sort_by_trainings: 'प्रशिक्षण के अनुसार क्रमबद्ध करें',
    sort_by_students: 'छात्रों के अनुसार क्रमबद्ध करें',
    sort_by_experience: 'अनुभव के अनुसार क्रमबद्ध करें',
    
    // Messages
    success: 'सफलता',
    error: 'त्रुटि',
    no_data: 'कोई डेटा उपलब्ध नहीं',
    
    // Brand
    brand_name: 'सुरक्षा',
    brand_subtitle: 'उन्नत चिकित्सा प्रशिक्षण प्रबंधन प्रणाली'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default to Hindi

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
