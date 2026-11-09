package fr.appsolaire.api.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/**
 * A solar installation owned by a user.
 * Only coordinates rounded to ~1 km are stored (GDPR data minimisation): no exact address.
 */
@Entity
@Table(name = "installations")
class Installation(

    @Column(name = "utilisateur_id", nullable = false)
    val utilisateurId: Long = 0,

    @Column(nullable = false)
    var nom: String = "Mon installation",

    @Column(nullable = false)
    var latitude: Double = 0.0,

    @Column(nullable = false)
    var longitude: Double = 0.0,

    @Column(name = "type_panneau", nullable = false)
    var typePanneau: String = "",

    @Column(name = "nombre_panneaux", nullable = false)
    var nombrePanneaux: Int = 0,

    @Column(name = "puissance_crete_wc", nullable = false)
    var puissanceCreteWc: Double = 0.0,

    @Column(name = "surface_m2", nullable = false)
    var surfaceM2: Double = 0.0,

    @Column(nullable = false)
    var orientation: String = "S",

    @Column(name = "inclinaison_deg", nullable = false)
    var inclinaisonDeg: Int = 0,

    @Column(name = "cree_le", nullable = false)
    val creeLe: Instant = Instant.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)
