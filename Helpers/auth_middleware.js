const jwt = require('jsonwebtoken');

module.exports.session = (request, response, next) => {
    let jwtToken;
    const authHeaders = request.headers['authorization'];
    if(authHeaders != undefined) {
        jwtToken = authHeaders.split(" ")[1];
    }
    if(jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "reciperover69420", async (error, payload) => {
            if(error) {
                response.status(401);
                response.send("Invalid JWT Token");
            } else {
                request.username = payload.username;
                next();
            }
        });
    }
};
