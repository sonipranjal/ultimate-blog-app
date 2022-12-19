import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // create fake users
  const fakeArray = Array.from({ length: 50 }).map((_, idx) => idx);
  console.log("seeding the db!");

  for await (const i of fakeArray) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        image: faker.internet.avatar(),
      },
    });

    const postsFakeArray = Array.from({
      length: faker.datatype.number({ max: 20, min: 5 }),
    }).map((_, idx) => idx);

    for await (const iterator of postsFakeArray) {
      await prisma.post.create({
        data: {
          title: faker.random.words(10),
          description: faker.lorem.lines(4),
          text: faker.lorem.paragraphs(5),
          html: faker.lorem.paragraphs(5),
          slug: faker.lorem.slug(),
          author: {
            connect: {
              id: user.id,
            },
          },
          featuredImage: faker.image.unsplash.technology(),
          tags: {
            connectOrCreate: {
              create: {
                name: faker.random.words() + faker.random.word(),
                description: faker.lorem.paragraph(1),
                slug: faker.lorem.slug(),
              },
              where: {
                id: faker.datatype.uuid(),
              },
            },
          },
        },
      });
    }
  }

  console.log("seed completed!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
