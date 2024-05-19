# PokeWeb App ✨

PokeWeb is a web application built with Angular 17 that allows users to browse and manage a list of Pokémon. Users can add Pokémon to their personal Pokédex, which is stored in Firebase. This app utilizes the Pokémon API to display detailed information about each Pokémon, including name, ID, sprite, height, weight, type, and a short description.

## Features

- **List of Pokémon:** Displays a list of 500 Pokémon with their basic information.
- **Add to Pokédex:** Logged-in users can add Pokémon to their personal Pokédex.
- **Search Pokémon by name:** Users can search for a Pokémon using the search bar.
- **Authentication:** Only logged-in users can add Pokémon to their Pokédex.
- **Sign Up and Login:** New users can sign up for an account, and existing users can log in.
- **Default Pokémon:** New users' Pokédex starts with a default Pokémon: Pikachu.
- **Search in Pokédex by name:** Users can search for Pokémon within their personal Pokédex.
- **Mobile Responsive:** The application is fully responsive and optimized for mobile devices.

## Technologies Used

- **Angular 17.3.9:** Frontend framework
- **Bootstrap:** CSS framework for styling and mobile responsiveness
- **Firebase:** Backend for storing user data and Pokédex information
- **Pokémon API:** Provides Pokémon data including name, ID, sprite, height, weight, type, and description

## Getting Started

### Prerequisites

- Node.js and npm installed
- Angular CLI installed (`npm install -g @angular/cli`)

### Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/plttsthr/PokeWeb.git
   cd pokeweb
   

2. Install dependencies.
   ```bash
   npm install

3. Set up Firebase credentials.

- Create a Firebase project at Firebase Console.
- Go to Project Settings and copy the Firebase config object.
- Paste the config object in **src/environments/environment.ts and src/environments/environment.prod.ts.**

    ```
    export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_AUTH_DOMAIN',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_STORAGE_BUCKET',
        messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
        appId: 'YOUR_APP_ID',
        measurementId: 'YOUR_MEASUREMENT_ID'
    }
    
4. Set up Firebase security rules:

- Go to the Firebase Console and navigate to your project.
- Go to Firestore and then Rules tab.
- Replace the existing rules with the following:

    ```
    service cloud.firestore {
        match /databases/{database}/documents {
        // Allow read/write access to the "pokemons" collection under each user
            match /users/{userID}/pokedex/{document=**} {
                allow read, write: if request.auth != null && request.auth.uid == userID;
            }
        }
    }

- **This rule ensures that each user can only read and write to their own Pokédex data.** 

- Run the app locally:

    ```
    ng serve

5. Open the app in your browser:

- Navigate to http://localhost:4200/.

## Usage

1. PokéList:

    - Explore the list of 500 Pokémon.

2. Add Pokémon to Pokédex:

    - Log in to add Pokémon to your personal Pokédex.
    - New users start with Pikachu in their Pokédex by default.

3. Search Pokémon in PokéList:

    - Use the search bar to find a specific Pokémon by name.

4. Pokédex:

    - See all Pokémons in your personal Pokédex.
    - Search for Pokémon within your personal Pokédex.
    - View details such as name, ID, sprite, height, weight, type, and description. 
 
