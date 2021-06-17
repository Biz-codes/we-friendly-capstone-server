module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://biz@localhost/we_friendly',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://biz@localhost/we_friendly_test',
  JWT_SECRET: process.env.JWT_SECRET || 'Hazel',
  // API_TOKEN: process.env.API_TOKEN || '',
  CLIENT_ORIGIN: '*',
  PGSSLMODE: "require"
}