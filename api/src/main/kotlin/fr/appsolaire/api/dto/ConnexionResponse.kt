package fr.appsolaire.api.dto

data class ConnexionResponse(
    val token: String,
    val utilisateur: UtilisateurResponse
)