// ===== LOCATION MODULE - Leaflet + OpenStreetMap =====
// Enhanced GPS with interactive map, reverse geocoding, ward detection
// FREE - No API key needed

const LocationModule = (function() {
    'use strict';

    let map = null;
    let marker = null;
    let accuracyCircle = null;
    let currentCoords = null;
    let mapInitialized = false;

    // Thanjavur center coordinates (fallback)
    const THANJAVUR_CENTER = { lat: 10.7870, lng: 79.1378 };

    // Ward boundaries (approximate centers for auto-detection)
    const WARD_CENTERS = {
        1: { lat: 10.7905, lng: 79.1350, radius: 0.005 },
        2: { lat: 10.7880, lng: 79.1320, radius: 0.005 },
        3: { lat: 10.7920, lng: 79.1380, radius: 0.005 },
        4: { lat: 10.7860, lng: 79.1400, radius: 0.005 },
        5: { lat: 10.7840, lng: 79.1360, radius: 0.005 },
        6: { lat: 10.7950, lng: 79.1410, radius: 0.005 },
        7: { lat: 10.7830, lng: 79.1420, radius: 0.005 },
        8: { lat: 10.7810, lng: 79.1380, radius: 0.005 },
        9: { lat: 10.7970, lng: 79.1350, radius: 0.005 },
        10: { lat: 10.7790, lng: 79.1340, radius: 0.005 },
        11: { lat: 10.7850, lng: 79.1300, radius: 0.006 },
        12: { lat: 10.7930, lng: 79.1420, radius: 0.005 },
        13: { lat: 10.7770, lng: 79.1380, radius: 0.005 },
        14: { lat: 10.7890, lng: 79.1450, radius: 0.005 },
        15: { lat: 10.7960, lng: 79.1300, radius: 0.005 },
        16: { lat: 10.7820, lng: 79.1440, radius: 0.005 },
        17: { lat: 10.7940, lng: 79.1280, radius: 0.005 },
        18: { lat: 10.7780, lng: 79.1420, radius: 0.005 },
        19: { lat: 10.7910, lng: 79.1260, radius: 0.005 },
        20: { lat: 10.7870, lng: 79.1480, radius: 0.005 },
        21: { lat: 10.7980, lng: 79.1380, radius: 0.006 },
        22: { lat: 10.7750, lng: 79.1360, radius: 0.006 },
        23: { lat: 10.7990, lng: 79.1420, radius: 0.006 },
        24: { lat: 10.7740, lng: 79.1400, radius: 0.006 },
        25: { lat: 10.8000, lng: 79.1320, radius: 0.006 },
        26: { lat: 10.7850, lng: 79.1500, radius: 0.006 },
        27: { lat: 10.7720, lng: 79.1350, radius: 0.006 },
        28: { lat: 10.8020, lng: 79.1400, radius: 0.006 },
        29: { lat: 10.7700, lng: 79.1380, radius: 0.006 },
        30: { lat: 10.7880, lng: 79.1520, radius: 0.006 },
        31: { lat: 10.8040, lng: 79.1350, radius: 0.007 },
        32: { lat: 10.7680, lng: 79.1360, radius: 0.007 },
        33: { lat: 10.7900, lng: 79.1550, radius: 0.007 },
        34: { lat: 10.8060, lng: 79.1420, radius: 0.007 },
        35: { lat: 10.7660, lng: 79.1400, radius: 0.007 },
        36: { lat: 10.7920, lng: 79.1200, radius: 0.008 },
        37: { lat: 10.8080, lng: 79.1380, radius: 0.008 },
        38: { lat: 10.7640, lng: 79.1350, radius: 0.008 },
        39: { lat: 10.7850, lng: 79.1580, radius: 0.008 },
        40: { lat: 10.8100, lng: 79.1450, radius: 0.008 },
        41: { lat: 10.7620, lng: 79.1380, radius: 0.008 },
        42: { lat: 10.7800, lng: 79.1600, radius: 0.008 },
        43: { lat: 10.8120, lng: 79.1350, radius: 0.009 },
        44: { lat: 10.7600, lng: 79.1400, radius: 0.009 },
        45: { lat: 10.7750, lng: 79.1620, radius: 0.009 },
        46: { lat: 10.8140, lng: 79.1420, radius: 0.009 },
        47: { lat: 10.7580, lng: 79.1350, radius: 0.009 },
        48: { lat: 10.7700, lng: 79.1640, radius: 0.009 },
        49: { lat: 10.8160, lng: 79.1380, radius: 0.010 },
        50: { lat: 10.7560, lng: 79.1380, radius: 0.010 },
        51: { lat: 10.7650, lng: 79.1660, radius: 0.010 }
    };

    // Initialize the map
    function initMap(containerId) {
        const container = document.getElementById(containerId);
        if (!container || mapInitialized) return;

        // Set container height
        container.style.height = '250px';
        container.style.borderRadius = '12px';
        container.style.overflow = 'hidden';
        container.style.border = '1px solid rgba(212,175,55,0.2)';
        container.innerHTML = ''; // Clear placeholder content

        // Create Leaflet map
        map = L.map(containerId, {
            center: [THANJAVUR_CENTER.lat, THANJAVUR_CENTER.lng],
            zoom: 14,
            zoomControl: true,
            attributionControl: true
        });

        // Add OpenStreetMap tiles (FREE - no API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19
        }).addTo(map);

        // Custom marker icon
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:linear-gradient(135deg,#8B0000,#C41E3A);width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #D4AF37;box-shadow:0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-size:12px;">📍</span></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        // Create draggable marker
        marker = L.marker([THANJAVUR_CENTER.lat, THANJAVUR_CENTER.lng], {
            draggable: true,
            icon: markerIcon
        }).addTo(map);

        // On marker drag end - update location
        marker.on('dragend', function(e) {
            const pos = e.target.getLatLng();
            updateLocation(pos.lat, pos.lng, null);
        });

        // On map click - move marker
        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            updateLocation(e.latlng.lat, e.latlng.lng, null);
        });

        mapInitialized = true;
        console.log('🗺️ Location map initialized (Leaflet + OpenStreetMap)');
    }

    // Get current GPS position
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            // Show loading state
            updateLocationUI('loading');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    currentCoords = { lat: latitude, lng: longitude, accuracy: accuracy };
                    resolve(currentCoords);
                },
                (error) => {
                    console.warn('GPS error:', error.message);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 60000
                }
            );
        });
    }

    // Update location on map and UI
    function updateLocation(lat, lng, accuracy) {
        currentCoords = { lat, lng, accuracy };

        // Update map
        if (map && marker) {
            marker.setLatLng([lat, lng]);
            map.setView([lat, lng], 17);

            // Show accuracy circle
            if (accuracy && accuracy < 1000) {
                if (accuracyCircle) map.removeLayer(accuracyCircle);
                accuracyCircle = L.circle([lat, lng], {
                    radius: accuracy,
                    color: '#D4AF37',
                    fillColor: '#D4AF37',
                    fillOpacity: 0.1,
                    weight: 1.5,
                    dashArray: '5,5'
                }).addTo(map);
            }
        }

        // Update UI
        updateLocationUI('success', lat, lng, accuracy);

        // Reverse geocode
        reverseGeocode(lat, lng);

        // Auto-detect ward
        autoDetectWard(lat, lng);

        // Generate Google Maps link
        generateGoogleMapsLink(lat, lng);
    }

    // Reverse geocoding using Nominatim (FREE - OpenStreetMap)
    async function reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en',
                        'User-Agent': 'CitizenConnect-Thanjavur/1.0'
                    }
                }
            );
            const data = await response.json();

            if (data && data.display_name) {
                const address = data.address || {};
                const parts = [];

                // Build readable address
                if (address.road) parts.push(address.road);
                if (address.neighbourhood) parts.push(address.neighbourhood);
                if (address.suburb) parts.push(address.suburb);
                if (address.village || address.town) parts.push(address.village || address.town);
                if (address.city) parts.push(address.city);
                if (address.state_district) parts.push(address.state_district);

                const readableAddress = parts.length > 0 ? parts.join(', ') : data.display_name;

                // Update address field
                const addressField = document.getElementById('manualAddress');
                if (addressField && !addressField.value) {
                    addressField.value = readableAddress;
                }

                // Update location text with address
                const locText = document.getElementById('locationText');
                if (locText) {
                    locText.innerHTML = `📍 ${readableAddress}`;
                    locText.title = `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)} | ${readableAddress}`;
                }

                // Show address info below map
                const addressInfo = document.getElementById('gpsAddressInfo');
                if (addressInfo) {
                    addressInfo.innerHTML = `<i class="fas fa-map-marker-alt" style="color:var(--gold);"></i> ${readableAddress}`;
                    addressInfo.style.display = 'block';
                }

                console.log('📍 Reverse geocoded:', readableAddress);
                return readableAddress;
            }
        } catch (err) {
            console.warn('Reverse geocoding failed:', err);
        }
        return null;
    }

    // Auto-detect ward from GPS coordinates
    function autoDetectWard(lat, lng) {
        let nearestWard = null;
        let minDistance = Infinity;

        Object.entries(WARD_CENTERS).forEach(([wardNum, center]) => {
            const distance = Math.sqrt(
                Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2)
            );
            if (distance < minDistance && distance < center.radius * 2) {
                minDistance = distance;
                nearestWard = parseInt(wardNum);
            }
        });

        if (nearestWard) {
            const wardSelect = document.getElementById('wardSelect');
            if (wardSelect && !wardSelect.value) {
                wardSelect.value = nearestWard;
                // Trigger street loading
                if (typeof loadStreets === 'function') loadStreets();
                showNotification(`🗺️ Ward ${nearestWard} auto-detected from GPS!`, 'info');
                console.log(`📍 Auto-detected Ward: ${nearestWard}`);
            }
        }
    }

    // Generate Google Maps link for admin navigation
    function generateGoogleMapsLink(lat, lng) {
        const link = `https://www.google.com/maps?q=${lat},${lng}`;
        const gmapsLink = document.getElementById('googleMapsLink');
        if (gmapsLink) {
            gmapsLink.href = link;
            gmapsLink.style.display = 'inline-flex';
        }

        // Store link in hidden field for complaint data
        let hiddenField = document.getElementById('gpsGoogleLink');
        if (!hiddenField) {
            hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.id = 'gpsGoogleLink';
            document.getElementById('complaintForm')?.appendChild(hiddenField);
        }
        hiddenField.value = link;
    }

    // Update location UI states
    function updateLocationUI(state, lat, lng, accuracy) {
        const locationText = document.getElementById('locationText');
        const getLocationBtn = document.getElementById('getLocation');

        switch(state) {
            case 'loading':
                if (getLocationBtn) getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GPS பெறுகிறது...';
                if (locationText) {
                    locationText.textContent = '🛰️ GPS signal தேடுகிறது...';
                    locationText.style.color = 'var(--warning)';
                }
                break;

            case 'success':
                if (getLocationBtn) {
                    getLocationBtn.innerHTML = '<i class="fas fa-check-circle"></i> இடம் பெறப்பட்டது ✅';
                    getLocationBtn.style.background = 'rgba(16,185,129,0.15)';
                    getLocationBtn.style.borderColor = 'rgba(16,185,129,0.3)';
                    getLocationBtn.style.color = 'var(--success)';
                }
                if (locationText) {
                    const accText = accuracy ? ` (±${Math.round(accuracy)}m)` : '';
                    locationText.textContent = `📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}${accText}`;
                    locationText.style.color = 'var(--success)';
                }
                break;

            case 'error':
                if (getLocationBtn) {
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> 📍 மீண்டும் முயற்சி';
                    getLocationBtn.style.background = '';
                    getLocationBtn.style.borderColor = '';
                    getLocationBtn.style.color = '';
                }
                if (locationText) {
                    locationText.textContent = '⚠️ GPS கிடைக்கவில்லை - Map-ல் pin வையுங்கள்';
                    locationText.style.color = 'var(--warning)';
                }
                break;
        }
    }

    // Get accuracy description
    function getAccuracyText(accuracy) {
        if (!accuracy) return '';
        if (accuracy <= 10) return '🟢 மிகச்சிறந்தது (±' + Math.round(accuracy) + 'm)';
        if (accuracy <= 30) return '🟢 நல்லது (±' + Math.round(accuracy) + 'm)';
        if (accuracy <= 100) return '🟡 சரி (±' + Math.round(accuracy) + 'm)';
        return '🔴 குறைவு (±' + Math.round(accuracy) + 'm) - Pin நகர்த்துங்கள்';
    }

    // Main function - Get Location button click handler
    async function handleGetLocation() {
        // Initialize map if not done
        const mapContainer = document.getElementById('mapPlaceholder');
        if (mapContainer && !mapInitialized) {
            initMap('mapPlaceholder');
        }

        try {
            const coords = await getCurrentLocation();
            updateLocation(coords.lat, coords.lng, coords.accuracy);

            // Show accuracy info
            const accText = getAccuracyText(coords.accuracy);
            if (accText) {
                const accInfo = document.getElementById('gpsAccuracyInfo');
                if (accInfo) {
                    accInfo.innerHTML = accText;
                    accInfo.style.display = 'block';
                }
            }

            showNotification('📍 GPS இடம் பெறப்பட்டது! Map-ல் சரிபார்க்கவும்.', 'success');
        } catch (error) {
            console.warn('GPS failed, showing map for manual selection:', error.message);
            updateLocationUI('error');

            // Still show map for manual pin placement
            if (map) {
                map.setView([THANJAVUR_CENTER.lat, THANJAVUR_CENTER.lng], 14);
            }
            showNotification('⚠️ GPS கிடைக்கவில்லை - Map-ல் pin வைத்து இடம் குறிக்கவும்', 'info');
        }
    }

    // Get stored location data for form submission
    function getLocationData() {
        if (!currentCoords) return null;
        return {
            lat: currentCoords.lat,
            lng: currentCoords.lng,
            accuracy: currentCoords.accuracy,
            googleMapsLink: `https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`,
            text: document.getElementById('locationText')?.textContent || ''
        };
    }

    // Public API
    return {
        init: initMap,
        getLocation: handleGetLocation,
        getLocationData: getLocationData,
        updateLocation: updateLocation,
        getCurrentCoords: () => currentCoords
    };

})();

// Export for global access
window.LocationModule = LocationModule;
console.log('📍 Location Module loaded (Leaflet + OpenStreetMap - FREE)');
