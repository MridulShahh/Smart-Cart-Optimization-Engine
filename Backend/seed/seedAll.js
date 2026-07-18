const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../src/models/Category");
const Brand = require("../src/models/Brand");
const HomepageSection = require("../src/models/HomepageSection");
const Banner = require("../src/models/Banner");
const Product = require("../src/models/Product");

dotenv.config({ path: "../.env" });

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await HomepageSection.deleteMany({});
    await Banner.deleteMany({});

    // Seed Categories
    const categories = await Category.insertMany([
      { name: "Laptops", slug: "laptops", description: "High performance laptops", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45" },
      { name: "Accessories", slug: "accessories", description: "Peripherals and accessories", image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef" },
      { name: "Audio", slug: "audio", description: "Headphones and speakers", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" }
    ]);
    console.log("Categories seeded");

    // Seed Brands
    const brands = await Brand.insertMany([
      { name: "Apple", slug: "apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
      { name: "Dell", slug: "dell", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
      { name: "Logitech", slug: "logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" },
      { name: "Sony", slug: "sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" }
    ]);
    console.log("Brands seeded");

    // Seed Banners
    await Banner.insertMany([
      {
        title: "Next-Gen Workstations",
        subtitle: "Powering the future of software development.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        link: "/shop?category=Laptops",
        isActive: true,
        position: "hero"
      }
    ]);
    console.log("Banners seeded");

    // Seed Homepage Sections
    await HomepageSection.insertMany([
      {
        title: "Trending Hardware",
        sectionType: "trending",
        isActive: true,
        order: 1
      },
      {
        title: "Curated Collections",
        sectionType: "latest",
        isActive: true,
        order: 2
      }
    ]);
    console.log("Homepage sections seeded");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

seedAll();
