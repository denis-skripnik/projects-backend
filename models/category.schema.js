import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  title: String,
  description: String
});

categorySchema.index({"$**":"text"})

export default categorySchema;
