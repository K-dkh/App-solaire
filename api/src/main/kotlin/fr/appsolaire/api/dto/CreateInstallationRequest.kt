package fr.appsolaire.api.dto

import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size

/**
 * Body of POST /api/v1/installations. Field names follow the contract expected by the
 * mobile app (see the front README). Fields are nullable so that a missing field gives a
 * clear validation message instead of a deserialization error.
 */
data class CreateInstallationRequest(

    @field:Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
    val name: String? = null,

    @field:NotNull(message = "La latitude est obligatoire")
    @field:DecimalMin(value = "-90", message = "La latitude doit être comprise entre -90 et 90")
    @field:DecimalMax(value = "90", message = "La latitude doit être comprise entre -90 et 90")
    val latitude: Double?,

    @field:NotNull(message = "La longitude est obligatoire")
    @field:DecimalMin(value = "-180", message = "La longitude doit être comprise entre -180 et 180")
    @field:DecimalMax(value = "180", message = "La longitude doit être comprise entre -180 et 180")
    val longitude: Double?,

    @field:NotNull(message = "Le type de panneau est obligatoire")
    @field:Pattern(
        regexp = "monocrystalline|polycrystalline|thin-film",
        message = "Type de panneau inconnu (monocrystalline, polycrystalline ou thin-film)"
    )
    val panelType: String?,

    @field:NotNull(message = "Le nombre de panneaux est obligatoire")
    @field:Min(value = 1, message = "Le nombre de panneaux doit être d'au moins 1")
    val panelCount: Int?,

    @field:NotNull(message = "La puissance crête est obligatoire")
    @field:Positive(message = "La puissance crête (Wc) doit être strictement positive")
    val peakPowerWc: Double?,

    @field:NotNull(message = "La surface est obligatoire")
    @field:Positive(message = "La surface (m²) doit être strictement positive")
    val surfaceM2: Double?,

    @field:NotNull(message = "L'orientation est obligatoire")
    @field:Pattern(
        regexp = "N|NE|E|SE|S|SW|W|NW",
        message = "Orientation inconnue (N, NE, E, SE, S, SW, W ou NW)"
    )
    val orientation: String?,

    @field:NotNull(message = "L'inclinaison est obligatoire")
    @field:Min(value = 0, message = "L'inclinaison doit être comprise entre 0 et 90°")
    @field:Max(value = 90, message = "L'inclinaison doit être comprise entre 0 et 90°")
    val tiltDeg: Int?
)
