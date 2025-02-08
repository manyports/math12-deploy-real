interface MathJaxConfig {
  tex: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
  };
  svg: {
    fontCache: string;
  };
  startup?: {
    typeset: boolean;
  };
}

interface MathJax extends MathJaxConfig {
  typesetPromise: () => Promise<void>;
}

interface Window {
  MathJax: MathJax | MathJaxConfig;
} 