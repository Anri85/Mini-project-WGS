/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("logs", {
        log: {
            type: "TEXT",
        },
        caused_by: {
            type: "VARCHAR(50)",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("logs");
};
