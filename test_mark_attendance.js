const API_URL = 'http://localhost:3000';

async function testMarkAttendance() {
  try {
    // 1. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'Password123!'
      })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);
    const token = loginData.token;
    console.log('Admin logged in.');

    // 2. Create a new user (HRuser1)
    console.log('Creating new user HRuser1...');
    const signupRes = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'HR User 1',
        email: `hruser1_${Date.now()}@test.com`, // Unique email
        password: 'Password123!'
      })
    });
    
    // Note: Signup might fail if user exists, but we can proceed if we get a token or handle 409
    let userId;
    if (signupRes.ok) {
        const signupData = await signupRes.json();
        // We need the ID. Let's fetch all employees to find the new user's ID
        console.log('User created. Fetching list to get ID...');
    } else {
        console.log('User creation skipped (might exist).');
    }

    // 3. Fetch all employees to get the target user ID
    const usersRes = await fetch(`${API_URL}/api/employees`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await usersRes.json();
    const targetUser = users.find(u => u.name === 'HR User 1');
    
    if (!targetUser) throw new Error('Target user not found');
    userId = targetUser.id;
    console.log(`Target User ID: ${userId}`);

    // 4. Mark Attendance
    console.log('Marking attendance...');
    const date = new Date().toISOString().split('T')[0];
    const markRes = await fetch(`${API_URL}/api/attendance`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: userId,
        date: date,
        status: 'PRESENT'
      })
    });

    const markData = await markRes.json();
    if (!markRes.ok) throw new Error(`Mark attendance failed: ${markData.message}`);

    console.log('Attendance marked successfully:', markData);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMarkAttendance();
