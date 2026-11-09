package fr.appsolaire.api.dto

import fr.appsolaire.api.entity.Installation
import java.time.Instant

data class InstallationResponse(
    val id: Long?,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val panelType: String,
    val panelCount: Int,
    val peakPowerWc: Double,
    val surfaceM2: Double,
    val orientation: String,
    val tiltDeg: Int,
    val costEur: Double,
    val subsidiesEur: Double,
    /** Cost minus subsidies: the amount used for the payback period. */
    val netCostEur: Double,
    val electricityPriceEurPerKwh: Double,
    val createdAt: Instant
) {
    companion object {
        fun from(i: Installation) = InstallationResponse(
            id = i.id,
            name = i.nom,
            latitude = i.latitude,
            longitude = i.longitude,
            panelType = i.typePanneau,
            panelCount = i.nombrePanneaux,
            peakPowerWc = i.puissanceCreteWc,
            surfaceM2 = i.surfaceM2,
            orientation = i.orientation,
            tiltDeg = i.inclinaisonDeg,
            costEur = i.coutEur,
            subsidiesEur = i.aidesEur,
            netCostEur = i.coutEur - i.aidesEur,
            electricityPriceEurPerKwh = i.prixKwhEur,
            createdAt = i.creeLe
        )
    }
}
