export type PageInput = {
  readonly searchParams: Promise<Readonly<Record<string, SearchValue>>>;
};

export type SearchValue = readonly string[] | string | undefined;
