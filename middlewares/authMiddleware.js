const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les infos de l'utilisateur au req
        next(); // Passe au middleware suivant
    } catch (error) {
        return res.status(400).json({ message: "Token invalide." });
    }
};

module.exports = authMiddleware;
