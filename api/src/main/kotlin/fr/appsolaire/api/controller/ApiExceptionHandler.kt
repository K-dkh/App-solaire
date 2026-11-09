package fr.appsolaire.api.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import fr.appsolaire.api.service.EmailDejaUtiliseException
import fr.appsolaire.api.service.IdentifiantsInvalidesException

/** Returns clear, uniform JSON errors: {"status", "message", "fieldErrors"}. */
@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, Any?>> {
        val fieldErrors = linkedMapOf<String, String?>()
        ex.bindingResult.fieldErrors.forEach { fieldErrors.putIfAbsent(it.field, it.defaultMessage) }
        return body(HttpStatus.BAD_REQUEST, "Données invalides", fieldErrors)
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadable(ex: HttpMessageNotReadableException): ResponseEntity<Map<String, Any?>> =
        body(HttpStatus.BAD_REQUEST, "Corps de requête illisible", emptyMap())

    @ExceptionHandler(ResponseStatusException::class)
    fun handleStatus(ex: ResponseStatusException): ResponseEntity<Map<String, Any?>> =
        body(HttpStatus.valueOf(ex.statusCode.value()), ex.reason, emptyMap())


    @ExceptionHandler(IdentifiantsInvalidesException::class)
    fun handleIdentifiants(ex: IdentifiantsInvalidesException): ResponseEntity<Map<String, Any?>> =
        body(HttpStatus.UNAUTHORIZED, ex.message, emptyMap())

    @ExceptionHandler(EmailDejaUtiliseException::class)
    fun handleEmailDejaUtilise(ex: EmailDejaUtiliseException): ResponseEntity<Map<String, Any?>> =
        body(HttpStatus.CONFLICT, ex.message, emptyMap())

    private fun body(
        status: HttpStatus,
        message: String?,
        fieldErrors: Map<String, String?>
    ): ResponseEntity<Map<String, Any?>> {
        val payload: Map<String, Any?> = linkedMapOf(
            "status" to status.value(),
            "message" to message,
            "fieldErrors" to fieldErrors
        )
        return ResponseEntity.status(status).body(payload)
    }
}