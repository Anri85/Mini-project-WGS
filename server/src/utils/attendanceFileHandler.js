const fs = require("fs");

// fungsi yang digunakan untuk merubah request base64 menjadi sebuah file
exports.attendanceFileHandler = (base64) => {
    // bersihkan data base64 dari string yang tidak valid
    const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
    // tentukan lokasi penyimpanan file
    const path = `${process.cwd()}/public/attendance`;
    const filename = `attendance-${Date.now().toString()}.jpeg`;

    // jika lokasi penyimpanan tidak tersedia maka buat lokasi penyimpanan file tersebut
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    // rubah string base64 menjadi sebuah file dengan module fs.writeFile
    fs.writeFile(`${process.cwd()}/public/attendance/${filename}`, base64Data, "base64", (error) => {
        if (error) console.log(error);
    });
    return filename;
};
