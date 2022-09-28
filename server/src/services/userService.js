const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const pool = new Pool();

// import exceptions
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthenticationError = require("../exceptions/AuthenticationError");
const AuthorizationError = require("../exceptions/AuthorizationError");

// select user
const selectUser = async (id) => {
    // jika terdapat id maka ambil user berdasarkan id tersebut
    if (id) {
        // merancang perintah query
        const order = {
            text: "SELECT fullname, role, division, position, image_url, username FROM users WHERE id = $1",
            values: [id],
        };
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("User not found");
        }
        return result.rows[0];
    }
    // jika tidak terdapat id maka ambil semua data user
    const result = await pool.query("SELECT id, fullname, role, division, position, image_url FROM users");
    return result.rows;
};

// tambah seorang user
const addUser = async (userRole, { fullname, username, password, role, division, position }, image_url) => {
    // cek role user yang melakukan create
    if (userRole !== "Super admin") {
        throw new AuthorizationError("Forbidden to access this resource");
    }
    // cek jika username yang dimasukan sudah terdaftar
    const isTakenUsername = await pool.query("SELECT username FROM users WHERE username = $1", [username]);
    // jika nama sudah ada maka berikan error
    if (isTakenUsername.rows.length > 0) {
        throw new InvariantError("Username is taken");
    }
    const id = `user-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 10);
    // merancang perintah query
    const order = {
        text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
        values: [id, fullname, username, hashPassword, role, division, position, image_url],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new InvariantError("User addition failed");
    }
    return result.rows[0].id;
};

// update user
const updateUser = async (id, userId, role, data) => {
    let order;
    // cek role user yang melakukan update
    if (role === "Super admin") {
        if (id) {
            // merancang perintah query
            order = {
                text: "UPDATE users SET fullname = $1, role = $2, division = $3, position = $4 WHERE id = $5 RETURNING id",
                values: [data.fullname, data.role, data.division, data.position, id],
            };
        } else {
            order = {
                text: "UPDATE users SET fullname = $1, role = $2, division = $3, position = $4 WHERE id = $5 RETURNING id",
                values: [data.fullname, data.role, data.division, data.position, userId],
            };
        }
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rowCount) {
            throw new InvariantError("User change failed");
        }
        return;
    }
    // merancang perintah query
    order = {
        text: "UPDATE users SET image_url = $1 WHERE id = $2 RETURNING id",
        values: [data, id],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new InvariantError("User change failed");
    }
};

const changeProfile = async (id, data) => {
    // merancang perintah query
    const order = {
        text: "UPDATE users SET image_url = $1 WHERE id = $2 RETURNING id",
        values: [data, id],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new InvariantError("Profile change failed");
    }
};

// hapus seorang user
const deleteUser = async (role, id) => {
    // cek role user yang melakukan delete
    if (role !== "Super admin") {
        throw new AuthorizationError("Forbidden to access this resource");
    }
    const order = {
        text: "DELETE FROM users WHERE id = $1 RETURNING id",
        values: [id],
    };
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new InvariantError("User removal failed");
    }
};

// jika user melakukan LOGIN
const verifyUser = async ({ username, password }) => {
    // merancang perintah query
    const order = {
        text: "SELECT id, fullname, role, password FROM users WHERE username = $1",
        values: [username],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new AuthenticationError("Invalid credentials");
    }
    // komparasikan password
    const comparedPassword = await bcrypt.compare(password, result.rows[0].password);
    if (!comparedPassword || comparedPassword === false) {
        throw new AuthenticationError("Invalid credentials");
    }
    return { id: result.rows[0].id, fullname: result.rows[0].fullname, role: result.rows[0].role };
};

module.exports = { addUser, selectUser, updateUser, deleteUser, verifyUser, changeProfile };
