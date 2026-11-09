package fr.appsolaire.api.repository

import fr.appsolaire.api.entity.Utilisateur
import org.springframework.data.jpa.repository.JpaRepository

interface UtilisateurRepository : JpaRepository<Utilisateur, Long> {

    fun findByEmail(email: String): Utilisateur?

    fun existsByEmail(email: String): Boolean
}