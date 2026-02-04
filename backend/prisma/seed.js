const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const passwordHash = '$2b$10$EpRnTzVlqHNP0zQx.Zuxxu/0o6y.B0y/T1V0/.6/././././.'; // hash for "password" (placeholder, will be hashed properly below)
  // Actually, let's use a known hash or hash it if we had bcrypt, but simpler to use the API flow or just assume we can hash here. 
  // Since we don't have bcrypt imported here and don't want to add it if not needed, let's rely on the app to hash, 
  // OR better, import bcrypt since it IS in package.json
  
  const bcrypt = require('bcrypt');
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const hrPassword = await bcrypt.hash('Hr123!', 10);
  const employeePassword = await bcrypt.hash('Employee123!', 10);

  const demoUsers = [
    {
      email: 'admin@demo.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isProfileComplete: true,
      phoneNumber: '1234567890',
      address: 'Admin HQ',
      department: 'Management',
      college: 'Demo College',
      joiningDate: new Date(),
    },
    {
      email: 'hr@demo.com',
      name: 'HR User',
      password: hrPassword,
      role: 'HR',
      isProfileComplete: true,
      phoneNumber: '0987654321',
      address: 'HR Dept',
      department: 'Human Resources',
      college: 'Demo College',
      joiningDate: new Date(),
    },
    {
      email: 'employee@demo.com',
      name: 'Employee User',
      password: employeePassword,
      role: 'EMPLOYEE',
      isProfileComplete: true,
      phoneNumber: '1122334455',
      address: 'Employee Desk',
      department: 'Engineering',
      college: 'Demo College',
      joiningDate: new Date(),
    },
  ];

  for (const u of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({ data: u });
      console.log(`Created user: ${u.email}`);
    } else {
        console.log(`User already exists: ${u.email}`);
    }
  }

  console.log('Start seeding attendance...');

  const users = await prisma.user.findMany();
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LEAVE']; // Weighted towards PRESENT

  for (const user of users) {
    console.log(`Seeding attendance for user: ${user.name}`);
    const today = new Date();
    
    // Generate attendance for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0); // Normalize time

      // Skip weekends (optional, but realistic)
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: date,
          },
        },
        update: {}, // Don't update if exists
        create: {
          date: date,
          status: randomStatus,
          userId: user.id,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
