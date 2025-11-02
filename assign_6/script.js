const packagesData = [
    { id: 'bali', destination: 'Bali, Indonesia', durationDays: 7, basePrice: 1200, season: 'Summer' },
    { id: 'paris', destination: 'Paris, France', durationDays: 5, basePrice: 1800, season: 'Spring' },
    { id: 'dubai', destination: 'Dubai, UAE', durationDays: 4, basePrice: 1000, season: 'Winter' },
    { id: 'tokyo', destination: 'Tokyo, Japan', durationDays: 6, basePrice: 2200, season: 'Autumn' }
];

function calculateFinalPrice(basePrice, season) {
    let finalPrice = basePrice;
    let multiplier = 1.0;

    switch (season) {
        case 'Summer':
            multiplier = 1.15;
            break;
        case 'Winter':
            multiplier = 0.90; 
            break;
        case 'Spring':
            multiplier = 1.05;
            break;
        case 'Autumn':
            multiplier = 1.10;
            break;
    }
    
    finalPrice = (finalPrice * multiplier) + 50; 
    
    return finalPrice.toFixed(0);
}

function highlightActiveNav() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 

    navLinks.forEach(link => {
        link.classList.remove('active-nav'); 
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-nav');
        }
    });
}

function renderPackagesTable() {
    const tableBody = document.querySelector('#package-table tbody');
    if (!tableBody) return; 

    tableBody.innerHTML = packagesData.map(pkg => {
        const finalPrice = calculateFinalPrice(pkg.basePrice, pkg.season);
        
        return `
            <tr>
                <td>${pkg.destination}</td>
                <td>${pkg.durationDays} Days</td>
                <td>$${pkg.basePrice.toLocaleString()}</td>
                <td>$${finalPrice.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}


function computeEstimatedTotal() {
    const form = document.querySelector('#booking-form');
    if (!form) return; 
    
    const startDate = new Date(form.elements['start-date'].value);
    const endDate = new Date(form.elements['end-date'].value);
    const packageId = form.elements['package'].value;
    const promoCode = form.elements['promo-code'] ? form.elements['promo-code'].value.toUpperCase() : '';
    const guests = parseInt(form.elements['guests'] ? form.elements['guests'].value : 1);
    
    const outputElement = document.getElementById('estimated-total');
    const submitButton = document.querySelector('button[type="submit"]');

    if (!startDate || !endDate || startDate > endDate || !packageId || !guests || form.elements['name'].value === '' || form.elements['destination'].value === '') {
        outputElement.innerHTML = 'Please fill out all **required** fields and select valid dates.';
        if (submitButton) submitButton.disabled = true; 
        return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (nights <= 0) {
        outputElement.innerHTML = 'End date must be after start date.';
        if (submitButton) submitButton.disabled = true;
        return;
    }
    
    const selectedPackage = packagesData.find(pkg => pkg.id === packageId);
    let estimatedTotal = selectedPackage ? parseFloat(calculateFinalPrice(selectedPackage.basePrice, selectedPackage.season)) : 0;
    
    if (selectedPackage && nights > selectedPackage.durationDays) {
        const pricePerNight = estimatedTotal / selectedPackage.durationDays;
        estimatedTotal = pricePerNight * nights;
    } else if (selectedPackage && nights < selectedPackage.durationDays) {
        const pricePerNight = estimatedTotal / selectedPackage.durationDays;
        estimatedTotal = pricePerNight * nights;
    }

    if (guests > 2) {
        estimatedTotal *= 1.20; 
    }
    
    let promoMessage = '';
    switch (promoCode) {
        case 'EARLYBIRD':
            estimatedTotal *= 0.90; 
            promoMessage = 'EARLYBIRD discount applied (-10%).';
            break;
        case 'WELCOME50':
            estimatedTotal -= 50;
            promoMessage = 'WELCOME50 discount applied (-$50).';
            break;
        default:
             promoMessage = 'No valid promo code applied.';
            break;
    }
    
    const finalTotal = Math.max(0, estimatedTotal).toFixed(2);
    outputElement.innerHTML = `${promoMessage}<br>Estimated Nights: **${nights}**<br>Final Total: **$${finalTotal.toLocaleString()}**`;
    
    if (submitButton) submitButton.disabled = false;
}


function setupGalleryModal() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return; 

    const modalHTML = `
        <div id="image-modal">
            <span class="close-btn">&times;</span>
            <img id="modal-image">
            <div id="caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    modal.onclick = (e) => {
        if (e.target.id === 'image-modal') {
            modal.style.display = 'none';
        }
    };
    
    gallery.querySelectorAll('img').forEach(img => {
        img.style.cursor = 'pointer'; 
        img.onclick = function() {
            modal.style.display = 'block';
            
            const largeSrc = this.getAttribute('data-large') || this.src;
            modalImg.src = largeSrc;
            
            const altText = this.alt;
            modalImg.alt = altText;
            captionText.innerHTML = altText;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    highlightActiveNav();


    if (document.querySelector('#package-table')) {
        renderPackagesTable();
    }

    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) { 
        bookingForm.addEventListener('change', computeEstimatedTotal);
        bookingForm.addEventListener('keyup', (e) => {
            if (e.target.name === 'promo-code' || e.target.name === 'guests' || e.target.name === 'name' || e.target.name === 'destination') {
                computeEstimatedTotal();
            }
        });

        computeEstimatedTotal();
    }
    

    if (document.querySelector('.gallery')) {
        setupGalleryModal();
    }
});