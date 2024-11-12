const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hotelReservation');

// Define a schema for the reservation
const reservationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    numberOfPersons: String,
    reservationTime: String,
    reservationDate: String,
    message: String
  });

const Reservation = mongoose.model('Reservation', reservationSchema);
//Define a Schema for Contact
const emailSchema = new mongoose.Schema({
    email: String
  });
  
  const Email = mongoose.model('Email', emailSchema);

// Route to handle Contact Data
app.post('/contact', (req, res) => {
    const newEmail = new Email({
      email: req.body.email_address
    });
  
    newEmail.save()
      .then(() => res.redirect('http://127.0.0.1:5500/grilli-master/grilli-master/'))
      .catch(err => res.status(400).send('Error saving email'));
  });
// Route to Print the Contact Data
app.get('/contact',(req,res)=>{
    Email.find()
    .then(emails=>res.json(emails))
    .catch(err=>res.status(400).send('Error fetching emails'));
})
// Route to handle form submission
app.post('/reservation', (req, res) => {
    const { name, phone, person, 'reservation-date': reservationDate, message } = req.body;
  
    const newReservation = new Reservation({
      name,
      phone,
      numberOfPersons: person[0], // Assuming the first element is the number of persons
      reservationTime: person[1], // Assuming the second element is the reservation time
      reservationDate,
      message
    });
  
    newReservation.save()
      .then(() => res.redirect('http://127.0.0.1:5500/grilli-master/grilli-master/'))
      .catch(err => res.status(400).send('Error saving reservation'));
  });

  app.get('/reservation', (req, res) => {
    Reservation.find()
      .then(reservations => res.json(reservations))
      .catch(err => res.status(400).send('Error fetching reservations'));
  });
  app.get('/data', async (req, res) => {
    try {
      const reservations = await Reservation.find();
      const emails = await Email.find();
      res.render('data', { reservations, emails });
    } catch (error) {
      res.status(500).send('Error retrieving data');
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
