const router = require("express").Router();

const { authenticateUser, updateAccessToken, deleteAccessToken } = require("../api/authenticate");

router.post("/authentication", authenticateUser);
router.put("/authentication", updateAccessToken);
router.delete("/authentication/:refresh_token", deleteAccessToken);

module.exports = router;
