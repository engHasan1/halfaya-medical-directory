// API Service for handling all backend requests

// ===== Authentication =====
async function loginAdmin(username, password) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'فشل تسجيل الدخول');
    }

    // Save token
    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

async function checkAuth() {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.ME}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      removeAuthToken();
      return null;
    }

    const data = await response.json();
    return data.admin;
  } catch (error) {
    removeAuthToken();
    return null;
  }
}

// ===== Doctors =====
async function getAllDoctors() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الأطباء');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

async function getDoctorById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الطبيب');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function createDoctor(doctorData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل إضافة الطبيب');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function updateDoctor(id, doctorData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحديث الطبيب');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function deleteDoctor(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTORS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل حذف الطبيب');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// ===== Pharmacies =====
async function getAllPharmacies() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الصيدليات');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    throw error;
  }
}

async function getOnDutyPharmacies() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}/on-duty`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل صيدليات المناوبة');
    }

    return data.data || [];
  } catch (error) {
    throw error;
  }
}

async function getPharmacyById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الصيدلية');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function createPharmacy(pharmacyData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pharmacyData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل إضافة الصيدلية');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function updatePharmacy(id, pharmacyData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pharmacyData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحديث الصيدلية');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function deletePharmacy(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACIES}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل حذف الصيدلية');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// ===== Pharmacists =====
async function getAllPharmacists() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACISTS}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الصيادلة');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching pharmacists:', error);
    throw error;
  }
}

async function getPharmacistById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACISTS}/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحميل الصيدلاني');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function createPharmacist(pharmacistData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACISTS}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pharmacistData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل إضافة الصيدلاني');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function updatePharmacist(id, pharmacistData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACISTS}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pharmacistData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل تحديث الصيدلاني');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
}

async function deletePharmacist(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PHARMACISTS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'فشل حذف الصيدلاني');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

