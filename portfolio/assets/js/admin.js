// Admin Dashboard JavaScript - Main Initialization

// Import admin functions
document.write('<script src="../assets/js/admin-functions.js"></script>');

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize dashboard components
    initSidebar();
    initTabs();
    loadUserData();
    setupEventListeners();
    initProfilePhotoUpload();
    initAboutPhotoUpload();
    initProjectImageUpload();
    loadProjects();
    loadSkills();
    
    // Handle logout button
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        logout();
    });
});

// Authentication functions
function checkAuth() {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('portfolioAdminAuth') && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
    
    // Redirect to dashboard if already authenticated
    if (localStorage.getItem('portfolioAdminAuth') && window.location.href.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

function logout() {
    localStorage.removeItem('portfolioAdminAuth');
    window.location.href = 'login.html';
    showNotification('Logged out successfully', 'success');
}

// Sidebar navigation
function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionName = this.getAttribute('data-section');
            switchSection(sectionName);
        });
    });
}

// Switch between dashboard sections
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
}

// Tab navigation within sections
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs in this section
            this.parentElement.querySelectorAll('.tab-btn').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Load user data from localStorage
function loadUserData() {
    // Load profile image if exists
    const profileImg = localStorage.getItem('portfolioProfileImage');
    if (profileImg) {
        document.getElementById('profilePreview').src = profileImg;
        document.getElementById('headerProfileImg').src = profileImg;
    }

    // Load about image if exists
    const aboutImg = localStorage.getItem('portfolioAboutImage');
    if (aboutImg) {
        document.getElementById('aboutPhotoPreview').src = aboutImg;
    }
    
    // Load site content data if exists
    const siteData = JSON.parse(localStorage.getItem('portfolioSiteData') || '{}');
    
    // Populate form fields with existing data
    if (siteData.profile) {
        document.getElementById('fullName').value = siteData.profile.name || 'Prashanna Shrestha';
        document.getElementById('title').value = siteData.profile.title || 'B.Sc.CSIT Student';
        document.getElementById('email').value = siteData.profile.email || 'prashannas@proton.me';
        document.getElementById('location').value = siteData.profile.location || 'Kathmandu, Nepal';
        document.getElementById('about').value = siteData.profile.about || 'Hello! I\'m Prashanna Shrestha, a Computer Science and Information Technology student at the Institute of Science and Technology, Tribhuvan University, Nepal.';
    }
    
    if (siteData.hero) {
        document.getElementById('heroTitle').value = siteData.hero.title || 'Prashanna Shrestha';
        document.getElementById('heroSubtitle').value = siteData.hero.subtitle || 'B.Sc.CSIT Student at IOST, TU Nepal';
        document.getElementById('typedText').value = siteData.hero.typedText || 'CSIT Student, Web Developer, Programmer, Tech Enthusiast';
    }
    
    if (siteData.about) {
        document.getElementById('aboutHeader').value = siteData.about.header || 'B.Sc.CSIT Student with a passion for technology';
        document.getElementById('aboutText').value = siteData.about.text || 'Hello! I\'m Prashanna Shrestha, a Computer Science and Information Technology student at the Institute of Science and Technology, Tribhuvan University, Nepal.\n\nI\'m passionate about [Your Interests/Specializations] and constantly working to expand my knowledge and skills in the field of technology.\n\nMy goal is to [Your Career Goals/Aspirations], and I\'m enthusiastic about opportunities where I can contribute to innovative projects and continue learning.';
    }
    
    if (siteData.contact) {
        document.getElementById('contactEmail').value = siteData.contact.email || 'prashannas@proton.me';
        document.getElementById('contactGithub').value = siteData.contact.github || 'chief-prash';
        document.getElementById('contactInstagram').value = siteData.contact.instagram || 'mrprashanna';
        document.getElementById('contactLocation').value = siteData.contact.location || 'Kathmandu, Nepal';
    }
    
    // Load username
    const credentials = JSON.parse(localStorage.getItem('portfolioAdminCredentials') || '{}');
    if (credentials.username) {
        document.getElementById('adminUsername').value = credentials.username;
    }
}

// Setup event listeners for forms
function setupEventListeners() {
    // Profile form
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfileData);
    }
    
    // Hero section form
    const saveHeroBtn = document.getElementById('saveHeroBtn');
    if (saveHeroBtn) {
        saveHeroBtn.addEventListener('click', saveHeroData);
    }
    
    // About section form
    const saveAboutBtn = document.getElementById('saveAboutBtn');
    if (saveAboutBtn) {
        saveAboutBtn.addEventListener('click', saveAboutData);
    }
    
    // Contact form
    const saveContactBtn = document.getElementById('saveContactBtn');
    if (saveContactBtn) {
        saveContactBtn.addEventListener('click', saveContactData);
    }
    
    // Credentials form
    const credentialsForm = document.getElementById('credentialsForm');
    if (credentialsForm) {
        credentialsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateCredentials();
        });
    }
    
    // Project form
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', showProjectModal);
    }
    
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProject();
        });
    }
    
    // Close all modals when clicking on X or cancel buttons
    document.querySelectorAll('.modal-close, #cancelProjectBtn, #cancelSkillBtn, #cancelConfirmationBtn').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeModals);
        }
    });
    
    // Add skill buttons
    document.querySelectorAll('.add-skill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showSkillModal(null, category);
        });
    });
    
    // Save all skills
    const saveSkillsBtn = document.getElementById('saveSkillsBtn');
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', saveAllSkills);
    }
    
    // Skill form
    const skillForm = document.getElementById('skillForm');
    if (skillForm) {
        skillForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSkill();
        });
    }
    
    // View portfolio button
    const viewPortfolioBtn = document.querySelector('button[onclick="viewPortfolio()"]');
    if (viewPortfolioBtn) {
        viewPortfolioBtn.addEventListener('click', viewPortfolio);
    }
    
    // Color settings
    const saveColorsBtn = document.getElementById('saveColorsBtn');
    if (saveColorsBtn) {
        saveColorsBtn.addEventListener('click', saveColorSettings);
    }
    
    // Initialize color picker preview
    const primaryColorInput = document.getElementById('primaryColor');
    const secondaryColorInput = document.getElementById('secondaryColor');
    
    if (primaryColorInput && secondaryColorInput) {
        // Set initial colors if stored
        const colors = JSON.parse(localStorage.getItem('portfolioColors') || '{"primary":"#4e54c8","secondary":"#00b0ff"}');
        primaryColorInput.value = colors.primary;
        secondaryColorInput.value = colors.secondary;
        
        updateColorPreview(colors.primary, colors.secondary);
        
        // Update preview on color change
        primaryColorInput.addEventListener('input', function() {
            updateColorPreview(this.value, secondaryColorInput.value);
        });
        
        secondaryColorInput.addEventListener('input', function() {
            updateColorPreview(primaryColorInput.value, this.value);
        });
    }
    
    // Data management
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }
    
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', confirmResetData);
    }
}
