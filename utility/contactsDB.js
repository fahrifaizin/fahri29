const connection = require("./db.js");

const fetchContact = async () => {
  const contacts = await connection.query('select * from contacts order by id asc');
  return contacts.rows;
};

const searchContactByID = async (data) => {
  const contact = await connection.query('select * from contacts where id = $1', [data]);
  return contact.rows[0];
};

const deleteContact = async (data) => {
  const contact = await connection.query('delete from contacts where id = $1', [data]);
  return contact;
};

const duplicateCheck = async (value, type) => {
  switch (type) {
    case 1:
      data = await connection.query('select * from contacts where nama = $1', [value]);
      break;
    case 2:
      data = await connection.query('select * from contacts where email = $1', [value]);
      break;
    }
    return data.rows;
};

const addContact = async (data) => {
  const contact = await connection.query('insert into contacts (nama, email, nomortelpon) values ($1, $2, $3)', [data.nama, data.email, data.nomortelpon]);
  return contact;
};

const updateContact = async (data) => {
  const contact = await connection.query('update contacts set nama = $1, email = $2, nomortelpon = $3 where id = $4', [data.nama, data.email, data.nomortelpon, data.id]);
  return contact;
};


module.exports = { fetchContact, searchContactByID, duplicateCheck, addContact, deleteContact, updateContact }; 