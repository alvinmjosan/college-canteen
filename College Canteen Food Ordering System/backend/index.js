import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.route.js';
import menuRouter from './routes/menu.route.js';
import notificationRouter from './routes/notifications.route.js';
import cartRouter from './routes/cart.route.js';
import reviewRouter from './routes/review.route.js';
import userRouter from './routes/user.route.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api", userRouter); 
app.use("/api", ordersRouter);
app.use("/api", menuRouter);
app.use("/api", notificationRouter);
app.use("/api", cartRouter);
app.use("/api", reviewRouter);

// const items = [
//   { id: 1, category: "lunch", name: "Meals", description: "Traditional rice meal with sambar, sides, pappadam & payasam", price: 30, img: "https://media.istockphoto.com/id/609912098/photo/onam-feast-on-banana-leaf.webp?a=1&b=1&s=612x612&w=0&k=20&c=LJ8Oj5Wq2Kke8fYnJhwFv5-JXX68atWzepHl3K85HAQ=" },
//   { id: 2, category: "lunch", name: "Chicken Biriyani", description: "Aromatic basmati rice layered with spiced chicken, herbs & fried onions", price: 80, img: "https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=" },
//   { id: 3, category: "lunch", name: "Porotta", description: "Flaky, layered flatbread, crispy outside & soft inside", price: 8, img: "https://media.istockphoto.com/id/2163457901/photo/lachha-paratha-served-in-dish-isolated-dark-background-top-view-of-indian-spices-bangladeshi.webp?a=1&b=1&s=612x612&w=0&k=20&c=D9e-QQEFFLUKyL8zdJeMCFZNRrEV-DKiszLPpdcBliA=" },
//   { id: 4, category: "lunch", name: "Appam", description: "Soft, lacy rice pancakes with a fluffy center", price: 8, img: "https://media.istockphoto.com/id/2020491948/photo/rice-roti-a-gluten-free-alternative-made-with-raw-rice-four-perfect-for-a-healthy-meal.webp?a=1&b=1&s=612x612&w=0&k=20&c=qCSsRTW6Cq2h0hcnik0_iZGGYDpKF90WbafFIxh_Hx0=" },
//   { id: 5, category: "refreshments", name: "Lemon Juice", description: "Refreshing & tangy citrus drink", price: 15, img: "https://media.istockphoto.com/id/1256888710/photo/a-glass-of-mojito.webp?a=1&b=1&s=612x612&w=0&k=20&c=KJHFPlhGVl6qcvNjUMO0WBzDULPSPQ7CEPSf-GICZ4c=" },
//   { id: 6, category: "lunch", name: "Veg Biriyani", description: "Fragrant basmati rice cooked with mixed vegetables & aromatic spices", price: 50, img: "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnJTIwYmlyaXlhbml8ZW58MHx8MHx8fDA%3D" },
//   { id: 7, category: "refreshments", name: "Soft Drinks", description: "Chilled, fizzy, and refreshing drinks", price: 10, img: "https://media.istockphoto.com/id/802667754/photo/cold-bottles-of-various-drinks-in-the-ice-bucket.webp?a=1&b=1&s=612x612&w=0&k=20&c=1ol7lYCeciH2df21w4Hnh_tfWc4dIHS-Q-VUqCOWUmQ=" },
//   { id: 8, category: "lunch", name: "Fish Curry", description: "Spicy and tangy curry with fresh fish & aromatic spices", price: 25, img: "https://media.istockphoto.com/id/1091567206/photo/srilanka-spicy-fish-curry.webp?a=1&b=1&s=612x612&w=0&k=20&c=nyMZQD8kh8Roljj8rrWgQ0NIzuPz2x9qa-8TFVSFnQw=" },
//   { id: 9, category: "lunch", name: "Veg Curry", description: "Mixed vegetables cooked in a flavorful spiced gravy", price: 20, img: "https://media.istockphoto.com/id/1497707535/photo/veg-manchurian-in-a-bowl-closeup-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=3vnKsHt7T6E6T3IIRUwOy4wZ17h4DyqIrO3rPQP5Efg=" },
//   { id: 10, category: "lunch", name: "Chicken Curry", description: "Tender chicken cooked in a rich, spiced gravy", price: 40, img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpY2tlbiUyMGN1cnJ5fGVufDB8fDB8fHww" },
//   { id: 11, category: "tea & Snacks", name: "Tea", description: "Tea is a ritual, an experience, a dance of flavors and aromas that awakens the senses", price: 10, img: "https://t3.ftcdn.net/jpg/08/20/38/44/360_F_820384451_VyPPMDN5AhpSytqxpoIKdmuP2n2tEWlu.jpg" },
//   { id: 12, category: "tea & Snacks", name: "Samoosa", description: "A crispy golden shell, delicately cradling a spiced, aromatic filling, takes you on a journey of flavors with every bite", price: 12, img: "https://t3.ftcdn.net/jpg/10/61/88/40/360_F_1061884043_pQwALKs3zORrLwl3NzfYlRdplFPz7kgE.jpg" }
// ];

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('database connected');
    app.listen(process.env.PORT, () => {
      console.log("Server statrted at the port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log('database not connected' + error);
});
