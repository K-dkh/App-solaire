package fr.appsolaire.api.dto

import jakarta.validation.constraints.AssertTrue
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class InscriptionRequest(

    @field:NotBlank(message = "Le nom est obligatoire")
    @field:Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
    val nom: String?,

    @field:NotBlank(message = "L'e-mail est obligatoire")
    @field:Email(message = "L'e-mail n'est pas valide")
    val email: String?,

    @field:NotBlank(message = "Le mot de passe est obligatoire")
    @field:Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    val motDePasse: String?,

    @field:AssertTrue(message = "Vous devez accepter les conditions (RGPD)")
    val consentementRgpd: Boolean? = false
)