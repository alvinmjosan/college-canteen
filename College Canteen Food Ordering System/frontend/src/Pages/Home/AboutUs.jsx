import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Clock,
  Award,
  ShoppingBag,
  MapPin,
  FastForward,
} from "lucide-react";
import Header from "./Header";

const AboutUs = () => {
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f3f6fb 100%)' }}>
      <Header />
      <div className="bg-primary text-white py-5" style={{ background: "linear-gradient(90deg,rgb(251, 103, 103), #ff6b6b)", border: 'none' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#f6f9fc' }}>
                Welcome to Bite Buddy
              </h1>
              <p className="fs-4 mb-3" style={{ color: '#f3f6fb' }}>
                Transforming your campus dining experience
              </p>
              <p className="fs-5 mb-4 text-white-50">
                No lines, no stress—just great food, ready when you are and grab your favorite campus bites!
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/menu">
                <button className="text-dark fw-medium px-4 py-2 btn btn-light">Order Now</button></Link>
                <a style={{ textDecoration: "none" }} href="#Features"><button className="btn btn-outline-light fw-medium px-4 py-2">Learn More</button></a>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <div className="position-relative" style={{ height: "320px", width: "320px" }}>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-white rounded-circle opacity-25"></div>
                <div className="position-absolute" style={{ top: "16px", left: "16px", right: "16px", bottom: "16px", opacity: "0.3" }}>
                  <div className="bg-white rounded-circle h-100 w-100"></div>
                </div>
                <div className="position-absolute" style={{ top: "32px", left: "32px", right: "32px", bottom: "32px", opacity: "0.4" }}>
                  <div className="bg-white rounded-circle h-100 w-100"></div>
                </div>
                <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center">
                  <ShoppingBag size={96} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="fs-1 fw-bold text-dark mb-4">Our Mission</h2>
              <p className="fs-5 text-secondary mb-4">
                At Bite Buddy, we're committed to revolutionizing campus dining by
                providing a seamless, efficient food ordering platform. We believe
                that good food shouldn't come with long waiting times or complicated
                ordering processes. Our mission is to connect students with campus
                eateries through technology that makes dining convenient,
                accessible, and enjoyable.
              </p>
              <div className="mx-auto bg-dark" style={{ width: "64px", height: "4px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="Features" className="py-5">
        <div className="container">
          <h2 className="fs-1 fw-bold text-center text-dark mb-5">
            Why Choose Bite Buddy?
          </h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "64px", height: "64px" }}>
                    <FastForward className="text-primary" size={32} />
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Skip the Line</h3>
                  <p className="text-secondary">
                    Order ahead and pick up your food when it's ready. No more waiting in long lines between classes.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "64px", height: "64px" }}>
                    <Users className="text-info" size={32} />
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Built for Students</h3>
                  <p className="text-secondary">
                    Designed specifically for the campus community, with student
                    budgets and tight schedules in mind.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "64px", height: "64px" }}>
                    <Award className="text-success" size={32} />
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Quality Experience</h3>
                  <p className="text-secondary">
                    Find exclusive deals, earn loyalty rewards, and enjoy a
                    customized ordering experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-5 bg-light">
        <div className="container">
          <h2 className="fs-1 fw-bold text-center text-dark mb-5">
            How It Works
          </h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center fs-4 fw-bold" style={{ width: "48px", height: "48px", backgroundColor: "#ff9494" }}>
                      1
                    </div>
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Browse & Select</h3>
                  <p className="text-secondary">
                    Discover every campus eatery in one place - filter by lunch, tea, snacks, and more!
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center fs-4 fw-bold" style={{ width: "48px", height: "48px", backgroundColor: "#ff9494" }}>
                      2
                    </div>
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Order & Pay</h3>
                  <p className="text-secondary">
                    Customize your order, add special instructions, and pay securely
                    through the platform. Use Upi or credit cards or other methods.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="text-white rounded-circle d-flex align-items-center justify-content-center fs-4 fw-bold" style={{ width: "48px", height: "48px", backgroundColor: "#ff9494" }}>
                      3
                    </div>
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">Delivery & Enjoy</h3>
                  <p className="text-secondary">
                    Skip the line—head straight to the canteen! Delivery is exclusive for faculty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-5 text-white" style={{ background: "linear-gradient(90deg,rgb(251, 103, 103), #ff6b6b)", border: 'none' }}>
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-4 text-center">
            <div className="col">
              <p className="display-5 fw-bold mb-1">2+</p>
              <p className="fs-5 text-white-50">Campus Eateries</p>
            </div>
            <div className="col">
              <p className="display-5 fw-bold mb-1">1K+</p>
              <p className="fs-5 text-white-50">Daily Orders</p>
            </div>
            <div className="col">
              <p className="display-5 fw-bold mb-1">200+</p>
              <p className="fs-5 text-white-50">Active Users</p>
            </div>
            <div className="col">
              <p className="display-5 fw-bold mb-1">97%</p>
              <p className="fs-5 text-white-50">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-5">
        <div className="container">
          <h2 className="fs-1 fw-bold text-center text-dark mb-5">
            What Students Say
          </h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" >
            <div className="col">
              <div className="card h-100 shadow-lg border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                      A
                    </div>
                    <div>
                      <p className="fw-bold mb-0">Alex Thompson</p>
                      <p className="text-secondary small mb-0">
                        Computer Science, Junior
                      </p>
                    </div>
                  </div>
                  <p className="text-secondary fst-italic">
                    "Bite Buddy has been a game changer between my tight class
                    schedule. I can order my lunch while walking out of lecture and
                    pick it up without waiting in the usual lunch rush."
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-lg border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 text-success fw-bold rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                      M
                    </div>
                    <div>
                      <p className="fw-bold mb-0">Maria Chen</p>
                      <p className="text-secondary small mb-0">Business, Senior</p>
                    </div>
                  </div>
                  <p className="text-secondary fst-italic">
                    "As someone with dietary restrictions, I love how easy it is to
                    filter menu options and customize my orders. The special
                    instructions are always followed perfectly."
                  </p>
                </div>
              </div>
            </div>
            <div className="col col-md-12 col-lg-4" >
              <div className="card h-100 shadow-lg border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 text-info fw-bold rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "40px", height: "40px" }}>
                      J
                    </div>
                    <div>
                      <p className="fw-bold mb-0">James Wilson</p>
                      <p className="text-secondary small mb-0">Engineering, Freshman</p>
                    </div>
                  </div>
                  <p className="text-secondary fst-italic">
                    "The loyalty rewards program is excellent! I've earned several
                    free meals this semester just by ordering through Bite Buddy
                    instead of waiting in line. The notifications when my food is
                    ready are super helpful."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-light py-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="fs-1 fw-bold text-dark mb-3">
                Contact Us
              </h2>
              <p className="fs-5 text-secondary mb-3">
                Have a question or need support? We’re here to help!
              </p>
              <div className="container d-flex justify-content-center align-items-center">
                <div className="card shadow-sm p-3 mb-3 bg-white rounded shadow-lg" style={{ maxWidth: "350px" }}>
                  <div className="card-body text-center">
                    <p className="fs-5 fw-bold text-dark mb-2">
                      Address:
                    </p>
                    <ul className="list-unstyled">
                      <li className="mb-1">GCE Kannur,</li>
                      <li className="mb-1">Mangattuparamba,</li>
                      <li className="mb-1">Parassinikadavu P.O,</li>
                      <li className="mb-3">Kannur, Kerala - 670563</li>
                      <li className="mb-1"><i class="fa-solid fa-phone"></i> 0497-2320547</li>
                      <li className="mb-1"><i class="fa-solid fa-envelope"></i> gcek@canteen.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-light py-5" style={{ backgroundColor: "#ff6b6b" }}>
        <p className="mb-0">© {new Date().getFullYear()} BiteBuddy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;