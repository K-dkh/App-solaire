package fr.appsolaire.api.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "utilisateurs")
class Utilisateur(

    @Column(nullable = false, unique = true)
    var email: String = "",

    @Column(name = "mot_de_passe", nullable = false)
    var motDePasse: String = "",

    @Column(nullable = false)
    var nom: String = "",

    @Column(nullable = false)
    var prenom: String = "",

    @Column(name = "consentement_rgpd", nullable = false)
    var consentementRgpd: Boolean = false,

    @Column(name = "date_consentement", nullable = false)
    var dateConsentement: Instant = Instant.now(),

    @Column(name = "cree_le", nullable = false)
    val creeLe: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)