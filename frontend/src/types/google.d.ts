interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleRenderButtonConfiguration {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  width?: number | string;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdConfiguration): void;
  renderButton(
    parent: HTMLElement,
    options: GoogleRenderButtonConfiguration
  ): void;
  prompt(): void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface Google {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google: Google;
  }
}

export {};