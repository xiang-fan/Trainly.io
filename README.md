# CS5200 Project
Project link: https://cs5200-project.herokuapp.com

DEMO video:

Installation video:

This is the final project for CS5200f17, and the goal of the project is to gain hands-on experience with developing a full database application from the ground up. 

We created an web application called Trainly.io which use MySQL as back-end database, and use Express.js, Angular.js, and Node.js 
to create front-end web app and connect it with the database.

Functions:
a) Register a new user (studnet, faculty and/or admin)
b) As an administrator, authenticate a faculty user (based upon title/affiliation/website/email) or fellow
administrator
c) Provide a categorized list of a student’s courses (each with primary/secondary topics, ranked by
average evaluation score): currently enrolled, completed, of interest
d) Enroll a student in a course
e) For a student enrolled in a course, list materials, in order, indicating the line of demarcation between
completed/not completed
f) Mark course material as having been completed by a student (possibly resulting in course completion)
g) Provide a certificate of completion for a student (assuming s/he has successfully completed all materials)
h) Provide an account history for a user: dates of enrollment/completion for each course, amount paid
(with confirmation code), and total spent.

This WebApp is currently hosting on Heroku, and you can run it at: https://cs5200-project.herokuapp.com

Installation:
1. $ git clone https://github.com/fanxiang1992/CS5200-project.git
2. cd /CS5200-project
3. Make sure you have Node installed in your computer, if not, plesase follow this link to download and install:
https://nodejs.org/en/download/
4. connect to your local mysql database and import the DDL/DML
5. $ node server.js
6. browse to localhost:3000