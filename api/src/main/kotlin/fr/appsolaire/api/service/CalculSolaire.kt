package fr.appsolaire.api.service

import fr.appsolaire.api.entity.Installation

data class RendementJour(val date: String, val irradiationKwhM2: Double, val productionKwh: Double)

object CalculSolaire {

    private const val RENDEMENT_SYSTEME = 0.80 // pertes onduleur, câbles, température...

    private fun rendementPanneau(type: String): Double = when (type) {
        "monocrystalline" -> 0.20
        "polycrystalline" -> 0.16
        "thin-film" -> 0.12
        else -> 0.16
    }

    private fun facteurOrientation(orientation: String): Double = when (orientation) {
        "S" -> 1.0
        "SE", "SW" -> 0.95
        "E", "W" -> 0.85
        "NE", "NW" -> 0.70
        "N" -> 0.60
        else -> 0.90
    }

    fun calculer(installation: Installation, previsions: List<IrradiationJour>): List<RendementJour> {
        val facteur = rendementPanneau(installation.typePanneau) *
                RENDEMENT_SYSTEME *
                facteurOrientation(installation.orientation)
        return previsions.map {
            RendementJour(
                date = it.date,
                irradiationKwhM2 = it.kwhParM2,
                productionKwh = it.kwhParM2 * installation.surfaceM2 * facteur
            )
        }
    }
}