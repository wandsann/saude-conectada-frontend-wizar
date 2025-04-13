declare module 'tailwindcss' {
  export interface Config {
    content: string[];
    darkMode?: string[];
    theme?: {
      container?: {
        center?: boolean;
        padding?: string;
        screens?: {
          [key: string]: string;
        };
      };
      extend?: {
        colors?: {
          [key: string]: string | { [key: string]: string };
        };
        borderRadius?: {
          [key: string]: string;
        };
        fontFamily?: {
          [key: string]: string[];
        };
        keyframes?: {
          [key: string]: {
            [key: string]: { [key: string]: string } | string;
          };
        };
        animation?: {
          [key: string]: string;
        };
      };
    };
    plugins?: any[];
  }
}

declare module 'tailwindcss/defaultTheme' {
  export const fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
}

declare module 'tailwindcss-animate' {
  const plugin: () => void;
  export = plugin;
} 