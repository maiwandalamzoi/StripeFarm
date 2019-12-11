# DASSICO

DASSICO stands for DAta Storing and Structuring for Information disCOvery.

## Getting Started
These instructions will get you a copy of the project up and running in your local machine 
for development and testing purposes. You can read a PDEng thesis about DASSICO that was written by Dimas Satria
and published by Eindhoven University of Technology to get more information about DASSICO.

### Prerequisites
You need to install [Docker](https://docs.docker.com/install/) in your machine before running the code. If you already
have Docker, clone the code from this repository to your machine.

### Installation
To start DASSICO with Docker:
 * Open command prompt or terminal in your machine
 * Go to the folder where docker-compose.yml is located
 * Run this command to build all services:
    ```
    docker-compose up -d --build
    ```

 * See all running services in DASSICO by executing:
   ```
   docker ps -a
   ```
   
 * Some services might need to restart because they cannot find the database during initialization.
   The database might be created after the services are initialized. Run this command to solve the issue:
   ```
   docker-compose restart
   ``` 

### Configuration Settings
Default configuration settings should be executed once the services initialized.
 
 * Adding configuration for role permission and system admin for User Service
    ```
    docker exec -i dassico_user python add_role_permissions.py
    docker exec -i dassico_user python add_admin_user.py
    ``` 
   
 * Adding lists of countries, measurement units, soil types, and accessibility statuses
    ```
    docker exec -i dassico_sensing python add_countries.py
    docker exec -i dassico_sensing python add_units.py
    docker exec -i dassico_sensing python add_soil_types.py
    docker exec -i dassico_sensing python add_accessibility_status.py
    ``` 