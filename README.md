

# Car Catalog Management System

This project is a simple car catalog management system built using Node.js, Express, MongoDB, and Passport.js for authentication. It includes an admin panel where cars and categories can be managed, allowing you to edit car details and organize them by categories.

## Features

- **Admin Authentication**: Admin login using Passport.js.
- **Car Management**: Admin can edit the name, description, price, color, and category of cars.
- **Category Management**: Cars are organized by categories, and categories can have nested subcategories.
- **Admin Panel**: A simple panel for managing cars.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or above)
- **MongoDB** (running locally or via MongoDB Atlas)
- **Git** (optional, for cloning the repository)

## Installation locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/VasulenkoIllia/car-catalog.git
   cd car-catalog

2. **Install Dependencies**:

    ```bash
    npm install

3. **Set Up Environment Variables:**:
    ```bash
    MONGO_URI=mongodb://admin:admin@localhost:27017/car_catalog?authSource=admin
    PORT=3001

4. Seed the Database:
    ```bash
    node seed.js

    This will create an admin account with the following credentials:
    Username: admin
    Password: admin

5. Run the Application:
    ```bash
    npm start

6. go to 
    ```bash
    http://localhost:3001 - catalog
    http://localhost:3001/admin/login - admin panel

## Installation in docker 

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/car-catalog.git
   cd car-catalog

2. Up Docker
    ```bash
    docker-compose up --force-recreate

3. go to 
    ```bash
    http://localhost:3001 - catalog
    http://localhost:3001/admin/login - admin panel

## Installation in k8s

1.To convert the docker-compose.yml file to files that you can use with kubectl, run kompose convert and then kubectl apply -f <output file>.


    kompose convert

## CLI import
    
    node import.js ./path/to/importData.json
    node import.js ./importData.json


## Structure of the JSON File
    
     {
        "categories": [
        {
          "name": "Седани",
          "description": "Комфортні автомобілі для довгих подорожей.",
          "slug": "sedans",
          "image": "https://example.com/sedans-category.jpg",
         "subCategories": [
          {
             "name": "Люксові Седани",
             "description": "Розкішні автомобілі для тих, хто цінує комфорт і престиж.",
             "slug": "luxury-sedans",
             "image": "https://example.com/luxury-sedans.jpg",
              "subCategories": []
            }
         ]
        }
    ],
    "cars": [
        {
            "name": "Tesla Model S",
            "price": 80000,
            "color": "Білий",
            "image": "https://example.com/tesla-model-s.jpg",
            "description": "Електричний седан з футуристичним дизайном.",
            "slug": "tesla-model-s",
            "category": "luxury-sedans"
         }
        ]
    }



