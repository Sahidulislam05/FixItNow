import "dotenv/config";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/enums";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";

// FixItNow এর ৮টা মূল সার্ভিস ক্যাটাগরি (এসাইনমেন্ট ডকুমেন্টে উল্লেখিত উদাহরণ অনুযায়ী)
const defaultCategories = [
    { name: "Plumbing", description: "Pipe fitting, leak repair, and water line installation", icon: "🔧" },
    { name: "Electrical", description: "Wiring, switchboard, and electrical appliance repair", icon: "⚡" },
    { name: "Cleaning", description: "Home deep cleaning and sanitization services", icon: "🧹" },
    { name: "Painting", description: "Interior and exterior wall painting", icon: "🎨" },
    { name: "AC Repair", description: "Air conditioner servicing, repair, and installation", icon: "❄️" },
    { name: "Carpentry", description: "Furniture repair and custom woodwork", icon: "🪚" },
    { name: "Appliance Repair", description: "Refrigerator, washing machine, and microwave repair", icon: "🛠️" },
    { name: "Pest Control", description: "Home pest and insect control treatment", icon: "🐜" },
];

async function seedAdmin() {
    const adminEmail = config.admin_email;
    const adminPassword = config.admin_password;

    if (!adminEmail || !adminPassword) {
        console.log("⚠️  ADMIN_EMAIL অথবা ADMIN_PASSWORD .env এ নেই। Admin seed স্কিপ করা হলো।");
        return;
    }

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log(`ℹ️  Admin আগে থেকেই আছে: ${adminEmail}`);
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, Number(config.bcrypt_salt_rounds));

    const admin = await prisma.user.create({
        data: {
            name: "FixItNow Admin",
            email: adminEmail,
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log(`✅ Admin তৈরি হয়েছে: ${admin.email}`);
}

async function seedCategories() {
    for (const category of defaultCategories) {
        const existing = await prisma.category.findUnique({
            where: { name: category.name },
        });

        if (existing) {
            console.log(`ℹ️  Category আগে থেকেই আছে: ${category.name}`);
            continue;
        }

        await prisma.category.create({ data: category });
        console.log(`✅ Category তৈরি হয়েছে: ${category.name}`);
    }
}

async function main() {
    console.log("🌱 Seeding শুরু হলো...");

    await seedAdmin();
    await seedCategories();

    console.log("🌱 Seeding শেষ।");
}

main()
    .catch((error) => {
        console.error("❌ Seeding ব্যর্থ হয়েছে:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
