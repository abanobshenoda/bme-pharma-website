import "dotenv/config";
import prisma from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@bmepharma.com";
  const password = "adminpassword"; // Prompt user to change this

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists!`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
    },
  });

  console.log(`Created admin user: ${user.email} (Password: ${password})`);
  console.log(
    "Please log in and change your password or create a new user and delete this one.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
