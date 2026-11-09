package fr.appsolaire.api.service

import fr.appsolaire.api.dto.CreateInstallationRequest
import fr.appsolaire.api.entity.Installation
import fr.appsolaire.api.repository.InstallationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class InstallationService(private val installationRepository: InstallationRepository) {

    /**
     * Creates an installation for the given user. The request is assumed to be validated,
     * so required fields are non-null. Coordinates are rounded to ~1 km (GDPR).
     */
    fun create(utilisateurId: Long, request: CreateInstallationRequest): Installation {
        val cost = request.costEur!!
        val subsidies = request.subsidiesEur ?: 0.0
        if (subsidies > cost) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Les aides ne peuvent pas dépasser le coût de l'installation"
            )
        }
        return installationRepository.save(
            Installation(
                utilisateurId = utilisateurId,
                nom = request.name?.trim().takeUnless { it.isNullOrEmpty() } ?: "Mon installation",
                latitude = roundToAboutOneKm(request.latitude!!),
                longitude = roundToAboutOneKm(request.longitude!!),
                typePanneau = request.panelType!!,
                nombrePanneaux = request.panelCount!!,
                puissanceCreteWc = request.peakPowerWc!!,
                surfaceM2 = request.surfaceM2!!,
                orientation = request.orientation!!,
                inclinaisonDeg = request.tiltDeg!!,
                coutEur = cost,
                aidesEur = subsidies,
                prixKwhEur = request.electricityPriceEurPerKwh!!
            )
        )
    }

    companion object {
        /** 2 decimals of a degree is about 1.1 km of latitude. */
        fun roundToAboutOneKm(degrees: Double): Double =
            BigDecimal.valueOf(degrees).setScale(2, RoundingMode.HALF_UP).toDouble()
    }
}
