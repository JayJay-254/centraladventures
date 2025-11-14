// Contact form handler
(function(){
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('contact-form');
        const statusMessage = document.getElementById('form-status');
        if (!form) return;

        async function handleSubmit(event){
            event.preventDefault();
            const data = new FormData(event.target);
            try{
                const response = await fetch(event.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
                if(response.ok){
                    if(statusMessage){ statusMessage.innerHTML = "Thanks for your submission! We'll get back to you soon."; statusMessage.className = 'success'; statusMessage.style.display = 'block'; }
                    form.reset();
                } else {
                    const json = await response.json().catch(()=>null);
                    let msg = 'Oops! There was a problem submitting your form.';
                    if(json && json.errors) msg = json.errors.map(e=>e.message).join(', ');
                    if(statusMessage) window.Site ? window.Site.showError(msg, statusMessage) : (statusMessage.innerHTML = msg);
                }
            } catch(err){
                if(statusMessage) window.Site ? window.Site.showError('Network error. Please try again.', statusMessage) : (statusMessage.innerHTML = 'Network error');
            }
        }
        form.addEventListener('submit', handleSubmit);
    });
})();
