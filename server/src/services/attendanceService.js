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
            text: `SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC`,
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
        const result = await pool.query("SELECT * FROM attendance ORDER BY date DESC");
        return result.rows;
    }
};

// mencari attendance berdasarkan id
const findAttendance = async (id) => {
    const order = {
        text: `SELECT users.id AS user_id, users.fullname, users.division, users.position, users.role, attendance.id, attendance.date, attendance.status, attendance.time_in,
        attendance.time_out, attendance.attendance_image FROM attendance JOIN users ON users.id = attendance.user_id WHERE attendance.id = $1`,
        values: [id],
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
        text: "INSERT INTO attendance VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        values: [id, data.fullname, data.date, data.status, data.time_in, data.time_out, data.attendance_image, data.user_id],
    };
    // mengeksekusi query
    const result = await pool.query(order);
    if (!result.rows[0].id) {
        throw new InvariantError("Attendace creation failed");
    }
    return result.rows[0];
};

// mengubah attendance sebelumnya
const updateAttendance = async (id, data, { isUpdate }) => {
    // jika isUpdate bernilai true maka attendance tersebut dirubah oleh seorang admin atau super admin
    if (isUpdate) {
        // jika data status tidak bernilai sama dengan data prevStatus
        if (data.status !== data.prevStatus) {
            // maka artinya status attendance dirubah oleh admin dan akan menggenerate time_out secara otomatis
            data.time_out = new Date().toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });
        }
        if (data.time_out === "") {
            data.status = "Attended";
        }
        // merancang perintah query
        const order = {
            text: "UPDATE attendance SET status = $1, time_in = $2, time_out = $3 WHERE id = $4 RETURNING id",
            values: [data.status, data.time_in, data.time_out, id],
        };
        // mengeksekusi query
        const result = await pool.query(order);
        if (!result.rows[0].id) {
            throw new InvariantError("Attendance change failed");
        }
        return result.rows[0].id;
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
        return result.rows[0].id;
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
