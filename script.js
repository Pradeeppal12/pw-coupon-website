// ============================================================
// 🔴🔴🔴 SIRF YEH 3 LINES CHANGE KARO 🔴🔴🔴
// ============================================================

const SUPABASE_URL = "https://bctjbfrxxbxhpjaqudsx.supabase.co";  // Tumhara URL
const SUPABASE_KEY = "sb_publishable_ctwo_uAsD5AloQZJ7S9jXQ_a3gkuX9p";  // Tumhari key
const AMBASSADOR_BASE_URL = "https://ambassador.pw.live/dashboard/special-link";  // Tumhara link

// ============================================================
// NEECHE KUCH MAT BADALNA
// ============================================================

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('couponForm');
const submitBtn = document.getElementById('submitBtn');
const studentNameInput = document.getElementById('studentName');
const studentPhoneInput = document.getElementById('studentPhone');

const modalBackdrop = document.getElementById('modalBackdrop');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const modalLinkOutput = document.getElementById('modalLinkOutput');
const modalErrorText = document.getElementById('modalErrorText');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const modalRedirectBtn = document.getElementById('modalRedirectBtn');
const modalWhatsapp = document.getElementById('modalWhatsapp');
const modalTelegram = document.getElementById('modalTelegram');
const modalCloseBtns = document.querySelectorAll('.modalClose');

let redirectTimer;

function generateCouponLink(studentName, studentPhone) {
    const uniqueCode = btoa(`${studentPhone}_${Date.now()}`).substring(0, 16);
    return `${AMBASSADOR_BASE_URL}?ref=${uniqueCode}&student=${encodeURIComponent(studentPhone)}`;
}

async function getUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return { city: data.city || 'Unknown', region: data.region || 'Unknown', country: data.country_name || 'India' };
    } catch (error) {
        return { city: 'Unknown', region: 'Unknown', country: 'India' };
    }
}

async function saveToSupabase(studentName, studentPhone, couponLink, location) {
    try {
        const { error } = await supabase.from('coupon_requests').insert([{
            student_name: studentName,
            student_phone: studentPhone,
            coupon_link: couponLink,
            city: location.city,
            region: location.region,
            country: location.country
        }]);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Supabase Error:', error);
        return false;
    }
}

function showSuccess(link) {
    modalLinkOutput.textContent = link;
    modalBackdrop.classList.remove('hidden');
    modalBackdrop.classList.add('flex');
    successModal.classList.remove('hidden');
    
    if (redirectTimer) clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => { window.location.href = link; }, 10000);
}

function showError(msg) {
    modalErrorText.textContent = msg;
    modalBackdrop.classList.remove('hidden');
    modalBackdrop.classList.add('flex');
    errorModal.classList.remove('hidden');
}

function hideFeedback() {
    if (redirectTimer) clearTimeout(redirectTimer);
    modalBackdrop.classList.add('hidden');
    modalBackdrop.classList.remove('flex');
    successModal.classList.add('hidden');
    errorModal.classList.add('hidden');
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="loader"></span> Generating...`;
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Generate My Discount Link 🎓';
    }
}

// Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentName = studentNameInput.value.trim();
    const studentPhone = studentPhoneInput.value.trim();
    
    if (!studentName) { showError('Please enter your name'); return; }
    if (studentPhone.length !== 10) { showError('Please enter a valid 10-digit phone number'); return; }
    
    setLoading(true);
    
    try {
        const couponLink = generateCouponLink(studentName, studentPhone);
        const location = await getUserLocation();
        const saved = await saveToSupabase(studentName, studentPhone, couponLink, location);
        
        if (saved) {
            showSuccess(couponLink);
            console.log(`✅ Coupon generated for ${studentName} (${studentPhone})`);
        } else {
            showError('Failed to save data. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Something went wrong. Please try again later.');
    } finally {
        setLoading(false);
    }
});

// Modal Buttons
modalCopyBtn.addEventListener('click', () => {
    const link = modalLinkOutput.textContent;
    if (link) { navigator.clipboard.writeText(link); alert('Link copied!'); }
});

modalRedirectBtn.addEventListener('click', () => {
    const link = modalLinkOutput.textContent;
    if (link) window.location.href = link;
});

modalWhatsapp.addEventListener('click', () => {
    const link = modalLinkOutput.textContent;
    window.open(`https://wa.me/?text=${encodeURIComponent(`🎓 Get discount: ${link}`)}`, '_blank');
});

modalTelegram.addEventListener('click', () => {
    const link = modalLinkOutput.textContent;
    window.open(`https://t.me/share/url?url=${link}&text=${encodeURIComponent('🎓 PW Discount!')}`, '_blank');
});

modalCloseBtns.forEach(btn => btn.addEventListener('click', hideFeedback));
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) hideFeedback(); });

console.log('✅ Website Ready!');