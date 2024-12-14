const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors( {origin: true}));

const {createUser} = require("./callableFunctions/UserCrud");

exports.createUser = createUser;