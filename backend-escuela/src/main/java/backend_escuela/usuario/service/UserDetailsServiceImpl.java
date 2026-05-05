package backend_escuela.usuario.service;

import backend_escuela.usuario.entity.UserDetailsImpl;
import backend_escuela.usuario.entity.Usuario;
import backend_escuela.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UsuarioRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario =  userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found in database") );
        return new UserDetailsImpl(usuario);
    }
}
