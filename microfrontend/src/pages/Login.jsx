import { useState } from 'react';
import { authService } from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.login(username);
      localStorage.setItem('token', data.token);
      onLogin();
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>🍎 Hortifrut Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
