// routes/grades.js
let { Grade, Student, Course } = require('../model/schemas');

async function getAll(req, res) {
  try {
    const grades = await Grade.find()
      .populate('student')
      .populate('course');

    res.send(grades);
  } catch (err) {
    console.error('Erreur getAll grades:', err);
    res.status(500).send(err);
  }
}

async function create(req, res) {
  try {
    console.log('POST /grades body =', req.body);

    const { student, course, grade, date } = req.body;

    // 1️⃣ chercher l'étudiant par son "id" logique (2128, 7912, ...)
    const studentDoc = await Student.findOne({ id: student });
    if (!studentDoc) {
      return res
        .status(400)
        .json({ message: `Student with id ${student} not found` });
    }

    // 2️⃣ chercher le cours par son "code" (MATH101, PHYS505, ...)
    const courseDoc = await Course.findOne({ code: course });
    if (!courseDoc) {
      return res
        .status(400)
        .json({ message: `Course with code ${course} not found` });
    }

    // 3️⃣ créer la note en utilisant les _id MongoDB
    const newGrade = new Grade({
      student: studentDoc._id,
      course: courseDoc._id,
      grade,
      date,
    });

    const saved = await newGrade.save();

    res.status(201).json({
      message: 'grade saved successfully',
      grade: saved,
    });
  } catch (err) {
    console.error('Erreur create grade:', err);
    res.status(400).json({
      message: 'cant post grade',
      error: err.message,
    });
  }
}

module.exports = { getAll, create };
