export function isEvmAddress(value:string):boolean{return /^0x[a-fA-F0-9]{40}$/.test(value)}
export function assertAllowedPolygonAddress(address:string, allowlist:string[]):void{ if(!isEvmAddress(address)) throw new Error('Invalid EVM address'); if(!allowlist.includes(address.toLowerCase())) throw new Error('Destination is not allowlisted'); }
