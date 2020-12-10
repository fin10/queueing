declare namespace JSX {
  interface IntrinsicElements {
    'fast-design-system-provider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'fast-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'fast-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      appearance: string;
    };
  }
}
