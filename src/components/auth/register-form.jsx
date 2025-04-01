// src/components/auth/register-form.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import Button from '../ui/button';
import Input from '../ui/input';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const { registerRequestCode, registerVerify, loading, error } = useAuth();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    const success = await registerRequestCode(email);
    if (success) {
      setStep(2);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    await registerVerify(email, code, password);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Регистрация</h2>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Подождите...' : 'Запросить код'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block mb-1">Код подтверждения</label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="reg-password" className="block mb-1">Пароль</label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Подождите...' : 'Завершить регистрацию'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;