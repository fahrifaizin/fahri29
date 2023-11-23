
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// const { addContact, fetchContact, searchContact, duplicateCheck, deleteContact, updateContacts } = require("./utility/contactsJSON.js");
const { fetchContact, searchContactByID, duplicateCheck, addContact, deleteContact, updateContact } = require("./utility/contactsDB.js");
const { body, validationResult, check } = require("express-validator");
const host = "localhost";
const port = 3001;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
 
app.use(cookieParser('secret'));
app.use(session ({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);

app.use(flash());

app.get("/", (req, res) => {
  res.render("index", {
    nama_Web: "Welcome To The World",
    title: "Welcome To The World",
    layout: "layout/core-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Welcome To The World - About",
    layout: "layout/core-layout",
    imageSrc: "img/selfie.jpeg"
  });
});

app.get("/contact", async (req, res) => {
  const contacts = await fetchContact();
  
  if (contacts.length === 0) {
    res.render("contact", {
      title: "Welcome To The World - Contact",
      contacts,
      isEmpty: true,
      layout: "layout/core-layout.ejs",
    });
  } else {
    res.render("contact", {
      title: "Welcome To The World - Contact",
      contacts,
      isEmpty: false,
      layout: "layout/core-layout.ejs",
    });
  }
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Welcome To The World - Add Contact",
    layout: "layout/core-layout.ejs",
  });
});

app.get('/contact/update/:id', async (req, res) => {
  const contact = await searchContactByID(req.params.id);
  res.render('edit-contact', {
      title: 'Form Edit Data Contact',
      layout: 'layout/core-layout',
      contact
  })
})

app.post(
  "/contact",[
    check('nama', 'Nama Harus Diisi').notEmpty(),
    check('email', 'Email Tidak Valid').notEmpty().isEmail(),
    check("nomortelpon", "Nomor Telp Tidak Valid").notEmpty().isMobilePhone("id-ID")
  ], async (req, res) => {
    const duplikatNama = await duplicateCheck(req.body.nama, 1);
    const duplikatEmail = await duplicateCheck(req.body.email, 2);
    const errors = []
    errors.push(validationResult(req).errors)
    if(duplikatNama.length > 0){
      errors[0].push({
        'type' : 'field',
        'value' : req.body.nama,
        'msg':'Nama sudah ada',
        'path' : 'nama',
        'location' : 'body',
      })
    }
    
    if(duplikatEmail.length > 0){
      errors[0].push({
        'type' : 'field',
        'value' : req.body.email,
        'msg':'Email sudah ada',
        'path' : 'email',
        'location' : 'body',
      })
    }

    if (errors[0].length > 0) {
      res.render("add-contact", {
        title: "Welcome To The - Add Contact",
        layout: "layout/core-layout.ejs",
        errors: errors[0],
      });
    } else {
      addContact(req.body);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:id", async (req, res) => {
  await deleteContact(req.params.id);
  req.flash("msg", "Data Contact Sudah Dihapus")
  res.redirect("/contact");   
})

app.post("/contact/update", [
  check('nama', 'Nama Harus Diisi').notEmpty(),
  check('email', 'Email Tidak Valid').notEmpty().isEmail(),
  check("nomortelpon", "Nomor Telp Tidak Valid").notEmpty().isMobilePhone("id-ID")
], async (req, res) => {
  const duplikatNama = await duplicateCheck(req.body.nama, 1);
  const duplikatEmail = await duplicateCheck(req.body.email, 2);
  const errors = []
  errors.push(validationResult(req).errors)
  if(duplikatNama.length > 0){
    if(req.body.id != duplikatNama[0].id){
      errors[0].push({
        'type' : 'field',
        'value' : req.body.nama,
        'msg':'Nama sudah ada',
        'path' : 'nama',
        'location' : 'body',
      })
    }
  }
  
  if(duplikatEmail.length > 0){
    if(req.body.id != duplikatEmail[0].id){
      errors[0].push({
        'type' : 'field',
        'value' : req.body.email,
        'msg':'Email sudah ada',
        'path' : 'email',
        'location' : 'body',
      })
    }
  }
  if (errors[0].length > 0) {        
      res.render("edit-contact", {
          title: "Form Edit Data Contact",
          layout: "layout/core-layout",
          errors: errors[0],
          contact: req.body,
      });
  } else {
      updateContact(req.body)
      req.flash("msg", "Data Contact Berhasil Diubah")
      res.redirect("/contact")
  }
})

app.get("/contact/:id", async (req, res) => {
  const contact = await searchContactByID(decodeURI(req.params.id));
  res.render("detail", {
    title: "Welcome To The World - Detail Contact",
    contact,
    layout: "layout/core-layout.ejs",
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>Not Found</h1>");
});


app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});