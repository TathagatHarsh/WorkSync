const API_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('Attempting login...');
    const loginRes = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'debug@test.com',
        password: 'Password123!'
      })
    });

    const loginData = await loginRes.json();
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    console.log('Login successful!');
    const token = loginData.token;
    console.log('Token received:', token ? 'Yes' : 'No');

    if (token) {
      console.log('Attempting to fetch profile...');
      const profileRes = await fetch(`${API_URL}/api/employees/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        console.error('Profile fetch error details:', profileData);
        throw new Error(`Profile fetch failed: ${profileData.message}`);
      }

      console.log('Profile fetched successfully!');
      console.log('Role:', profileData.role);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLogin();
