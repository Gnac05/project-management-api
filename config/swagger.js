const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Project Management API",
            version: "1.0.0",
            description: "API de gestion de projets avec Express.js et MongoDB",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Serveur local",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Scanner tous les fichiers de routes
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};

module.exports = setupSwagger;
