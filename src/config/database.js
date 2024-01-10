require('dotenv/config');

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT, DB_PORT, APP_ENV } = process.env;

module.exports = {
    dialect: DB_DIALECT,
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    logging: APP_ENV === "development" ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    },
};
