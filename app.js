
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// const { addContact, fetchContact, searchContact, duplicateCheck, deleteContact, updateContacts } = require("./utility/contactsJSON.js");
const { fetchContact, searchContactByName } = require("./utility/contactsDB.js");
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

app.get('/contact/update/:nama', (req, res) => {
  const contact = searchContact(req.params.nama);

  res.render('edit-contact', {
      title: 'Form Edit Data Contact',
      layout: 'layout/core-layout',
      contact
  })
})

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplicateNama = duplicateCheck(value, 1);
      if (duplicateNama) {
        throw new Error("Nama Sudah Di Gunakan");
      }
      return true;
    }),
    body("email").custom((value) => {
      const duplicateEmail = duplicateCheck(value, 2);
      if (duplicateEmail) {
        throw new Error("Email Sudah Di Gunakan");
      }
      return true;
    }),
    check('email', 'Email Tidak Valid').notEmpty().isEmail(),
    check("NomorTelpon", "Nomor Telp Tidak Valid").notEmpty().isMobilePhone("id-ID")
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Welcome To The - Add Contact",
        layout: "layout/core-layout.ejs",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:nama", (req, res) => {
  const contact = searchContact(req.params.nama);
  if (!contact) {
      res.status(404);
      res.send("Data Tidak Ada")
  } else {
      deleteContact(req.params.nama);
      req.flash("msg", "Data Contact Sudah Dihapus")
      res.redirect("/contact");
  }
      
})

app.post("/contact/update", [
  body("nama").custom((value, {req}) => { 
      var duplikatNama = duplicateCheck(value, 1);
      if (value !== req.body.oldNama && duplikatNama) {
          throw new Error("Nama Sudah Di Gunakan");
      }
      return true;
  }),
  body("email").custom((value) => {
    const duplicateEmail = duplicateCheck(value, 2);
    if (duplicateEmail) {
      throw new Error("Email Sudah Di Gunakan");
    }
    return true;
  }),
  check('email', 'Email Tidak Valid').notEmpty().isEmail(),
  check("NomorTelpon", "Nomor Telp Tidak Valid").notEmpty().isMobilePhone("id-ID")
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {        
      res.render("edit-contact", {
          title: "Form Edit Data Contact",
          layout: "layout/core-layout",
          errors: errors.array(),
          contact: req.body,
      });
  } else {
      updateContacts(req.body)
      req.flash("msg", "Data Contact Berhasil Diubah")
      res.redirect("/contact")
  }
})

app.get("/contact/:nama", async (req, res) => {
  const contact = await searchContactByName(decodeURI(req.params.nama));
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