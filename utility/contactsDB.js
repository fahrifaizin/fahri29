const connection = require("./db.js");

const fetchContact = async (nama = '') => {
  const contacts = await connection.query('select * from contacts');
  return contacts.rows;
};

const searchContactByName = async (nama) => {
  const contact = await connection.query('select * from contacts where nama = $1', [nama]);
  return contact.rows[0];
};

module.exports = { fetchContact, searchContactByName }; 