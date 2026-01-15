import { API_BASE_URL } from '../utils/constants'

/**
 * API Client for Medical Vault Backend
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Make HTTP request
   * @private
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log('API Request:', url)
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      console.log('API Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new Error(error.error || error.message || 'Request failed')
      }

      const data = await response.json()
      console.log('API Response data:', data)
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // ==================== Whitelists Management ====================
  
  /**
   * Create new whitelist (with privateKey for auto-execute, or returns txBytes)
   */
  async createWhitelist(data) {
    return this.request('/whitelists', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get user's whitelists from blockchain (real-time)
   */
  async getUserWhitelists(address) {
    return this.request(`/whitelists/user/${address}/chain`)
  }

  /**
   * Check user access to whitelist (from on-chain)
   */
  async checkWhitelistAccess(whitelistId, address) {
    return this.request(`/whitelists/${whitelistId}/access/${address}`)
  }

  /**
   * Add doctor to whitelist (with privateKey for auto-execute, or returns txBytes)
   */
  async addDoctor(whitelistId, data) {
    return this.request(`/whitelists/${whitelistId}/doctors`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Remove doctor from whitelist
   */
  async removeDoctor(whitelistId, data) {
    return this.request(`/whitelists/${whitelistId}/doctors`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  /**
   * Add member to whitelist (with privateKey for auto-execute, or returns txBytes)
   */
  async addMember(whitelistId, data) {
    return this.request(`/whitelists/${whitelistId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Remove member from whitelist
   */
  async removeMember(whitelistId, data) {
    return this.request(`/whitelists/${whitelistId}/members`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  }

  // ==================== Medical Records ====================

  /**
   * Upload medical record with files
   * Can work with or without privateKey (wallet signing)
   */
  async uploadRecord(formData) {
    const url = `${this.baseURL}/records/upload`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.error || error.message || 'Upload failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Upload Error:', error)
      throw error
    }
  }

  /**
   * Get record details
   */
  async getRecordDetails(recordId) {
    return this.request(`/records/${recordId}`)
  }

  /**
   * Get all records in whitelist
   */
  async getWhitelistRecords(whitelistId) {
    return this.request(`/records/whitelist/${whitelistId}`)
  }

  /**
   * Download and decrypt file
   */
  async downloadRecord(recordId, data) {
    const url = `${this.baseURL}/records/${recordId}/download`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Download failed' }))
        throw new Error(error.error || error.message || 'Download failed')
      }

      return await response.blob()
    } catch (error) {
      console.error('Download Error:', error)
      throw error
    }
  }

  // ==================== Logs & History ====================

  /**
   * Get actions by address (with pagination)
   */
  async getUserActions(address, page = 1, limit = 50) {
    return this.request(`/log/address/${address}?page=${page}&limit=${limit}`)
  }

  /**
   * Get actions by whitelist
   */
  async getWhitelistActions(whitelistId) {
    return this.request(`/log/whitelist/${whitelistId}`)
  }

  /**
   * Get actions by type
   */
  async getActionsByType(actionType) {
    return this.request(`/log/type/${actionType}`)
  }

  /**
   * Get all actions (with pagination)
   */
  async getAllActions(page = 1, limit = 50) {
    return this.request(`/log?page=${page}&limit=${limit}`)
  }

  /**
   * Get actions between two users
   */
  async getRelationshipActions(address, targetAddress) {
    return this.request(`/log/relationship/${address}/${targetAddress}`)
  }

  /**
   * Get whitelists by owner from database (audit logs)
   */
  async getWhitelistsByOwner(owner) {
    return this.request(`/log/whitelists/owner/${owner}`)
  }

  /**
   * Get whitelists by doctor from database (audit logs)
   */
  async getWhitelistsByDoctor(doctorAddress) {
    return this.request(`/log/whitelists/doctor/${doctorAddress}`)
  }

  /**
   * Get whitelists by member from database (audit logs)
   */
  async getWhitelistsByMember(memberAddress) {
    return this.request(`/log/whitelists/member/${memberAddress}`)
  }

  /**
   * Get whitelist details from database (audit log)
   */
  async getWhitelistDetailsFromDB(whitelistId) {
    return this.request(`/log/whitelists/${whitelistId}`)
  }

  /**
   * Get record details from database (audit log)
   */
  async getRecordDetailsFromDB(recordId) {
    return this.request(`/log/records/${recordId}`)
  }

  /**
   * Get records by whitelist from database (audit log)
   */
  async getRecordsByWhitelistFromDB(whitelistId) {
    return this.request(`/log/records/whitelist/${whitelistId}`)
  }

  /**
   * Get records by uploader
   */
  async getRecordsByUploader(uploader) {
    return this.request(`/log/records/uploader/${uploader}`)
  }
}

export default new ApiClient()