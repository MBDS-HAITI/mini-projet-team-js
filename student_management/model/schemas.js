// model/schemas.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  id: { type: Number, required: true, unique: true }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const courseSchema = new Schema({
  code: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
});

const gradeSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  grade: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Grade = mongoose.model('Grade', gradeSchema);

module.exports = { Student, Course, Grade };
