import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.car.deleteMany();
  await prisma.carModelInfo.deleteMany();
  await prisma.user.deleteMany();
  await prisma.client.deleteMany();

  // --- Create SUPERADMIN ---
  const hashedSuperAdminPassword = await bcrypt.hash('superadmin_password', 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@example.com',
      name: 'Super Admin',
      password: hashedSuperAdminPassword,
      role: UserRole.SUPERADMIN,
    },
  });
  console.log('Created Super Admin:', superAdmin);

  // --- Create Clients (Dealerships) ---
  const client1 = await prisma.client.create({
    data: {
      name: 'AutoMundo',
    },
  });
  console.log('Created Client 1:', client1);

  const client2 = await prisma.client.create({
    data: {
      name: 'Carros del Sol',
    },
  });
  console.log('Created Client 2:', client2);

  // --- Create Client Admins ---
  const hashedClientAdmin1Password = await bcrypt.hash('client1_password', 10);
  const clientAdmin1 = await prisma.user.create({
    data: {
      email: 'admin@automundo.com',
      name: 'Admin AutoMundo',
      password: hashedClientAdmin1Password,
      role: UserRole.CLIENT_ADMIN,
      clientId: client1.id,
    },
  });
  console.log('Created Client Admin 1:', clientAdmin1);

  const hashedClientAdmin2Password = await bcrypt.hash('client2_password', 10);
  const clientAdmin2 = await prisma.user.create({
    data: {
      email: 'admin@carrosdelsol.com',
      name: 'Admin Carros del Sol',
      password: hashedClientAdmin2Password,
      role: UserRole.CLIENT_ADMIN,
      clientId: client2.id,
    },
  });
  console.log('Created Client Admin 2:', clientAdmin2);

  // --- Create AI-Generated Car Model Info ---
  const modelInfoToyotaCamry = await prisma.carModelInfo.create({
    data: {
      modelKey: 'TOYOTA_CAMRY_2023',
      funFacts: JSON.stringify([
        '¿Sabías que el Toyota Camry ha sido el sedán más vendido en América durante casi 20 años consecutivos?',
        'El nombre "Camry" proviene de la palabra japonesa "kanmuri", que significa "corona".',
      ]),
      positiveComments: JSON.stringify([
        'Confiabilidad legendaria: un coche que dura para siempre.',
        'Excelente economía de combustible para su tamaño.',
        'Interior espacioso y cómodo, ideal para familias.',
      ]),
      statistics: JSON.stringify([
        'Hasta 39 MPG en carretera.',
        'Calificación de seguridad de 5 estrellas de la NHTSA.',
      ]),
    },
  });

  const modelInfoFordMustang = await prisma.carModelInfo.create({
    data: {
      modelKey: 'FORD_MUSTANG_2024',
      funFacts: JSON.stringify([
        '¿Sabías que el primer Ford Mustang fue presentado en la Feria Mundial de Nueva York en 1964?',
        'El logo del pony galopando originalmente apuntaba hacia la derecha, pero se cambió para simbolizar la libertad y el espíritu indomable.',
      ]),
      positiveComments: JSON.stringify([
        'Diseño icónico y atemporal que nunca pasa de moda.',
        'Potente motor V8 que ofrece una experiencia de conducción emocionante.',
        'Sorprendentemente práctico para un coche deportivo.',
      ]),
      statistics: JSON.stringify([
        'El motor V8 de 5.0L produce más de 480 caballos de fuerza.',
        'Más de 10 millones de Mustangs vendidos desde su creación.',
      ]),
    },
  });

  const modelInfoTeslaModel3 = await prisma.carModelInfo.create({
    data: {
      modelKey: 'TESLA_MODEL3_2023',
      funFacts: JSON.stringify([
        '¿Sabías que el Tesla Model 3 no tiene un cuadro de instrumentos tradicional? Toda la información se muestra en la pantalla central de 15 pulgadas.',
        'El Model 3 fue diseñado para ser el coche eléctrico más asequible de Tesla para llevar la movilidad eléctrica a las masas.',
      ]),
      positiveComments: JSON.stringify([
        'Aceleración instantánea y silenciosa, una experiencia de conducción única.',
        'Red de Superchargers de Tesla, que hace que los viajes largos sean fáciles y convenientes.',
        'Costos de mantenimiento y "combustible" muy bajos en comparación con los coches de gasolina.',
      ]),
      statistics: JSON.stringify([
        'Autonomía de hasta 358 millas con una sola carga (versión Long Range).',
        '0 a 60 mph en tan solo 3.1 segundos (versión Performance).',
      ]),
    },
  });

  console.log('Created Car Model Info entries.');

  // --- Create Cars ---
  await prisma.car.create({
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 28000,
      description: 'Un sedán confiable y eficiente. Perfecto para la familia y los viajes diarios. Como nuevo, con poco kilometraje.',
      images: JSON.stringify(['/images/toyota-camry-1.jpg', '/images/toyota-camry-2.jpg']),
      clientId: client1.id,
      carModelInfoId: modelInfoToyotaCamry.id,
    },
  });

  await prisma.car.create({
    data: {
      make: 'Ford',
      model: 'Mustang',
      year: 2024,
      price: 45000,
      description: 'El icónico muscle car americano. Potencia V8 y un estilo inconfundible. Siente la emoción de conducir.',
      images: JSON.stringify(['/images/ford-mustang-1.jpg', '/images/ford-mustang-2.jpg']),
      clientId: client1.id,
      carModelInfoId: modelInfoFordMustang.id,
    },
  });

  await prisma.car.create({
    data: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42000,
      description: 'El futuro de la conducción. Rápido, silencioso y tecnológicamente avanzado. Únete a la revolución eléctrica.',
      images: JSON.stringify(['/images/tesla-model3-1.jpg', '/images/tesla-model3-2.jpg']),
      clientId: client2.id,
      carModelInfoId: modelInfoTeslaModel3.id,
    },
  });

  await prisma.car.create({
    data: {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      price: 23000,
      description: 'Compacto, deportivo y muy económico. El Honda Civic es conocido por su durabilidad y divertido manejo.',
      images: JSON.stringify(['/images/honda-civic-1.jpg', '/images/honda-civic-2.jpg']),
      clientId: client2.id,
      // No specific model info for this one yet
    },
  });

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