
type MinQueryFn = {
  each(callback : (index? : number) => void) : MinQuery;
};

type MinQuery = MinQueryFn & any[];

type MinQueryStatic = {
  extend<S,T, U extends S & T>(o1 : S, o2 : T) : U;
  fn : MinQueryFn;
  (target? : string|Window|Element|Document) : MinQuery;
};
