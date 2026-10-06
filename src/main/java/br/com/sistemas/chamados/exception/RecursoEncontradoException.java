package br.com.sistemas.chamados.exception;

/*lança quando um recurso procurado não existe vira http 404 */
public class RecursoEncontradoException extends RuntimeException {
    public RecursoEncontradoException(String message) {
        super(message);
    }
    
}
