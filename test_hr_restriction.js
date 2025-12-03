const API_URL = 'http://localhost:3000';

async function testHRRestriction() {
  try {
    // 1. Create/Login Admin
    console.log('Logging in as Admin...');
    const adminLoginRes = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'Password123!' })
    });
    const adminToken = (await adminLoginRes.json()).token;

    // 2. Create HR User 1 (The requester)
    console.log('Creating HR User 1...');
    await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'HR One', email: `hr1_${Date.now()}@test.com`, password: 'Password123!' })
    });
    // Login as HR 1
    const hr1LoginRes = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `hr1_${Date.now()}@test.com`, password: 'Password123!' })
    });
    // Note: If signup failed (user exists), we try login with a known email or just proceed if we can't. 
    // For simplicity in this test, we'll assume fresh unique emails work. 
    // Actually, let's use a fixed email for HR1 and HR2 and handle login if signup fails.
    
    // Helper to get token for a user (signup or signin)
    async function getAuthToken(name, email, role = 'EMPLOYEE') {
        let token;
        const signup = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: 'Password123!' })
        });
        
        if (signup.ok) {
            token = (await signup.json()).token;
            // If we need to set role to HR, we must do it via DB or Admin endpoint. 
            // Since we don't have an endpoint to change role, we assume we manually seeded or use the seed-admin script logic.
            // Wait, we can't easily make them HR via API. 
            // I will use the existing 'HR User' from the seed if available, or just rely on the fact that I can't easily create HRs via API.
            // Actually, I can use the Admin token to update a user's role if I had that endpoint. I don't.
            // I will rely on the 'HR User' created by seed.js.
        } else {
            const login = await fetch(`${API_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: 'Password123!' })
            });
            if (login.ok) token = (await login.json()).token;
        }
        return token;
    }

    // Let's use the seeded 'HR User' (email: hr@test.com) and 'Admin User' (email: admin@test.com)
    // And let's create a new user and try to make them HR? No, I can't.
    // I will test: HR User (hr@test.com) trying to mark attendance for Admin User (admin@test.com).
    
    console.log('Logging in as seeded HR User...');
    const hrLoginRes = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hr@test.com', password: 'Password123!' })
    });
    
    if (!hrLoginRes.ok) throw new Error('Seeded HR user not found. Did you run seed?');
    const hrToken = (await hrLoginRes.json()).token;

    // Get Admin User ID via /me endpoint
    const adminProfileRes = await fetch(`${API_URL}/api/employees/me`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminUser = await adminProfileRes.json();
    console.log(`Target Admin User ID: ${adminUser.id}`);

    // Test: HR tries to mark attendance for Admin
    console.log('Test 1: HR trying to mark attendance for Admin (Should Fail)...');
    const failRes = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hrToken}`
        },
        body: JSON.stringify({
            userId: adminUser.id,
            date: new Date().toISOString().split('T')[0],
            status: 'PRESENT'
        })
    });

    if (failRes.status === 403) {
        console.log('SUCCESS: HR was forbidden from marking Admin attendance.');
    } else {
        console.error(`FAILURE: HR request status was ${failRes.status}`);
    }

    // Test: Admin tries to mark attendance for Admin (Should Pass)
    console.log('Test 2: Admin trying to mark attendance for Admin (Should Pass)...');
    const passRes = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
            userId: adminUser.id,
            date: new Date().toISOString().split('T')[0],
            status: 'PRESENT'
        })
    });

    if (passRes.ok || passRes.status === 201) {
        console.log('SUCCESS: Admin successfully marked attendance.');
    } else {
        // It might fail if record exists (unique constraint), which is also a "pass" for permission check
        const data = await passRes.json();
        if (data.message && data.message.includes('Unique constraint')) {
             console.log('SUCCESS: Admin allowed (Record already exists).');
        } else {
             console.error(`FAILURE: Admin request failed: ${JSON.stringify(data)}`);
        }
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testHRRestriction();
