export class GetCustomerDataDto {
  customerCode: string;
  customerType: string;
  isResident: boolean;
  taxCode: string;
  fullName: string;
  shortName: string;
  kpp: string;
  customerOgrn: string;
}

export class GetCustomerListDataDto {
  Customer: GetCustomerDataDto[];
}

export class GetCustomerListResponseDto {
  Data: GetCustomerListDataDto;
  Links: any;
  Meta: any;
}
