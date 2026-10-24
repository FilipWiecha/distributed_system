package com.filipwiecha.auth.user;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.filipwiecha.auth.user.models.User;
import com.filipwiecha.auth.user.models.confirmDto.ConfirmByPassword;
import com.filipwiecha.auth.user.repositories.UserRepository;
import com.filipwiecha.auth.user.services.UserService;
import com.filipwiecha.auth.sessions.services.SessionsForUserService;
class DeleteAccountTest {
    private final UserRepository repository = mock(UserRepository.class);
    private final SessionsForUserService sessions = mock(SessionsForUserService.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final UserService service = new UserService(repository, encoder, sessions);
    private final UUID id = UUID.randomUUID();
    private static final String PASSWORD = " account-test-password ";
    private void account() {
        User user = new User(); user.setId(id); user.setPassword(encoder.encode(PASSWORD));
        when(repository.findById(id)).thenReturn(Optional.of(user));
    }
    @Test void validPasswordRevokesSessionsAndDisablesAccount() {
        account(); when(repository.disableUser(id)).thenReturn(1);
        service.deleteUser(id, new ConfirmByPassword(PASSWORD));
        var ordered = inOrder(sessions, repository);
        ordered.verify(sessions).revokeAll(id);
        ordered.verify(repository).disableUser(id);
    }
    @Test void wrongPasswordCannotRevokeSessionsOrDisableAccount() {
        account();
        assertThrows(IllegalArgumentException.class, () -> service.deleteUser(id, new ConfirmByPassword("wrong-password")));
        verifyNoInteractions(sessions); verify(repository, never()).disableUser(id);
    }
    @Test void rejectsMissingBlankAndOverlongPasswordsBeforeAnyAction() {
        assertThrows(IllegalArgumentException.class, () -> service.deleteUser(id, null));
        for (String value : new String[] { null, "", "   ", "a".repeat(73), "ą".repeat(37) }) {
            assertThrows(IllegalArgumentException.class, () -> service.deleteUser(id, new ConfirmByPassword(value)));
        }
        verifyNoInteractions(repository, sessions);
    }
    @Test void sessionRevocationFailurePreventsDisabling() {
        account(); doThrow(new IllegalStateException("Unavailable")).when(sessions).revokeAll(id);
        assertThrows(IllegalStateException.class, () -> service.deleteUser(id, new ConfirmByPassword(PASSWORD)));
        verify(repository, never()).disableUser(id);
    }
    @Test void failedDatabaseUpdateDoesNotReportSuccess() {
        account(); when(repository.disableUser(id)).thenReturn(0);
        assertThrows(IllegalStateException.class, () -> service.deleteUser(id, new ConfirmByPassword(PASSWORD)));
    }
    @Test void confirmationDtoDoesNotExposePassword() {
        assertFalse(new ConfirmByPassword(PASSWORD).toString().contains(PASSWORD));
    }
}
