// @ts-expect-error — untyped JS data module shared with the Astro original
import { site } from '../data/portfolio.js';
import BrandMark from './BrandMark';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <span className="footer-brand">
        <BrandMark size={20} />© {year} {site.studio}
      </span>
      <span>
        Built with{' '}
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          Next.js
        </a>
      </span>
    </footer>
  );
}
