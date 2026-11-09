package fr.appsolaire.api.controller

import fr.appsolaire.api.dto.CreateInstallationRequest
import fr.appsolaire.api.dto.InstallationResponse
import fr.appsolaire.api.repository.InstallationRepository
import fr.appsolaire.api.repository.UtilisateurRepository
import fr.appsolaire.api.service.CalculSolaire
import fr.appsolaire.api.service.InstallationService
import fr.appsolaire.api.service.MeteoService
import fr.appsolaire.api.service.RendementJour
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.net.URI

@RestController
@RequestMapping("/api/v1/installations")
class InstallationController(
    private val installationService: InstallationService,
    private val installationRepository: InstallationRepository,
    private val utilisateurRepository: UtilisateurRepository,
    private val meteoService: MeteoService
) {

    @PostMapping
    fun create(
        @AuthenticationPrincipal userId: Long,
        @Valid @RequestBody request: CreateInstallationRequest
    ): ResponseEntity<InstallationResponse> {
        if (!utilisateurRepository.existsById(userId)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise")
        }
        val created = installationService.create(userId, request)
        return ResponseEntity.created(URI.create("/api/v1/installations/${created.id}"))
            .body(InstallationResponse.from(created))
    }

    @GetMapping
    fun lister(@AuthenticationPrincipal userId: Long): List<InstallationResponse> =
        installationService.listerPourUtilisateur(userId)
            .map { InstallationResponse.from(it) }

    @GetMapping("/{id}/rendement")
    fun rendement(
        @AuthenticationPrincipal userId: Long,
        @PathVariable id: Long
    ): List<RendementJour> {
        val installation = installationRepository.findById(id).orElse(null)
        if (installation == null || installation.utilisateurId != userId) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Installation introuvable")
        }
        val previsions = meteoService.irradiationPrevisions(installation.latitude, installation.longitude)
        return CalculSolaire.calculer(installation, previsions)
    }
}