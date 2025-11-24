// Main JavaScript file for Halfaya Medical Directory - Updated to use API



// Global variables for data (will be loaded from API)

// Notification system for admin pages
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.getElementById('notification-message');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification-message';
    notification.className = `notification-message ${type}`;
    
    const text = document.createElement('p');
    text.id = 'notification-text';
    text.textContent = message;
    notification.appendChild(text);
    
    // Insert at the beginning of main content
    const mainContent = document.querySelector('.main-content .container');
    if (mainContent) {
        mainContent.insertBefore(notification, mainContent.firstChild);
        
        // Show notification
        setTimeout(() => {
            notification.style.display = 'block';
        }, 10);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
}

let doctorsData = [];

let pharmacistsData = [];

let pharmaciesData = [];

let onDutyPharmacy = null;



// Mobile menu toggle functionality

document.addEventListener('DOMContentLoaded', function() {

    const menuToggle = document.querySelector('.menu-toggle');

    const navMenu = document.querySelector('.nav-menu');

    

    if (menuToggle && navMenu) {

        menuToggle.addEventListener('click', function() {

            navMenu.classList.toggle('active');

            

            // Animation for hamburger icon

            const bars = menuToggle.querySelectorAll('.bar');

            if (navMenu.classList.contains('active')) {

                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';

                bars[1].style.opacity = '0';

                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';

            } else {

                bars[0].style.transform = 'none';

                bars[1].style.opacity = '1';

                bars[2].style.transform = 'none';

            }

        });

        

        // Close menu when clicking on a link

        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {

            link.addEventListener('click', () => {

                navMenu.classList.remove('active');

                const bars = menuToggle.querySelectorAll('.bar');

                bars[0].style.transform = 'none';

                bars[1].style.opacity = '1';

                bars[2].style.transform = 'none';

            });

        });

    }

    

    // Add search input event listener

    const searchInput = document.getElementById('main-search');

    if (searchInput) {

        searchInput.addEventListener('keyup', function(event) {

            if (event.key === 'Enter') {

                performSearch(this.value);

            }

        });

    }

});



// Search function

function performSearch(query) {

    if (query.trim() !== '') {

        window.location.href = `doctors.html?search=${encodeURIComponent(query)}`;

    }

}



// Function to load and display doctors and pharmacists from API

async function loadDoctorsAndPharmacists() {

    try {

        // Load doctors and pharmacists in parallel

        const [doctors, pharmacists] = await Promise.all([

            getAllDoctors(),

            getAllPharmacists()

        ]);



        // Combine doctors and pharmacists

        doctorsData = doctors.map(doctor => ({

            ...doctor,

            type: 'doctor',

            specialty: doctor.speciality

        }));



        pharmacistsData = pharmacists.map(pharmacist => ({

            ...pharmacist,

            type: 'pharmacist',

            specialty: 'صيدليات'

        }));



        // Combine all data

        const allData = [...doctorsData, ...pharmacistsData];

        
        // Update specialty filter dropdown with all available specialties
        updateSpecialtyFilter(allData);

        // Get URL parameters if any

        const urlParams = new URLSearchParams(window.location.search);

        const searchQuery = urlParams.get('search');

        

        // If there's a search query from URL, populate the search box

        if (searchQuery) {

            const searchBox = document.getElementById('doctors-search');

            if (searchBox) {

                searchBox.value = decodeURIComponent(searchQuery);

            }

        }

        

        // Display all data

        displayFilteredDoctors(allData);

    } catch (error) {

        console.error('Error loading doctors and pharmacists:', error);

        const container = document.getElementById('doctors-container');

        if (container) {

            container.innerHTML = '<p class="no-results">حدث خطأ في تحميل البيانات. الرجاء المحاولة لاحقاً.</p>';

        }

    }

}



// Function to update specialty filter dropdown - لا نحتاج لإضافة تخصصات ديناميكية
// التخصصات الرئيسية محددة مسبقاً في HTML
function updateSpecialtyFilter(allData) {
    // لا نحتاج لإضافة تخصصات ديناميكية
    // التخصصات الرئيسية محددة مسبقاً في HTML
    // هذا يحافظ على قائمة نظيفة بدون تكرار
}

// Function to filter doctors based on search and filters

function filterDoctors() {

    const searchInput = document.getElementById('doctors-search');

    const specialtyFilter = document.getElementById('specialty-filter');

    const typeFilter = document.getElementById('type-filter');

    

    if (!searchInput || !specialtyFilter || !typeFilter) {

        return;

    }



    const searchValue = searchInput.value.toLowerCase();

    const specialtyValue = specialtyFilter.value;

    const typeValue = typeFilter.value;

    

    // Combine doctors and pharmacists

    const allData = [...doctorsData, ...pharmacistsData];

    

    // Filter the data

    let filteredData = allData.filter(item => {

        // Check search term

        const matchesSearch = searchValue === '' || 

            item.name.toLowerCase().includes(searchValue) || 

            (item.specialty && item.specialty.toLowerCase().includes(searchValue));

        

        // Check specialty filter - البحث في التخصص (يحتوي على الكلمة المختارة)
        let matchesSpecialty = true;
        if (specialtyValue !== '') {
            if (specialtyValue === 'صيدليات') {
                // للصيدليات: يجب أن يكون التخصص "صيدليات" بالضبط
                matchesSpecialty = item.specialty === 'صيدليات';
            } else {
                // للأطباء: البحث في التخصص (يحتوي على الكلمة المختارة)
                const specialtyLower = (item.specialty || '').toLowerCase();
                const filterLower = specialtyValue.toLowerCase();
                
                // تطبيع للتخصصات المركبة (مثل "داخلية، قلبية")
                // تطبيع الهمزة
                const normalizedSpecialty = specialtyLower
                    .replace(/[أإآ]/g, 'ا')
                    .replace(/[ى]/g, 'ي')
                    .replace(/[ة]/g, 'ه')
                    .replace(/[ًٌٍَُِّْ]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                const normalizedFilter = filterLower
                    .replace(/[أإآ]/g, 'ا')
                    .replace(/[ى]/g, 'ي')
                    .replace(/[ة]/g, 'ه')
                    .replace(/[ًٌٍَُِّْ]/g, '')
                    .trim();
                
                // البحث في التخصص المطبيع
                matchesSpecialty = normalizedSpecialty.includes(normalizedFilter);
                
                // معالجة خاصة لـ "أنف أذن حنجرة" - البحث عن أي من الكلمات المرتبطة
                if (specialtyValue === 'أنف أذن حنجرة' || specialtyValue === 'أنف') {
                    matchesSpecialty = normalizedSpecialty.includes('انف') || 
                                      normalizedSpecialty.includes('اذن') ||
                                      normalizedSpecialty.includes('حنجرة');
                }
                
                // معالجة خاصة لـ "طب طوارئ" أو "طوارئ"
                if (specialtyValue === 'طب طوارئ' || specialtyValue === 'طوارئ') {
                    matchesSpecialty = normalizedSpecialty.includes('طوارئ') || 
                                   normalizedSpecialty.includes('طوار');
                }
                
                // معالجة خاصة لـ "جراحة" - البحث عن أي نوع من الجراحة
                if (specialtyValue === 'جراحة') {
                    matchesSpecialty = normalizedSpecialty.includes('جراحة') || 
                                      normalizedSpecialty.includes('جراح');
                }
            }
        }

        

        // Check type filter

        const matchesType = typeValue === '' || item.type === typeValue;

        

        return matchesSearch && matchesSpecialty && matchesType;

    });

    

    // Display filtered results

    displayFilteredDoctors(filteredData);

}



// Function to display filtered doctors and pharmacists

function displayFilteredDoctors(data) {

    const container = document.getElementById('doctors-container');

    

    if (!container) {

        return;

    }



    // Clear existing content

    container.innerHTML = '';

    

    // Display message if no results found

    if (data.length === 0) {

        container.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة للبحث</p>';

        return;

    }

    

    // Create and append cards for each doctor/pharmacist

    data.forEach(item => {

        const card = document.createElement('div');

        card.className = 'doctor-card';

        

        // Determine type text based on gender
        let typeText = '';
        if (item.type === 'doctor') {
            typeText = item.gender === 'أنثى' ? 'طبيبة' : 'طبيب';
        } else {
            typeText = item.gender === 'أنثى' ? 'صيدلانية' : 'صيدلي';
        }

        

        // Format address display

        const addressDisplay = !item.address || item.address === "—" ? "العنوان: غير متوفر" : item.address;

        const specialtyDisplay = item.specialty || item.speciality || 'غير محدد';

        

        card.innerHTML = `

            <div class="card-content">

                <h3 class="doctor-name">${item.name}</h3>

                <p class="doctor-specialty">${specialtyDisplay} - ${typeText}</p>

                <p class="doctor-address">📍 ${addressDisplay}</p>

                <p class="doctor-phone">📞 ${item.phone}</p>

            </div>

            <div class="card-footer">

                <a href="tel:${item.phone}" class="call-button-small">اتصال مباشر</a>

            </div>

        `;

        

        container.appendChild(card);

    });

}



// Function to load and display all on-duty pharmacies from API
async function loadOnDutyPharmacy() {
    try {
        const pharmacies = await getOnDutyPharmacies();
        
        // Store first pharmacy for backward compatibility
        onDutyPharmacy = pharmacies.length > 0 ? pharmacies[0] : null;
        
        // Get container for displaying pharmacies list
        const pharmaciesContainer = document.getElementById('on-duty-pharmacies-container');
        
        // If container exists, display pharmacies
        if (pharmaciesContainer) {
            pharmaciesContainer.innerHTML = '';
            
            if (pharmacies.length === 0) {
                pharmaciesContainer.innerHTML = `
                    <div class="on-duty-main-card">
                        <div class="pharmacy-icon">💊</div>
                        <h2 class="pharmacy-title">لا توجد صيدليات مناوبة حالياً</h2>
                        <p class="info-text" style="color: #666; margin-top: 15px;">يرجى المحاولة لاحقاً</p>
                    </div>
                `;
                return;
            }
            
            // Check if we're on the main page (index.html) or on-duty page
            const isMainPage = window.location.pathname.includes('index.html') || 
                              (window.location.pathname === '/' || window.location.pathname.endsWith('/'));
            
            // Limit to 3 pharmacies on main page
            const pharmaciesToShow = isMainPage ? pharmacies.slice(0, 3) : pharmacies;
            const hasMore = isMainPage && pharmacies.length > 3;
            
            // Add class based on number of cards for proper centering
            const cardCount = pharmaciesToShow.length;
            if (cardCount === 1) {
                pharmaciesContainer.classList.add('single-card');
            } else if (cardCount === 2) {
                pharmaciesContainer.classList.add('two-cards');
            } else if (cardCount === 3) {
                pharmaciesContainer.classList.add('three-cards');
            } else {
                pharmaciesContainer.classList.add('multiple-cards');
            }
            
            // Display pharmacies in a grid
            pharmaciesToShow.forEach((pharmacy, index) => {
                const pharmacyCard = document.createElement('div');
                pharmacyCard.className = 'on-duty-pharmacy-card';
                
                // تحديد نوع المناوبة مع قيمة افتراضية
                const shiftType = pharmacy.shiftType || 'صباحية';
                const shiftIcon = shiftType === 'صباحية' ? '🌅' : '🌙';
                const shiftClass = shiftType === 'صباحية' ? 'shift-morning' : 'shift-evening';
                
                pharmacyCard.innerHTML = `
                    <div class="pharmacy-icon">💊</div>
                    <div class="shift-badge ${shiftClass}">
                        <span class="shift-icon">${shiftIcon}</span>
                        <span class="shift-text">مناوبة ${shiftType}</span>
                    </div>
                    <h3 class="pharmacy-card-title">${pharmacy.name}</h3>
                    <div class="pharmacy-details">
                        <div class="pharmacy-info-item">
                            <span class="info-icon">📞</span>
                            <span class="info-text">${pharmacy.phone}</span>
                        </div>
                        <div class="pharmacy-info-item">
                            <span class="info-icon">📍</span>
                            <span class="info-text">${pharmacy.address || 'غير محدد'}</span>
                        </div>
                    </div>
                    <a href="tel:${pharmacy.phone}" class="call-button-large">اتصال مباشر</a>
                `;
                pharmaciesContainer.appendChild(pharmacyCard);
            });
            
            // Add "View More" button if there are more than 3 pharmacies on main page
            if (hasMore) {
                const viewMoreButton = document.createElement('div');
                viewMoreButton.className = 'view-more-container';
                viewMoreButton.innerHTML = `
                    <a href="on-duty.html" class="view-more-button">انقر لعرض المزيد من الصيدليات المناوبة</a>
                `;
                pharmaciesContainer.appendChild(viewMoreButton);
            }
            
            return;
        }
        
        // Fallback for old single pharmacy display (backward compatibility)
        const nameElement = document.getElementById('pharmacy-name');
        const phoneElement = document.getElementById('pharmacy-phone');
        const locationElement = document.getElementById('pharmacy-location');
        const callButton = document.getElementById('call-button');
        
        if (pharmacies.length === 0) {
            if (nameElement) nameElement.textContent = 'لا توجد صيدلية مناوبة حالياً';
            if (phoneElement) phoneElement.textContent = '—';
            if (locationElement) locationElement.textContent = '—';
            if (callButton) callButton.href = '#';
            return;
        }
        
        // Display first pharmacy for backward compatibility
        if (onDutyPharmacy) {
            if (nameElement) nameElement.textContent = onDutyPharmacy.name;
            if (phoneElement) phoneElement.textContent = onDutyPharmacy.phone;
            if (locationElement) locationElement.textContent = onDutyPharmacy.address;
            if (callButton) callButton.href = `tel:${onDutyPharmacy.phone}`;
        }
    } catch (error) {
        console.error('Error loading on-duty pharmacies:', error);
        const pharmaciesContainer = document.getElementById('on-duty-pharmacies-container');
        if (pharmaciesContainer) {
            pharmaciesContainer.innerHTML = `
                <div class="on-duty-main-card">
                    <div class="pharmacy-icon">⚠️</div>
                    <h2 class="pharmacy-title">حدث خطأ في تحميل البيانات</h2>
                    <p class="info-text" style="color: #666; margin-top: 15px;">يرجى المحاولة لاحقاً</p>
                </div>
            `;
        } else {
            const nameElement = document.getElementById('pharmacy-name');
            if (nameElement) {
                nameElement.textContent = 'حدث خطأ في تحميل البيانات';
            }
        }
    }
}



// Function to handle form submission (still using localStorage for pending submissions)

function submitForm() {

    // Get form elements

    const userType = document.getElementById('user-type').value;

    const fullName = document.getElementById('full-name').value;

    const phone = document.getElementById('phone').value;

    const gender = document.getElementById('gender').value;

    const specialty = document.getElementById('specialty').value;

    const location = document.getElementById('location').value;

    const notes = document.getElementById('notes').value;

    

    // Validate user type

    if (!userType) {

        alert('الرجاء اختيار النوع (طبيب، صيدلي، أو صيدلية)');

        return;

    }

    

    // Validate gender for doctor and pharmacist

    if ((userType === 'doctor' || userType === 'pharmacist') && !gender) {

        alert('الرجاء اختيار الجنس');

        return;

    }

    

    // Create submission object

    const submission = {

        userType: userType, // 'doctor', 'pharmacist', or 'pharmacy'

        fullName: fullName,

        phone: phone,

        gender: gender || null,

        specialty: userType === 'doctor' ? specialty : (userType === 'pharmacist' ? 'صيدليات' : 'صيدليات'),

        location: location || "غير محدد",

        notes: notes || "لا توجد ملاحظات",

        timestamp: new Date().toISOString()

    };

    

    // Get existing submissions from localStorage

    const storedPendingSubmissions = localStorage.getItem("pendingSubmissions");

    let pendingSubmissions = storedPendingSubmissions ? JSON.parse(storedPendingSubmissions) : [];

    

    // Add to pending submissions array

    pendingSubmissions.push(submission);

    

    // Save to localStorage

    localStorage.setItem("pendingSubmissions", JSON.stringify(pendingSubmissions));

    

    // Show success message

    const successMessage = document.getElementById('success-message');

    if (successMessage) {

        successMessage.style.display = 'block';

        successMessage.scrollIntoView({ behavior: 'smooth' });

    }

    

    // Reset form

    const form = document.getElementById('add-form');

    if (form) {

        form.reset();

        // Reset specialty group visibility

        const specialtyGroup = document.getElementById('specialty-group');

        if (specialtyGroup) {

            specialtyGroup.style.display = 'none';

        }

    }

    

    // Hide success message after 5 seconds

    setTimeout(() => {

        if (successMessage) {

            successMessage.style.display = 'none';

        }

    }, 5000);

}



// Admin panel functions

async function loadAdminPanel() {
    // Load only sections that exist in admin.html
    await Promise.all([
        loadPendingSubmissions(),
        loadOnDutyManagement()
    ]);
}



function loadPendingSubmissions() {

    const container = document.getElementById('pending-submissions-container');

    if (!container) return;

    

    container.innerHTML = '';

    

    // Get pending submissions from localStorage

    const storedPendingSubmissions = localStorage.getItem("pendingSubmissions");

    const pendingSubmissions = storedPendingSubmissions ? JSON.parse(storedPendingSubmissions) : [];

    

    if (pendingSubmissions.length === 0) {

        container.innerHTML = '<p class="no-results">لا توجد طلبات معلّقة حاليًا.</p>';

        return;

    }

    

    pendingSubmissions.forEach((submission, index) => {

        const card = document.createElement('div');

        card.className = 'admin-card';

        let userTypeText = 'طبيب';

        if (submission.userType === 'pharmacy') {

            userTypeText = 'صيدلية';

        } else if (submission.userType === 'pharmacist') {

            userTypeText = submission.gender === 'أنثى' ? 'صيدلانية' : 'صيدلي';

        } else if (submission.userType === 'doctor') {

            userTypeText = submission.gender === 'أنثى' ? 'طبيبة' : 'طبيب';

        }

        let specialtyDisplay = (submission.userType === 'pharmacy' || submission.userType === 'pharmacist') ? 'صيدليات' : submission.specialty;
        
        // If specialty is "غير ذلك", show a note about checking notes
        if (submission.specialty === 'غير ذلك' && submission.notes) {
            specialtyDisplay = `غير ذلك (راجع الملاحظات: ${submission.notes.substring(0, 50)}${submission.notes.length > 50 ? '...' : ''})`;
        }

        card.innerHTML = `

            <h3>${submission.fullName}</h3>

            <p><strong>النوع:</strong> ${userTypeText}</p>
            
            ${submission.gender ? `<p><strong>الجنس:</strong> ${submission.gender}</p>` : ''}

            <p><strong>الاختصاص:</strong> ${specialtyDisplay}</p>

            <p><strong>الهاتف:</strong> ${submission.phone}</p>

            <p><strong>الموقع:</strong> ${submission.location}</p>

            <p><strong>الملاحظات:</strong> ${submission.notes}</p>

            <p><strong>وقت الإرسال:</strong> ${new Date(submission.timestamp).toLocaleString('ar-SA')}</p>

            <div class="admin-card-actions">

                <button class="accept-button" onclick="acceptSubmission(${index})">قبول</button>

                <button class="reject-button" onclick="rejectSubmission(${index})">رفض</button>

            </div>

        `;

        container.appendChild(card);

    });

}



// Function to load doctors management

async function loadDoctorsManagement() {

    try {

        const doctors = await getAllDoctors();

        doctorsData = doctors;

        

        const container = document.getElementById('doctors-management-container');

        if (!container) return;

        

        container.innerHTML = '';

        

        // Populate category filter dropdown

        const categoryFilter = document.getElementById('adminDoctorsCategoryFilter');

        if (categoryFilter) {

            categoryFilter.innerHTML = '<option value="">كل الاختصاصات</option>';

            const specialties = [...new Set(doctors.map(doctor => doctor.speciality))];

            specialties.forEach(specialty => {

                const option = document.createElement('option');

                option.value = specialty;

                option.textContent = specialty;

                categoryFilter.appendChild(option);

            });

        }

        

        doctors.forEach((doctor, index) => {

            const card = document.createElement('div');

            card.className = 'admin-card';

            card.innerHTML = `

                <h3>${doctor.name}</h3>

                <p><strong>الاختصاص:</strong> ${doctor.speciality}</p>

                <p><strong>النوع:</strong> ${doctor.gender === 'أنثى' ? 'طبيبة' : 'طبيب'}</p>

                <p><strong>الجنس:</strong> ${doctor.gender}</p>

                <p><strong>الهاتف:</strong> ${doctor.phone}</p>

                <p><strong>العنوان:</strong> ${doctor.address}</p>

                <div class="admin-card-actions">

                    <button class="edit-button" onclick="openDoctorEditModal('${doctor._id}')">تعديل</button>

                    <button class="delete-button" onclick="deleteDoctor('${doctor._id}')">حذف</button>

                </div>

            `;

            card.dataset.id = doctor._id;

            container.appendChild(card);

        });

    } catch (error) {

        console.error('Error loading doctors:', error);

        const container = document.getElementById('doctors-management-container');

        if (container) {

            container.innerHTML = '<p class="no-results">حدث خطأ في تحميل الأطباء.</p>';

        }

    }

}



// Function to load pharmacists management

async function loadPharmacistsManagement() {

    try {

        const pharmacists = await getAllPharmacists();

        pharmacistsData = pharmacists;

        

        const container = document.getElementById('pharmacists-management-container');

        if (!container) return;

        

        container.innerHTML = '';

        

        if (pharmacists.length === 0) {

            container.innerHTML = '<p class="no-results">لا توجد صيادلة في النظام.</p>';

            return;

        }

        

        pharmacists.forEach((pharmacist) => {

            const card = document.createElement('div');

            card.className = 'admin-card';

            card.innerHTML = `

                <h3>${pharmacist.name}</h3>

                <p><strong>النوع:</strong> ${pharmacist.gender === 'أنثى' ? 'صيدلانية' : 'صيدلي'}</p>

                <p><strong>الجنس:</strong> ${pharmacist.gender}</p>

                <p><strong>الهاتف:</strong> ${pharmacist.phone}</p>

                <p><strong>العنوان:</strong> ${pharmacist.address}</p>

                <div class="admin-card-actions">

                    <button class="edit-button" onclick="openPharmacistEditModal('${pharmacist._id}')">تعديل</button>

                    <button class="delete-button" onclick="deletePharmacistHandler('${pharmacist._id}')">حذف</button>

                </div>

            `;

            card.dataset.id = pharmacist._id;

            container.appendChild(card);

        });

    } catch (error) {

        console.error('Error loading pharmacists:', error);

        const container = document.getElementById('pharmacists-management-container');

        if (container) {

            container.innerHTML = '<p class="no-results">حدث خطأ في تحميل الصيادلة.</p>';

        }

    }

}



// Function to load pharmacies management

async function loadPharmaciesManagement() {

    try {

        const pharmacies = await getAllPharmacies();

        pharmaciesData = pharmacies;

        

        const container = document.getElementById('pharmacies-management-container');

        if (!container) return;

        

        container.innerHTML = '';

        

        if (pharmacies.length === 0) {

            container.innerHTML = '<p class="no-results">لا توجد صيدليات في النظام.</p>';

            return;

        }

        

        pharmacies.forEach((pharmacy) => {

            const card = document.createElement('div');

            card.className = 'admin-card';

            const onDutyStatus = pharmacy.isOnDuty ? '<span style="color: green;">●</span> مناوبة' : '<span style="color: gray;">●</span> غير مناوبة';
            const shiftType = pharmacy.shiftType || 'صباحية';
            
            // زر المناوبة - يتغير حسب الحالة
            const onDutyButton = pharmacy.isOnDuty 
                ? `<button class="cancel-on-duty-btn" onclick="togglePharmacyOnDuty('${pharmacy._id}', false)" style="margin-top: 10px; width: 100%;">إلغاء المناوبة</button>`
                : `<button class="accept-button" onclick="togglePharmacyOnDuty('${pharmacy._id}', true)" style="margin-top: 10px; width: 100%;">اجعلها مناوبة</button>`;

            card.innerHTML = `

                <h3>${pharmacy.name}</h3>

                <p><strong>النوع:</strong> صيدلية</p>

                <p><strong>الهاتف:</strong> ${pharmacy.phone}</p>

                <p><strong>العنوان:</strong> ${pharmacy.address}</p>

                <p><strong>حالة المناوبة:</strong> ${onDutyStatus}</p>
                
                ${pharmacy.isOnDuty ? `<p><strong>نوع المناوبة:</strong> ${shiftType}</p>` : ''}

                ${onDutyButton}

                <div class="admin-card-actions">

                    <button class="edit-button" onclick="openPharmacyEditModal('${pharmacy._id}')">تعديل</button>

                    <button class="delete-button" onclick="deletePharmacyHandler('${pharmacy._id}')">حذف</button>

                </div>

            `;

            card.dataset.id = pharmacy._id;

            container.appendChild(card);

        });

    } catch (error) {

        console.error('Error loading pharmacies:', error);

        const container = document.getElementById('pharmacies-management-container');

        if (container) {

            container.innerHTML = '<p class="no-results">حدث خطأ في تحميل الصيدليات.</p>';

        }

    }

}



// Function to open the modal for editing doctors

async function openDoctorEditModal(id) {

    try {

        const doctor = await getDoctorById(id);

        const modal = document.getElementById('editModal');

        const modalTitle = document.getElementById('modalTitle');

        const modalForm = document.getElementById('modalForm');

        

        if (!modal || !modalTitle || !modalForm) return;

        

        modalTitle.textContent = 'تعديل بيانات الطبيب';

        

        modalForm.innerHTML = `

            <div class="form-group">

                <label for="modal-name">الاسم</label>

                <input type="text" id="modal-name" name="name" value="${doctor.name}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-speciality">التخصص</label>

                <input type="text" id="modal-speciality" name="speciality" value="${doctor.speciality === 'غير ذلك' ? '' : doctor.speciality}" required>

            </div>
            
            ${doctor.speciality === 'غير ذلك' ? `
            <div class="form-group" style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #856404; font-size: 0.9rem;">
                    <strong>ملاحظة:</strong> التخصص الحالي هو "غير ذلك". يرجى التحقق من الملاحظات في الطلب الأصلي لمعرفة التخصص الفعلي وتحديثه هنا.
                </p>
            </div>
            ` : ''}

            

            <div class="form-group">

                <label for="modal-phone">رقم الهاتف</label>

                <input type="tel" id="modal-phone" name="phone" value="${doctor.phone}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-gender">الجنس</label>

                <select id="modal-gender" name="gender" required>

                    <option value="ذكر" ${doctor.gender === 'ذكر' ? 'selected' : ''}>ذكر</option>

                    <option value="أنثى" ${doctor.gender === 'أنثى' ? 'selected' : ''}>أنثى</option>

                </select>

            </div>

            

            <div class="form-group">

                <label for="modal-address">العنوان</label>

                <input type="text" id="modal-address" name="address" value="${doctor.address}" required>

            </div>

            

            <button type="button" class="submit-button" onclick="saveDoctorEditFromModal('${doctor._id}')">حفظ التعديلات</button>

        `;

        

        modal.style.display = 'flex';

    } catch (error) {

        showNotification('حدث خطأ في تحميل بيانات الطبيب: ' + error.message, 'error');

    }

}



// Function to save doctor edits from modal

async function saveDoctorEditFromModal(id) {

    try {

        const doctorData = {

            name: document.getElementById('modal-name').value,

            speciality: document.getElementById('modal-speciality').value,

            phone: document.getElementById('modal-phone').value,

            gender: document.getElementById('modal-gender').value,

            address: document.getElementById('modal-address').value

        };

        

        await updateDoctor(id, doctorData);

        closeEditModal();

        await loadDoctorsManagement();

        showNotification("تم حفظ التعديلات بنجاح.", 'success');

    } catch (error) {

        showNotification('حدث خطأ في حفظ التعديلات: ' + error.message, 'error');

    }

}



// Function to open the modal for editing on-duty pharmacy

async function openOnDutyEditModal() {

    try {

        const pharmacies = await getOnDutyPharmacies();

        const pharmacy = pharmacies.length > 0 ? pharmacies[0] : null;

        

        if (!pharmacy) {

            alert('لا توجد صيدلية مناوبة حالياً');

            return;

        }

        

        const modal = document.getElementById('editModal');

        const modalTitle = document.getElementById('modalTitle');

        const modalForm = document.getElementById('modalForm');

        

        if (!modal || !modalTitle || !modalForm) return;

        

        modalTitle.textContent = 'تعديل بيانات صيدلية المناوبة';

        

        modalForm.innerHTML = `

            <div class="form-group">

                <label for="modal-on-duty-name">اسم الصيدلية</label>

                <input type="text" id="modal-on-duty-name" name="name" value="${pharmacy.name}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-on-duty-phone">رقم الهاتف</label>

                <input type="tel" id="modal-on-duty-phone" name="phone" value="${pharmacy.phone}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-on-duty-address">العنوان</label>

                <input type="text" id="modal-on-duty-address" name="address" value="${pharmacy.address}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-on-duty-isOnDuty">حالة المناوبة</label>

                <select id="modal-on-duty-isOnDuty" name="isOnDuty" required>

                    <option value="true" ${pharmacy.isOnDuty ? 'selected' : ''}>مناوبة</option>

                    <option value="false" ${!pharmacy.isOnDuty ? 'selected' : ''}>غير مناوبة</option>

                </select>

            </div>
            
            <div class="form-group">

                <label for="modal-on-duty-shiftType">نوع المناوبة</label>

                <select id="modal-on-duty-shiftType" name="shiftType" required>

                    <option value="صباحية" ${(pharmacy.shiftType || 'صباحية') === 'صباحية' ? 'selected' : ''}>صباحية</option>

                    <option value="مسائية" ${(pharmacy.shiftType || 'صباحية') === 'مسائية' ? 'selected' : ''}>مسائية</option>

                </select>

            </div>

            

            <button type="button" class="submit-button" onclick="saveOnDutyEditFromModal('${pharmacy._id}')">حفظ التعديلات</button>

        `;

        

        modal.style.display = 'flex';

    } catch (error) {

        showNotification('حدث خطأ في تحميل بيانات الصيدلية: ' + error.message, 'error');

    }

}



// Function to save on-duty pharmacy edits from modal

async function saveOnDutyEditFromModal(id) {

    try {

        const pharmacyData = {

            name: document.getElementById('modal-on-duty-name').value,

            phone: document.getElementById('modal-on-duty-phone').value,

            address: document.getElementById('modal-on-duty-address').value,

            isOnDuty: document.getElementById('modal-on-duty-isOnDuty').value === 'true',

            shiftType: document.getElementById('modal-on-duty-shiftType').value

        };

        

        await updatePharmacy(id, pharmacyData);

        closeEditModal();

        await loadOnDutyManagement();
        
        // Reload on-duty pharmacies on main pages if they exist
        if (typeof loadOnDutyPharmacy === 'function') {
            await loadOnDutyPharmacy();
        }

        showNotification("تم تحديث صيدلية المناوبة بنجاح.", 'success');

    } catch (error) {

        showNotification('حدث خطأ في حفظ التعديلات: ' + error.message, 'error');

    }

}



// Function to close the modal

function closeEditModal() {

    const modal = document.getElementById('editModal');

    if (modal) {

        modal.style.display = 'none';

    }

}



// Function to filter doctors management based on search input and category filter

function filterDoctorsManagement() {

    const searchTerm = document.getElementById('adminDoctorsSearchInput');

    const categoryFilter = document.getElementById('adminDoctorsCategoryFilter');

    const container = document.getElementById('doctors-management-container');

    

    if (!searchTerm || !categoryFilter || !container) return;

    

    const searchValue = searchTerm.value.toLowerCase();

    const categoryValue = categoryFilter.value;

    const cards = container.getElementsByClassName('admin-card');

    

    for (let i = 0; i < cards.length; i++) {

        const card = cards[i];

        const doctorId = card.dataset.id;

        const doctor = doctorsData.find(d => d._id === doctorId);

        

        if (!doctor) {

            card.style.display = 'none';

            continue;

        }

        

        const doctorName = doctor.name.toLowerCase();

        const matchesSearch = doctorName.includes(searchValue);

        const matchesCategory = categoryValue === '' || doctor.speciality === categoryValue;

        

        if (matchesSearch && matchesCategory) {

            card.style.display = '';

        } else {

            card.style.display = 'none';

        }

    }

}



// Function to filter pharmacies management

function filterPharmaciesManagement() {

    const searchTerm = document.getElementById('adminPharmaciesSearchInput');

    const container = document.getElementById('pharmacies-management-container');

    

    if (!searchTerm || !container) return;

    

    const searchValue = searchTerm.value.toLowerCase();

    const cards = container.getElementsByClassName('admin-card');

    

    for (let i = 0; i < cards.length; i++) {

        const card = cards[i];

        const pharmacyId = card.dataset.id;

        const pharmacy = pharmaciesData.find(p => p._id === pharmacyId);

        

        if (!pharmacy) {

            card.style.display = 'none';

            continue;

        }

        

        const pharmacyName = pharmacy.name.toLowerCase();

        const matchesSearch = pharmacyName.includes(searchValue);

        

        if (matchesSearch) {

            card.style.display = '';

        } else {

            card.style.display = 'none';

        }

    }

}



// Function to filter pharmacists management

function filterPharmacistsManagement() {

    const searchTerm = document.getElementById('adminPharmacistsSearchInput');

    const container = document.getElementById('pharmacists-management-container');

    

    if (!searchTerm || !container) return;

    

    const searchValue = searchTerm.value.toLowerCase();

    const cards = container.getElementsByClassName('admin-card');

    

    for (let i = 0; i < cards.length; i++) {

        const card = cards[i];

        const pharmacistId = card.dataset.id;

        const pharmacist = pharmacistsData.find(p => p._id === pharmacistId);

        

        if (!pharmacist) {

            card.style.display = 'none';

            continue;

        }

        

        const pharmacistName = pharmacist.name.toLowerCase();

        const matchesSearch = pharmacistName.includes(searchValue);

        

        if (matchesSearch) {

            card.style.display = '';

        } else {

            card.style.display = 'none';

        }

    }

}



async function loadOnDutyManagement() {

    try {

        const pharmacies = await getOnDutyPharmacies();

        

        const container = document.getElementById('on-duty-management-container');

        if (!container) return;

        

        if (pharmacies.length === 0) {

            container.innerHTML = `

                <div class="admin-on-duty-info">

                    <p>لا توجد صيدليات مناوبة حالياً</p>

                    <button type="button" class="save-on-duty-btn" onclick="selectOnDutyPharmacy()">إضافة صيدلية مناوبة</button>

                </div>

            `;

            return;

        }

        

        // Display all on-duty pharmacies

        let pharmaciesHTML = '<div class="admin-on-duty-list">';

        pharmacies.forEach((pharmacy) => {
            const shiftType = pharmacy.shiftType || 'صباحية';
            const shiftIcon = shiftType === 'صباحية' ? '🌅' : '🌙';
            const shiftClass = shiftType === 'صباحية' ? 'shift-morning' : 'shift-evening';
            const oppositeShift = shiftType === 'صباحية' ? 'مسائية' : 'صباحية';
            const oppositeIcon = shiftType === 'صباحية' ? '🌙' : '🌅';

            pharmaciesHTML += `

                <div class="admin-on-duty-item">

                    <div class="admin-on-duty-item-info">

                        <p><strong>اسم الصيدلية:</strong> ${pharmacy.name}</p>

                        <p><strong>رقم الهاتف:</strong> ${pharmacy.phone}</p>

                        <p><strong>العنوان:</strong> ${pharmacy.address}</p>
                        
                        <div class="shift-type-display" style="margin: 15px 0;">
                            <span class="shift-badge ${shiftClass}" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                                <span>${shiftIcon}</span>
                                <span>مناوبة ${shiftType}</span>
                            </span>
                        </div>

                    </div>
                    
                    <div class="admin-on-duty-actions" style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                        <button type="button" class="shift-toggle-btn ${shiftClass}" onclick="toggleShiftType('${pharmacy._id}', '${oppositeShift}')" style="width: 100%; padding: 10px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                            <span>${oppositeIcon}</span> تغيير إلى مناوبة ${oppositeShift}
                        </button>
                        <button type="button" class="cancel-on-duty-btn" onclick="cancelOnDuty('${pharmacy._id}')">إلغاء المناوبة</button>
                    </div>

                </div>

            `;

        });

        pharmaciesHTML += '</div>';

        pharmaciesHTML += `<button type="button" class="save-on-duty-btn" onclick="selectOnDutyPharmacy()" style="margin-top: 15px;">إضافة صيدلية مناوبة</button>`;

        

        container.innerHTML = pharmaciesHTML;

    } catch (error) {

        console.error('Error loading on-duty management:', error);

        const container = document.getElementById('on-duty-management-container');

        if (container) {

            container.innerHTML = '<p class="no-results">حدث خطأ في تحميل صيدليات المناوبة.</p>';

        }

    }

}



async function selectOnDutyPharmacy() {

    try {

        const pharmacies = await getAllPharmacies();

        if (pharmacies.length === 0) {

            alert('لا توجد صيدليات في النظام');

            return;

        }

        

        // Filter out pharmacies that are already on duty

        const availablePharmacies = pharmacies.filter(p => !p.isOnDuty);

        

        if (availablePharmacies.length === 0) {

            alert('جميع الصيدليات موجودة في المناوبة بالفعل');

            return;

        }

        

        // Create modal for selecting pharmacy

        const modal = document.getElementById('editModal');

        const modalTitle = document.getElementById('modalTitle');

        const modalForm = document.getElementById('modalForm');

        

        if (!modal || !modalTitle || !modalForm) {

            // Fallback to prompt if modal doesn't exist

            const pharmacyNames = availablePharmacies.map(p => p.name).join('\n');

            const selectedName = prompt(`اختر صيدلية من القائمة:\n${pharmacyNames}`);

            

            if (!selectedName) return;

            

            const selectedPharmacy = availablePharmacies.find(p => p.name === selectedName);

            if (!selectedPharmacy) {

                alert('الصيدلية المختارة غير موجودة');

                return;

            }

            

            await updatePharmacy(selectedPharmacy._id, { ...selectedPharmacy, isOnDuty: true });

            await loadOnDutyManagement();

            showNotification('تم إضافة صيدلية المناوبة بنجاح', 'success');

            return;

        }

        

        modalTitle.textContent = 'إضافة صيدلية مناوبة';

        

        // Create select dropdown with only non-on-duty pharmacies

        let selectOptions = '<option value="">اختر صيدلية</option>';

        availablePharmacies.forEach(pharmacy => {

            selectOptions += `<option value="${pharmacy._id}">${pharmacy.name}</option>`;

        });

        

        modalForm.innerHTML = `

            <div class="form-group">

                <label for="modal-select-pharmacy">اختر صيدلية لإضافتها للمناوبة</label>

                <select id="modal-select-pharmacy" name="pharmacy" class="form-input" required>

                    ${selectOptions}

                </select>

            </div>
            
            <div class="form-group">

                <label for="modal-select-shiftType">نوع المناوبة</label>

                <select id="modal-select-shiftType" name="shiftType" class="form-input" required>

                    <option value="صباحية">صباحية</option>

                    <option value="مسائية">مسائية</option>

                </select>

            </div>

            <button type="button" class="submit-button" onclick="saveOnDutySelection()">إضافة</button>

        `;

        

        modal.style.display = 'flex';

        

        // Store pharmacies in window for use in saveOnDutySelection

        window.tempPharmacies = availablePharmacies;

    } catch (error) {

        showNotification('حدث خطأ: ' + error.message, 'error');

    }

}



async function saveOnDutySelection() {

    try {

        const pharmacyId = document.getElementById('modal-select-pharmacy').value;

        if (!pharmacyId) {

            alert('الرجاء اختيار صيدلية');

            return;

        }

        

        const pharmacies = window.tempPharmacies || [];

        const selectedPharmacy = pharmacies.find(p => p._id === pharmacyId);

        

        if (!selectedPharmacy) {

            alert('الصيدلية المختارة غير موجودة');

            return;

        }

        

        // Get shift type from modal
        const shiftType = document.getElementById('modal-select-shiftType').value || 'صباحية';
        
        // Set selected pharmacy to on duty (without removing others)
        await updatePharmacy(selectedPharmacy._id, { ...selectedPharmacy, isOnDuty: true, shiftType: shiftType });

        

        closeEditModal();

        await loadOnDutyManagement();

        await loadPharmaciesManagement(); // Reload pharmacies list to update status

        alert('تم إضافة صيدلية المناوبة بنجاح');

        

        // Clean up

        window.tempPharmacies = null;

    } catch (error) {

        showNotification('حدث خطأ: ' + error.message, 'error');

    }

}



// Function to cancel on-duty status for a pharmacy

async function cancelOnDuty(pharmacyId) {

    if (!confirm('هل أنت متأكد من إلغاء المناوبة عن هذه الصيدلية؟')) {

        return;

    }

    

    try {

        const pharmacy = await getPharmacyById(pharmacyId);

        if (!pharmacy) {

            alert('الصيدلية غير موجودة');

            return;

        }

        

        await updatePharmacy(pharmacyId, { ...pharmacy, isOnDuty: false });

        await loadOnDutyManagement();

        await loadPharmaciesManagement(); // Reload pharmacies list to update status

        showNotification('تم إلغاء المناوبة بنجاح', 'success');

    } catch (error) {

        showNotification('حدث خطأ: ' + error.message, 'error');

    }

}



// Function to toggle shift type for a pharmacy
async function toggleShiftType(pharmacyId, newShiftType) {
    try {
        const pharmacy = await getPharmacyById(pharmacyId);
        if (!pharmacy) {
            showNotification('الصيدلية غير موجودة', 'error');
            return;
        }
        
        // Update pharmacy with new shift type
        const updatedData = {
            name: pharmacy.name,
            phone: pharmacy.phone,
            address: pharmacy.address,
            isOnDuty: pharmacy.isOnDuty,
            shiftType: newShiftType
        };
        
        await updatePharmacy(pharmacyId, updatedData);
        await loadOnDutyManagement();
        
        // Reload on-duty pharmacies on main pages if they exist
        if (typeof loadOnDutyPharmacy === 'function') {
            await loadOnDutyPharmacy();
        }
        
        showNotification(`تم تغيير نوع المناوبة إلى ${newShiftType} بنجاح`, 'success');
    } catch (error) {
        showNotification('حدث خطأ في تغيير نوع المناوبة: ' + error.message, 'error');
    }
}

// Export functions for use in onclick handlers

window.saveOnDutySelection = saveOnDutySelection;

window.cancelOnDuty = cancelOnDuty;

window.toggleShiftType = toggleShiftType;



async function acceptSubmission(index) {

    try {

        // Get pending submissions from localStorage

        const storedPendingSubmissions = localStorage.getItem("pendingSubmissions");

        const pendingSubmissions = storedPendingSubmissions ? JSON.parse(storedPendingSubmissions) : [];

        const submission = pendingSubmissions[index];

        

        if (!submission) {

            alert('الطلب غير موجود');

            return;

        }

        

        // Determine the type and create accordingly

        if (submission.userType === "pharmacy") {

            // Create pharmacy

            const pharmacyData = {

                name: submission.fullName,

                phone: submission.phone,

                address: submission.location || "—",

                isOnDuty: false,

                shiftType: 'صباحية'

            };

            

            await createPharmacy(pharmacyData);

            showNotification("تمت إضافة الصيدلية إلى الدليل بنجاح.", 'success');

        } else if (submission.userType === "pharmacist") {

            // Create pharmacist

            const pharmacistData = {

                name: submission.fullName,

                phone: submission.phone,

                gender: submission.gender || 'ذكر',

                address: submission.location || "—"

            };

            

            await createPharmacist(pharmacistData);

            const genderText = submission.gender === 'أنثى' ? 'صيدلانية' : 'صيدلي';

            showNotification(`تمت إضافة ال${genderText} إلى الدليل بنجاح.`, 'success');

        } else {

            // Create doctor

            // If specialty is "غير ذلك", keep it as is (admin will update it later from notes)
            const doctorData = {

                name: submission.fullName,

                phone: submission.phone,

                speciality: submission.specialty || 'غير ذلك',

                gender: submission.gender || 'ذكر',

                address: submission.location || "—"

            };

            

            await createDoctor(doctorData);

            const genderText = submission.gender === 'أنثى' ? 'طبيبة' : 'طبيب';

            showNotification(`تمت إضافة ال${genderText} إلى الدليل بنجاح.`, 'success');

        }

        

        // Remove from pending submissions

        pendingSubmissions.splice(index, 1);

        localStorage.setItem("pendingSubmissions", JSON.stringify(pendingSubmissions));

        

        // Reload admin panel

        await loadAdminPanel();

    } catch (error) {

        showNotification('حدث خطأ في إضافة البيانات: ' + error.message, 'error');

    }

}

// Function to normalize specialty text (remove diacritics and normalize)
function normalizeSpecialty(text) {
    if (!text) return '';
    // Remove all diacritics (همزة، تشكيل، إلخ) and normalize Arabic characters
    return text
        .replace(/[أإآ]/g, 'ا')  // Convert all forms of Alef to ا
        .replace(/[ى]/g, 'ي')    // Convert Alef maksura to Ya
        .replace(/[ة]/g, 'ه')    // Convert Taa marbuta to Haa
        .replace(/[ًٌٍَُِّْ]/g, '')  // Remove all diacritics
        .replace(/\s+/g, ' ')     // Normalize spaces (multiple spaces to single)
        .trim()
        .toLowerCase();
}

// Function to match specialty with existing list
function matchSpecialty(inputSpecialty) {
    if (!inputSpecialty || !inputSpecialty.trim()) {
        return 'غير ذلك';
    }
    
    const specialtyList = [
        'أطفال',
        'نسائية',
        'عظمية',
        'قلبية',
        'داخلية',
        'عصبية',
        'عينية',
        'أنف أذن حنجرة',
        'طب طوارئ',
        'أشعة',
        'أسنان'
    ];
    
    const normalizedInput = normalizeSpecialty(inputSpecialty);
    
    // Check for exact match first (most common case)
    for (const specialty of specialtyList) {
        const normalizedSpecialty = normalizeSpecialty(specialty);
        if (normalizedSpecialty === normalizedInput) {
            return specialty;
        }
    }
    
    // Check for partial match (contains) - for cases like "اسنان" vs "أسنان" or "انف اذن حنجرة" vs "أنف أذن حنجرة"
    for (const specialty of specialtyList) {
        const normalizedSpecialty = normalizeSpecialty(specialty);
        // Check if input contains specialty or specialty contains input
        if (normalizedInput.includes(normalizedSpecialty) || normalizedSpecialty.includes(normalizedInput)) {
            // For multi-word specialties like "أنف أذن حنجرة", check if all words match
            const inputWords = normalizedInput.split(' ').filter(w => w.length > 0);
            const specialtyWords = normalizedSpecialty.split(' ').filter(w => w.length > 0);
            
            // If both have multiple words, check if they match word by word
            if (inputWords.length > 1 && specialtyWords.length > 1) {
                if (inputWords.length === specialtyWords.length) {
                    let allWordsMatch = true;
                    for (let i = 0; i < inputWords.length; i++) {
                        if (inputWords[i] !== specialtyWords[i]) {
                            allWordsMatch = false;
                            break;
                        }
                    }
                    if (allWordsMatch) {
                        return specialty;
                    }
                }
            }
            
            // For single word or partial matches, check if the match is significant (at least 3 characters)
            if (normalizedInput.length >= 3 || normalizedSpecialty.length >= 3) {
                // Additional check: if one contains the other and they're similar length, it's a match
                const lengthDiff = Math.abs(normalizedInput.length - normalizedSpecialty.length);
                if (lengthDiff <= 2) { // Allow small difference in length
                    return specialty;
                }
            }
        }
    }
    
    // Special handling for "أنف أذن حنجرة" variations
    const anfVariations = ['انف اذن حنجرة', 'انف اذن حنجره', 'انف اذن حنجرة', 'أنف اذن حنجرة', 'انف أذن حنجرة'];
    const normalizedAnfInput = normalizeSpecialty(inputSpecialty);
    for (const variation of anfVariations) {
        if (normalizeSpecialty(variation) === normalizedAnfInput) {
            return 'أنف أذن حنجرة';
        }
    }
    
    // If no match found, return the original input (trimmed)
    return inputSpecialty.trim();
}

// Function to submit admin form (adds directly to database)
async function submitAdminForm() {
    try {
        // Get form elements
        const userType = document.getElementById('admin-user-type').value;
        const fullName = document.getElementById('admin-full-name').value;
        const phone = document.getElementById('admin-phone').value;
        const gender = document.getElementById('admin-gender').value;
        let specialty = document.getElementById('admin-specialty').value;
        const location = document.getElementById('admin-location').value;
        
        // Validate user type
        if (!userType) {
            showNotification('الرجاء اختيار النوع (طبيب، صيدلي، أو صيدلية)', 'warning');
            return;
        }
        
        // Validate gender for doctor and pharmacist
        if ((userType === 'doctor' || userType === 'pharmacist') && !gender) {
            showNotification('الرجاء اختيار الجنس', 'warning');
            return;
        }
        
        // Validate specialty for doctor
        if (userType === 'doctor' && !specialty.trim()) {
            showNotification('الرجاء إدخال الاختصاص', 'warning');
            return;
        }
        
        // Match specialty with existing list (normalize to match existing specialties)
        if (userType === 'doctor' && specialty.trim()) {
            specialty = matchSpecialty(specialty);
        }
        
        // Determine the type and create accordingly
        if (userType === "pharmacy") {
            // Create pharmacy
            const pharmacyData = {
                name: fullName,
                phone: phone,
                address: location || "—",
                isOnDuty: false,
                shiftType: 'صباحية'
            };
            
            await createPharmacy(pharmacyData);
            showNotification("تمت إضافة الصيدلية إلى الدليل بنجاح.", 'success');
            
        } else if (userType === "pharmacist") {
            // Create pharmacist
            const pharmacistData = {
                name: fullName,
                phone: phone,
                gender: gender || 'ذكر',
                address: location || "—"
            };
            
            await createPharmacist(pharmacistData);
            const genderText = gender === 'أنثى' ? 'صيدلانية' : 'صيدلي';
            showNotification(`تمت إضافة ال${genderText} إلى الدليل بنجاح.`, 'success');
            
        } else {
            // Create doctor
            // Use matched specialty (normalized to match existing specialties)
            const matchedSpecialty = specialty ? matchSpecialty(specialty) : 'غير ذلك';
            const doctorData = {
                name: fullName,
                phone: phone,
                speciality: matchedSpecialty,
                gender: gender || 'ذكر',
                address: location || "—"
            };
            
            await createDoctor(doctorData);
            const genderText = gender === 'أنثى' ? 'طبيبة' : 'طبيب';
            showNotification(`تمت إضافة ال${genderText} إلى الدليل بنجاح.`, 'success');
        }
        
        // Clear form
        document.getElementById('admin-add-form').reset();
        document.getElementById('admin-gender-group').style.display = 'none';
        document.getElementById('admin-specialty-group').style.display = 'none';
        
        // Reload admin panel to show new data
        await loadAdminPanel();
        
    } catch (error) {
        showNotification('حدث خطأ في إضافة البيانات: ' + error.message, 'error');
    }
}



function rejectSubmission(index) {

    const storedPendingSubmissions = localStorage.getItem("pendingSubmissions");

    const pendingSubmissions = storedPendingSubmissions ? JSON.parse(storedPendingSubmissions) : [];

    

    pendingSubmissions.splice(index, 1);

    localStorage.setItem("pendingSubmissions", JSON.stringify(pendingSubmissions));

    

    loadAdminPanel();

}



// Delete doctor handler - calls API deleteDoctor function

async function deleteDoctorHandler(id) {

    if (!confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {

        return;

    }

    

    try {

        // Use the deleteDoctor function from api.js

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {

            method: 'DELETE',

            headers: getAuthHeaders()

        });

        

        if (!response.ok) {

            const data = await response.json();

            throw new Error(data.message || 'فشل حذف الطبيب');

        }

        

        await loadDoctorsManagement();

        showNotification('تم حذف الطبيب بنجاح', 'success');

    } catch (error) {

        showNotification('حدث خطأ في حذف الطبيب: ' + error.message, 'error');

    }

}



// Export function for use in onclick handlers

window.deleteDoctor = deleteDoctorHandler;



// Delete pharmacy handler

async function deletePharmacyHandler(id) {

    if (!confirm('هل أنت متأكد من حذف هذه الصيدلية؟')) {

        return;

    }

    

    try {

        await deletePharmacy(id);

        await loadPharmaciesManagement();

        await loadOnDutyManagement(); // Reload on-duty section in case deleted pharmacy was on duty

        showNotification('تم حذف الصيدلية بنجاح', 'success');

    } catch (error) {

        showNotification('حدث خطأ في حذف الصيدلية: ' + error.message, 'error');

    }

}



// Delete pharmacist handler

async function deletePharmacistHandler(id) {

    if (!confirm('هل أنت متأكد من حذف هذا الصيدلي؟')) {

        return;

    }

    

    try {

        await deletePharmacist(id);

        await loadPharmacistsManagement();

        showNotification('تم حذف الصيدلي بنجاح', 'success');

    } catch (error) {

        showNotification('حدث خطأ في حذف الصيدلي: ' + error.message, 'error');

    }

}



// Open pharmacy edit modal

async function openPharmacyEditModal(id) {

    try {

        const pharmacy = await getPharmacyById(id);

        const modal = document.getElementById('editModal');

        const modalTitle = document.getElementById('modalTitle');

        const modalForm = document.getElementById('modalForm');

        

        if (!modal || !modalTitle || !modalForm) return;

        

        modalTitle.textContent = 'تعديل بيانات الصيدلية';

        

        modalForm.innerHTML = `

            <div class="form-group">

                <label for="modal-pharmacy-name">اسم الصيدلية</label>

                <input type="text" id="modal-pharmacy-name" name="name" value="${pharmacy.name}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacy-phone">رقم الهاتف</label>

                <input type="tel" id="modal-pharmacy-phone" name="phone" value="${pharmacy.phone}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacy-address">العنوان</label>

                <input type="text" id="modal-pharmacy-address" name="address" value="${pharmacy.address}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacy-isOnDuty">حالة المناوبة</label>

                <select id="modal-pharmacy-isOnDuty" name="isOnDuty" required>

                    <option value="true" ${pharmacy.isOnDuty ? 'selected' : ''}>مناوبة</option>

                    <option value="false" ${!pharmacy.isOnDuty ? 'selected' : ''}>غير مناوبة</option>

                </select>

            </div>
            
            <div class="form-group">

                <label for="modal-pharmacy-shiftType">نوع المناوبة</label>

                <select id="modal-pharmacy-shiftType" name="shiftType" required>

                    <option value="صباحية" ${(pharmacy.shiftType || 'صباحية') === 'صباحية' ? 'selected' : ''}>صباحية</option>

                    <option value="مسائية" ${(pharmacy.shiftType || 'صباحية') === 'مسائية' ? 'selected' : ''}>مسائية</option>

                </select>

            </div>

            

            <button type="button" class="submit-button" onclick="savePharmacyEditFromModal('${pharmacy._id}')">حفظ التعديلات</button>

        `;

        

        modal.style.display = 'flex';

    } catch (error) {

        showNotification('حدث خطأ في تحميل بيانات الصيدلية: ' + error.message, 'error');

    }

}



// Save pharmacy edit from modal

async function savePharmacyEditFromModal(id) {

    try {

        const pharmacyData = {

            name: document.getElementById('modal-pharmacy-name').value,

            phone: document.getElementById('modal-pharmacy-phone').value,

            address: document.getElementById('modal-pharmacy-address').value,

            isOnDuty: document.getElementById('modal-pharmacy-isOnDuty').value === 'true',

            shiftType: document.getElementById('modal-pharmacy-shiftType').value

        };

        

        await updatePharmacy(id, pharmacyData);

        closeEditModal();

        await loadPharmaciesManagement();

        await loadOnDutyManagement(); // Reload on-duty section
        
        // Reload on-duty pharmacies on main pages if they exist
        if (typeof loadOnDutyPharmacy === 'function') {
            await loadOnDutyPharmacy();
        }

        showNotification("تم تحديث بيانات الصيدلية بنجاح.", 'success');

    } catch (error) {

        showNotification('حدث خطأ في حفظ التعديلات: ' + error.message, 'error');

    }

}



// Open pharmacist edit modal

async function openPharmacistEditModal(id) {

    try {

        const pharmacist = await getPharmacistById(id);

        const modal = document.getElementById('editModal');

        const modalTitle = document.getElementById('modalTitle');

        const modalForm = document.getElementById('modalForm');

        

        if (!modal || !modalTitle || !modalForm) return;

        

        modalTitle.textContent = 'تعديل بيانات الصيدلي';

        

        modalForm.innerHTML = `

            <div class="form-group">

                <label for="modal-pharmacist-name">الاسم</label>

                <input type="text" id="modal-pharmacist-name" name="name" value="${pharmacist.name}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacist-phone">رقم الهاتف</label>

                <input type="tel" id="modal-pharmacist-phone" name="phone" value="${pharmacist.phone}" required>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacist-gender">الجنس</label>

                <select id="modal-pharmacist-gender" name="gender" required>

                    <option value="ذكر" ${pharmacist.gender === 'ذكر' ? 'selected' : ''}>ذكر</option>

                    <option value="أنثى" ${pharmacist.gender === 'أنثى' ? 'selected' : ''}>أنثى</option>

                </select>

            </div>

            

            <div class="form-group">

                <label for="modal-pharmacist-address">العنوان</label>

                <input type="text" id="modal-pharmacist-address" name="address" value="${pharmacist.address}" required>

            </div>

            

            <button type="button" class="submit-button" onclick="savePharmacistEditFromModal('${pharmacist._id}')">حفظ التعديلات</button>

        `;

        

        modal.style.display = 'flex';

    } catch (error) {

        showNotification('حدث خطأ في تحميل بيانات الصيدلي: ' + error.message, 'error');

    }

}



// Save pharmacist edit from modal

async function savePharmacistEditFromModal(id) {

    try {

        const pharmacistData = {

            name: document.getElementById('modal-pharmacist-name').value,

            phone: document.getElementById('modal-pharmacist-phone').value,

            gender: document.getElementById('modal-pharmacist-gender').value,

            address: document.getElementById('modal-pharmacist-address').value

        };

        

        await updatePharmacist(id, pharmacistData);

        closeEditModal();

        await loadPharmacistsManagement();

        showNotification("تم تحديث بيانات الصيدلي بنجاح.", 'success');

    } catch (error) {

        showNotification('حدث خطأ في حفظ التعديلات: ' + error.message, 'error');

    }

}



// Function to toggle pharmacy on-duty status
async function togglePharmacyOnDuty(pharmacyId, setOnDuty) {
    try {
        const pharmacy = await getPharmacyById(pharmacyId);
        if (!pharmacy) {
            showNotification('الصيدلية غير موجودة', 'error');
            return;
        }
        
        await updatePharmacy(pharmacyId, { ...pharmacy, isOnDuty: setOnDuty });
        
        // Reload pharmacies management to update the UI
        await loadPharmaciesManagement();
        
        // Reload on-duty management section (in admin.html) if it exists
        const onDutyContainer = document.getElementById('on-duty-management-container');
        if (onDutyContainer) {
            await loadOnDutyManagement();
        }
        
        const message = setOnDuty ? 'تم تفعيل المناوبة للصيدلية بنجاح' : 'تم إلغاء المناوبة عن الصيدلية بنجاح';
        showNotification(message, 'success');
    } catch (error) {
        showNotification('حدث خطأ في تغيير حالة المناوبة: ' + error.message, 'error');
    }
}

// Export functions for use in onclick handlers

window.deletePharmacyHandler = deletePharmacyHandler;

window.deletePharmacistHandler = deletePharmacistHandler;

window.openPharmacyEditModal = openPharmacyEditModal;

window.openPharmacistEditModal = openPharmacistEditModal;

window.savePharmacyEditFromModal = savePharmacyEditFromModal;

window.savePharmacistEditFromModal = savePharmacistEditFromModal;

window.togglePharmacyOnDuty = togglePharmacyOnDuty;



// Add event listeners for filters

document.addEventListener('DOMContentLoaded', function() {

    // Doctors search and filter

    const doctorsSearchInput = document.getElementById('adminDoctorsSearchInput');

    const doctorsCategoryFilter = document.getElementById('adminDoctorsCategoryFilter');

    

    if (doctorsSearchInput) {

        doctorsSearchInput.addEventListener('input', function() {

            filterDoctorsManagement();

        });

    }

    

    if (doctorsCategoryFilter) {

        doctorsCategoryFilter.addEventListener('change', function() {

            filterDoctorsManagement();

        });

    }

    

    // Pharmacies search

    const pharmaciesSearchInput = document.getElementById('adminPharmaciesSearchInput');

    if (pharmaciesSearchInput) {

        pharmaciesSearchInput.addEventListener('input', function() {

            filterPharmaciesManagement();

        });

    }

    

    // Pharmacists search

    const pharmacistsSearchInput = document.getElementById('adminPharmacistsSearchInput');

    if (pharmacistsSearchInput) {

        pharmacistsSearchInput.addEventListener('input', function() {

            filterPharmacistsManagement();

        });

    }

    

    const closeModalBtn = document.getElementById('closeModal');

    const modal = document.getElementById('editModal');

    

    if (closeModalBtn) {

        closeModalBtn.addEventListener('click', closeEditModal);

    }

    

    if (modal) {

        modal.addEventListener('click', function(event) {

            if (event.target === modal) {

                closeEditModal();

            }

        });

    }

});

