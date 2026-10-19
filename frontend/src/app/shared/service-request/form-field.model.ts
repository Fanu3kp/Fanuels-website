export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  defaultValue?: any;
  validators?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface ServiceSchema {
  serviceId: string;
  serviceName: string;
  description: string;
  fields: FormFieldConfig[];
}
