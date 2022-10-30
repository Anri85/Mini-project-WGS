const ClientError = require("../exceptions/ClientError");

const {
    insertAttendance,
    selectAttendance,
    updateAttendance,
    removeAttendance,
    findAttendance,
    getAttendanceStatistic,
    filterAttendance,
} = require("../services/attendanceService");
const { attendanceFileHandler } = require("../utils/attendanceFileHandler");

// mengambil list attendance oleh user
exports.getAttendanceList = async (req, res) => {
    try {
        if (req.decoded.role === "Super admin" || req.decoded.role === "Admin") {
            if (req.params.filter !== "nothing") {
                const arr = req.params.filter.split(",");
                const attendance = await filterAttendance(arr);
                return res.status(200).json({ message: "Success", status: true, data: attendance });
            }
            const attendance = await selectAttendance();
            return res.status(200).json({ message: "Success", status: true, data: attendance });
        }
        return res.status(403).json({ message: "Forbidden to access this resource", status: false });
    } catch (error) {
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

exports.getDetailAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const detailAttendance = await findAttendance(id);
        return res.status(200).json({ message: "Success", status: true, data: detailAttendance });
    } catch (error) {
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

// get detail attendance by all user
exports.getUserAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await selectAttendance(id);
        return res.status(200).json({ message: "Success", status: true, data: attendance });
    } catch (error) {
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
    try {
        // cek jika id attendance tersedia (belum pernah absen time_in)
        if (id) {
            // jika tersedia maka lakukan update attendance berdasarkan id tersebut
            const attendanceId = await updateAttendance(
                id,
                {
                    status: "Unattended",
                    time_out: rawDate.toLocaleString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    }),
                },
                { isUpdate: false }
            );
            return res.status(201).json({ message: "Success", status: true, data: { id: attendanceId } });
        }
        // jika tidak tersedia maka create attendance baru (belum absen pada hari itu) juga proses string base64 dari frontend
        const filename = attendanceFileHandler(req.body.base64);
        const data = await insertAttendance({
            status: "Attended",
            fullname: req.decoded.fullname,
            time_in: rawDate.toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }),
            time_out: "",
            attendance_image: filename,
            user_id: req.decoded.id,
        });
        return res.status(201).json({ message: "Success", status: true, data });
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
        // cek apakah user yang mengedit attendance merupakan admin atau super admin
        if (role === "Admin" || role === "Super admin") {
            // ambil id attendance
            const { id } = req.params;
            // update attendance berdasarkan id
            await updateAttendance(id, req.body, { isUpdate: true });
            return res.status(200).json({ message: "Success", status: true });
        }
        return res.status(403).json({ message: "Forbidden to access this resource", status: false });
    } catch (error) {
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
        return res.status(200).json({ message: "Success", status: true });
    } catch (error) {
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

exports.attendanceAnalysis = async (req, res) => {
    try {
        const { users, absences, completed } = await getAttendanceStatistic();
        const withoutExp = Number(users) - Number(absences);
        return res.status(200).json({ message: "success", status: true, data: { users, absences, completed, withoutExp } });
    } catch (error) {
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};
