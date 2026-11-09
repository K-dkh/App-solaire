package fr.appsolaire.api.dto

import jakarta.validation.constraints.NotBlank

data class ConnexionRequest(

    @field:NotBlank(message = "L'e-mail est obligatoire")
    val email: String?,

    @field:NotBlank(message = "Le mot de passe est obligatoire")
    val motDePasse: String?
)