import { RequestPromise } from "request-promise";

/**
 * postOnJwtToken() mocks post api request on Jwt Token
 * return 200 if email = test@test.nl && password = testPassword
 * return 401 if email != test@test.nl || password != testPassword
 */
export function postOnJwtToken(options: any): RequestPromise{
    return new Promise((resolve, reject) => {
        if ((options.body.email === 'test@test.nl' && options.body.password === 'testPassword')
            || (options.body.email === 'info@proeftuin.nl' && options.body.password === 'admin')) {
            let response = {
                statusCode: 200,
                body: {
                    "access_token": "eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0",
                    "refresh_token": "eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOivdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX08y",
                    "user_id": 15
                }
            };
            resolve(response);
        } else {
            reject({statusCode: 401});
        }
    }) as unknown as RequestPromise;
}
