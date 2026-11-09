package fr.appsolaire.api.controller

import fr.appsolaire.api.dto.InscriptionRequest
import fr.appsolaire.api.dto.UtilisateurResponse
import fr.appsolaire.api.service.AuthService
import jakarta.validation.Valid
import fr.appsolaire.api.dto.ConnexionRequest
import fr.appsolaire.api.dto.ConnexionResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/inscription")
    fun inscription(
        @Valid @RequestBody request: InscriptionRequest
    ): ResponseEntity<UtilisateurResponse> {
        val utilisateur = authService.inscrire(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(UtilisateurResponse.from(utilisateur))
    }

    @PostMapping("/connexion")
    fun connexion(
        @Valid @RequestBody request: ConnexionRequest
    ): ResponseEntity<ConnexionResponse> =
        ResponseEntity.ok(authService.connecter(request))


    @PostMapping("/deconnexion")
    fun deconnexion(): ResponseEntity<Void> =
        ResponseEntity.noContent().build()
}



