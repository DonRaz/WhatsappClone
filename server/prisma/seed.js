const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data (order matters for foreign key constraints)
    console.log('Cleaning existing data...');
    
    await prisma.user.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.shift.deleteMany({});
    
    console.log('Seeding database with new data...');
    
    // Create shifts first
    const shifts = await Promise.all([
      prisma.shift.create({
        data: {
          date: new Date('2023-05-01'),
          startingHour: 8,
          endingHour: 16,
          employeeIds: []
        }
      }),
      prisma.shift.create({
        data: {
          date: new Date('2023-05-02'),
          startingHour: 9,
          endingHour: 17,
          employeeIds: []
        }
      }),
      prisma.shift.create({
        data: {
          date: new Date('2023-05-03'),
          startingHour: 10,
          endingHour: 18,
          employeeIds: []
        }
      })
    ]);
    
    console.log('Created shifts');
    
    // First, create a marketing department (without a manager)
    const marketingDept = await prisma.department.create({
      data: { 
        name: 'Marketing'
      }
    });
    
    console.log('Created Marketing department');
    
    // Create Bob from marketing department
    const bobJohnson = await prisma.employee.create({
      data: {
        firstName: 'Bob',
        lastName: 'Johnson',
        startedWorkAt: 2021,
        departmentId: marketingDept.id,
        shiftIds: [shifts[0].id, shifts[2].id]
      }
    });
    
    console.log('Created Bob from marketing');
    
    // Create Engineering department with John as manager
    const johnDoe = await prisma.employee.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        startedWorkAt: 2020,
        departmentId: marketingDept.id, // Temporary assignment
        shiftIds: [shifts[0].id, shifts[1].id]
      }
    });
    
    console.log('Created John');
    
    // Now create Engineering department with John as manager
    const engineeringDept = await prisma.department.create({
      data: { 
        name: 'Engineering',
        managerId: johnDoe.id
      }
    });
    
    console.log('Created Engineering department with John as manager');
    
    // Update John's department
    await prisma.employee.update({
      where: { id: johnDoe.id },
      data: { departmentId: engineeringDept.id }
    });
    
    console.log('Updated John\'s department');
    
    // Create Jane from HR
    const janeSmith = await prisma.employee.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        startedWorkAt: 2019,
        departmentId: marketingDept.id, // Temporary assignment
        shiftIds: [shifts[1].id, shifts[2].id]
      }
    });
    
    console.log('Created Jane');
    
    // Create HR department with Jane as manager
    const hrDept = await prisma.department.create({
      data: { 
        name: 'HR',
        managerId: janeSmith.id
      }
    });
    
    console.log('Created HR department with Jane as manager');
    
    // Update Jane's department
    await prisma.employee.update({
      where: { id: janeSmith.id },
      data: { departmentId: hrDept.id }
    });
    
    console.log('Updated Jane\'s department');
    
    // Update shifts with employee IDs
    await Promise.all([
      prisma.shift.update({
        where: { id: shifts[0].id },
        data: { employeeIds: [johnDoe.id, bobJohnson.id] }
      }),
      prisma.shift.update({
        where: { id: shifts[1].id },
        data: { employeeIds: [johnDoe.id, janeSmith.id] }
      }),
      prisma.shift.update({
        where: { id: shifts[2].id },
        data: { employeeIds: [janeSmith.id, bobJohnson.id] }
      })
    ]);
    
    console.log('Updated shifts with employee IDs');
    
    // Create users
    await Promise.all([
      prisma.user.create({
        data: {
          employeeId: johnDoe.id,
          fullName: `${johnDoe.firstName} ${johnDoe.lastName}`,
          email: 'Sincere@april.biz', // modifieable without changing the idFromJsonPlaceHolder
          numOfActions: 100,
          numOfActionsLeft: 100,
          idFromJsonPlaceHolder: 'Bret_Sincere@april.biz'
        }
      }),
      prisma.user.create({
        data: {
          employeeId: janeSmith.id,
          fullName: `${janeSmith.firstName} ${janeSmith.lastName}`,
          email: 'Shanna@melissa.tv',
          numOfActions: 100,
          numOfActionsLeft: 80,
          idFromJsonPlaceHolder: 'Antonette_Shanna@melissa.tv'
        }
      })
    ]);
    
    console.log('Created users');
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();