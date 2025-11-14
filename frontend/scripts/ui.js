// UI helpers, navigation, theme, modals, and auth state
(function(){
    const $all = (sel) => Array.from(document.querySelectorAll(sel));

    const Site = {
        isLoggedIn: false,
        lastFocusedElement: null,
        // Open modal and enable a focus trap so Tab/Shift+Tab cycles inside the modal
        openModal(modal){
            if(!modal) return;
            this.lastFocusedElement = document.activeElement;
            modal.classList.remove('hidden');
            // discover focusable elements inside the modal
            const focusableSelector = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
            const focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
            // focus the first focusable element if present
            if(focusableElements.length){ focusableElements[0].focus(); }
            // prevent background scroll
            document.body.style.overflow = 'hidden';

            // focus trap handler (keeps Tab within modal)
            const trap = (e) => {
                if(e.key !== 'Tab') return;
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];
                if(!first || !last) return;
                if(e.shiftKey){ // backward
                    if(document.activeElement === first){ e.preventDefault(); last.focus(); }
                } else { // forward
                    if(document.activeElement === last){ e.preventDefault(); first.focus(); }
                }
            };
            // attach handler to document while modal is open
            document.addEventListener('keydown', trap);
            // save references so we can remove the listener on close
            this._modalTrap = trap;
            this._modalFocusable = focusableElements;
            this._activeModal = modal;
        },
        // Close modal and remove focus trap
        closeModal(modal){
            if(!modal) return;
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            // remove trap if present
            if(this._modalTrap){ document.removeEventListener('keydown', this._modalTrap); delete this._modalTrap; }
            delete this._modalFocusable;
            this._activeModal = null;
            // restore focus to the element that opened the modal
            if(this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function'){
                try{ this.lastFocusedElement.focus(); }catch(err){}
            }
        },
        showError(message, el){ if(!el) return; el.innerHTML = message; el.className = 'error'; el.style.display = 'block'; }
    };

    document.addEventListener('DOMContentLoaded', () => {
        // cached elements
        const pageContents = $all('.page-content');
        const navLinks = $all('.nav-link');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        const profileMenuButton = document.getElementById('profile-menu-button');
        const profileMenu = document.getElementById('profile-menu');
        const eventsMenuButton = document.getElementById('events-menu-button');
        const eventsMenu = document.getElementById('events-menu');
        const htmlElement = document.documentElement;
        const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const authLinks = $all('.auth-link');
        const authFeatures = $all('.auth-feature');
        const loginLinkDesktop = document.getElementById('login-link-desktop');
        const loginLinkMobile = document.getElementById('login-link-mobile');
        const logoutLinkDesktop = document.getElementById('logout-link-desktop');
        const logoutLinkMobile = document.getElementById('logout-link-mobile');
        const loginModal = document.getElementById('login-modal');
        const closeLoginModalButton = document.getElementById('close-login-modal');
        const loginForm = document.getElementById('login-form');

        // Navigation & routing
        function showPage(pageId){
            if(pageId !== 'home' && !Site.isLoggedIn){ if(loginModal) Site.openModal(loginModal); if(loginModal) loginModal.dataset.desiredPage = pageId; return; }
            pageContents.forEach(p => p.classList.add('hidden'));
            const target = document.getElementById(`page-${pageId}`); if(target) target.classList.remove('hidden');
            navLinks.forEach(link => { if(link.dataset.page === pageId) link.classList.add('text-accent-orange'); else link.classList.remove('text-accent-orange'); });
            if(mobileMenu) mobileMenu.classList.add('hidden'); if(hamburgerIcon) hamburgerIcon.style.display = 'block'; if(closeIcon) closeIcon.style.display = 'none'; if(mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded','false');
            if(profileMenu) profileMenu.classList.add('hidden'); if(eventsMenu) eventsMenu.classList.add('hidden'); window.scrollTo(0,0);
        }

        // wire nav links
        navLinks.forEach(link => { if(!link) return; link.addEventListener('click', e => { e.preventDefault(); showPage(link.dataset.page); }); });

        // auth UI updates
        function updateUIForAuthState(){ if(Site.isLoggedIn){ authLinks.forEach(l=>l.classList.remove('hidden')); authFeatures.forEach(f=>f.classList.remove('hidden')); if(loginLinkDesktop) loginLinkDesktop.classList.add('hidden'); if(loginLinkMobile) loginLinkMobile.classList.add('hidden'); } else { authLinks.forEach(l=>l.classList.add('hidden')); authFeatures.forEach(f=>f.classList.add('hidden')); if(loginLinkDesktop) loginLinkDesktop.classList.remove('hidden'); if(loginLinkMobile) loginLinkMobile.classList.remove('hidden'); } }

        function login(){ Site.isLoggedIn = true; Site.closeModal(loginModal); updateUIForAuthState(); const desired = loginModal && loginModal.dataset && loginModal.dataset.desiredPage; if(desired){ delete loginModal.dataset.desiredPage; showPage(desired);} else showPage('home'); }
        function logout(){ Site.isLoggedIn = false; updateUIForAuthState(); showPage('home'); }

        // auth listeners
        if(loginForm) loginForm.addEventListener('submit', e => { e.preventDefault(); login(); });
        [loginLinkDesktop, loginLinkMobile].forEach(l => { if(!l) return; l.addEventListener('click', e => { e.preventDefault(); if(profileMenu) profileMenu.classList.add('hidden'); if(mobileMenu) mobileMenu.classList.add('hidden'); Site.openModal(loginModal); }); });
        [logoutLinkDesktop, logoutLinkMobile].forEach(l => { if(!l) return; l.addEventListener('click', e => { e.preventDefault(); logout(); }); });
        if(closeLoginModalButton) closeLoginModalButton.addEventListener('click', () => Site.closeModal(loginModal));

        // mobile menu toggle
        if(mobileMenuButton) mobileMenuButton.addEventListener('click', () => { const isHidden = mobileMenu && mobileMenu.classList.toggle('hidden'); if(isHidden){ if(hamburgerIcon) hamburgerIcon.style.display = 'block'; if(closeIcon) closeIcon.style.display = 'none'; mobileMenuButton.setAttribute('aria-expanded','false'); } else { if(hamburgerIcon) hamburgerIcon.style.display = 'none'; if(closeIcon) closeIcon.style.display = 'block'; mobileMenuButton.setAttribute('aria-expanded','true'); } });

        // dropdowns
        if(profileMenuButton) profileMenuButton.addEventListener('click', e => { e.stopPropagation(); if(profileMenu) profileMenu.classList.toggle('hidden'); if(eventsMenu) eventsMenu.classList.add('hidden'); });
        if(eventsMenuButton) eventsMenuButton.addEventListener('click', e => { e.stopPropagation(); if(eventsMenu) eventsMenu.classList.toggle('hidden'); if(profileMenu) profileMenu.classList.add('hidden'); });
        window.addEventListener('click', e => { if(profileMenu && !profileMenu.classList.contains('hidden')){ if(!profileMenu.contains(e.target) && profileMenuButton && !profileMenuButton.contains(e.target)) profileMenu.classList.add('hidden'); } if(eventsMenu && !eventsMenu.classList.contains('hidden')){ if(!eventsMenu.contains(e.target) && eventsMenuButton && !eventsMenuButton.contains(e.target)) eventsMenu.classList.add('hidden'); } });

        // theme toggles
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if(currentTheme === 'dark'){ if(themeToggleDesktop) themeToggleDesktop.checked = true; if(themeToggleMobile) themeToggleMobile.checked = true; htmlElement.classList.add('dark'); } else { htmlElement.classList.remove('dark'); }
        function handleThemeChange(e){ const checked = e.target.checked; if(checked){ htmlElement.classList.add('dark'); localStorage.setItem('theme','dark'); if(themeToggleDesktop) themeToggleDesktop.checked = true; if(themeToggleMobile) themeToggleMobile.checked = true; } else { htmlElement.classList.remove('dark'); localStorage.setItem('theme','light'); if(themeToggleDesktop) themeToggleDesktop.checked = false; if(themeToggleMobile) themeToggleMobile.checked = false; } }
        if(themeToggleDesktop) themeToggleDesktop.addEventListener('change', handleThemeChange); if(themeToggleMobile) themeToggleMobile.addEventListener('change', handleThemeChange);

        // escape key closes modals/menus
        window.addEventListener('keydown', e => { if(e.key === 'Escape'){ if(loginModal && !loginModal.classList.contains('hidden')) Site.closeModal(loginModal); const addPhotoModal = document.getElementById('add-photo-modal'); if(addPhotoModal && !addPhotoModal.classList.contains('hidden')) Site.closeModal(addPhotoModal); const bookTripModal = document.getElementById('book-trip-modal'); if(bookTripModal && !bookTripModal.classList.contains('hidden')) Site.closeModal(bookTripModal); if(mobileMenu && !mobileMenu.classList.contains('hidden')){ mobileMenu.classList.add('hidden'); if(mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded','false'); } } });

        // footer year
        const currentYearSpan = document.getElementById('current-year'); if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

        // expose Site and helpers
        window.Site = Site;
        window.Site.showPage = showPage;
        window.Site.updateUIForAuthState = updateUIForAuthState;
    });
})();
