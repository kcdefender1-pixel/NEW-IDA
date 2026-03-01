const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing sources
  await prisma.source.deleteMany({});

  // Seed news sources
  const sources = [
    // Mainstream Media
    {
      name: 'Kansas City Star',
      url: 'https://www.kansascity.com/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    {
      name: 'KCUR',
      url: 'https://www.kcur.org/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    {
      name: 'KMBC News',
      url: 'https://www.kmbc.com/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    {
      name: 'KCTV5 News',
      url: 'https://www.kctv5.com/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    {
      name: 'Fox 4 Kansas City',
      url: 'https://www.fox4kc.com/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    {
      name: 'The Pitch',
      url: 'https://www.thepitchkc.com/feed/',
      type: 'rss',
      category: 'mainstream',
    },
    // Community/Movement Sources
    {
      name: 'KC Tenants',
      url: 'https://www.kctenants.org/',
      type: 'web',
      category: 'community',
    },
    {
      name: 'Decarcerate KC',
      url: 'https://decarcerateKC.org/',
      type: 'web',
      category: 'community',
    },
    {
      name: 'Urban League of Greater Kansas City',
      url: 'https://ulkc.org/',
      type: 'web',
      category: 'community',
    },
    // Government
    {
      name: 'Kansas City City Council',
      url: 'https://kcmo.gov/city-council/',
      type: 'web',
      category: 'government',
    },
    {
      name: 'KCPD Public Information',
      url: 'https://www.kcpd.org/',
      type: 'web',
      category: 'government',
    },
  ];

  for (const source of sources) {
    const created = await prisma.source.create({
      data: {
        ...source,
        active: true,
      },
    });
    console.log(`Created source: ${created.name}`);
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
