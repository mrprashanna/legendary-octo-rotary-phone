document.addEventListener('DOMContentLoaded', function() {
    // Photo upload functionality
    const profilePhotoUpload = document.getElementById('profilePhotoUpload');
    const aboutPhotoUpload = document.getElementById('aboutPhotoUpload');
    const heroImage = document.querySelector('.hero-image img');
    const aboutImage = document.querySelector('.about-image img');
    const profileUploadBtn = document.getElementById('profileUploadBtn');
    const aboutUploadBtn = document.getElementById('aboutUploadBtn');

    // Create modal for photo cropping
    const createPhotoModal = () => {
        const modal = document.createElement('div');
        modal.classList.add('photo-modal');
        modal.innerHTML = `
            <div class="photo-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Adjust Your Photo</h3>
                <div class="crop-container">
                    <img id="cropImage" src="" alt="Upload image">
                </div>
                <div class="crop-controls">
                    <button id="rotateLeft" class="btn secondary-btn"><i class="fas fa-undo"></i></button>
                    <button id="rotateRight" class="btn secondary-btn"><i class="fas fa-redo"></i></button>
                    <button id="zoomIn" class="btn secondary-btn"><i class="fas fa-search-plus"></i></button>
                    <button id="zoomOut" class="btn secondary-btn"><i class="fas fa-search-minus"></i></button>
                </div>
                <button id="saveCrop" class="btn primary-btn">Save Photo</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close modal functionality
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        return modal;
    };

    // Initialize the modal
    const photoModal = createPhotoModal();

    // Function to handle image uploads
    const handleImageUpload = (file, targetImg, isProfile = true) => {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Display modal for cropping
            photoModal.style.display = 'flex';
            const cropImage = document.getElementById('cropImage');
            cropImage.src = e.target.result;
            
            // Save button functionality
            const saveBtn = document.getElementById('saveCrop');
            saveBtn.onclick = function() {
                // In a real implementation, you would use a library like cropperjs
                // For this demo, we'll just use the image as is
                targetImg.src = e.target.result;
                photoModal.style.display = 'none';
                
                // Store in localStorage to persist the image
                try {
                    localStorage.setItem(
                        isProfile ? 'portfolioProfileImage' : 'portfolioAboutImage', 
                        e.target.result
                    );
                    showNotification(`${isProfile ? 'Profile' : 'About'} photo updated successfully!`);
                } catch (e) {
                    console.error('Error saving image to localStorage:', e);
                    showNotification('Image too large for browser storage. Try using a smaller image.', 'error');
                }
            };
        };
        reader.readAsDataURL(file);
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };

    // Load saved images from localStorage
    const loadSavedImages = () => {
        const profileImage = localStorage.getItem('portfolioProfileImage');
        const aboutImageSrc = localStorage.getItem('portfolioAboutImage');
        
        if (profileImage && heroImage) {
            heroImage.src = profileImage;
        }
        
        if (aboutImageSrc && aboutImage) {
            aboutImage.src = aboutImageSrc;
        }
    };

    // Add event listeners
    if (profilePhotoUpload && profileUploadBtn) {
        profileUploadBtn.addEventListener('click', () => {
            profilePhotoUpload.click();
        });
        
        profilePhotoUpload.addEventListener('change', (e) => {
            handleImageUpload(e.target.files[0], heroImage, true);
        });
    }

    if (aboutPhotoUpload && aboutUploadBtn) {
        aboutUploadBtn.addEventListener('click', () => {
            aboutPhotoUpload.click();
        });
        
        aboutPhotoUpload.addEventListener('change', (e) => {
            handleImageUpload(e.target.files[0], aboutImage, false);
        });
    }

    // Load any saved images on page load
    loadSavedImages();

    // Simple rotate/zoom functionality (simulated)
    const rotateLeft = document.getElementById('rotateLeft');
    const rotateRight = document.getElementById('rotateRight');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const cropImage = document.getElementById('cropImage');
    
    if (rotateLeft && cropImage) {
        let rotation = 0;
        let scale = 1;
        
        rotateLeft.addEventListener('click', () => {
            rotation -= 90;
            cropImage.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        });
        
        rotateRight.addEventListener('click', () => {
            rotation += 90;
            cropImage.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        });
        
        zoomIn.addEventListener('click', () => {
            scale += 0.1;
            cropImage.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        });
        
        zoomOut.addEventListener('click', () => {
            if (scale > 0.5) scale -= 0.1;
            cropImage.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        });
    }
});
