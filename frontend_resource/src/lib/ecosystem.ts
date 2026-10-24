export interface EcosystemService {
  id: string;
  name: string;
  subdomain: string;
  url: string;
  gatewayRoute: string;
  role: string;
  description: string;
}

export const ECOSYSTEM_DOMAIN = "mojprojekt.test";

export const ECOSYSTEM_SERVICES: EcosystemService[] = [
  {
    id: "account",
    name: "Konto",
    subdomain: "account.mojprojekt.test",
    url: "http://account.mojprojekt.test",
    gatewayRoute: "account.mojprojekt.test/api → auth",
    role: "Profil, tożsamość i sesje SSO",
    description:
      "Zarządzaj tożsamością, aktywnymi sesjami i bezpieczeństwem konta.",
  },
  {
    id: "gym",
    name: "Gym",
    subdomain: "gym.mojprojekt.test",
    url: "http://gym.mojprojekt.test",
    gatewayRoute: "gym.mojprojekt.test/api → resource",
    role: "Ćwiczenia, plany i treningi",
    description:
      "Twórz ćwiczenia, układaj plany treningowe i zapisuj wykonane treningi.",
  },
];
