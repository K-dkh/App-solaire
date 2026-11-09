package fr.appsolaire.api.service

class EmailDejaUtiliseException : RuntimeException("Cet e-mail est déjà utilisé")