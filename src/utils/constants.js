// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Sui Network Configuration
export const SUI_NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet'
export const SUI_RPC_URL = import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io'

// Walrus Configuration
export const WALRUS_PUBLISHER_URL = import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space'
export const WALRUS_AGGREGATOR_URL = import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space'

// Contract Addresses
export const MEDICAL_VAULT_PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0xc4f956117f2ea91392c8a5af2a2ba53d00afdac00801e2df7f77a0f16705dd62'
export const WHITELIST_REGISTRY = import.meta.env.VITE_WHITELIST_REGISTRY || '0x5a8347fa5f2d9065c0e28326b73db549d4e190bcf60f01fbd3e2026f87ddf168'
export const CLOCK_OBJECT_ID = '0x6'

// Access Control Roles
export const ROLES = {
  OWNER: 0,
  DOCTOR: 1,
  MEMBER: 2,
  NO_ACCESS: 255,
}

export const ROLE_NAMES = {
  0: 'Owner',
  1: 'Doctor',
  2: 'Member',
  255: 'No Access',
}

// Document Types (theo backend API)
export const DOC_TYPES = {
  LAB_RESULT: 0,
  IMAGING: 1,
  DOCTOR_NOTES: 2,
  PRESCRIPTION: 3,
  OTHER: 4,
}

export const DOC_TYPE_NAMES = {
  0: 'Lab Result',
  1: 'Imaging',
  2: 'Doctor Notes',
  3: 'Prescription',
  4: 'Other',
}

// Record Types (legacy - for backward compatibility)
export const RECORD_TYPES = {
  LAB_RESULT: 'Lab Result',
  IMAGING: 'Imaging',
  EXAMINATION: 'Doctor Notes',
  PRESCRIPTION: 'Prescription',
  OTHER: 'Other',
}

// File Upload Limits
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const MAX_FILES_PER_UPLOAD = 10
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

// Action Types
export const ACTION_TYPES = {
  CREATE_WHITELIST: 'CREATE_WHITELIST',
  ADD_DOCTOR: 'ADD_DOCTOR',
  ADD_MEMBER: 'ADD_MEMBER',
  REMOVE_DOCTOR: 'REMOVE_DOCTOR',
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  UPLOAD_RECORD: 'UPLOAD_RECORD',
  DOWNLOAD_RECORD: 'DOWNLOAD_RECORD',
}

export const ACTION_TYPE_NAMES = {
  CREATE_WHITELIST: 'Created Whitelist',
  ADD_DOCTOR: 'Added Doctor',
  ADD_MEMBER: 'Added Member',
  REMOVE_DOCTOR: 'Removed Doctor',
  REMOVE_MEMBER: 'Removed Member',
  UPLOAD_RECORD: 'Uploaded Record',
  DOWNLOAD_RECORD: 'Downloaded Record',
}

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
