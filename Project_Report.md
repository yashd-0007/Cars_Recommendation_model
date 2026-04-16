# Project Report

**1. PROJECT NAME**
**DreamDrive – AI Car Recommendation System**

**2. AIM OF THE PROJECT**
The main goal of the DreamDrive project is to build an intelligent and user-friendly web application that helps people find the perfect car according to their personal needs and financial situation. Buying a car is often a confusing process because there are too many options, features, and price ranges. Many buyers struggle to understand which car fits both their daily lifestyle and their monthly salary.

DreamDrive solves this problem by using Artificial Intelligence. When a user visits the website, they simply enter their monthly income, their total budget for the car, and standard preferences like fuel type (Petrol, Diesel, EV) and transmission (Manual or Automatic). The system immediately analyzes these details, considers the user's financial capacity, and suggests the most practical and suitable cars available in the market. 

Additionally, the project features a built-in EMI (Equated Monthly Installment) calculator. This tool instantly estimates how much the user will have to pay every month if they decide to take a loan for their recommended car. By combining AI suggestions with realistic financial estimates, this project aims to make the car buying experience simple, transparent, and highly personalized for every user.

**3. TECHNOLOGY USED**
This project was built using a modern Full-Stack development approach, combining multiple powerful technologies to create a seamless experience.

**React (Frontend UI)**
React is a popular JavaScript library used to build the visual parts of the website that the user interacts with. It was chosen because it allows for creating highly responsive, fast, and interactive user interfaces. React helped in building the beautiful car display cards, the search forms, the EMI calculator, and the glowing animations that make the website feel premium and modern.

**Node.js (Backend API)**
Node.js acts as the server-side technology for this project. It is responsible for handling user authentication and securely managing login details. When a user tries to log into their profile, the React frontend sends their details to the Node.js backend, which verifies the information and grants access. This creates a safe and organized structure for the application.

**Machine Learning Model (Car Recommendation)**
The core intelligence of DreamDrive comes from a custom Machine Learning model. This model was programmed to understand numerical data like salaries and budgets, and categorize them to match specific car segments. Instead of using basic website filters, the Machine Learning model acts like a virtual assistant, predicting exactly which vehicles make the most mathematical and practical sense for the buyer.

**Python / Google Colab (Model Training)**
Python is the primary language used to write the analytical logic for the AI. Google Colab, a cloud-based programming environment, was used to train the Machine Learning model. In Colab, the model was fed hundreds of rows of car data so it could learn the patterns between car prices, features, and buyer income levels. Once trained, the model was exported as a `.pkl` (pickle) file to be connected to the website.

**CSV Dataset (Car Data)**
A comprehensive CSV (Comma-Separated Values) dataset was used as the foundation of knowledge for the website. This file acts as a massive spreadsheet containing the real-world details of various cars, including their brand, image links, fuel types, seating capacity, price, and mileage. The AI model reads this dataset to fetch the exact specifications of the cars it recommends.

**GitHub (Project Hosting)**
GitHub is a platform used by developers to store and manage their code securely. For this project, GitHub was used for version control, meaning every change made to the code was saved systematically. Furthermore, the final working frontend of the website was successfully hosted live on the internet using GitHub Pages, allowing anyone to access and use the DreamDrive application from their own devices.

**4. LEARNING FROM THE PROJECT**
Developing the DreamDrive application was a highly educational experience that bridged the gap between theoretical computer science and practical software engineering. Several key technical skills were acquired during this journey:

**Machine Learning model creation:** I learned how to approach a real-world problem using AI, program a model using Python, train it to recognize patterns in numerical data, and export it for external use.

**Working with datasets:** I gained hands-on experience in collecting, cleaning, and managing large CSV files. I learned how to structure data so that both a web application and an AI model can read and process it efficiently without errors.

**Building APIs:** I learned how to construct Application Programming Interfaces (APIs). This taught me how different parts of a software system communicate over the internet, specifically how to send data from a website, process it on a server, and return an answer.

**Connecting AI model with a web application:** One of the most challenging but rewarding parts of the project was learning how to integrate a locally trained Python AI model into a live JavaScript web environment so that normal users could interact with it through a browser.

**Frontend development using React:** I significantly improved my UI/UX (User Interface and User Experience) design skills. I learned how to use React components to build a complex, multi-page layout, handle user inputs gracefully, and create smooth, modern animations for a premium feel.

**Deploying project using GitHub:** Finally, I learned the critical steps of the software deployment pipeline. I practiced compiling code for production and configuring repositories to host a fully functional web application live on the web for public use.
