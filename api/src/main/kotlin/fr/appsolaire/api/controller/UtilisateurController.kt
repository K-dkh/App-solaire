package fr.appsolaire.api.controller

import fr.appsolaire.api.service.CompteService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/utilisateurs")
class UtilisateurController(private val compteService: CompteService) {

    @DeleteMapping("/me")
    fun supprimerMonCompte(@AuthenticationPrincipal userId: Long): ResponseEntity<Void> {
        compteService.supprimer(userId)
        return ResponseEntity.noContent().build()
    }
}