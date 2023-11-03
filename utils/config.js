// const SECRET_KEY = "JWT_SECRET";
const { SECRET_KEY = "JWT_SECRET" } = process.env;

module.exports = {
  SECRET_KEY,
};
