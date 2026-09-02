interface PageProps {
  readonly title: string;
}

/**
 * Render a small Next.js page with explicit typed inputs.
 * @param props Page properties.
 * @returns Rendered page content.
 */
export function Page({ title }: PageProps) {
  return <main>{title}</main>;
}
