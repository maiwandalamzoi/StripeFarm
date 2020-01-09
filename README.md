# DASSICO

DASSICO stands for DAta Storing and Structuring for Information disCOvery. STRIPEFARM is the first frontend repository to help nature inclusive farming, focussing on stripe farming.

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

### Starting Up
You can open your browser and go to http://localhost:5000/. You can see a login page of DASSICO.
The default settings for an account of a system admin to login is:
 * email: info@proeftuin.nl
 * password: admin

![Login](/Documentation/Images/login_page.PNG)

You can connect the DASSICO database with pgAdmin 4 by creating new database server with following settings: 
1. Open pgAdmin
2. Specify server connection by right-clicking on "Servers" and selecting "Create" -> "Server..."
![Create server](/Documentation/Images/pgAdmin_connectDb.PNG)
3. Insert a server name on the General tab. I use "dassico_db" for the server name.
![General Info](/Documentation/Images/pgAdmin_generalInfo.PNG)
4. Insert connection info for the server:
   * host name: localhost
   * port: 5433 (as specified in docker-compose.yml)
   * username: postgres
   * password: supersecretpassword (as specified in .env file)
   ![Connection Info](/Documentation/Images/pgAdmin_connectionInfo.PNG)
5. Press "Save" button at the bottom of the window. The connection with the database is created.
![Connection Info](/Documentation/Images/pgAdmin_connected.PNG) 

### System requirements
Minimum system requirements to deploy DASSICO are:
 * Operating system: Windows 10 / Ubuntu 16.04.3 LTS 64-bit
 * Hard disk space: 3.2 GB
 * RAM space: 4 GB
 * CPU core(s): 1 core @ 2.60 GHz
 
### Documentation
API documentation of DASSICO can be found on SwaggerHub: https://app.swaggerhub.com/apis-docs/dassico/dassico_api/1.0.0

In Documentation folder, you can find *.EAP file that contains detailed design of DASSICO.
To open this file, you can use Enterprise Architect Lite / Viewer that can be downloaded on
https://sparxsystems.com/products/ea/downloads.html
