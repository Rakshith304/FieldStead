import java.io.*; import java.nio.file.*; import java.util.*;
public class Week3Collections {
    public static void main(String[] args) throws Exception {
        List<String> list = new ArrayList<>(List.of("Tractor", "Rotavator", "Tractor", "Seed Drill"));
        Set<String> unique = new HashSet<>(list);
        Map<String, Double> rates = new HashMap<>(Map.of("Tractor", 1800.0, "Rotavator", 650.0, "Seed Drill", 500.0));
        System.out.println("List size " + list.size() + ", unique " + unique.size());
        Iterator<String> it = list.iterator();
        while (it.hasNext()) if (it.next().equals("Tractor")) it.remove();
        System.out.println("After iterator removal: " + list);
        rates.entrySet().stream().filter(e -> e.getValue() > 600).map(Map.Entry::getKey).sorted().forEach(n -> System.out.println("Above 600: " + n));
        Path file = Files.createTempFile("equipment", ".csv");
        try (PrintWriter w = new PrintWriter(file.toFile())) { rates.forEach((k, v) -> w.println(k + "," + v)); }
        System.out.println("Exported lines: " + Files.readAllLines(file).size());
        Files.delete(file);
        int[] counter = {0};
        Thread a = new Thread(() -> { for (int i = 0; i < 1000; i++) synchronized (counter) { counter[0]++; } });
        Thread b = new Thread(() -> { for (int i = 0; i < 1000; i++) synchronized (counter) { counter[0]++; } });
        a.start(); b.start(); a.join(); b.join();
        System.out.println("Thread-safe counter: " + counter[0]);
    }
}
