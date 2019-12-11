import Request from 'request-promise';

let apiUrl = "http://proeftuin.win.tue.nl/api/v1";

/**
 * Get an access token via the user and authentication service.
 * @param email The email address to login.
 * @param password The password to login.
 */
export async function getAccessToken(email: string, password: string): Promise<string> {
    const options = {
        method: "POST",
        uri: apiUrl + "/auth/jwt_token",
        resolveWithFullResponse: true,
        body: {
            "email": email,
            "password": password
        },
        json: true
    };

    return await Request.post(options)
        .then(async function(res) {
            if (res.statusCode === 200) {
                // Login succesful
                return res.body.access_token;
            }
            return Promise.reject("Unexpected response received!");
        })
        .catch(function(err) {
            if (err.statusCode) {
                switch (err.statusCode) {
                case 401:
                {
                    // Invalid username or password
                    throw new Error("Login unsuccessful");
                }
                }
            }
        });
}