import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { ApiError, apiGet, apiPost } from '@/lib/api';

const SESSION_KEY = 'givingback.session';
const BIOMETRIC_KEY = 'givingback.biometric-enabled';

export type UserRole = 'NGO' | 'admin' | 'corporate' | 'donor';

export type AuthUser = {
  active?: number;
  email: string;
  first_time_login?: number;
  id: number;
  role: UserRole;
  status?: number;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type LoginResponse = {
  data: {
    user: AuthUser;
  };
  status: string;
  token: string;
};

type SessionResponse = {
  data: {
    profile: Record<string, unknown> | null;
    user: AuthUser;
  };
  status: string;
};

type BiometricAvailability = {
  available: boolean;
  label: string;
};

type AuthContextValue = {
  biometric: BiometricAvailability;
  biometricEnabled: boolean;
  disableBiometrics: () => Promise<void>;
  enableBiometrics: () => Promise<void>;
  hasSavedSession: boolean;
  initializing: boolean;
  isLocked: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  session: AuthSession | null;
  unlockWithBiometrics: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStorage(key: string) {
  if (Platform.OS === 'web') {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function writeStorage(key: string, value: string) {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

async function deleteStorage(key: string) {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

async function detectBiometrics(): Promise<BiometricAvailability> {
  if (Platform.OS === 'web') return { available: false, label: 'Biometrics' };

  const [hardware, enrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  const hasFace = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const hasFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
  const label = hasFace ? 'Face ID' : hasFingerprint ? 'Fingerprint' : 'Biometrics';
  return { available: hardware && enrolled, label };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [pendingSession, setPendingSession] = useState<AuthSession | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometric, setBiometric] = useState<BiometricAvailability>({
    available: false,
    label: 'Biometrics',
  });
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const persistSession = useCallback(async (nextSession: AuthSession | null) => {
    if (nextSession) {
      await writeStorage(SESSION_KEY, JSON.stringify(nextSession));
    } else {
      await deleteStorage(SESSION_KEY);
    }
  }, []);

  const validateSession = useCallback(async (stored: AuthSession) => {
    const response = await apiGet<SessionResponse>('/auth/session', stored.token);
    return {
      token: stored.token,
      user: response.data.user,
    } satisfies AuthSession;
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const [storedValue, biometricValue, availability] = await Promise.all([
          readStorage(SESSION_KEY),
          readStorage(BIOMETRIC_KEY),
          detectBiometrics(),
        ]);
        if (!mounted) return;
        setBiometric(availability);
        const shouldLock = biometricValue === 'true' && availability.available;
        setBiometricEnabled(shouldLock);

        if (storedValue) {
          const stored = JSON.parse(storedValue) as AuthSession;
          if (shouldLock) {
            setPendingSession(stored);
          } else {
            try {
              const validated = await validateSession(stored);
              if (mounted) setSession(validated);
            } catch (error) {
              if (error instanceof ApiError && error.status === 401) {
                await persistSession(null);
              } else if (mounted) {
                setSession(stored);
              }
            }
          }
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [persistSession, validateSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current === 'active' &&
        nextState !== 'active' &&
        biometricEnabled &&
        session
      ) {
        setPendingSession(session);
        setSession(null);
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [biometricEnabled, session]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiPost<LoginResponse>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
        uuid: '',
      });
      const nextSession = {
        token: response.token,
        user: response.data.user,
      };
      setPendingSession(null);
      setSession(nextSession);
      await persistSession(nextSession);
      return nextSession;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    const token = session?.token || pendingSession?.token;
    if (token) {
      try {
        await apiGet('/auth/logout', token);
      } catch {
        // Local logout must still complete when the network is unavailable.
      }
    }
    setSession(null);
    setPendingSession(null);
    await persistSession(null);
  }, [pendingSession?.token, persistSession, session?.token]);

  const refreshSession = useCallback(async () => {
    if (!session) return;
    const nextSession = await validateSession(session);
    setSession(nextSession);
    await persistSession(nextSession);
  }, [persistSession, session, validateSession]);

  const enableBiometrics = useCallback(async () => {
    const availability = await detectBiometrics();
    setBiometric(availability);
    if (!availability.available) {
      throw new Error('Set up Face ID or fingerprint on this device first.');
    }
    const result = await LocalAuthentication.authenticateAsync({
      biometricsSecurityLevel: 'strong',
      cancelLabel: 'Not now',
      fallbackLabel: 'Use device passcode',
      promptMessage: `Enable ${availability.label} for GivingBack`,
      promptSubtitle: 'Use biometrics to unlock your saved GivingBack session.',
    });
    if (!result.success) throw new Error('Biometric verification was not completed.');
    await writeStorage(BIOMETRIC_KEY, 'true');
    setBiometricEnabled(true);
  }, []);

  const disableBiometrics = useCallback(async () => {
    await deleteStorage(BIOMETRIC_KEY);
    setBiometricEnabled(false);
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    if (!pendingSession || !biometric.available) return false;
    const result = await LocalAuthentication.authenticateAsync({
      biometricsSecurityLevel: 'strong',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use device passcode',
      promptMessage: `Unlock GivingBack with ${biometric.label}`,
    });
    if (!result.success) return false;

    try {
      const validated = await validateSession(pendingSession);
      setSession(validated);
      setPendingSession(null);
      await persistSession(validated);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await logout();
      }
      throw error;
    }
  }, [biometric, logout, pendingSession, persistSession, validateSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      biometric,
      biometricEnabled,
      disableBiometrics,
      enableBiometrics,
      hasSavedSession: Boolean(pendingSession),
      initializing,
      isLocked: Boolean(pendingSession && !session),
      login,
      logout,
      refreshSession,
      session,
      unlockWithBiometrics,
    }),
    [
      biometric,
      biometricEnabled,
      disableBiometrics,
      enableBiometrics,
      initializing,
      login,
      logout,
      pendingSession,
      refreshSession,
      session,
      unlockWithBiometrics,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
