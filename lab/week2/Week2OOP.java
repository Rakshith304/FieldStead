public class Week2OOP {
    public static void main(String[] args) {
        Item[] items = {new Tractor(1800), new Seeder(500)};
        for (Item i : items) System.out.println(i.getName() + " 3 days = " + i.total(3) + ", with 10% off = " + i.total(3, 10));
        try { new Seeder(-5); } catch (IllegalArgumentException e) { System.out.println("Caught: " + e.getMessage()); }
        System.out.println("Initials: " + "Farm Equipment Rental".replaceAll("[a-z ]", ""));
    }
}

abstract class Item {
    private final String name; protected double dailyRate;
    Item(String name, double dailyRate) { this.name = name; setDailyRate(dailyRate); }
    String getName() { return name; }
    void setDailyRate(double r) { if (r <= 0) throw new IllegalArgumentException("Rate must be positive"); dailyRate = r; }
    abstract double total(int days);
    double total(int days, double discountPercent) { return total(days) * (1 - discountPercent / 100); } // overloading
}
class Tractor extends Item {
    Tractor(double r) { super("Tractor", r); }
    double total(int days) { return dailyRate * days + 500; } // fuel/delivery fee: polymorphism
}
class Seeder extends Item {
    Seeder(double r) { super("Seed Drill", r); }
    double total(int days) { return dailyRate * days; }
}
