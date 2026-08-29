import crypto from 'crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();

const SYSTEM_OWNER_EMAIL = 'catalogue-owner@burnsville.invalid';

const bootstrapCatalogue = async () => {
  await connectDB();

  const session = await mongoose.startSession();
  let insertedCount = 0;

  try {
    await session.withTransaction(async () => {
      const existingProductCount = await Product.countDocuments({}).session(
        session
      );

      if (existingProductCount > 0) {
        return;
      }

      let catalogueOwner = await User.findOne({
        email: SYSTEM_OWNER_EMAIL,
      }).session(session);

      if (!catalogueOwner) {
        const [createdOwner] = await User.create(
          [
            {
              name: 'Burnsville Catalogue',
              email: SYSTEM_OWNER_EMAIL,
              password: crypto.randomBytes(32).toString('hex'),
              isAdmin: false,
            },
          ],
          { session }
        );

        catalogueOwner = createdOwner;
      }

      const catalogueProducts = products.map((product) => ({
        ...product,
        user: catalogueOwner._id,
      }));

      const insertedProducts = await Product.insertMany(catalogueProducts, {
        session,
      });

      insertedCount = insertedProducts.length;
    });

    if (insertedCount === 0) {
      console.log('Catalogue already initialized; no changes made.');
    } else {
      console.log(
        `Catalogue bootstrap complete: ${insertedCount} products created.`
      );
    }
  } catch (error) {
    console.error(`Catalogue bootstrap failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await session.endSession();
    await mongoose.disconnect();
  }
};

bootstrapCatalogue();
