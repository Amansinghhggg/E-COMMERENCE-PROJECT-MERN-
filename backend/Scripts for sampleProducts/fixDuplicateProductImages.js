import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/product.js";

dotenv.config();

const uploadsDir = path.join(process.cwd(), "uploads");
const WIKI_API_BASE =
  "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=1200&gsrsearch=";

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

const getImageExtension = (contentType) => {
  if (!contentType) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  return "jpg";
};

const normalizeImagePath = (imagePath) => (imagePath || "").replace(/\\/g, "/");

const fetchBinaryFromUrl = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ProductImageBot/1.0)",
      Accept: "image/*,application/json;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Image download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const ext = getImageExtension(contentType);

  return { buffer: Buffer.from(arrayBuffer), ext };
};

const getWikipediaImageUrl = async (title) => {
  const query = encodeURIComponent(title);
  const response = await fetch(`${WIKI_API_BASE}${query}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ProductImageBot/1.0)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const pages = data?.query?.pages;
  if (!pages) {
    return null;
  }

  const firstPage = Object.values(pages)[0];
  return firstPage?.thumbnail?.source || null;
};

const fetchImageByTitle = async (title, lockKey) => {
  const wikipediaImageUrl = await getWikipediaImageUrl(title);
  if (wikipediaImageUrl) {
    try {
      return await fetchBinaryFromUrl(wikipediaImageUrl);
    } catch {
      // Fall through to alternate providers if the primary source throttles.
    }
  }

  try {
    return await fetchBinaryFromUrl(
      `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/900`
    );
  } catch {
    return fetchBinaryFromUrl(
      `https://placehold.co/1200x900.jpg?text=${encodeURIComponent(title)}`
    );
  }
};

const run = async () => {
  try {
    await connectDB();

    const allProducts = await Product.find({}).select("name image");
    const imageCounts = new Map();

    for (const product of allProducts) {
      const normalizedPath = normalizeImagePath(product.image);
      if (!normalizedPath) {
        continue;
      }
      imageCounts.set(normalizedPath, (imageCounts.get(normalizedPath) || 0) + 1);
    }

    const duplicatePaths = new Set(
      [...imageCounts.entries()]
        .filter(([, count]) => count > 1)
        .map(([imagePath]) => imagePath)
    );

    const targets = allProducts.filter((product) =>
      duplicatePaths.has(normalizeImagePath(product.image))
    );

    if (!targets.length) {
      console.log("No products found with the duplicate image path.");
      await mongoose.connection.close();
      process.exit(0);
    }

    await fs.mkdir(uploadsDir, { recursive: true });

    let updatedCount = 0;
    const failedProducts = [];

    for (const product of targets) {
      try {
        const safeTitle = slugify(product.name) || "product";
        const lockKey = product._id.toString();

        const { buffer, ext } = await fetchImageByTitle(product.name, lockKey);
        const fileName = `${safeTitle}-${lockKey}.${ext}`;
        const diskPath = path.join(uploadsDir, fileName);
        const dbImagePath = `/uploads/${fileName}`;

        await fs.writeFile(diskPath, buffer);

        product.image = dbImagePath;
        await product.save();
        updatedCount += 1;

        console.log(`Updated: ${product.name} -> ${dbImagePath}`);
      } catch (error) {
        failedProducts.push({ name: product.name, reason: error.message });
        console.log(`Skipped: ${product.name} -> ${error.message}`);
      }
    }

    console.log(`Done. Updated ${updatedCount} product images.`);
    if (failedProducts.length) {
      console.log("Failed products:");
      for (const item of failedProducts) {
        console.log(`- ${item.name}: ${item.reason}`);
      }
    }
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Failed to update product images: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

run();
