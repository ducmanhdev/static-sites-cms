export type FieldConfigType = 'text' | 'date' | 'markdown' | 'select' | 'checkbox' | 'radio' | 'color' | 'image';

export interface IFetchResponse<T> {
  status: boolean;
  data: {
    items: T[];
    _links: {
      self: {
        href: string;
      };
      first: {
        href: string;
      };
      last: {
        href: string;
      };
    };
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
  messages: string;
  code: number;
}

export interface IPageData {
  [key: string]: any;
}