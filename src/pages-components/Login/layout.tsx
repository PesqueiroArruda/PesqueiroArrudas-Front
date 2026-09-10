import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import Logo from '../../assets/logo.jpeg';

interface Props {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  handleLogin: any;
  accessKey: string;
  setAccessKey: Dispatch<SetStateAction<string>>;
  sendedLoginRequest: boolean;
}

export const LoginLayout = ({
  setShowPassword,
  showPassword,
  handleLogin,
  accessKey,
  setAccessKey,
  sendedLoginRequest,
}: Props) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background px-4">
    <form
      onSubmit={handleLogin}
      className="flex w-full max-w-md flex-col gap-5 rounded-card border border-border bg-card p-8 shadow-card"
    >
      <div className="flex flex-col items-center gap-2 pb-2">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl">
          <Image src={Logo} alt="Arruda's" fill className="object-contain" />
        </div>
        <h1 className="font-heading text-lg font-extrabold text-navy">Arruda&apos;s</h1>
      </div>

      <Input
        placeholder="Chave de acesso"
        type={showPassword ? 'text' : 'password'}
        value={accessKey}
        onChange={(e) => setAccessKey(e.target.value)}
        className="h-12 text-base"
      />

      <label htmlFor="login-show-password" className="flex items-center gap-2 text-sm font-semibold text-text-muted">
        <input
          id="login-show-password"
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-gold"
        />
        Mostrar chave
      </label>

      <Button type="submit" size="lg" className="h-12 text-base" disabled={sendedLoginRequest}>
        {sendedLoginRequest && <Loader2 className="h-4 w-4 animate-spin" />}
        {sendedLoginRequest ? 'Logando...' : 'Acessar'}
      </Button>
    </form>
  </div>
);
