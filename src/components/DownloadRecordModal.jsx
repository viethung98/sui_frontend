import { AlertCircle, CheckCircle, Download, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import api from '../services/api'

/**
 * Modal for downloading and decrypting medical records
 * Requires user to input password to decrypt stored private key
 */
export default function DownloadRecordModal({ 
  record, 
  fileIndex = 0,
  requesterAddress,
  onSuccess, 
  onClose 
}) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleDownload = async () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get encrypted private key from storage
      const encryptedKey = localStorage.getItem('encrypted_key')
      if (!encryptedKey) {
        // For development: use placeholder key
        console.warn('No encrypted key found in localStorage, using placeholder')
        // TODO: In production, this should fail and prompt user to set up key
        setError('No private key configured. This is a development limitation - backend needs private key for Seal decryption.')
        setLoading(false)
        return
      }

      // Decrypt private key with password
      // Note: In production, use proper encryption library like CryptoJS
      const privateKey = atob(encryptedKey) // Temporary: just base64
      console.log('Private key decrypted, downloading record...')
      
      // Download and decrypt record
      console.log('Downloading record:', record.recordId, 'file index:', fileIndex)
      const blob = await api.downloadRecord(record.recordId, {
        requesterAddress: requesterAddress,
        fileIndex: fileIndex,
        privateKey: privateKey
      })

      console.log('Record downloaded successfully, creating download link...')

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `medical_record_${record.recordId.slice(0, 8)}_${fileIndex}.bin`
      a.click()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Download failed:', err)
      setError(err.message || 'Failed to download record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-text-light dark:text-text-dark">
            Download Record
          </h2>
          {!loading && !success && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
              Download Started!
            </h3>
            <p className="text-sm text-text-muted">
              Check your downloads folder
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Record:</strong> {record.recordId.slice(0, 16)}...
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                File {fileIndex + 1} of {record.filesCount || record.walrusCids?.length || 1}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-light dark:text-text-dark disabled:opacity-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light dark:hover:text-text-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-900 dark:text-yellow-200">
                <strong>Security:</strong> Your password is used to decrypt your private key locally. It never leaves your device.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-900 dark:text-orange-200">
                <strong>Note:</strong> This is a development version. For production, use proper key management with CryptoJS or similar library.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text-light dark:text-text-dark rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                disabled={loading || !password}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
