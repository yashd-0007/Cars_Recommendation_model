// In a real application, this would be a MongoDB or PostgreSQL connection.
// For now, we use a simple JavaScript array to mock our users data.

const users = [
  {
    id: 1,
    name: "Yash Dongare",
    email: "yash@example.com",
    password: "123456", // In production, this must be a hashed password (e.g. bcrypt)
    joinDate: "2024-01-15T10:00:00Z",
    role: "Premium Member"
  },
  {
    id: 2,
    name: "Demo User",
    email: "demo@car-genius.com",
    password: "password123",
    joinDate: "2024-02-01T14:30:00Z",
    role: "Standard Member"
  }
];

module.exports = users;
