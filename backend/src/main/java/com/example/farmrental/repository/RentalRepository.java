package com.example.farmrental.repository;
import com.example.farmrental.entity.Rental; import java.time.LocalDate; import java.util.List;
import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param;
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByFarmerIdOrderByIdDesc(Long farmerId);
    List<Rental> findAllByOrderByIdDesc();
    @Query("select count(r) from Rental r where r.equipment.id = :eid and r.status in ('PENDING','APPROVED') and r.startDate <= :end and r.endDate >= :start")
    long countOverlapping(@Param("eid") Long eid, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
