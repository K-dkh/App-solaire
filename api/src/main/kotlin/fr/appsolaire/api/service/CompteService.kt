package fr.appsolaire.api.service

import fr.appsolaire.api.repository.InstallationRepository
import fr.appsolaire.api.repository.UtilisateurRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class CompteService(
    private val utilisateurRepository: UtilisateurRepository,
    private val installationRepository: InstallationRepository
) {

    /** Supprime les installations puis le compte, dans une seule transaction (RGPD, droit à l'effacement). */
    @Transactional
    fun supprimer(userId: Long) {
        if (!utilisateurRepository.existsById(userId)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentification requise")
        }
        installationRepository.deleteByUtilisateurId(userId)
        utilisateurRepository.deleteById(userId)
    }
}