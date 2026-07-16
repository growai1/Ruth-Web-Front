import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('growai_user');
    const token = localStorage.getItem('growai_token');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now()) {
          setUser(parsed);
        } else {
          localStorage.removeItem('growai_user');
          localStorage.removeItem('growai_token');
        }
      } catch {
        localStorage.removeItem('growai_user');
        localStorage.removeItem('growai_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Email y contraseña son requeridos'));
          return;
        }
        const userData = {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0],
          email,
          avatar: null,
          plan: 'Gratis',
          joinDate: new Date().toISOString(),
          notifications: true,
          language: 'es',
          theme: 'light',
          stats: {
            videosGenerated: 0,
            coursesCompleted: 0,
            learningHours: 0,
          },
          activity: [],
        };
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(
          JSON.stringify({ sub: userData.id, exp: Date.now() + 86400000 })
        );
        const token = `${header}.${payload}.simulated`;
        localStorage.setItem('growai_user', JSON.stringify(userData));
        localStorage.setItem('growai_token', token);
        setUser(userData);
        resolve(userData);
      }, 1200);
    });
  };

  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('Todos los campos son requeridos'));
          return;
        }
        const userData = {
          id: 'usr_' + Date.now(),
          name,
          email,
          avatar: null,
          plan: 'Gratis',
          joinDate: new Date().toISOString(),
          notifications: true,
          language: 'es',
          theme: 'light',
          stats: {
            videosGenerated: 0,
            coursesCompleted: 0,
            learningHours: 0,
          },
          activity: [],
        };
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(
          JSON.stringify({ sub: userData.id, exp: Date.now() + 86400000 })
        );
        const token = `${header}.${payload}.simulated`;
        localStorage.setItem('growai_user', JSON.stringify(userData));
        localStorage.setItem('growai_token', token);
        setUser(userData);
        resolve(userData);
      }, 1200);
    });
  };

  const logout = () => {
    localStorage.removeItem('growai_user');
    localStorage.removeItem('growai_token');
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('growai_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
