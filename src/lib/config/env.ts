type AppEnv = 'development' | 'qa' | 'stage' | 'production';

const requireEnv = (value: string | undefined, key: string): string => {
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const EnvConfig = {
  appEnv: requireEnv(process.env.NEXT_PUBLIC_APP_ENV, 'NEXT_PUBLIC_APP_ENV') as AppEnv,
  apiBaseUrl: requireEnv(process.env.NEXT_PUBLIC_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL'),
  imageDomain: requireEnv(process.env.NEXT_PUBLIC_IMAGE_DOMAIN, 'NEXT_PUBLIC_IMAGE_DOMAIN'),
} as const;
