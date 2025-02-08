interface MathJax {
  Hub: {
    Queue: (args: any[]) => void;
    Config: (config: any) => void;
  };
  tex2jax?: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
  };
  showMathMenu?: boolean;
  messageStyle?: string;
}

interface Window {
  MathJax: MathJax;
} 