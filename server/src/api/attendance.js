const ClientError = require("../exceptions/ClientError");

const { insertAttendance, selectAttendance, updateAttendance, removeAttendance } = require("../services/attendanceService");

// mengambil list attendance oleh user
exports.getAttendanceList = async (req, res) => {
    try {
        if (req.decoded.role === "Super admin") {
            const attendance = await selectAttendance();
            return res.status(200).json({ message: "Success", status: true, data: attendance });
        }
        return res.status(403).json({ message: "Forbidden to access this resource", status: false });
    } catch (error) {
        console.error(error);
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

// membuat kehadiran atau mengupdate kehadiran yang ada
exports.createAttendance = async (req, res) => {
    const { id } = req.params;
    const rawDate = new Date();
    const date = rawDate.toISOString().split("T")[0];
    try {
        // cek jika id attendance tersedia (belum pernah absen time_in)
        if (id) {
            // jika tersedia maka lakukan update attendance berdasarkan id tersebut
            const attendanceId = await updateAttendance(id, { status: "Unattended", time_out: rawDate.toLocaleTimeString() });
            return res.status(201).json({ message: "Success", status: true, data: { id: attendanceId } });
        }
        // jika tidak tersedia maka create attendance baru (belum absen pada hari itu)
        const data = await insertAttendance({
            status: "Attended",
            fullname: req.decoded.fullname,
            date,
            time_in: rawDate.toLocaleTimeString(),
            time_out: "",
            user_id: req.decoded.id,
        });
        return res.status(201).json({ message: "Success", status: true, data });
    } catch (error) {
        console.error(error);
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

// get detail attendance by all user
exports.getDetailAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await selectAttendance(id);
        return res.status(200).json({ message: "Success", status: true, data: attendance });
    } catch (error) {
        console.log(error);
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

// admin dan super admin dapat mengupdate attendance
exports.editAttendance = async (req, res) => {
    try {
        const { role } = req.decoded;
        const { status, time_in, time_out } = req.body;
        // cek apakah user yang mengedit attendance merupakan admin atau super admin
        if (role === "admin" || role === "super admin") {
            // ambil id attendance
            const { id } = req.params;
            // update attendance berdasarkan id
            await updateAttendance(id, { status, isUpdate: true });
            return res.status(200).json({ message: "Success", status: true });
        }
        return res.status(403).json({ message: "Forbidden to access this resource", status: false });
    } catch (error) {
        console.error(error);
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

// admin dan seuper admin dapat menghapus attendance
exports.deleteAttendance = async (req, res) => {
    try {
        // ambil id attendance dan role user
        const { id } = req.params;
        const { role } = req.decoded;
        // hapus attendance berdasarkan id
        await removeAttendance(id, role);
        return res.status(200).json({ message: "Success", status: false });
    } catch (error) {
        console.error(error);
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};
