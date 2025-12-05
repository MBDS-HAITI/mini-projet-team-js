let { Student } = require('../model/schemas');

function getAll(req, res) {
  Student.find()
    .then((students) => res.send(students))
    .catch((err) => res.status(500).send(err));
}

function create(req, res) {
  console.log('POST /students body =', req.body); // 🔍 pour debug

  const { id, firstName, lastName } = req.body;

  if (!id || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'id, firstName, lastName sont obligatoires' });
  }

  const student = new Student({ id, firstName, lastName });

  student
    .save()
    .then((s) => res.json({ message: `student saved with id ${s.id}!`, student: s }))
    .catch((err) => {
      console.error(err);
      res.status(500).send('cant post student ' + err.message);
    });
}

module.exports = { getAll, create };
