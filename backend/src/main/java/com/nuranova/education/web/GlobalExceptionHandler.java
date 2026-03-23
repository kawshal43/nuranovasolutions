package com.nuranova.education.web;

import com.nuranova.education.web.ApiDtos.MessageResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponse handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        FieldError fieldError = exception.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = fieldError != null ? fieldError.getDefaultMessage() : "Invalid request data";
        return new MessageResponse(message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponse handleConstraintViolation(ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .findFirst()
                .map(violation -> violation.getMessage())
                .orElse("Invalid request data");
        return new MessageResponse(message);
    }
}
