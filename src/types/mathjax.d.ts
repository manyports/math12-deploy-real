interface MathJaxConfig {
  tex: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
    packages?: string[];
  };
  svg: {
    fontCache: string;
  };
  options?: {
    skipHtmlTags: string[];
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