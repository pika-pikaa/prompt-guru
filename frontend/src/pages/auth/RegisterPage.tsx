import { type FC, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { AuthLayout } from '@/components/layout';
import { Button, Input, useToast } from '@/components/ui';
import { useAuthStore } from '@/stores';

export const RegisterPage: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) {
      newErrors.name = 'Imię jest wymagane';
    } else if (name.length < 2) {
      newErrors.name = 'Imię musi mieć co najmniej 2 znaki';
    }

    if (!email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Potwierdź swoje hasło';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są zgodne';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register({ name, email, password });
      toast.success('Konto utworzone!', 'Witaj w Prompt Guru.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Rejestracja nie powiodła się', (error as Error).message);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground">Utwórz konto</h2>
          <p className="text-sm text-muted-foreground">
            Zacznij korzystać z Prompt Guru już dziś
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Imię"
            type="text"
            placeholder="Wprowadź swoje imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            leftIcon={<User className="h-4 w-4" />}
            autoComplete="name"
            disabled={isLoading}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Wprowadź swój email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Hasło"
            type={showPassword ? 'text' : 'password'}
            placeholder="Utwórz hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground"
                aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Input
            label="Potwierdź hasło"
            type={showPassword ? 'text' : 'password'}
            placeholder="Potwierdź swoje hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Utwórz konto
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Masz już konto?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Zaloguj się
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

RegisterPage.displayName = 'RegisterPage';
