// API Configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

// Contract Configuration
export const MEDICAL_VAULT_PACKAGE_ID = (import.meta as any).env?.VITE_PACKAGE_ID || '0xc4f956117f2ea91392c8a5af2a2ba53d00afdac00801e2df7f77a0f16705dd62';
export const WHITELIST_REGISTRY = (import.meta as any).env?.VITE_WHITELIST_REGISTRY || '0x5a8347fa5f2d9065c0e28326b73db549d4e190bcf60f01fbd3e2026f87ddf168';
export const CLOCK_OBJECT_ID = '0x6';

export const ENDPOINTS = {
  // Folders
  CREATE_FOLDER: '/folders/create',
  GET_FOLDERS: '/folders',
  ADD_DOCTOR: '/folders/:whitelistId/add-doctor',
  ADD_MEMBER: '/folders/:whitelistId/add-member',
  GET_USER_WHITELISTS: '/whitelists/user/:address/chain',
  GET_USER_ROLE: '/whitelists/:whitelistId/role/:address',
  GET_WHITELIST: '/whitelists/:whitelistId',
  
  // Records
  UPLOAD_RECORD: '/records/upload',
  GET_RECORDS: '/records/whitelist/:whitelistId',
  DOWNLOAD_FILE: '/records/:recordId/files/:fileIndex/download',
  ADD_FILES: '/records/:recordId/add-files',
  
  // Export
  EXPORT_RECORDS: '/export/export',
  
  // Log
  GET_AUDIT_LOGS: '/audit/:whitelistId',
};

export const DOC_TYPES = {
  LAB: 0,
  IMAGING: 1,
  REPORT: 2,
  PRESCRIPTION: 3,
  OTHER: 4,
} as const;

export const DOC_TYPE_LABELS = {
  [DOC_TYPES.LAB]: 'Lab Results',
  [DOC_TYPES.IMAGING]: 'Imaging',
  [DOC_TYPES.REPORT]: 'Clinical Report',
  [DOC_TYPES.PRESCRIPTION]: 'Prescription',
  [DOC_TYPES.OTHER]: 'Other',
};

export const DOC_TYPE = {
  LAB_RESULT: 0,
  IMAGING: 1,
  PRESCRIPTION: 2,
  REPORT: 3,
  OTHER: 4,
};

export const DOC_TYPE_TO_MIME = {
  [DOC_TYPES.LAB]: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  [DOC_TYPES.IMAGING]: ['image/jpeg', 'image/png', 'image/webp', 'application/dicom'],
  [DOC_TYPES.PRESCRIPTION]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DOC_TYPES.REPORT]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  [DOC_TYPES.OTHER]: ['application/octet-stream'],
};

export const ROLE_TYPES = {
  OWNER: 0,
  DOCTOR: 1,
  MEMBER: 2,
  NONE: 255,
} as const;

export const ROLE_LABELS = {
  [ROLE_TYPES.OWNER]: 'Owner',
  [ROLE_TYPES.DOCTOR]: 'Doctor',
  [ROLE_TYPES.MEMBER]: 'Member',
  [ROLE_TYPES.NONE]: 'No Access',
};

export const ROLE_COLORS = {
  [ROLE_TYPES.OWNER]: '#f59e0b',
  [ROLE_TYPES.DOCTOR]: '#3b82f6',
  [ROLE_TYPES.MEMBER]: '#10b981',
  [ROLE_TYPES.NONE]: '#6b7280',
};
