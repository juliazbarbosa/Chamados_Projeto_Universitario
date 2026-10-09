package br.com.sistemas.chamados.exception;

/**Lançado quando uma regra de negócio é violada (vira HTTP 409) */
public class RegraNegocioException extends RuntimeException{
    public RegraNegocioException(String mensagem){
        super(mensagem);
    }
}