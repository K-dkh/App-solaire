package fr.appsolaire.api.controller

import fr.appsolaire.api.dto.CreateInstallationRequest
import fr.appsolaire.api.dto.InstallationResponse
import fr.appsolaire.api.repository.UtilisateurRepository
import fr.appsolaire.api.service.InstallationService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.net.URI

@RestController
@RequestMapping("/api/v1/installations")
class InstallationController(
    private val installationService: InstallationService,
    private val utilisateurRepository: UtilisateurRepository
) {

    @PostMapping
    fun create(
        // TODO(FCT-02): replace this temporary header with the user from the JWT.
        @RequestHeader(name = "X-User-Id", required = false) userId: Long?,
        @Valid @RequestBody request: CreateInstallationRequest
    ): ResponseEntity<InstallationResponse> {
        if (userId == null || !utilisateurRepository.existsById(userId)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise")
        }
        val created = installationService.create(userId, request)
        return ResponseEntity.created(URI.create("/api/v1/installations/${created.id}"))
            .body(InstallationResponse.from(created))
    }
}
