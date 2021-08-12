export enum DwType {
  UNKNOWN = 0,
  INT1 = 1,
  INT2 = 2,
  INT4 = 3,
  INT8 = 4,
  UINT1 = 5,
  UINT2 = 6,
  UINT4 = 7,
  UINT8 = 8,
  FLOAT4 = 9,
  FLOAT8 = 10,
  BOOL = 11,
  STRING = 16,
  TIMESTAMP = 17,
  BINARY = 19
}
// 'INT1' | 'INT2' | 'INT4' | 'INT8' | 'UINT1' | 'UINT2' | 'UINT4' | 'UINT8' | 'FLOAT4' | 'FLOAT8' | 'BOOL' | 'STRING' | 'TIMESTAMP' | 'BINARY' | 'UNKNOWN'

export class DwVariable {
  variable: string;
  type?: DwType;
  typeString?: string;
  count?: number;
  xdim?: number;
  ydim?: number;
  zdim?: number;
  xstart?: number;
  ystart?: number;
  zstart?: number;
  length?: number;
  casts?: number;
  castStrings?: string[];
  bitno?: number;
  offset?: number;
  desc?: string;
  options?: string[];
  optionStrings?: string[];
}

export class DwSubscribeVariable extends DwVariable {
  device: string;
}
