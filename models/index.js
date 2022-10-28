import 'dotenv/config';
import mongoose from 'mongoose';
import categorySchema from './category.schema.js';
import projectsSchema from './projects.schema.js';

mongoose.connect(process.env.MONGO_URL);
export const Category = mongoose.model('Category', categorySchema);
export const Projects = mongoose.model('Projects', projectsSchema);