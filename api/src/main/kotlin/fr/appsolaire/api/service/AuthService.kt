package fr.appsolaire.api.service

import fr.appsolaire.api.dto.ConnexionRequest
import fr.appsolaire.api.dto.ConnexionResponse
import fr.appsolaire.api.dto.InscriptionRequest
import fr.appsolaire.api.dto.UtilisateurResponse
import fr.appsolaire.api.entity.Utilisateur
import fr.appsolaire.api.repository.UtilisateurRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class AuthService(
    private val utilisateurRepository: UtilisateurRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun inscrire(request: InscriptionRequest): Utilisateur {
        val email = request.email!!.trim().lowercase()

        if (utilisateurRepository.existsByEmail(email)) {
            throw EmailDejaUtiliseException()
        }

        return utilisateurRepository.save(
            Utilisateur(
                email = email,
                motDePasse = passwordEncoder.encode(request.motDePasse!!)!!,
                nom = request.nom!!.trim(),
                consentementRgpd = true,
                dateConsentement = Instant.now()
            )
        )
    }

    fun connecter(request: ConnexionRequest): ConnexionResponse {
        val email = request.email!!.trim().lowercase()
        val utilisateur = utilisateurRepository.findByEmail(email)
            ?: throw IdentifiantsInvalidesException()

        if (!passwordEncoder.matches(request.motDePasse!!, utilisateur.motDePasse)) {
            throw IdentifiantsInvalidesException()
        }

        val token = jwtService.genererToken(utilisateur.id!!, utilisateur.email)
        return ConnexionResponse(token, UtilisateurResponse.from(utilisateur))
    }
}