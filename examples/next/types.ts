export type SearchValue = string | readonly string[] | undefined;

export type PageInput = {
  readonly searchParams: Promise<Readonly<Record<string, SearchValue>>>;
};
