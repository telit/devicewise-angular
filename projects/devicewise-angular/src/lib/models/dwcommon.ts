export enum DwType {
  UNKNOWN = 1,
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
  device: string;
  variable: string;
  type: DwType;
  count: number;
  length: number;
}
