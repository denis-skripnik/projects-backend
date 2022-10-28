import mongoose from 'mongoose';

const projectsSchema = new mongoose.Schema({
  id: Number,
title: String,
logo: String,
description: String,
recommend_global: Boolean,
recommend_global_category: String,
recommend_category: Boolean,
links: String,
  commission: Number,
  income: Number,
likes: Number,
category: String
});

projectsSchema.index({"$**":"text"})

export default projectsSchema;
