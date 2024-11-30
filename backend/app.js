const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51QQRCEHhF3wo4tl2gsnHBPhkvEXiMRVnBoIsITvBzTilVrS1NfnVUSzz8zwqcVoj2XH80A8xc7usqHbh6dTcNPma003q9in8fh"
);
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rajdeepak_SQL",
  database: "event",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully.");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register request received:", { name, email, password });

  db.query("SELECT * FROM register WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res
        .status(500)
        .json({ message: "Database error", success: false });
    }

    if (result.length > 0) {
      console.log("User already exists:", email);
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const query =
      "INSERT INTO register (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res
          .status(500)
          .json({ message: "Database error", success: false });
      }
      console.log("User registered successfully:", { name, email, password });
      return res
        .status(200)
        .json({ message: "User registered successfully", success: true });
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password are required", success: false });
  }

  const query = "SELECT * FROM register WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err.stack);
      return res
        .status(500)
        .json({ message: "Database query error", success: false });
    }

    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    const user = result[0];

    if (password === user.Password) {
      return res.status(200).json({
        message: "Login successful",
        success: true,
        name: user.Name,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  });
});

app.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = "admin24@gmail.com";
  const adminPassword = "Admin2024";

  if (email === adminEmail && password === adminPassword) {
    res.status(200).json({ success: true, message: "Login successful!" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password." });
  }
});

app.post("/addevent", (req, res) => {
  const {
    eventName,
    category,
    venueName,
    location,
    tickets,
    ticketsPrice,
    startDate,
    endDate,
  } = req.body;

  const query =
    "INSERT INTO addevent (eventName, category, venueName, location, tickets, ticketsPrice, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      eventName,
      category,
      venueName,
      location,
      tickets,
      ticketsPrice,
      startDate,
      endDate,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting event:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error adding event" });
      }
      res
        .status(200)
        .json({ success: true, message: "Event added successfully!" });
    }
  );
});

app.post("/addcategory", (req, res) => {
  const { Categorytitle, Categorydescription } = req.body;

  const checkCategoryQuery = "SELECT * FROM addcategory WHERE Categoryname = ?";
  db.query(checkCategoryQuery, [Categorytitle], (err, result) => {
    if (err) {
      console.error("Error checking category:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error checking category" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const insertCategoryQuery =
      "INSERT INTO addcategory (Categoryname, Categorydescription) VALUES (?, ?)";
    db.query(
      insertCategoryQuery,
      [Categorytitle, Categorydescription],
      (err, result) => {
        if (err) {
          console.error("Error adding category:", err);
          return res.status(500).json({
            success: false,
            message: "Error adding category",
          });
        }
        res
          .status(200)
          .json({ success: true, message: "Category added successfully" });
      }
    );
  });
});

// Fetch all events
app.get("/allevent", (req, res) => {
  const query = "SELECT * FROM addevent";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching events" });
    }
    res.status(200).json({ success: true, events: result });
  });
});

// Delete Event
app.delete("/allevent/:Id", (req, res) => {
  const { Id } = req.params;
  const query = "DELETE FROM addevent WHERE Id = ?";
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting event" });
    }
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully!" });
  });
});

// Update Event
app.put("/allevent/:Id", (req, res) => {
  const { Id } = req.params;
  const {
    Eventname,
    Category,
    Venuename,
    Location,
    Tickets,
    Ticketsprice,
    startdate,
    enddate,
  } = req.body;

  const query = `
    UPDATE addevent
    SET Eventname = ?, Category = ?, Venuename = ?, Location = ?, Tickets = ?, Ticketsprice = ?, startdate = ?, enddate = ?
    WHERE Id = ?
  `;

  db.query(
    query,
    [
      Eventname,
      Category,
      Venuename,
      Location,
      Tickets,
      Ticketsprice,
      startdate,
      enddate,
      Id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating event:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error updating event" });
      }
      res
        .status(200)
        .json({ success: true, message: "Event updated successfully!" });
    }
  );
});

app.get("/eventdetails/:Id", (req, res) => {
  const { Id } = req.params;

  const query = "SELECT * FROM addevent WHERE Id = ?";

  db.execute(query, [Id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.json(results[0]);
    } else {
      return res.status(404).json({ message: "Event not found" });
    }
  });
});

app.get("/allcategory", (req, res) => {
  const query = "SELECT * FROM addcategory";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching categories" });
    }
    res.status(200).json({ success: true, categories: result });
  });
});

// Delete category
app.delete("/allcategory/:Id", (req, res) => {
  const { Id } = req.params;
  const query = "DELETE FROM addcategory WHERE Id = ?";
  db.query(query, [Id], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting category" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully!" });
  });
});

// Update category
app.put("/allcategory/:Id", (req, res) => {
  const { Id } = req.params;
  const { Categoryname } = req.body;
  const query = "UPDATE addcategory SET Categoryname = ? WHERE Id = ?";
  db.query(query, [Categoryname, Id], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error updating category" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category updated successfully!" });
  });
});

let bookings = [];

app.post("/create-checkout-session", async (req, res) => {
  const {
    eventId,

    eventName,
    category,
    username,
    totalTickets,
    totalPrice,
  } = req.body;

  console.log(req.body);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:3000/Mybooking`,
      cancel_url: `http://localhost:3000/event-details/${eventId}`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Tickets for Event ${eventId}`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: totalTickets,
        },
      ],
    });
    console.log(session);
    const paymentId = session.id;
    const bookingDate = new Date();

    const query =
      "INSERT INTO booking (paymentid, eventname, category, username, tickets, bookingdate) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      paymentId,
      eventName,
      category,
      username,
      totalTickets,
      bookingDate,
    ];

    db.execute(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting data into database:", error);
        res.status(500).send("Error inserting booking details into database");
      } else {
        console.log("Booking details inserted successfully");
      }
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Error creating Stripe session");
  }
});

app.get("/get-booking-details/:username", (req, res) => {
  const { username } = req.params;

  const query = "SELECT * FROM booking WHERE username = ?";

  db.execute(query, [username], (error, results) => {
    if (error) {
      console.error("Error retrieving booking details:", error);
      return res
        .status(500)
        .json({ message: "Error retrieving booking details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.json({ bookings: results });
  });
});

app.get("/get-booking-detail", (req, res) => {
  const query = "SELECT * FROM booking";

  db.execute(query, (error, results) => {
    if (error) {
      console.error("Error retrieving booking details:", error);
      return res
        .status(500)
        .json({ message: "Error retrieving booking details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.json({ bookings: results });
  });
});

app.get("/count-tickets", (req, res) => {
  const query =
    "SELECT eventname, SUM(tickets) AS total_tickets FROM booking GROUP BY eventname";

  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error retrieving ticket count:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.json({ ticketCounts: results });
    } else {
      return res.status(404).json({ message: "No bookings found" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
