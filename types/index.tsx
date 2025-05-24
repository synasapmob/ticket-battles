export type IPFSDataType = {
  image: string;
  name: string;
  quantity?: number;
  attributes: Record<'trait_type' | 'value', string>[];
};
