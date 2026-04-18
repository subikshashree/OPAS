package com.opas.repository;

import com.opas.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByToId(String toId);
    List<Message> findByFromId(String fromId);
}
