'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n on client side
const initI18n = () => {
  const resources = {
    en: {
      translation: {
        // Header
        notifications: "Notifications",
        viewAll: "View All",
        noNotifications: "No notifications",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
        adminName: "Administrator",
        cityLocation: "Kolkata, India",
        newIssueReport: "New Issue Report",
        taskUpdate: "Task Update",
        
        // Sidebar
        dashboard: "Dashboard",
        reports: "Reports",
        workers: "Workers",
        analytics: "Analytics",
        quickActions: "Quick Actions",
        assignWorker: "Assign Worker",
        createReport: "Create Report",
        sendAlert: "Send Alert",
        
        // Dashboard
        totalReports: "Total Reports",
        activeWorkers: "Active Workers",
        pendingTasks: "Pending Tasks",
        resolvedToday: "Resolved Today",
        recentActivity: "Recent Activity",
        recentReports: "Recent Reports",
        workerPerformance: "Worker Performance",
        taskDistribution: "Task Distribution",
        
        // Status
        pending: "Pending",
        inProgress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled",
        
        // Actions
        view: "View",
        edit: "Edit",
        assign: "Assign",
        resolve: "Resolve",
        delete: "Delete",
        
        // Time
        justNow: "Just now",
        minutesAgo: "{{count}} minutes ago",
        hoursAgo: "{{count}} hours ago",
        daysAgo: "{{count}} days ago",
        
        // Categories
        roadMaintenance: "Road Maintenance",
        waterSupply: "Water Supply",
        wasteManagement: "Waste Management",
        streetLighting: "Street Lighting",
        publicSafety: "Public Safety",
        
        // Data Initializer
        dataInitializer: "Data Initializer",
        initializeData: "Initialize Indian Data",
        dataDescription: "Populate the database with realistic Indian municipal data including workers, tasks, and reports.",
        creating: "Creating {{item}}...",
        created: "Created {{count}} {{item}}",
        initializationComplete: "Data initialization complete!",
        
        // Language selector
        language: "Language",
        english: "English",
        hindi: "हिन्दी (Hindi)",
        bengali: "বাংলা (Bengali)",
        
        // Login page
        adminDashboard: "Admin Dashboard",
        pleaseLogin: "Please login to continue",
        cityManagement: "Municipal Management",
        realTimeManagement: "Real-time civic service management",
        lastUpdated: "Last updated",
        
        // Messages page
        messages: "Messages",
        searchMessages: "Search messages...",
        allRoles: "All Roles",
        admin: "Admin",
        worker: "Worker", 
        citizen: "Citizen",
        noMessages: "No messages found",
        typeMessage: "Type a message...",
        sending: "Sending...",
        send: "Send",
        
        // Applications page
        workerApplications: "Worker Applications",
        totalApplications: "Total Applications",
        approved: "Approved",
        rejected: "Rejected",
        searchApplications: "Search applications...",
        allStatuses: "All Statuses",
        noApplicationsFound: "No applications found",
        applicant: "Applicant",
        contact: "Contact",
        department: "Department",
        status: "Status",
        applicationDate: "Application Date",
        actions: "Actions",
        applicationDetails: "Application Details",
        personalInformation: "Personal Information",
        fullName: "Full Name",
        username: "Username",
        email: "Email",
        phone: "Phone",
        address: "Address",
        
        // Heatmap page
        issueHeatmap: "Issue Heatmap",
        visualizeIssueDistribution: "Visualize issue distribution across the city",
        workDetails: "Work Details",
        speciality: "Speciality",
        experience: "Experience",
        years: "Years",
        education: "Education",
        previousWork: "Previous Work",
        emergencyContact: "Emergency Contact",
        name: "Name",
        applicationStatus: "Application Status",
        reviewedAt: "Reviewed At",
        rejectionReason: "Rejection Reason",
        adminNotes: "Admin Notes",
        idCard: "ID Card",
        idType: "ID Type",
        idNumber: "ID Number",
        skills: "Skills",
        certifications: "Certifications",
        processing: "Processing...",
        approve: "Approve",
        reject: "Reject",
        
        // Heatmap page
        issuesHeatmap: "Issues Heatmap",
        heatmap: "Heatmap",
        statistics: "Statistics",
        allCategories: "All Categories",
        streetlighting: "Street Lighting",
        watersupply: "Water Supply",
        sanitation: "Sanitation",
        drainage: "Drainage",
        wastemanagement: "Waste Management",
        roadmaintenance: "Road Maintenance",
        last7Days: "Last 7 Days",
        last30Days: "Last 30 Days",
        last90Days: "Last 90 Days",
        lastYear: "Last Year",
        loadingHeatmap: "Loading heatmap data...",
        issueDistribution: "Issue Distribution",
        dataPoints: "Data Points",
        interactiveHeatmap: "Interactive Heatmap View",
        heatmapWillShow: "Heatmap will show",
        timeRange: "Time Range",
        intensity: "Intensity",
        low: "Low",
        medium: "Medium",
        high: "High",
        totalDataPoints: "Total Data Points",
        hotspots: "Hotspots",
        averageIntensity: "Average Intensity",
        maxIssuesAtLocation: "Max Issues at Location",
        locationStatistics: "Location Statistics",
        noStatsAvailable: "No statistics available",
        area: "Area",
        totalIssues: "Total Issues",
        completedIssues: "Completed Issues",
        completionRate: "Completion Rate",
        avgResponseTime: "Avg Response Time",
        days: "Days"
      }
    },
    hi: {
      translation: {
        // Header
        notifications: "सूचनाएं",
        viewAll: "सभी देखें",
        noNotifications: "कोई सूचना नहीं",
        profile: "प्रोफ़ाइल",
        settings: "सेटिंग्स",
        logout: "लॉग आउट",
        adminName: "प्रशासक",
        cityLocation: "कोलकाता, भारत",
        newIssueReport: "नई समस्या रिपोर्ट",
        taskUpdate: "कार्य अपडेट",
        
        // Sidebar
        dashboard: "डैशबोर्ड",
        reports: "रिपोर्ट्स",
        workers: "कार्यकर्ता",
        analytics: "विश्लेषण",
        quickActions: "त्वरित कार्य",
        assignWorker: "कार्यकर्ता असाइन करें",
        createReport: "रिपोर्ट बनाएं",
        sendAlert: "अलर्ट भेजें",
        
        // Dashboard
        totalReports: "कुल रिपोर्ट्स",
        activeWorkers: "सक्रिय कार्यकर्ता",
        pendingTasks: "लंबित कार्य",
        resolvedToday: "आज हल किए गए",
        recentActivity: "हाल की गतिविधि",
        recentReports: "हाल की रिपोर्ट्स",
        workerPerformance: "कार्यकर्ता प्रदर्शन",
        taskDistribution: "कार्य वितरण",
        
        // Status
        pending: "लंबित",
        inProgress: "प्रगति में",
        completed: "पूर्ण",
        cancelled: "रद्द",
        
        // Actions
        view: "देखें",
        edit: "संपादित करें",
        assign: "असाइन करें",
        resolve: "हल करें",
        delete: "हटाएं",
        
        // Time
        justNow: "अभी",
        minutesAgo: "{{count}} मिनट पहले",
        hoursAgo: "{{count}} घंटे पहले",
        daysAgo: "{{count}} दिन पहले",
        
        // Categories
        roadMaintenance: "सड़क रखरखाव",
        waterSupply: "पानी की आपूर्ति",
        wasteManagement: "अपशिष्ट प्रबंधन",
        streetLighting: "सड़क प्रकाश",
        publicSafety: "सार्वजनिक सुरक्षा",
        
        // Data Initializer
        dataInitializer: "डेटा इनिशियलाइज़र",
        initializeData: "भारतीय डेटा इनिशियलाइज़ करें",
        dataDescription: "डेटाबेस को वास्तविक भारतीय नगरपालिका डेटा से भरें जिसमें कार्यकर्ता, कार्य और रिपोर्ट शामिल हैं।",
        creating: "{{item}} बना रहे हैं...",
        created: "{{count}} {{item}} बनाए गए",
        initializationComplete: "डेटा इनिशियलाइज़ेशन पूर्ण!",
        
        // Language selector
        language: "भाषा",
        english: "English (अंग्रेजी)",
        hindi: "हिन्दी",
        bengali: "বাংলা (बंगाली)",
        
        // Login page
        adminDashboard: "प्रशासन डैशबोर्ड",
        pleaseLogin: "कृपया लॉग इन करें",
        cityManagement: "नगरीय प्रबंधन",
        realTimeManagement: "रियल-टाइम शहरी सेवा प्रबंधन",
        lastUpdated: "अंतिम अपडेट",
        
        // Messages page
        messages: "संदेश",
        searchMessages: "संदेश खोजें...",
        allRoles: "सभी भूमिकाएं",
        admin: "प्रशासक",
        worker: "कार्यकर्ता", 
        citizen: "नागरिक",
        noMessages: "कोई संदेश नहीं मिला",
        typeMessage: "संदेश लिखें...",
        sending: "भेज रहे हैं...",
        send: "भेजें",
        
        // Applications page
        workerApplications: "कार्यकर्ता आवेदन",
        totalApplications: "कुल आवेदन",
        approved: "स्वीकृत",
        rejected: "अस्वीकृत",
        searchApplications: "आवेदन खोजें...",
        allStatuses: "सभी स्थितियां",
        noApplicationsFound: "कोई आवेदन नहीं मिला",
        applicant: "आवेदक",
        contact: "संपर्क",
        department: "विभाग",
        status: "स्थिति",
        applicationDate: "आवेदन तिथि",
        actions: "कार्य",
        applicationDetails: "आवेदन विवरण",
        personalInformation: "व्यक्तिगत जानकारी",
        fullName: "पूरा नाम",
        username: "उपयोगकर्ता नाम",
        email: "ईमेल",
        phone: "फोन",
        address: "पता",
        
        // Heatmap page
        issueHeatmap: "समस्या हीटमैप",
        visualizeIssueDistribution: "शहर में समस्याओं का वितरण देखें",
        workDetails: "कार्य विवरण",
        speciality: "विशेषता",
        experience: "अनुभव",
        years: "वर्ष",
        education: "शिक्षा",
        previousWork: "पूर्व कार्य",
        emergencyContact: "आपातकालीन संपर्क",
        name: "नाम",
        applicationStatus: "आवेदन स्थिति",
        reviewedAt: "समीक्षा की गई",
        rejectionReason: "अस्वीकृति कारण",
        adminNotes: "प्रशासक टिप्पणी",
        idCard: "पहचान पत्र",
        idType: "पहचान प्रकार",
        idNumber: "पहचान संख्या",
        skills: "कौशल",
        certifications: "प्रमाणपत्र",
        processing: "प्रसंस्करण...",
        approve: "स्वीकृत करें",
        reject: "अस्वीकार करें",
        
        // Heatmap page
        issuesHeatmap: "मुद्दे हीटमैप",
        heatmap: "हीटमैप",
        statistics: "आंकड़े",
        allCategories: "सभी श्रेणियां",
        streetlighting: "सड़क प्रकाश",
        watersupply: "पानी की आपूर्ति",
        sanitation: "स्वच्छता",
        drainage: "जल निकासी",
        wastemanagement: "अपशिष्ट प्रबंधन",
        roadmaintenance: "सड़क रखरखाव",
        last7Days: "पिछले 7 दिन",
        last30Days: "पिछले 30 दिन",
        last90Days: "पिछले 90 दिन",
        lastYear: "पिछला वर्ष",
        loadingHeatmap: "हीटमैप डेटा लोड हो रहा है...",
        issueDistribution: "समस्या वितरण",
        dataPoints: "डेटा पॉइंट्स",
        interactiveHeatmap: "इंटरैक्टिव हीटमैप व्यू",
        heatmapWillShow: "हीटमैप दिखाएगा",
        timeRange: "समय सीमा",
        intensity: "तीव्रता",
        low: "कम",
        medium: "मध्यम",
        high: "उच्च",
        totalDataPoints: "कुल डेटा पॉइंट्स",
        hotspots: "हॉटस्पॉट्स",
        averageIntensity: "औसत तीव्रता",
        maxIssuesAtLocation: "स्थान पर अधिकतम समस्याएं",
        locationStatistics: "स्थान आंकड़े",
        noStatsAvailable: "कोई आंकड़े उपलब्ध नहीं",
        area: "क्षेत्र",
        totalIssues: "कुल समस्याएं",
        completedIssues: "पूर्ण समस्याएं",
        completionRate: "पूर्णता दर",
        avgResponseTime: "औसत प्रतिक्रिया समय",
        days: "दिन"
      }
    },
    bn: {
      translation: {
        // Header
        notifications: "বিজ্ঞপ্তি",
        viewAll: "সব দেখুন",
        noNotifications: "কোন বিজ্ঞপ্তি নেই",
        profile: "প্রোফাইল",
        settings: "সেটিংস",
        logout: "লগ আউট",
        adminName: "প্রশাসক",
        cityLocation: "কলকাতা, ভারত",
        newIssueReport: "নতুন সমস্যা রিপোর্ট",
        taskUpdate: "কাজের আপডেট",
        
        // Sidebar
        dashboard: "ড্যাশবোর্ড",
        reports: "রিপোর্ট",
        workers: "কর্মী",
        analytics: "বিশ্লেষণ",
        quickActions: "দ্রুত কর্ম",
        assignWorker: "কর্মী নিয়োগ",
        createReport: "রিপোর্ট তৈরি",
        sendAlert: "সতর্কতা পাঠান",
        
        // Dashboard
        totalReports: "মোট রিপোর্ট",
        activeWorkers: "সক্রিয় কর্মী",
        pendingTasks: "অমীমাংসিত কাজ",
        resolvedToday: "আজ সমাধান",
        recentActivity: "সাম্প্রতিক কার্যকলাপ",
        recentReports: "সাম্প্রতিক রিপোর্ট",
        workerPerformance: "কর্মী কর্মক্ষমতা",
        taskDistribution: "কাজ বিতরণ",
        
        // Status
        pending: "অমীমাংসিত",
        inProgress: "চলমান",
        completed: "সম্পন্ন",
        cancelled: "বাতিল",
        
        // Actions
        view: "দেখুন",
        edit: "সম্পাদনা",
        assign: "নিয়োগ",
        resolve: "সমাধান",
        delete: "মুছুন",
        
        // Time
        justNow: "এখনই",
        minutesAgo: "{{count}} মিনিট আগে",
        hoursAgo: "{{count}} ঘন্টা আগে",
        daysAgo: "{{count}} দিন আগে",
        
        // Categories
        roadMaintenance: "রাস্তা রক্ষণাবেক্ষণ",
        waterSupply: "জল সরবরাহ",
        wasteManagement: "বর্জ্য ব্যবস্থাপনা",
        streetLighting: "রাস্তার আলো",
        publicSafety: "জনিক নিরাপত্তা",
        
        // Data Initializer
        dataInitializer: "ডেটা ইনিশিয়ালাইজার",
        initializeData: "ভারতীয় ডেটা ইনিশিয়ালাইজ",
        dataDescription: "ডেটাবেসে বাস্তবসম্মত ভারতীয় পৌর ডেটা দিয়ে পূরণ করুন যাতে কর্মী, কাজ এবং রিপোর্ট রয়েছে।",
        creating: "{{item}} তৈরি করা হচ্ছে...",
        created: "{{count}} {{item}} তৈরি হয়েছে",
        initializationComplete: "ডেটা ইনিশিয়ালাইজেশন সম্পন্ন!",
        
        // Language selector
        language: "ভাষা",
        english: "English (ইংরেজি)",
        hindi: "हिन्दी (হিন্দি)",
        bengali: "বাংলা",
        
        // Login page
        adminDashboard: "প্রশাসনিক ড্যাশবোর্ড",
        pleaseLogin: "অনুগ্রহ করে লগইন করুন",
        cityManagement: "পৌর ব্যবস্থাপনা",
        realTimeManagement: "রিয়েল-টাইম নাগরিক সেবা ব্যবস্থাপনা",
        lastUpdated: "শেষ আপডেট",
        
        // Messages page
        messages: "বার্তা",
        searchMessages: "বার্তা খুঁজুন...",
        allRoles: "সব ভূমিকা",
        admin: "প্রশাসক",
        worker: "কর্মী", 
        citizen: "নাগরিক",
        noMessages: "কোন বার্তা পাওয়া যায়নি",
        typeMessage: "বার্তা লিখুন...",
        sending: "পাঠানো হচ্ছে...",
        send: "পাঠান",
        
        // Applications page
        workerApplications: "কর্মী আবেদন",
        totalApplications: "মোট আবেদন",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        searchApplications: "আবেদন খুঁজুন...",
        allStatuses: "সব অবস্থা",
        noApplicationsFound: "কোন আবেদন পাওয়া যায়নি",
        applicant: "আবেদনকারী",
        contact: "যোগাযোগ",
        department: "বিভাগ",
        status: "অবস্থা",
        applicationDate: "আবেদনের তারিখ",
        actions: "কর্ম",
        applicationDetails: "আবেদনের বিবরণ",
        personalInformation: "ব্যক্তিগত তথ্য",
        fullName: "পূর্ণ নাম",
        username: "ব্যবহারকারীর নাম",
        email: "ইমেইল",
        phone: "ফোন",
        address: "ঠিকানা",
        
        // Heatmap page
        issueHeatmap: "সমস্যা হিটম্যাপ",
        visualizeIssueDistribution: "শহরে সমস্যার বিতরণ দেখুন",
        workDetails: "কাজের বিবরণ",
        speciality: "বিশেষত্ব",
        experience: "অভিজ্ঞতা",
        years: "বছর",
        education: "শিক্ষা",
        previousWork: "পূর্ববর্তী কাজ",
        emergencyContact: "জরুরি যোগাযোগ",
        name: "নাম",
        applicationStatus: "আবেদনের অবস্থা",
        reviewedAt: "পর্যালোচনা করা হয়েছে",
        rejectionReason: "প্রত্যাখ্যানের কারণ",
        adminNotes: "প্রশাসকের মন্তব্য",
        idCard: "পরিচয়পত্র",
        idType: "পরিচয়ের ধরন",
        idNumber: "পরিচয় নম্বর",
        skills: "দক্ষতা",
        certifications: "সার্টিফিকেশন",
        processing: "প্রক্রিয়াকরণ...",
        approve: "অনুমোদন করুন",
        reject: "প্রত্যাখ্যান করুন",
        
        // Heatmap page
        issuesHeatmap: "সমস্যার হিটম্যাপ",
        heatmap: "হিটম্যাপ",
        statistics: "পরিসংখ্যান",
        allCategories: "সব বিভাগ",
        streetlighting: "রাস্তার আলো",
        watersupply: "পানি সরবরাহ",
        sanitation: "স্যানিটেশন",
        drainage: "নিকাশী",
        wastemanagement: "বর্জ্য ব্যবস্থাপনা",
        roadmaintenance: "রাস্তা রক্ষণাবেক্ষণ",
        last7Days: "গত ৭ দিন",
        last30Days: "গত ৩০ দিন",
        last90Days: "গত ৯০ দিন",
        lastYear: "গত বছর",
        loadingHeatmap: "হিটম্যাপ ডেটা লোড হচ্ছে...",
        issueDistribution: "সমস্যার বিতরণ",
        dataPoints: "ডেটা পয়েন্ট",
        interactiveHeatmap: "ইন্টারঅ্যাক্টিভ হিটম্যাপ ভিউ",
        heatmapWillShow: "হিটম্যাপ দেখাবে",
        timeRange: "সময়সীমা",
        intensity: "তীব্রতা",
        low: "কম",
        medium: "মাঝারি",
        high: "উচ্চ",
        totalDataPoints: "মোট ডেটা পয়েন্ট",
        hotspots: "হটস্পট",
        averageIntensity: "গড় তীব্রতা",
        maxIssuesAtLocation: "স্থানে সর্বোচ্চ সমস্যা",
        locationStatistics: "স্থানের পরিসংখ্যান",
        noStatsAvailable: "কোন পরিসংখ্যান নেই",
        area: "এলাকা",
        totalIssues: "মোট সমস্যা",
        completedIssues: "সম্পন্ন সমস্যা",
        completionRate: "সম্পূর্ণতার হার",
        avgResponseTime: "গড় প্রতিক্রিয়া সময়",
        days: "দিন"
      }
    }
  }

  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      })
  }
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize i18n first
  useEffect(() => {
    initI18n();
    setIsInitialized(true);
  }, []);

  // Load saved language after initialization
  useEffect(() => {
    if (isInitialized) {
      const savedLanguage = localStorage.getItem('civisamadhan-language') || 'en';
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [isInitialized]);

  // Create a stable setLanguage function
  const setLanguage = React.useCallback((lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('civisamadhan-language', lang);
  }, []);

  // Create a stable translation function
  const t = React.useCallback((key: string) => {
    if (!isInitialized || !i18n.isInitialized) {
      return key; // Return key as fallback if not initialized
    }
    return i18n.t(key);
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div>Loading CiviSamadhan...</div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};