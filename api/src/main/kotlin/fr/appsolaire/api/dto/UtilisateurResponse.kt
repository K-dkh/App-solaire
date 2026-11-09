package fr.appsolaire.api.dto

import fr.appsolaire.api.entity.Utilisateur
import java.time.Instant

data class UtilisateurResponse(
    val id: Long?,
    val nom: String,
    val email: String,
    val creeLe: Instant
) {
    companion object {
        fun from(u: Utilisateur) = UtilisateurResponse(
            id = u.id,
            nom = u.nom,
            email = u.email,
            creeLe = u.creeLe
        )
    }
}