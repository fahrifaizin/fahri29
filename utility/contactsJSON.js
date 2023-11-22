var fs = require('fs');
const lokasiDirr = "./data";
if (!fs.existsSync(lokasiDirr)) {
  fs.mkdirSync(lokasiDirr);
}

const filePath = `./data/contacts.json`;
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

const fetchContact = () => {
  const file = fs.readFileSync(filePath, "utf8");
  const contacts = JSON.parse(file);
  return contacts;
};

const searchContact = (nama) => {
  const contacts = fetchContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = fetchContact();
  contacts.push(contact);
  saveContacts(contacts);
};

const duplicateCheck = (value, type) => {
  const contacts = fetchContact();
  switch (type) {
    case 1:
      return contacts.find((contact) => contact.nama === value);
      break;
    case 2:
      return contacts.find((contact) => contact.email === value);
      break;
  }
};

const deleteContact = (nama) => {
  const contacts = fetchContact();
  const filterContacts = contacts.filter(
      (contact) => contact.nama !== nama
  );
  saveContacts(filterContacts);
}

const updateContacts = (newContacts) => {
  const contacts = fetchContact();
  const filterContacts = contacts.filter(
      (contact) => contact.nama !== newContacts.oldNama);
  delete newContacts.oldNama;
  filterContacts.push(newContacts);
  saveContacts(filterContacts);
}

module.exports = { addContact, fetchContact, searchContact, duplicateCheck, deleteContact, updateContacts }; 