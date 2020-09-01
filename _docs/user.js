// Tag
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API
 */
// User Schema
/**
 * @swagger
 *  components:
 *    schemas:
 *      signup:
 *        type: object
 *        required:
 *          - issuer
 *          - signUpType
 *          - access_token 
 *        properties:
 *          issuer:
 *            type: string
 *            description: Third-party application used for signup/login
 *          signUpType:
 *            type: string
 *            description: Mode of Signup
 *          access_token:
 *            type: string
 *            description: Token for Signup
 *
 *        example:
 *           issuer: "google"
 *           signUpType: "OAuth"
 *           idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwNTQxNWIxM2FjYjk1OTBmNzBkZjg2Mjc2NWM2NTVmNWE3YTAxOWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAxMTIxNTkwMzU0OS1nazA0cHF1cWd0YmtrZWZ0OHJ2a2VkMGViMDhsa3M2MS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMTEyMTU5MDM1NDktZ2swNHBxdXFndGJra2VmdDhydmtlZDBlYjA4bGtzNjEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NTYyMjg5MTE3NzU4MjAyOTciLCJlbWFpbCI6ImpvZWxtYXRoZXdrb3NoeUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImVYUUlkWmpGWDdGRDQ4blNaV3E3c0EiLCJuYW1lIjoiSm9lbCBNYXRoZXciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hiLUxfYW9acllIcGZHMTE0MUlUWW1TTEh3MUx2NG5wSHlZZF9zZUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9lbCIsImZhbWlseV9uYW1lIjoiTWF0aGV3IiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1OTYyNzE2MjEsImV4cCI6MTU5NjI3NTIyMSwianRpIjoiZWI1YWVmZTM1YWMyZGNhZGQ5YTMwMzRlN2U4YjA3NWJhNjNjMjYyNCJ9.eoozJ7l6BV-q7s7nGRq_xjz1ijQ3EyYlryKisXAadYGCABZIu9C65GypvXkCxHq5OoZEp3wWy7mj5Z-bxUGDSJ8_l3z4l6FeOKoTaNvKwhHzYEkb0L6yHKQatvi8tcLYJSafTWgOjYsDyoh92r5X_BM4zMg60HIS6BeMPpg8NzLxOy3l14TTD4wu3nxtaQxPIwJBgABA2XOhb3jsi7qFWiZWtLkUa36_mYSjf3Ii1uAl7ITs5Jbpi4wdKjQqA-B9URmgzvySHq7GBjkHa4Md4tJ5Cee-yZSRT8Hd4WfuxZPghVcI-Wo-uPOuDBnlxI8IGu1TtxbpErMxDyrfg-JvyA"
 *      login:
 *        type: object
 *        required:
 *          - issuer
 *          - access_token
 *        properties:
 *          issuer:
 *            type: string
 *            description: Third-party application used for signup/login
 *          access_token:
 *            type: string
 *            description: Token for Signup
 *
 *        example:
 *           issuer: "google"
 *           idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImYwNTQxNWIxM2FjYjk1OTBmNzBkZjg2Mjc2NWM2NTVmNWE3YTAxOWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAxMTIxNTkwMzU0OS1nazA0cHF1cWd0YmtrZWZ0OHJ2a2VkMGViMDhsa3M2MS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMTEyMTU5MDM1NDktZ2swNHBxdXFndGJra2VmdDhydmtlZDBlYjA4bGtzNjEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NTYyMjg5MTE3NzU4MjAyOTciLCJlbWFpbCI6ImpvZWxtYXRoZXdrb3NoeUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImVYUUlkWmpGWDdGRDQ4blNaV3E3c0EiLCJuYW1lIjoiSm9lbCBNYXRoZXciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hiLUxfYW9acllIcGZHMTE0MUlUWW1TTEh3MUx2NG5wSHlZZF9zZUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9lbCIsImZhbWlseV9uYW1lIjoiTWF0aGV3IiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1OTYyNzE2MjEsImV4cCI6MTU5NjI3NTIyMSwianRpIjoiZWI1YWVmZTM1YWMyZGNhZGQ5YTMwMzRlN2U4YjA3NWJhNjNjMjYyNCJ9.eoozJ7l6BV-q7s7nGRq_xjz1ijQ3EyYlryKisXAadYGCABZIu9C65GypvXkCxHq5OoZEp3wWy7mj5Z-bxUGDSJ8_l3z4l6FeOKoTaNvKwhHzYEkb0L6yHKQatvi8tcLYJSafTWgOjYsDyoh92r5X_BM4zMg60HIS6BeMPpg8NzLxOy3l14TTD4wu3nxtaQxPIwJBgABA2XOhb3jsi7qFWiZWtLkUa36_mYSjf3Ii1uAl7ITs5Jbpi4wdKjQqA-B9URmgzvySHq7GBjkHa4Md4tJ5Cee-yZSRT8Hd4WfuxZPghVcI-Wo-uPOuDBnlxI8IGu1TtxbpErMxDyrfg-JvyA"
 *      getinfo:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *            type: string
 *            description: Email of the User
 *
 *        example:
 *           email: "donaldabraham@karunya.edu.in"
 */
// Components used in the responses
/**
 * @swagger
 *  components:
 *    schemas:
 *      signup201:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Signup Procedure of the User
 *        example:
 *            message: 'User Account Created'
 *
 *      signup409:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Exists
 *        example:
 *            message: 'User Already Exists'
 *
 *      signup401a:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Missing Fields
 *        example:
 *            message: 'Required field missing or Username is in use'
 *
 *      signup401b:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Invalid token signature
 *        example:
 *            message: 'Invalid token signature'
 *
 *      signup401c:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Unrecognized data
 *        example:
 *            message: 'Unrecognized data'
 *
 *      signup401d:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Error Message
 *        example:
 *            message: 'Error'
 *
 *      signup500:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Error
 *        example:
 *            message: 'Internal Error'
 *
 *      login200:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Successfully logged in
 *        example:
 *            message: 'Login successful'
 *
 *      login401a:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Does not Exists
 *        example:
 *            message: 'User Does not Exists'
 *
 *      login401b:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Invalid token signature
 *        example:
 *            message: 'Invalid token signature'
 *
 *      login401c:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Unrecognized data
 *        example:
 *            message: 'Unrecognized data'
 *
 *      login401d:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Error Message
 *        example:
 *            message: 'Error'
 *
 *      login500:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Server Error
 *        example:
 *            message: 'Server Error'
 *
 *      logout200:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Logged Out
 *        example:
 *            message: 'Logout successful'
 *
 *      logout500:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Logged Out
 *        example:
 *            message: 'Server Error'
 *
 *      delete200:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Delete User
 *        example:
 *            message: 'Account deleted successfully'
 *
 *      delete409:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: User Not Available
 *        example:
 *            message: 'Account does not exist'
 *
 *      delete401:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Account Not Proper
 *        example:
 *            message: 'Account not sound'
 *
 *
 *      delete500:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Error
 *        example:
 *            message: 'Server Error'
 *
 *      info200:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Getting User Info
 *        example:
 *            email: donaldabraham0001@gmail.com
 *            userName: donald0109
 *            firstName: Donald
 *            lastName: Abraham
 *            picture: https://www.google.com/url?sa=i&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiEtNbT46TrAhWH83MBHQkICcIQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fimage&psig=AOvVaw3t1GT99bhLtGhIYpc4PatV&ust=1597840983437824
 *
 *      info401:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Acoount Not Available
 *        example:
 *            message: 'User Does not Exists'
 *
 *      info500:
 *        type: object
 *        properties:
 *          message:
 *            type: object
 *            description: Error in Server
 *        example:
 *            message: 'Server Error'
 *
 *      Error:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: Error
 *        example:
 *           message: Error message
 */

//  paths with their method and responses
/**
 * @swagger
 * path:
 *  /users/signup:
 *    post:
 *      summary: SIGNUP
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/signup'
 *      responses:
 *        "201":
 *          description: Create a new User
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup201'
 *        "409":
 *          description: User Already Exists
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup409'
 *        "401":
 *          description: Missing fields
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/signup401a'
 *                  - $ref: '#/components/schemas/signup401b'
 *                  - $ref: '#/components/schemas/signup401c'
 *                  - $ref: '#/components/schemas/signup401d'
 *
 *        "500":
 *          description: Missing fields
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup500'
 *
 *  /users/login:
 *    post:
 *      summary: LOGIN
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/login'
 *      responses:
 *        "200":
 *          description: Logged IN
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/login200'
 *
 *        "401":
 *          description: Error logging in
 *          content:
 *            application/json:
 *              schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/login401a'
 *                  - $ref: '#/components/schemas/login401b'
 *                  - $ref: '#/components/schemas/login401c'
 *                  - $ref: '#/components/schemas/login401d'
 *
 *        "500":
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/login500'
 *
 *  /users/logout:
 *    get:
 *      summary: LOGOUT
 *      tags: [User]
 *      responses:
 *        "200":
 *          description: Logged Out
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/logout200'
 *
 *        "500":
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/logout500'
 *
 *  /users/delete:
 *    delete:
 *      summary: DELETE
 *      tags: [User]
 *      responses:
 *        "200":
 *          description: Deleted User
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/delete200'
 *        "409":
 *          description: Account Does not Exists
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/delete409'
 *        "401":
 *          description: Account not Sound
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/delete401'
 *
 *        "500":
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/delete500'
 *
 *  /users/info:
 *    get:
 *      summary: GET INFO
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/getinfo'
 *      responses:
 *        "200":
 *          description: Info
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/info200'
 *
 *        "401":
 *          description: User Does Not Exists
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/info401'
 *
 *        "500":
 *          description: Server Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/info500'
 */
