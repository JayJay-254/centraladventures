// Bookings: trip selection, modal totals and booking submission
(function(){
    document.addEventListener('DOMContentLoaded', () => {
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

        function updateTotalPrice(basePrice, people){ const total = (Number(basePrice) || 0) * (Number(people) || 0); if(modalTotalPrice) modalTotalPrice.textContent = `Ksh ${total.toLocaleString()}`; }

        if(tripList){
            tripList.addEventListener('click', (e) => {
                if(e.target.classList.contains('book-trip-button')){
                    const tripName = e.target.dataset.trip;
                    const tripPrice = e.target.dataset.price;
                    if(modalTripName) modalTripName.textContent = tripName;
                    if(modalTripTitleInput) modalTripTitleInput.value = tripName;
                    if(modalTripPriceInput) modalTripPriceInput.value = tripPrice;
                    if(modalPeopleInput) modalPeopleInput.value = 1;
                    updateTotalPrice(tripPrice, 1);
                    if(window.Site) window.Site.openModal(bookTripModal);
                }
            });
        }

        if(modalPeopleInput) modalPeopleInput.addEventListener('input', (e) => { updateTotalPrice(modalTripPriceInput && modalTripPriceInput.value, e.target.value); });
        if(closeBookTripModalButton) closeBookTripModalButton.addEventListener('click', () => { if(window.Site) window.Site.closeModal(bookTripModal); });

        if(bookTripForm){
            bookTripForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log({ trip: modalTripTitleInput && modalTripTitleInput.value, people: modalPeopleInput && modalPeopleInput.value, contact: modalContactInput && modalContactInput.value, total: modalTotalPrice && modalTotalPrice.textContent });
                if(window.Site) window.Site.closeModal(bookTripModal);
                if(bookingSuccessMessage) bookingSuccessMessage.classList.remove('hidden');
                setTimeout(() => { if(bookingSuccessMessage) bookingSuccessMessage.classList.add('hidden'); }, 5000);
                if(bookTripForm) bookTripForm.reset();
                if(bookingSuccessMessage) bookingSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });
})();
