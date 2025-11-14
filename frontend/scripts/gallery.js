// Gallery: add-photo modal and adding photos safely
(function(){
    document.addEventListener('DOMContentLoaded', () => {
        const addPhotoButton = document.getElementById('add-photo-button');
        const addPhotoModal = document.getElementById('add-photo-modal');
        const closePhotoModalButton = document.getElementById('close-photo-modal');
        const addPhotoForm = document.getElementById('add-photo-form');
        const galleryGrid = document.getElementById('gallery-grid');
        const imgUrlInput = document.getElementById('img-url');
        const imgFileInput = document.getElementById('img-file');
        const imgCaptionInput = document.getElementById('img-caption');

        if(addPhotoButton) addPhotoButton.addEventListener('click', () => { if(window.Site) window.Site.openModal(addPhotoModal); });
        if(closePhotoModalButton) closePhotoModalButton.addEventListener('click', () => { if(window.Site) window.Site.closeModal(addPhotoModal); });

        if(addPhotoForm){
            addPhotoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const caption = (imgCaptionInput && imgCaptionInput.value) || 'Gallery Image';
                const file = imgFileInput && imgFileInput.files && imgFileInput.files[0];
                const url = imgUrlInput && imgUrlInput.value;
                if(!file && !url){ alert('Please provide an image URL or upload a file.'); return; }
                if(file){ const reader = new FileReader(); reader.onload = (ev) => addNewPhoto(ev.target.result, caption); reader.readAsDataURL(file); }
                else addNewPhoto(url, caption);
            });
        }

        function addNewPhoto(src, caption){ if(!galleryGrid) return; const item = document.createElement('div'); item.className = 'gallery-item'; const wrapper = document.createElement('div'); wrapper.className = 'gallery-item-image-wrapper'; const img = document.createElement('img'); img.src = src; img.alt = caption || 'Gallery Image'; img.loading = 'lazy'; wrapper.appendChild(img); const cap = document.createElement('div'); cap.className = 'gallery-item-caption'; const p = document.createElement('p'); p.textContent = caption || ''; cap.appendChild(p); item.appendChild(wrapper); item.appendChild(cap); galleryGrid.appendChild(item); if(addPhotoForm) addPhotoForm.reset(); if(window.Site) window.Site.closeModal(addPhotoModal); }
    });
})();
