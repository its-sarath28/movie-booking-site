# BookMyMovie Web App

Welcome to BookMyMovie! This application provides a seamless platform for booking movie tickets online. Below are the key features and functionalities of the app:

## Key Features:

1. **Admin and User Dashboards:** Enjoy a user-friendly interface tailored for both administrators and regular users.

2. **JWT Authentication:** Secure your account with industry-standard JWT authentication for peace of mind.

3. **Frontend UI:** Our frontend is built using React.js and Bootstrap, ensuring a smooth and responsive user experience.

4. **Backend Development:** Powered by Express.js, our backend ensures robust functionality and efficient performance.

5. **Payment Integration:** Seamlessly book tickets and make payments through Razorpay integration, providing a hassle-free transaction experience.

6. **Field Validation:** Express Validator ensures that all inputs are validated, minimizing errors and ensuring data integrity.

7. **Image Uploadation:** Cloudinary integration allows users to effortlessly upload images, enhancing their profile customization experience.

8. **Movie Availability:** Users can browse through all available movies and book tickets according to dates and showtimes.

9. **Admin Controls:** Administrators have the capability to disable movies based on scheduling requirements, ensuring smooth operations.

10. **Ticket Download:** After booking, users can conveniently download their tickets for easy access.

11. **Email Notifications:** Upon successful booking, an email containing the booking ID is sent to the registered email address, keeping users informed and organized.

12. **Swiper.js Integration:** Enjoy a seamless movie card swiping experience, enhancing navigation and user engagement.

## Getting Started:

### .env setup

```
client:

VITE_CLOUD_NAME=
VITE_UPLOAD_PRESET=

server:

MONGO_URL=
PORT=
JWT_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL=
APP_PASSWORD=
```

To get started with BookMyMovie:

1. Clone the repository: `https://github.com/its-sarath28/movie-booking-site.git`
2. Install dependencies: `npm install`
3. Configure environment variables for JWT secret, Razorpay API keys, Cloudinary credentials, and email server settings.
4. Run the server: `npm run start-dev`
5. Run the client: `npm run dev`
6. Access the application in your browser at `http://localhost:5173`

## Acknowledgements:

Technologies and libraries used this project:

- ReactJS
- Bootstrap
- ExpressJS
- Razorpay
- Cloudinary
- Express Validator
- Swiper.js

Happy movie booking! 🎬🍿
