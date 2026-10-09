package br.com.sistemas.chamados.exception;

import java.time.LocalDateTime;
import java.until.List;

import org.sprimgframework.http.HttpStatus;
import org.sprimgframework.http.ResponseEntity;
import org.sprimgframework.web.bind.MethodArgumentNotValidException;
import org.sprimgframework.web.bind.annotation.ExceptionHandler;
import org.sprimgframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler{
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> naoEncontrado(RecursoNaoEncontradoException ex){
        return montar(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
    }
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ErroResposta> regraNegocio(RegraNegocioException ex){
        return montar(HttpStatus.CONFLICT, ex.getMessage(), List.of());
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException ex){
        List<String> detalhes = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ":" + e.getDefaultMessage() )
            .toList();
        return montar(HttpStatus.BAD_REQUEST, "Dados inválidos", detalhes);
    }
    private ResponseEntity<ErroResposta> montar(
        HttpStatus status, String erro, List<String> detalhes){
        return ResponseEntity.status(status)
            .body(new ErroResposta(LocalDateTime.now(), status.value(), erro, detalhes));
        
    }
}
