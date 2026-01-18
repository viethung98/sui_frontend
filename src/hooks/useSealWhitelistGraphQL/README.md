# useSealWhitelistGraphQL

React hook for fetching SealWhitelist dynamic object fields using Sui GraphQL RPC.

## Features

- Fetch dynamic fields (TimelineEntry, DepositPool) from SealWhitelist objects
- Automatic patient reference hashing (blake2b256) matching Move contract logic
- Filter entries by patient reference
- Support for both filtered and unfiltered entry lists
- Fetch full TimelineEntry object content by object ID

## Installation

```bash
npm install blakejs
```

## Usage

### Basic Usage

```javascript
import { useSealWhitelistDynamicFields } from './hooks';

function MedicalTimeline({ whitelistId, patientAddress }) {
  const {
    allTimelineEntries,
    timelineEntries,
    depositPools,
    loading,
    error,
    refresh,
    patientRefBytes,
  } = useSealWhitelistDynamicFields(whitelistId, patientAddress, {
    autoFetch: true,
    filterByPatientRef: true,
  });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Timeline Entries</h2>
      {timelineEntries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
```

### With Filtering

```javascript
import { useTimelineEntryFilter } from './hooks';

function FilteredTimeline({ whitelistId, patientAddress }) {
  const {
    timelineEntries,
    getEntriesByType,
    getEntriesByStatus,
    getNonRevokedEntries,
  } = useTimelineEntryFilter(whitelistId, patientAddress);

  // Get only lab results
  const labResults = getEntriesByType(5); // 5 = lab_result

  // Get verified entries
  const verifiedEntries = getEntriesByStatus('verified');

  // Get active (non-revoked) entries
  const activeEntries = getNonRevokedEntries();

  return (
    <div>
      {/* Render entries */}
    </div>
  );
}
```

### Fetch Full Entry Content

```javascript
import { useSealWhitelistDynamicFields, useTimelineEntry } from './hooks';

function EntryDetail({ whitelistId }) {
  const { allTimelineEntries, loading } = useSealWhitelistDynamicFields(whitelistId, null, {
    autoFetch: false,
    filterByPatientRef: false,
  });

  const { data: fullEntry, loading: entryLoading } = useTimelineEntry(
    whitelistId,
    selectedEntry?.dynamicObjectId
  );

  if (loading) return <Loading />;

  return (
    <div>
      {allTimelineEntries.map(entry => (
        <button key={entry.id} onClick={() => setSelectedEntry(entry)}>
          View {entry.entryTypeName}
        </button>
      ))}

      {entryLoading && <p>Loading entry details...</p>}
      {fullEntry && (
        <div>
          <h3>{fullEntry.visitDate}</h3>
          <p>Provider: {fullEntry.providerSpecialty}</p>
          <p>Status: {fullEntry.status}</p>
          <p>Content Hash: {fullEntry.contentHash}</p>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### useSealWhitelistDynamicFields(objectId, patientRef, options)

**Parameters:**
- `objectId` (string): SealWhitelist object ID
- `patientRef` (string): Patient address for filtering (optional)
- `options` (Object):
  - `autoFetch` (boolean): Auto-fetch on mount (default: true)
  - `filterByPatientRef` (boolean): Filter by patient ref (default: true)

**Returns:**
```javascript
{
  data: Object,
  sealWhitelist: Object,
  timelineEntries: Array,        // Filtered by patient ref
  allTimelineEntries: Array,     // All entries (unfiltered)
  depositPools: Array,
  otherFields: Array,
  loading: boolean,
  error: Error | null,
  refresh: Function,
  patientRefBytes: Uint8Array,
  fetchedAt: number,
}
```

### useTimelineEntry(whitelistObjectId, entryObjectId)

Fetches full content of a specific TimelineEntry object.

**Parameters:**
- `whitelistObjectId` (string): Parent SealWhitelist object ID
- `entryObjectId` (string): TimelineEntry object ID to fetch

**Returns:**
```javascript
{
  data: {
    objectId: string,
    version: number,
    digest: string,
    type: string,
    patientRefBytes: Array,
    entryType: number,
    entryTypeName: string,
    visitDate: string,
    providerSpecialty: string,
    visitType: string,
    status: string,
    contentHash: string,
    walrusBlobId: Array,
    createdAt: number,
    revoked: boolean,
    rawData: Object,  // Full GraphQL response
  } | null,
  loading: boolean,
  error: Error | null,
  refresh: Function,
}
```

### useTimelineEntryFilter(objectId, patientRef)

Factory hook with filtering methods. Returns all properties from `useSealWhitelistDynamicFields` plus:

- `getEntriesByType(entryType)` - Filter by entry type (0-6)
- `getEntriesByStatus(status)` - Filter by status string
- `getNonRevokedEntries()` - Filter out revoked entries

## Data Structure

### TimelineEntry (from dynamic fields)

```javascript
{
  id: string,                    // `${whitelistObjectId}-${timestampMs}`
  objectId: string,              // Parent SealWhitelist object ID
  dynamicObjectId: string | null, // Actual TimelineEntry object ID (from dynamic field value)
  patientRefBytes: Array,        // Patient reference bytes (from key)
  timestampMs: number,           // Entry timestamp (milliseconds, from key BCS)
  entryType: number,             // 0-6 (see Entry Types)
  entryTypeName: string,         // Human-readable type name
  visitDate: string,             // YYYY-MM-DD format
  providerSpecialty: string,     // Provider category
  visitType: string,             // Visit category
  status: string,                // Entry status
  contentHash: string,           // SHA3-256 hash
  walrusBlobId: Array,           // Walrus storage ID
  createdAt: number,             // Creation timestamp (same as timestampMs)
  revoked: boolean,              // Revocation status
}
```

### DepositPool

```javascript
{
  id: string,                    // JSON stringified key
  objectId: string,              // Parent SealWhitelist object ID
  dynamicObjectId: string | null, // Actual DepositPool object ID (from dynamic field value)
  timelineEntryId: string,       // Linked TimelineEntry ID
  patientRefBytes: Array,        // Patient reference bytes
  creator: string,               // Pool creator address
  amount: number,                // Pool balance in MIST
  active: boolean,               // Pool status
}
```

### Entry Types

| Value | Name | Description |
|-------|------|-------------|
| 0 | visit_summary | General visit summary |
| 1 | procedure | Medical procedure |
| 2 | refill | Prescription refill |
| 3 | note | Medical note |
| 4 | diagnosis | Diagnosis information |
| 5 | lab_result | Lab test results |
| 6 | immunization | Immunization record |

## GraphQL Endpoint

- **Testnet**: `https://graphql.testnet.sui.io/graphql`
- **Mainnet**: `https://graphql.mainnet.sui.io/graphql`

## Example Object IDs

```javascript
// Test SealWhitelist object
const SEAL_WHITELIST_ID = '0x1a54378f8b050138b3b4868f0074a78cc9d4e739417c5f2e4aee442a7f29a5de';

// Patient address for testing
const PATIENT_ADDRESS = '0xb5a4b0fbbd3b57d06c4c040a23a70182eb0cd7770dee6d327cbfae56fb4bcafa';
```

## Error Handling

```javascript
const { loading, error, refresh } = useSealWhitelistDynamicFields(id, ref);

if (error) {
  if (error.message.includes('not found')) {
    // Handle object not found
  } else if (error.message.includes('GraphQL')) {
    // Handle GraphQL errors
  }
}
```

## Related

- [Sui GraphQL Documentation](https://docs.sui.io/guides/developer/accessing-data/query-with-graphql)
- [Medical Vault Move Contracts](../../move/medical-vault/sources/timeline.move)
