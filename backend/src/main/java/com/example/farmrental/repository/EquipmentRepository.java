package com.example.farmrental.repository;
import com.example.farmrental.entity.Equipment; import org.springframework.data.domain.Page; import org.springframework.data.domain.Pageable; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.Query; import org.springframework.data.repository.query.Param;
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
	@Query("select e from Equipment e where e.archived = false and (:category = '' or e.category = :category) and (:search = '' or lower(e.name) like lower(concat('%', :search, '%'))) order by e.name")
	Page<Equipment> searchAvailable(@Param("search") String search, @Param("category") String category, Pageable pageable);
}
