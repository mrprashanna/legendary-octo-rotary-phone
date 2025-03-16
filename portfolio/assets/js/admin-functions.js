// Admin Dashboard Helper Functions

// Profile Photo Upload Handling
function initProfilePhotoUpload() {
    const profilePreview = document.getElementById('profilePreview');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const uploadOverlay = profilePreview?.parentElement.querySelector('.upload-overlay');
    
    if (uploadOverlay && profilePhotoInput) {
        uploadOverlay.addEventListener('click', function() {
            profilePhotoInput.click();
        });
        
        profilePhotoInput.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0], 'profile');
        });
    }
    
    // Update button
    const updateProfilePhotoBtn = document.getElementById('updateProfilePhotoBtn');
    if (updateProfilePhotoBtn) {
        updateProfilePhotoBtn.addEventListener('click', function() {
            profilePhotoInput.click();
        });
    }
}

// About Photo Upload Handling
function initAboutPhotoUpload() {
    const aboutPhotoPreview = document.getElementById('aboutPhotoPreview');
    const aboutPhotoInput = document.getElementById('aboutPhotoInput');
    const uploadOverlay = aboutPhotoPreview?.parentElement.querySelector('.upload-overlay');
    
    if (uploadOverlay && aboutPhotoInput) {
        uploadOverlay.addEventListener('click', function() {
            aboutPhotoInput.click();
        });
        
        aboutPhotoInput.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0], 'about');
        });
    }
}

// Project Image Upload Handling
function initProjectImageUpload() {
    const projectImagePreview = document.getElementById('projectImagePreview');
    const projectImageInput = document.getElementById('projectImageInput');
    const uploadOverlay = projectImagePreview?.parentElement.querySelector('.upload-overlay');
    
    if (uploadOverlay && projectImageInput) {
        uploadOverlay.addEventListener('click', function() {
            projectImageInput.click();
        });
        
        projectImageInput.addEventListener('change', function(e) {
            handleImageUpload(e.target.files[0], 'project');
        });
    }
}

// Generic Image Upload Handler
function handleImageUpload(file, type) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Update preview based on type
        switch (type) {
            case 'profile':
                document.getElementById('profilePreview').src = imageData;
                document.getElementById('headerProfileImg').src = imageData;
                localStorage.setItem('portfolioProfileImage', imageData);
                showNotification('Profile photo updated successfully', 'success');
                break;
            case 'about':
                document.getElementById('aboutPhotoPreview').src = imageData;
                localStorage.setItem('portfolioAboutImage', imageData);
                showNotification('About photo updated successfully', 'success');
                break;
            case 'project':
                document.getElementById('projectImagePreview').src = imageData;
                // Don't save to localStorage yet, will be saved with project data
                break;
        }
    };
    
    reader.readAsDataURL(file);
}

// Project Management Functions
function loadProjects() {
    const projectsGrid = document.querySelector('.admin-projects');
    if (!projectsGrid) return;
    
    // Clear existing projects
    projectsGrid.innerHTML = '';
    
    // Get projects from localStorage
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    
    if (projects.length === 0) {
        // Add sample projects if none exist
        const sampleProjects = [
            {
                id: 'project1',
                name: 'Portfolio Website',
                category: 'web',
                description: 'A modern portfolio website showcasing my skills and projects.',
                image: '../assets/images/project1-placeholder.jpg',
                link: '#',
                repo: 'https://github.com/chief-prash/portfolio'
            },
            {
                id: 'project2',
                name: 'Student Management System',
                category: 'web',
                description: 'A web application for managing student records and attendance.',
                image: '../assets/images/project2-placeholder.jpg',
                link: '#',
                repo: 'https://github.com/chief-prash/student-ms'
            }
        ];
        
        sampleProjects.forEach(project => {
            addProjectToGrid(project, projectsGrid);
        });
        
        // Save sample projects to localStorage
        localStorage.setItem('portfolioProjects', JSON.stringify(sampleProjects));
    } else {
        // Add existing projects to grid
        projects.forEach(project => {
            addProjectToGrid(project, projectsGrid);
        });
    }
}

function addProjectToGrid(project, grid) {
    const projectCard = document.createElement('div');
    projectCard.className = 'admin-project-card';
    projectCard.dataset.id = project.id;
    
    projectCard.innerHTML = `
        <div class="admin-project-img">
            <img src="${project.image}" alt="${project.name}">
            <div class="project-overlay">
                <div class="overlay-btn edit-project" title="Edit Project">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="overlay-btn delete-project" title="Delete Project">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        </div>
        <div class="admin-project-info">
            <h3>${project.name}</h3>
            <p>${project.category.charAt(0).toUpperCase() + project.category.slice(1)}</p>
            <div class="project-actions">
                ${project.link ? `<a href="${project.link}" target="_blank" class="btn secondary-btn btn-sm"><i class="fas fa-external-link-alt"></i> View</a>` : ''}
                ${project.repo ? `<a href="${project.repo}" target="_blank" class="btn primary-btn btn-sm"><i class="fab fa-github"></i> Repo</a>` : ''}
            </div>
        </div>
    `;
    
    // Add event listeners
    projectCard.querySelector('.edit-project').addEventListener('click', function() {
        editProject(project.id);
    });
    
    projectCard.querySelector('.delete-project').addEventListener('click', function() {
        deleteProject(project.id);
    });
    
    grid.appendChild(projectCard);
}

function showProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');
    
    // Reset form
    form.reset();
    document.getElementById('projectImagePreview').src = '../assets/images/project1-placeholder.jpg';
    
    if (projectId) {
        // Edit mode
        modalTitle.textContent = 'Edit Project';
        
        // Get project data
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectCategory').value = project.category;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectImagePreview').src = project.image;
            document.getElementById('projectLink').value = project.link || '';
            document.getElementById('projectRepo').value = project.repo || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Project';
        document.getElementById('projectId').value = 'project' + Date.now();
    }
    
    // Show modal
    modal.style.display = 'flex';
}

function saveProject() {
    const projectId = document.getElementById('projectId').value;
    const projectName = document.getElementById('projectName').value;
    const projectCategory = document.getElementById('projectCategory').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectImage = document.getElementById('projectImagePreview').src;
    const projectLink = document.getElementById('projectLink').value;
    const projectRepo = document.getElementById('projectRepo').value;
    
    // Create project object
    const project = {
        id: projectId,
        name: projectName,
        category: projectCategory,
        description: projectDescription,
        image: projectImage,
        link: projectLink,
        repo: projectRepo
    };
    
    // Get existing projects
    let projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    
    // Check if editing or adding
    const existingIndex = projects.findIndex(p => p.id === projectId);
    
    if (existingIndex >= 0) {
        // Update existing project
        projects[existingIndex] = project;
        showNotification('Project updated successfully', 'success');
    } else {
        // Add new project
        projects.push(project);
        showNotification('Project added successfully', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    
    // Reload projects grid
    loadProjects();
    
    // Close modal
    closeModals();
}

function editProject(projectId) {
    showProjectModal(projectId);
}

function deleteProject(projectId) {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    confirmationTitle.textContent = 'Delete Project';
    confirmationMessage.textContent = 'Are you sure you want to delete this project? This action cannot be undone.';
    
    // Show modal
    confirmationModal.style.display = 'flex';
    
    // Set up confirm button
    confirmBtn.onclick = function() {
        // Delete project
        let projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Reload projects grid
        loadProjects();
        
        // Close modal
        closeModals();
        
        showNotification('Project deleted successfully', 'success');
    };
}

// Skills Management Functions
function loadSkills() {
    const programmingSkillsContainer = document.getElementById('programming-skills');
    const frameworkSkillsContainer = document.getElementById('framework-skills');
    
    if (!programmingSkillsContainer || !frameworkSkillsContainer) return;
    
    // Clear existing skills
    programmingSkillsContainer.innerHTML = '';
    frameworkSkillsContainer.innerHTML = '';
    
    // Get skills from localStorage
    const skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{"programming":[],"framework":[]}');
    
    if (skills.programming.length === 0 && skills.framework.length === 0) {
        // Add sample skills if none exist
        const sampleSkills = {
            programming: [
                { id: 'skill1', name: 'JavaScript', level: 85 },
                { id: 'skill2', name: 'HTML5', level: 90 },
                { id: 'skill3', name: 'CSS3', level: 80 },
                { id: 'skill4', name: 'Python', level: 75 }
            ],
            framework: [
                { id: 'skill5', name: 'React.js', level: 70 },
                { id: 'skill6', name: 'Node.js', level: 65 },
                { id: 'skill7', name: 'Bootstrap', level: 85 },
                { id: 'skill8', name: 'Git', level: 80 }
            ]
        };
        
        // Add sample skills to containers
        sampleSkills.programming.forEach(skill => {
            addSkillToContainer(skill, programmingSkillsContainer, 'programming');
        });
        
        sampleSkills.framework.forEach(skill => {
            addSkillToContainer(skill, frameworkSkillsContainer, 'framework');
        });
        
        // Save sample skills to localStorage
        localStorage.setItem('portfolioSkills', JSON.stringify(sampleSkills));
    } else {
        // Add existing skills to containers
        skills.programming.forEach(skill => {
            addSkillToContainer(skill, programmingSkillsContainer, 'programming');
        });
        
        skills.framework.forEach(skill => {
            addSkillToContainer(skill, frameworkSkillsContainer, 'framework');
        });
    }
}

function addSkillToContainer(skill, container, category) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.dataset.id = skill.id;
    
    skillItem.innerHTML = `
        <div class="skill-item-header">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level">${skill.level}%</span>
        </div>
        <div class="skill-progress">
            <div class="skill-progress-bar" style="width: ${skill.level}%"></div>
        </div>
        <div class="skill-actions">
            <button class="skill-edit" title="Edit Skill"><i class="fas fa-edit"></i></button>
            <button class="skill-delete" title="Delete Skill"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    
    // Add event listeners
    skillItem.querySelector('.skill-edit').addEventListener('click', function() {
        showSkillModal(skill.id, category);
    });
    
    skillItem.querySelector('.skill-delete').addEventListener('click', function() {
        deleteSkill(skill.id, category);
    });
    
    container.appendChild(skillItem);
}

function showSkillModal(skillId = null, category) {
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('skillModalTitle');
    const form = document.getElementById('skillForm');
    
    // Reset form
    form.reset();
    
    // Set category
    document.getElementById('skillCategory').value = category;
    
    if (skillId) {
        // Edit mode
        modalTitle.textContent = 'Edit Skill';
        
        // Get skill data
        const skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{"programming":[],"framework":[]}');
        const skill = skills[category].find(s => s.id === skillId);
        
        if (skill) {
            document.getElementById('skillId').value = skill.id;
            document.getElementById('skillName').value = skill.name;
            document.getElementById('skillLevel').value = skill.level;
            document.getElementById('skillLevelValue').textContent = skill.level + '%';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Skill';
        document.getElementById('skillId').value = 'skill' + Date.now();
        document.getElementById('skillLevel').value = 75;
        document.getElementById('skillLevelValue').textContent = '75%';
    }
    
    // Show modal
    modal.style.display = 'flex';
}

function saveSkill() {
    const skillId = document.getElementById('skillId').value;
    const skillName = document.getElementById('skillName').value;
    const skillLevel = document.getElementById('skillLevel').value;
    const category = document.getElementById('skillCategory').value;
    
    // Create skill object
    const skill = {
        id: skillId,
        name: skillName,
        level: parseInt(skillLevel)
    };
    
    // Get existing skills
    let skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{"programming":[],"framework":[]}');
    
    // Check if editing or adding
    const existingIndex = skills[category].findIndex(s => s.id === skillId);
    
    if (existingIndex >= 0) {
        // Update existing skill
        skills[category][existingIndex] = skill;
        showNotification('Skill updated successfully', 'success');
    } else {
        // Add new skill
        skills[category].push(skill);
        showNotification('Skill added successfully', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('portfolioSkills', JSON.stringify(skills));
    
    // Reload skills
    loadSkills();
    
    // Close modal
    closeModals();
}

function saveAllSkills() {
    showNotification('All skills saved successfully', 'success');
}

function deleteSkill(skillId, category) {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    confirmationTitle.textContent = 'Delete Skill';
    confirmationMessage.textContent = 'Are you sure you want to delete this skill? This action cannot be undone.';
    
    // Show modal
    confirmationModal.style.display = 'flex';
    
    // Set up confirm button
    confirmBtn.onclick = function() {
        // Delete skill
        let skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{"programming":[],"framework":[]}');
        skills[category] = skills[category].filter(s => s.id !== skillId);
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        
        // Reload skills
        loadSkills();
        
        // Close modal
        closeModals();
        
        showNotification('Skill deleted successfully', 'success');
    };
}

// Update skill level value
function updateSkillLevelValue(value) {
    document.getElementById('skillLevelValue').textContent = value + '%';
}

// Data Management Functions
function saveProfileData() {
    const fullName = document.getElementById('fullName').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    const location = document.getElementById('location').value;
    const about = document.getElementById('about').value;
    
    // Get existing site data
    let siteData = JSON.parse(localStorage.getItem('portfolioSiteData') || '{}');
    
    // Update profile data
    siteData.profile = {
        name: fullName,
        title: title,
        email: email,
        location: location,
        about: about
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioSiteData', JSON.stringify(siteData));
    
    showNotification('Profile data saved successfully', 'success');
}

function saveHeroData() {
    const heroTitle = document.getElementById('heroTitle').value;
    const heroSubtitle = document.getElementById('heroSubtitle').value;
    const typedText = document.getElementById('typedText').value;
    
    // Get existing site data
    let siteData = JSON.parse(localStorage.getItem('portfolioSiteData') || '{}');
    
    // Update hero data
    siteData.hero = {
        title: heroTitle,
        subtitle: heroSubtitle,
        typedText: typedText
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioSiteData', JSON.stringify(siteData));
    
    showNotification('Hero section saved successfully', 'success');
}

function saveAboutData() {
    const aboutHeader = document.getElementById('aboutHeader').value;
    const aboutText = document.getElementById('aboutText').value;
    
    // Get existing site data
    let siteData = JSON.parse(localStorage.getItem('portfolioSiteData') || '{}');
    
    // Update about data
    siteData.about = {
        header: aboutHeader,
        text: aboutText
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioSiteData', JSON.stringify(siteData));
    
    showNotification('About section saved successfully', 'success');
}

function saveContactData() {
    const contactEmail = document.getElementById('contactEmail').value;
    const contactGithub = document.getElementById('contactGithub').value;
    const contactInstagram = document.getElementById('contactInstagram').value;
    const contactLocation = document.getElementById('contactLocation').value;
    
    // Get existing site data
    let siteData = JSON.parse(localStorage.getItem('portfolioSiteData') || '{}');
    
    // Update contact data
    siteData.contact = {
        email: contactEmail,
        github: contactGithub,
        instagram: contactInstagram,
        location: contactLocation
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioSiteData', JSON.stringify(siteData));
    
    showNotification('Contact information saved successfully', 'success');
}

function updateCredentials() {
    const username = document.getElementById('adminUsername').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordMessage = document.getElementById('passwordMessage');
    
    // Get stored credentials
    const storedCredentials = JSON.parse(localStorage.getItem('portfolioAdminCredentials') || '{}');
    
    // Validate current password
    if (currentPassword !== storedCredentials.password) {
        passwordMessage.textContent = 'Current password is incorrect';
        passwordMessage.className = 'message error';
        return;
    }
    
    // Validate new password
    if (newPassword !== confirmPassword) {
        passwordMessage.textContent = 'New passwords do not match';
        passwordMessage.className = 'message error';
        return;
    }
    
    // Update credentials
    const updatedCredentials = {
        username: username,
        password: newPassword
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioAdminCredentials', JSON.stringify(updatedCredentials));
    
    // Show success message
    passwordMessage.textContent = 'Credentials updated successfully';
    passwordMessage.className = 'message success';
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    showNotification('Admin credentials updated successfully', 'success');
}

function saveColorSettings() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    
    // Save to localStorage
    localStorage.setItem('portfolioColors', JSON.stringify({
        primary: primaryColor,
        secondary: secondaryColor
    }));
    
    // Update CSS variables
    document.documentElement.style.setProperty('--admin-primary', primaryColor);
    document.documentElement.style.setProperty('--admin-secondary', secondaryColor);
    
    showNotification('Color settings saved successfully', 'success');
}

function updateColorPreview(primary, secondary) {
    const previewBox = document.getElementById('colorPreview');
    if (previewBox) {
        previewBox.style.background = `linear-gradient(45deg, ${primary}, ${secondary})`;
    }
}

function backupData() {
    // Create backup object
    const backup = {
        profileImage: localStorage.getItem('portfolioProfileImage'),
        aboutImage: localStorage.getItem('portfolioAboutImage'),
        siteData: JSON.parse(localStorage.getItem('portfolioSiteData') || '{}'),
        projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]'),
        skills: JSON.parse(localStorage.getItem('portfolioSkills') || '{"programming":[],"framework":[]}'),
        colors: JSON.parse(localStorage.getItem('portfolioColors') || '{"primary":"#4e54c8","secondary":"#00b0ff"}'),
        adminCredentials: JSON.parse(localStorage.getItem('portfolioAdminCredentials') || '{}')
    };
    
    // Convert to JSON string
    const backupString = JSON.stringify(backup);
    
    // Create and download backup file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backupString));
    element.setAttribute('download', 'portfolio_backup_' + new Date().toISOString().split('T')[0] + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showNotification('Backup created successfully', 'success');
}

function confirmResetData() {
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    confirmationTitle.textContent = 'Reset All Data';
    confirmationMessage.textContent = 'Are you sure you want to reset all data? This will erase all your settings and revert to default values. This action cannot be undone!';
    
    // Show modal
    confirmationModal.style.display = 'flex';
    
    // Set up confirm button
    confirmBtn.onclick = function() {
        // Reset all data
        resetData();
        
        // Close modal
        closeModals();
    };
}

function resetData() {
    // Keep only admin credentials
    const adminCredentials = localStorage.getItem('portfolioAdminCredentials');
    const auth = localStorage.getItem('portfolioAdminAuth');
    
    // Clear localStorage
    localStorage.clear();
    
    // Restore admin credentials
    localStorage.setItem('portfolioAdminCredentials', adminCredentials);
    if (auth) {
        localStorage.setItem('portfolioAdminAuth', auth);
    }
    
    // Reload page
    window.location.reload();
    
    showNotification('All data has been reset to default values', 'success');
}

// Helper Functions
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
}

function viewPortfolio() {
    window.open('../index.html', '_blank');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notificationPopup');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Set icon and class based on type
    notificationIcon.className = 'notification-icon';
    notificationIcon.classList.add(type);
    
    if (type === 'success') {
        notificationIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        notificationIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    } else if (type === 'warning') {
        notificationIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    // Set message
    notificationMessage.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
