import java.math.BigDecimal; import java.sql.*;
/** Standalone lab (not production persistence). Needs MySQL connector jar and the backend run once so the tables exist.
 *  javac JdbcDemo.java && java -cp .:mysql-connector-j.jar JdbcDemo */
public class JdbcDemo {
    public static void main(String[] args) {
        String url = System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/farm_rental?serverTimezone=UTC");
        String sql = "SELECT id, name, daily_rate FROM equipment WHERE daily_rate <= ? ORDER BY daily_rate"; // PreparedStatement prevents SQL injection
        try (Connection c = DriverManager.getConnection(url, System.getenv().getOrDefault("DB_USERNAME", "root"), System.getenv().getOrDefault("DB_PASSWORD", ""));
             PreparedStatement p = c.prepareStatement(sql)) {
            p.setBigDecimal(1, new BigDecimal("1000"));
            try (ResultSet r = p.executeQuery()) {
                while (r.next()) System.out.println(r.getLong("id") + " | " + r.getString("name") + " | " + r.getBigDecimal("daily_rate"));
            }
        } catch (SQLException e) { System.out.println("Database error: " + e.getMessage()); }
    }
}
