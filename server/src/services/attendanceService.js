const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const pool = new Pool();

// import exceptions
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

// select attendance
const selectAttendance = async (id) => {
    // jika terdapat parameter id ambil detail attendance beserta user yang melakukannya
    if (id) {
        // merancang perintah query
        const order = {
            text: `SELECT users.fullname, users.division, users.position, attendance.date, attendance.status, attendance.time_in,
            attendance.time_out FROM attendance JOIN users ON users.id = attendance.user_id WHERE attendance.id = $1`,
            values: [id],
        };
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Attendance not found");
        }
        return result.rows;
    } else {
        // jika tidak terdapat id maka ambil seluruh data attendance
        const result = await pool.query("SELECT * FROM attendance");
        return result.rows;
    }
};

// mencari attendance berdasarkan id
const findAttendance = async (id, date) => {
    const order = {
        text: "SELECT fullname, status FROM attendance WHERE id = $1 AND date = $2",
        values: [id, date],
    };
    const result = await pool.query(order);
    if (!result.rowCount) {
        throw new NotFoundError("Attendance not found");
    }
    return result.rows[0];
};

// membuat attendance
const insertAttendance = async (data) => {
    const id = `attendance-${nanoid(16)}`;
    // merancang perintah query
    const order = {
        text: "INSERT INTO attendance VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        values: [id, data.fullname, data.date, data.status, data.time_in, data.time_out, data.user_id],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rows[0].id) {
        throw new InvariantError("Attendace creation failed");
    }
};

// mengubah attendance sebelumnya
const updateAttendance = async (id, data) => {
    // jika isUpdate bernilai true maka attendance tersebut dirubah oleh seorang admin atau super admin
    if (data.isUpdate) {
        // merancang perintah query
        const order = {
            text: "UPDATE attendance SET status = $1 WHERE id = $3 RETURNING id",
            values: [data.status, id],
        };
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rows[0].id) {
            throw new InvariantError("Attendance change failed");
        }
        // jika isUpdate tidak bernilai true maka attendance dilakukan oleh user
    } else {
        // merancang perintah query
        const order = {
            text: "UPDATE attendance SET status = $1, time_out = $2 WHERE id = $3 RETURNING id",
            values: [data.status, data.time_out, id],
        };
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rows[0].id) {
            throw new InvariantError("Attendance change failed");
        }
    }
};

// delete attendance
const removeAttendance = async (id, role) => {
    // hanya admin dan super admin yang dapat menghapus attendance
    if (role === "admin" || role === "super admin") {
        const order = {
            text: "DELETE FROM attendance WHERE id = $1 RETURNING id",
            values: [id],
        };
        const result = await pool.query(order);
        if (!result.rowCount) {
            throw new InvariantError("Attendance removal failed");
        }
    }
    throw new AuthorizationError("Forbidden to access this resource");
};

module.exports = { selectAttendance, insertAttendance, updateAttendance, findAttendance, removeAttendance };
