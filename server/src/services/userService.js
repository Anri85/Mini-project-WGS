const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const pool = new Pool();
const fs = require("fs");

// import exceptions
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthenticationError = require("../exceptions/AuthenticationError");
const AuthorizationError = require("../exceptions/AuthorizationError");

// select user
const selectUsers = async (fullname) => {
    let result;
    if (fullname) {
        result = await pool.query(`SELECT id, fullname, role, division, position, gender, image_url FROM users WHERE lower(fullname) LIKE '%${fullname.toLowerCase()}%'`);
        return result.rows;
    }
    // jika tidak terdapat id maka ambil semua data user
    result = await pool.query("SELECT id, fullname, role, division, position, gender, image_url FROM users");
    return result.rows;
};

const selectSingleUser = async (id) => {
    // merancang perintah query
    const order = {
        text: "SELECT id, fullname, role, division, position, gender, image_url, username FROM users WHERE id = $1",
        values: [id],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new NotFoundError("User not found");
    }
    return result.rows[0];
};

const selectSingleAnotherUser = async (id) => {
    // merancang perintah query
    const order1 = {
        text: "SELECT username, fullname, role, division, position, gender, image_url FROM users WHERE id = $1",
        values: [id],
    };
    const order2 = {
        text: "SELECT id, date, status, time_in, time_out FROM attendance WHERE user_id = $1",
        values: [id],
    };
    // mengeksekusi query
    const result1 = await pool.query(order1);
    const result2 = await pool.query(order2);

    const data = { ...result1.rows[0], attendance: result2.rows };
    if (!result1.rowCount) {
        throw new NotFoundError("User not found");
    }
    return data;
};

// tambah seorang user
const addUser = async (userRole, { fullname, username, password, role, division, position, gender }, image_url) => {
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
        text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
        values: [id, fullname, username, hashPassword, role, division, position, gender, image_url],
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
    if (role === "Super admin" || role === "Admin") {
        if (id) {
            // merancang perintah query
            order = {
                text: "UPDATE users SET fullname = $1, role = $2, division = $3, position = $4, gender = $5 WHERE id = $6 RETURNING id",
                values: [data.fullname, data.role, data.division, data.position, data.gender, id],
            };
        } else {
            order = {
                text: "UPDATE users SET fullname = $1, role = $2, division = $3, position = $4, gender = $5 WHERE id = $6 RETURNING id",
                values: [data.fullname, data.role, data.division, data.position, data.gender, userId],
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
    const order1 = {
        text: "SELECT image_url FROM users WHERE id = $1",
        values: [id],
    };
    const result1 = await pool.query(order1);
    if (result1.rows[0].image_url !== "") {
        fs.unlink(`${process.cwd()}/public/images/${result1.rows[0].image_url}`, (err) => {
            if (err) {
                throw new InvariantError("Profile change failed");
            }
        });
    }
    // merancang perintah query
    const order2 = {
        text: "UPDATE users SET image_url = $1 WHERE id = $2 RETURNING id",
        values: [data, id],
    };
    // mengeksekusi query
    const result2 = await pool.query(order2);
    if (!result2.rowCount) {
        throw new InvariantError("Profile change failed");
    }
};

// hapus seorang user ataupun beberapa user
const deleteUser = async (id) => {
    const result1 = await pool.query(`SELECT image_url FROM users WHERE id = ANY('{${id}}'::text[])`);
    if (result1.rowCount) {
        result1.rows.forEach((url) => {
            fs.unlink(`${process.cwd()}/public/images/${url.image_url}`, (err) => {
                if (err) {
                    throw new InvariantError("User removal failed");
                }
            });
        });
    }
    const result2 = await pool.query(`DELETE FROM users WHERE id = ANY('{${id}}'::text[]) RETURNING id`);
    if (!result2.rowCount) {
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

module.exports = { addUser, selectUsers, selectSingleUser, selectSingleAnotherUser, updateUser, deleteUser, verifyUser, changeProfile };
