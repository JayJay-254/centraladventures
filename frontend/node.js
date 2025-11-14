        document.addEventListener('DOMContentLoaded', () => {
            
            // --- State ---
            let isLoggedIn = false; // Simple auth state simulation

            // --- Page Elements ---
            const pageContents = document.querySelectorAll('.page-content');
            const navLinks = document.querySelectorAll('.nav-link');
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

            // --- Auth Elements ---
            const authLinks = document.querySelectorAll('.auth-link');
            const authFeatures = document.querySelectorAll('.auth-feature');
            const loginLinkDesktop = document.getElementById('login-link-desktop');
            const loginLinkMobile = document.getElementById('login-link-mobile');
            const logoutLinkDesktop = document.getElementById('logout-link-desktop');
            const logoutLinkMobile = document.getElementById('logout-link-mobile');
            const loginModal = document.getElementById('login-modal');
            const closeLoginModalButton = document.getElementById('close-login-modal');
            const loginForm = document.getElementById('login-form');

            // --- Gallery Modal Elements ---
            const addPhotoButton = document.getElementById('add-photo-button');
            const addPhotoModal = document.getElementById('add-photo-modal');
            const closePhotoModalButton = document.getElementById('close-photo-modal');
            const addPhotoForm = document.getElementById('add-photo-form');
            const galleryGrid = document.getElementById('gallery-grid');
            const imgUrlInput = document.getElementById('img-url');
            const imgFileInput = document.getElementById('img-file');
            const imgCaptionInput = document.getElementById('img-caption');
            
            // --- Booking Page Elements ---
            const tripList = document.getElementById('trip-list');
            const bookingSuccessMessage = document.getElementById('booking-success');
            const bookTripModal = document.getElementById('book-trip-modal');
            const closeBookTripModalButton = document.getElementById('close-book-trip-modal');
            const bookTripForm = document.getElementById('book-trip-form');
            const modalTripName = document.getElementById('modal-trip-name');
            const modalPeopleInput = document.getElementById('modal-people');
            const modalContactInput = document.getElementById('modal-contact');
            const modalTripTitleInput = document.getElementById('modal-trip-title-input');
            const modalTripPriceInput = document.getElementById('modal-trip-price-input');
            const modalTotalPrice = document.getElementById('modal-total-price');

            // --- Initial UI Update ---
            updateUIForAuthState();
            showPage('home'); // Show home page by default

            // --- Page Navigation ---
            function showPage(pageId) {
                // Check auth for protected pages
                if (pageId !== 'home' && !isLoggedIn) {
                    loginModal.classList.remove('hidden');
                    return; // Stop navigation
                }

                // Hide all pages
                pageContents.forEach(page => {
                    page.classList.add('hidden');
                });

                // Show target page
                const targetPage = document.getElementById(`page-${pageId}`);
                if (targetPage) {
                    targetPage.classList.remove('hidden');
                }

                // Update active nav link
                navLinks.forEach(link => {
                    if (link.dataset.page === pageId) {
                        link.classList.add('text-accent-orange');
                    } else {
                        link.classList.remove('text-accent-orange');
                    }
                });
                
                // Close mobile menu
                mobileMenu.classList.add('hidden');
                hamburgerIcon.style.display = 'block';
                closeIcon.style.display = 'none';
                
                // Close profile dropdown
                profileMenu.classList.add('hidden');

                // Close events dropdown
                if (eventsMenu) {
                    eventsMenu.classList.add('hidden');
                }

                // Scroll to top
                window.scrollTo(0, 0);
            }

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageId = link.dataset.page;
                    showPage(pageId);
                });
            });

            // --- Authentication Logic ---
            function updateUIForAuthState() {
                if (isLoggedIn) {
                    // Show protected links and features
                    authLinks.forEach(link => link.classList.remove('hidden'));
                    authFeatures.forEach(feature => feature.classList.remove('hidden'));
                    
                    // Hide login links
                    loginLinkDesktop.classList.add('hidden');
                    loginLinkMobile.classList.add('hidden');

                } else {
                    // Hide protected links and features
                    authLinks.forEach(link => link.classList.add('hidden'));
                    authFeatures.forEach(feature => feature.classList.add('hidden'));

                    // Show login links
                    loginLinkDesktop.classList.remove('hidden');
                    loginLinkMobile.classList.remove('hidden');
                }
            }

            function login() {
                isLoggedIn = true;
                loginModal.classList.add('hidden');
                updateUIForAuthState();
                showPage('home'); 
            }

            function logout() {
                isLoggedIn = false;
                updateUIForAuthState();
                showPage('home'); 
            }

            // --- Auth Modal Listeners ---
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                login(); 
            });
            
            [loginLinkDesktop, loginLinkMobile].forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    profileMenu.classList.add('hidden');
                    mobileMenu.classList.add('hidden'); 
                    loginModal.classList.remove('hidden');
                });
            });
            
            [logoutLinkDesktop, logoutLinkMobile].forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            });

            closeLoginModalButton.addEventListener('click', () => {
                loginModal.classList.add('hidden');
            });

            // --- Mobile Menu Toggle ---
            mobileMenuButton.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                if (isHidden) {
                    hamburgerIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                } else {
                    hamburgerIcon.style.display = 'none';
                    closeIcon.style.display = 'block';
                }
            });

            // --- Profile Dropdown Toggle ---
            profileMenuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                profileMenu.classList.toggle('hidden');
                if (eventsMenu) {
                    eventsMenu.classList.add('hidden'); 
                }
            });

            // --- Events Dropdown Toggle ---
            if (eventsMenuButton) {
                eventsMenuButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    eventsMenu.classList.toggle('hidden');
                    profileMenu.classList.add('hidden'); 
                });
            }

            // --- Close Dropdowns on Click Outside ---
            window.addEventListener('click', (event) => {
                // Close Profile Menu
                if (!profileMenu.classList.contains('hidden')) {
                    if (!profileMenu.contains(event.target) && !profileMenuButton.contains(event.target)) {
                        profileMenu.classList.add('hidden');
                    }
                }
                // Close Events Menu
                if (eventsMenu && !eventsMenu.classList.contains('hidden')) {
                    if (!eventsMenu.contains(event.target) && !eventsMenuButton.contains(event.target)) {
                        eventsMenu.classList.add('hidden');
                    }
                }
            });

            // --- Theme Toggler Logic ---
            // Set initial state of toggles
            const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            if (currentTheme === 'dark') {
                themeToggleDesktop.checked = true;
                themeToggleMobile.checked = true;
                htmlElement.classList.add('dark');
            } else {
                htmlElement.classList.remove('dark');
            }

            function handleThemeChange(event) {
                const isChecked = event.target.checked;
                if (isChecked) {
                    htmlElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                    themeToggleDesktop.checked = true;
                    themeToggleMobile.checked = true;
                } else {
                    htmlElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                    themeToggleDesktop.checked = false;
                    themeToggleMobile.checked = false;
                }
            }
            themeToggleDesktop.addEventListener('change', handleThemeChange);
            themeToggleMobile.addEventListener('change', handleThemeChange);

            // contact form 
             var form = document.getElementById("contact-form");
        var statusMessage = document.getElementById("form-status");

        async function handleSubmit(event) {
            event.preventDefault(); // Stop the form from reloading the page
            
            var data = new FormData(event.target);
            
            try {
                // Send the data to Formspree using 'fetch'
                var response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    statusMessage.innerHTML = "Thanks for your submission! We'll get back to you soon.";
                    statusMessage.className = "success";
                    statusMessage.style.display = "block";
                    
                    // Clear the form
                    form.reset();
                } else {
                    // Get error details from Formspree if possible
                    response.json().then(data => {
                        var errorMessage = "Oops! There was a problem submitting your form.";
                        if (data && data.errors) {
                            errorMessage = data.errors.map(error => error.message).join(", ");
                        }
                        showError(errorMessage);
                    });
                }
            } catch (error) {
                showError("Oops! There was a network error. Please try again.");
            }
        }

        function showError(message) {
            statusMessage.innerHTML = message;
            statusMessage.className = "error";
            statusMessage.style.display = "block";
        }

        // Attach the event listener to the form's 'submit' event
        form.addEventListener("submit", handleSubmit);

            // --- Gallery Modal Logic ---
            if (addPhotoButton) {
                addPhotoButton.addEventListener('click', () => {
                    addPhotoModal.classList.remove('hidden');
                });
            }

            if (closePhotoModalButton) {
                closePhotoModalButton.addEventListener('click', () => {
                    addPhotoModal.classList.add('hidden');
                });
            }

            if (addPhotoForm) {
                addPhotoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const caption = imgCaptionInput.value || "No caption";
                    const file = imgFileInput.files[0];
                    const url = imgUrlInput.value;

                    if (!file && !url) {
                        alert("Please provide an image URL or upload a file.");
                        return;
                    }

                    if (file) {
                        // Handle file upload
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            addNewPhotoToGallery(e.target.result, caption);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        // Handle URL
                        addNewPhotoToGallery(url, caption);
                    }
                });
            }
            
            function addNewPhotoToGallery(src, caption) {
                 const newPhoto = `
                    <div class="gallery-item">
                        <div class="gallery-item-image-wrapper">
                            <img src="${src}" alt="${caption}">
                        </div>
                        <div class="gallery-item-caption">
                            <p>${caption}</p>
                        </div>
                    </div>
                `;
                galleryGrid.insertAdjacentHTML('beforeend', newPhoto);
                
                // Reset form and close modal
                addPhotoForm.reset();
                addPhotoModal.classList.add('hidden');
            }
            
            // --- Booking Form Logic ---
            if (tripList) {
                tripList.addEventListener('click', (e) => {
                    if (e.target.classList.contains('book-trip-button')) {
                        const tripName = e.target.dataset.trip;
                        const tripPrice = e.target.dataset.price;
                        
                        // Populate and show modal
                        modalTripName.textContent = tripName;
                        modalTripTitleInput.value = tripName;
                        modalTripPriceInput.value = tripPrice;
                        modalPeopleInput.value = 1; // Reset to 1
                        updateTotalPrice(tripPrice, 1);
                        
                        bookTripModal.classList.remove('hidden');
                    }
                });
            }

            // Update price in modal based on number of people
            if (modalPeopleInput) {
                modalPeopleInput.addEventListener('input', (e) => {
                    const people = e.target.value;
                    const price = modalTripPriceInput.value;
                    updateTotalPrice(price, people);
                });
            }

            function updateTotalPrice(basePrice, people) {
                const total = (parseInt(basePrice) || 0) * (parseInt(people) || 0);
                modalTotalPrice.textContent = `Ksh ${total.toLocaleString()}`;
            }

            if (closeBookTripModalButton) {
                closeBookTripModalButton.addEventListener('click', () => {
                    bookTripModal.classList.add('hidden');
                });
            }

            if (bookTripForm) {
                bookTripForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // In a real app, you'd send this data to a server
                    console.log({
                        trip: modalTripTitleInput.value,
                        people: modalPeopleInput.value,
                        contact: modalContactInput.value,
                        total: modalTotalPrice.textContent
                    });
                    
                    // Hide modal
                    bookTripModal.classList.add('hidden');
                    
                    // Show success message
                    bookingSuccessMessage.classList.remove('hidden');
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        bookingSuccessMessage.classList.add('hidden');
                    }, 5000);
                    
                    // Reset form
                    bookTripForm.reset();
                    
                    // Scroll to top of page to see message
                    bookingSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }


            // --- Footer: Set Current Year ---
            const currentYearSpan = document.getElementById('current-year');
            if (currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }

        });