public class Week1Basics {
    public static void main(String[] args) {
        String[] names = {"Tractor", "Rotavator", "Seed Drill"};
        double[] rate = {1800.50, 650.00, 500.00};
        boolean[] available = {true, false, true};
        int days = 3;
        for (int i = 0; i < names.length; i++) {
            if (available[i]) {
                System.out.println(names[i] + " available, total for " + days + " days = " + rate[i] * days);
            } else {
                System.out.println(names[i] + " is not available");
            }
        }
        System.out.println("Rate cast to int: " + (int) rate[0]);
    }
}
