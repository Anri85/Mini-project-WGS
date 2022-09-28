/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("attendance", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        fullname: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        date: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        status: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        time_in: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        time_out: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        user_id: {
            type: "VARCHAR(50)",
            notNull: true,
        },
    });

    // memberikan constraint foreign key pada kolom album_id terhadap albums.id
    pgm.addConstraint("attendance", "fk_attendance.user_id_users.id", "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
    pgm.dropTable("attendance");
};
