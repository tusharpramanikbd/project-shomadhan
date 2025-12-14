export type TMailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export type TNodeError = Error & { code?: string };
