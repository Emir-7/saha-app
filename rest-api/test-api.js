// Using built-in fetch
const baseUrl = 'http://localhost:9000/api';

async function runTests() {
    console.log('--- STARTING API TESTS ---');
    let userId, fieldId, bookingId;

    try {
        // 1. Register User
        const registerRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Ozan',
                lastName: 'Tekin',
                email: 'testtest@test.com',
                password: 'password123',
                phone: '1112223344'
            })
        });
        const registerData = await registerRes.json();
        console.log('Register:', registerRes.status, registerData);
        if (registerRes.status === 201) userId = registerData.userId;

        // 2. Login User
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testtest@test.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login:', loginRes.status, loginData);
        if (!userId) userId = loginData.userId;

        // 3. Create Field
        const addFieldRes = await fetch(`${baseUrl}/fields`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Saha',
                address: 'Istanbul',
                pricePerHour: 500,
                features: ['Otopark']
            })
        });
        const addFieldData = await addFieldRes.json();
        console.log('Add Field:', addFieldRes.status, addFieldData);
        fieldId = addFieldData._id || addFieldData.fieldId;

        // 4. Create Booking
        if (fieldId && userId) {
            const bookingRes = await fetch(`${baseUrl}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    field: fieldId,
                    user: userId,
                    date: new Date().toISOString(),
                    timeSlot: '20:00-21:00'
                })
            });
            const bookingData = await bookingRes.json();
            console.log('Create Booking:', bookingRes.status, bookingData);
            bookingId = bookingData.booking ? bookingData.booking._id : null;
        }

        // 5. Get User Bookings
        if (userId) {
            const getBookingsRes = await fetch(`${baseUrl}/users/${userId}/bookings`);
            const getBookingsData = await getBookingsRes.json();
            console.log('Get Bookings:', getBookingsRes.status, getBookingsData);
        }

    } catch (e) {
        console.error('Test script error:', e);
    }
}

runTests();
