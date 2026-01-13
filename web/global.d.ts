declare global {
  module "*.svg" {
    const content: React.FC<React.SVGAttributes<SVGElement>>;
    export default content;
  }
  module "*.png" {
    const path: string;
    export default path;
  }
}

export {};
