package fr.appsolaire.api.repository

import fr.appsolaire.api.entity.Installation
import org.springframework.data.jpa.repository.JpaRepository

interface InstallationRepository : JpaRepository<Installation, Long> {

    fun findByUtilisateurId(utilisateurId: Long): List<Installation>

    fun deleteByUtilisateurId(utilisateurId: Long)
}