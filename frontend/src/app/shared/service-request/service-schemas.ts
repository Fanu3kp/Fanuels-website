import { ServiceSchema } from './form-field.model';

export const SERVICE_SCHEMAS: Record<string, ServiceSchema> = {
  pos: {
    serviceId: 'pos',
    serviceName: 'POS System Request',
    description: 'Request a new Point of Sale terminal or hardware configuration.',
    fields: [
      {
        key: 'businessName',
        label: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Enter registered business name'
      },
      {
        key: 'terminalCount',
        label: 'Number of Terminals',
        type: 'number',
        required: true,
        defaultValue: 1,
        validators: { min: 1, max: 50 }
      },
      {
        key: 'posSoftware',
        label: 'Preferred POS Software',
        type: 'select',
        required: true,
        options: [
          { label: 'Standard Retail Suite', value: 'retail_standard' },
          { label: 'Advanced Hospitality / Restaurant', value: 'hospitality_adv' },
          { label: 'Custom Integration', value: 'custom' }
        ]
      },
      {
        key: 'comments',
        label: 'Additional Requirements',
        type: 'textarea',
        placeholder: 'Mention any specific hardware accessories needed...'
      }
    ]
  },
  maintenance: {
    serviceId: 'maintenance',
    serviceName: 'IT & Equipment Maintenance',
    description: 'Schedule routine or emergency technical support and maintenance.',
    fields: [
      {
        key: 'equipmentType',
        label: 'Equipment Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Server Hardware', value: 'server' },
          { label: 'Workstation / Desktop', value: 'desktop' },
          { label: 'Networking Gear', value: 'networking' }
        ]
      },
      {
        key: 'urgency',
        label: 'Priority Level',
        type: 'select',
        required: true,
        options: [
          { label: 'Low - Routine Check', value: 'low' },
          { label: 'Medium - Degraded Performance', value: 'medium' },
          { label: 'High - Total Outage', value: 'high' }
        ]
      },
      {
        key: 'preferredDate',
        label: 'Preferred Service Date',
        type: 'date',
        required: true
      },
      {
        key: 'issueDescription',
        label: 'Issue Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the symptoms or maintenance required...'
      }
    ]
  }
};
