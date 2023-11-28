# EdUniHub - Ed-Tech Platform

![EdUniHub Logo](#link_to_your_logo)



## Project Description

EdUniHub is a fully functional ed-tech platform built on the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS). The platform facilitates the creation, consumption, and rating of educational content, aiming to provide:

- A seamless and interactive learning experience for students, making education accessible and engaging.
- A platform for instructors to showcase expertise and connect with learners globally.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Front-end](#front-end)
3. [Back-end](#back-end)
4. [API Design](#api-design)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Future Enhancements](#future-enhancements)
8. [Conclusion](#conclusion)

---

## System Architecture

The EdUniHub platform comprises three main components: front end, back end, and a MongoDB database. It follows a client-server architecture, with ReactJS for the front end, NodeJS/ExpressJS for the back end, and MongoDB for the database.

**[Architecture Diagram](https://drive.google.com/file/d/1u7rNKK_lrGrAMHo_OS4HZJKMdTKLcmU7/view?usp=sharing)**

## Front-end

The EdUniHub front end is designed using ReactJS and Figma for a clean, minimalistic interface. Key pages include:

### For Students:
- Homepage
- Course List
- Wishlist
- Cart Checkout
- Course Content
- User Details
- User Edit Details

### For Instructors:
- Dashboard
- Insights
- Course Management Pages
- View and Edit Profile Details

### For Admin (future scope):
- Dashboard
- Insights
- Instructor Management
- Other Relevant Pages

Frameworks and tools used: ReactJS, CSS, Tailwind, Redux, VSCode.

**[Figma Design](https://www.figma.com/file/Mikd0FjHKAofUlWQSi70nf/StudyNotion_shared)**

## Back-end

### Back-end Architecture:

EdUniHub uses a monolithic architecture with Node.js, Express.js, and MongoDB. Features include:

- User authentication and authorization
- Course management
- Payment Integration (Razorpay)
- Cloud-based media management (Cloudinary)
- Markdown formatting

Frameworks, libraries, and tools used: Node.js, MongoDB, Express.js, JWT, Bcrypt, Mongoose.

### Data Models and Database Schema:

- Student schema
- Instructor schema
- Course schema

## API Design

The EdUniHub API follows REST principles and is implemented using Node.js/Express.js. Sample endpoints:

- /api/auth/signup (POST)
- /api/auth/login (POST)
- /api/auth/verify-otp (POST)
- /api/auth/forgot-password (POST)
- /api/courses (GET, POST, PUT, DELETE)
- /api/courses/:id/rate (POST)

**[Sample Requests and Responses](#link_to_api_docs)**

## Deployment

The deployment involves hosting on various cloud services:

- Front end: Vercel
- Back end: Render or Railway
- Media files: Cloudinary
- Database: MongoDB Atlas

**[Hosting Environment and Infrastructure](#link_to_deployment_docs)**

## Testing

Details of the testing process, types of testing, and frameworks/tools used.

## Future Enhancements

1. **Gamification features**: Badges, points, and leaderboards for increased user engagement (Medium Priority).
2. **Personalized learning paths**: Tailoring learning paths based on individual interests (High Priority).
3. **Social learning features**: Group discussions, peer-to-peer feedback, and collaborative projects (Medium Priority).
4. **Mobile app**: Enhanced accessibility for users (High Priority).
5. **Machine learning-powered recommendations**: Personalized course recommendations (Medium to High Priority).
6. **VR/AR Integration**: Immersive learning experiences (Low to Medium Priority).

## Conclusion

EdUniHub is designed to deliver a versatile and intuitive ed-tech experience. This document provides an overview of the platform's architecture, features, deployment, and future enhancements. The platform's development journey will involve overcoming challenges while achieving project milestones.
