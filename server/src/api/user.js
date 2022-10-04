const ClientError = require("../exceptions/ClientError");

const { addUser, selectUsers, selectSingleUser, deleteUser, updateUser, changeProfile } = require("../services/userService");

exports.getAllUsers = async (req, res) => {
    try {
        // jika user yang mengakses bukan super admin maka akses tersebut dilarang
        if (req.decoded.role !== "Super admin") {
            return res.status(403).json({ message: "Forbidden to access this resource", status: false });
        }
        const users = await selectUsers();
        return res.status(200).json({ message: "Success", status: true, data: users });
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

exports.getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.decoded.id;
        // jika terdapat parameter id maka cari user berdasarkan id tersebut
        if (id) {
            const user = await selectSingleUser(id);
            return res.status(200).json({ message: "Success", status: true, data: user });
        } else {
            // jika tidak ada maka cari user berdasarkan user yang sedang login
            const user = await selectSingleUser(userId);
            return res.status(200).json({ message: "Success", status: true, data: user });
        }
    } catch (error) {
        // jika error merupakan kesalahan pengguna
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({ message: error.message, status: false });
        }
        // jika server mengalami error
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};

exports.createUser = async (req, res) => {
    try {
        // jika user yang mengakses bukan super admin maka akses tersebut dilarang
        if (req.decoded.role !== "Super admin") {
            return res.status(403).json({ message: "Forbidden to access this resource", status: false });
        }
        // jika user merupakan super admin maka diperbolehkan mengakses resource
        const userId = await addUser(req.decoded.role, req.body, req.file.filename);
        return res.status(201).json({ message: "Success", status: true, data: userId });
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

exports.editUser = async (req, res) => {
    try {
        if (req.decoded.role === "Super admin") {
            // jika user yang melakukan update adalah super admin
            const { fullname, role, division, position, gender } = req.body;
            // ambil id user lain
            const { id } = req.params;
            // maka user tersebut dapat mengupdate sebagian besar data dan user lain
            await updateUser(id, req.decoded.id, req.decoded.role, { fullname, role, division, position, gender });
            return res.status(200).json({ message: "Success", status: true });
        }
        // jika user yang melakukan pengeditan bukan super admin hanya bisa melakukan update terhadap dirinya sendiri dan mengganti gambar
        const { image_url } = req.body;
        await updateUser(req.decoded.id, req.decoded.role, image_url);
        return res.status(200).json({ message: "Success", status: true });
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

exports.removeUser = async (req, res) => {
    try {
        // jika user yang mengakses bukan super admin maka akses tersebut dilarang
        if (req.decoded.role !== "Super admin") {
            return res.status(403).json({ message: "Forbidden to access this resource", status: false });
        }
        // jika user merupakan super admin maka diperbolehkan mengakses resource dan menghapus user
        const { id } = req.params;
        await deleteUser(req.decoded.role, id);
        return res.status(200).json({ message: "Success", status: true });
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

exports.uploadImage = async (req, res) => {
    try {
        // jika ada file yang diupload
        if (req.file) {
            const { id } = req.decoded;
            const image = req.file.filename;
            // update imagge_url user yang melakukan upload tersebut
            await changeProfile(id, image);
            return res.status(200).json({ message: "Success", status: true });
        }
        return res.status(400).json({ message: "No file uploaded", status: false });
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
