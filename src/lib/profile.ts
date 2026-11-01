export type PlistData = { __plistData: string };
export type PlistValue = string | number | boolean | PlistData | PlistValue[] | { [key: string]: PlistValue };
export type Payload = {
  id: string;
  type: string;
  name: string;
  description: string;
  enabled: boolean;
  platform: string;
  values: Record<string, PlistValue>;
};

export const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 3 | 8)).toString(16);
});

export const catalog = [
  { type: 'com.apple.wifi.managed', name: 'Wi-Fi', category: 'Network', platform: 'iOS, iPadOS, macOS', description: 'Configure a managed wireless network.', fields: [['SSID_STR','Network name','string'],['AutoJoin','Automatically join','boolean'],['HIDDEN_NETWORK','Hidden network','boolean'],['EncryptionType','Encryption','select:none,WEP,Any,WPA,WPA2,WPA3'],['Password','Password','password']] },
  { type: 'com.apple.vpn.managed', name: 'VPN', category: 'Network', platform: 'iOS, iPadOS, macOS', description: 'Configure a VPN connection. Provider-specific keys may be required.', fields: [['UserDefinedName','Connection name','string'],['VPNType','VPN type','select:IPsec,IKEv2,L2TP'],['RemoteAddress','Server address','string'],['AuthName','Account name','string'],['OnDemandEnabled','Connect on demand','boolean']] },
  { type: 'com.apple.dnsSettings.managed', name: 'DNS settings', category: 'Network', platform: 'iOS, iPadOS, macOS', description: 'Configure encrypted DNS-over-HTTPS or DNS-over-TLS.', fields: [['DNSProtocol','Protocol','select:HTTPS,TLS'],['ServerURL','DoH server URL','string'],['ServerName','DoT server name','string']] },
  { type: 'com.apple.proxy.http.global', name: 'Global HTTP proxy', category: 'Network', platform: 'Supervised iOS, iPadOS', description: 'Set a device-wide HTTP proxy. Availability is restricted.', fields: [['ProxyType','Proxy type','select:Manual,Auto'],['ProxyServer','Proxy server','string'],['ProxyServerPort','Port','number'],['ProxyPACURL','PAC URL','string'],['ProxyUsername','Username','string']] },
  { type: 'com.apple.webClip.managed', name: 'Web clip', category: 'Web & apps', platform: 'iOS, iPadOS, macOS', description: 'Add a Home Screen web shortcut.', fields: [['Label','Label','string'],['URL','URL','string'],['IsRemovable','Removable','boolean'],['FullScreen','Open full screen','boolean'],['Precomposed','Precomposed icon','boolean']] },
  { type: 'com.apple.applicationaccess', name: 'Restrictions', category: 'Restrictions', platform: 'iOS, iPadOS, macOS (varies)', description: 'Set supported device restrictions. Many keys depend on OS and supervision.', fields: [['allowAppInstallation','Allow app installation','boolean'],['allowCamera','Allow camera','boolean'],['allowSafari','Allow Safari','boolean'],['allowScreenShot','Allow screenshots','boolean'],['allowAirDrop','Allow AirDrop','boolean'],['allowiCloudBackup','Allow iCloud backup','boolean'],['forceEncryptedBackup','Require encrypted backups','boolean']] },
  { type: 'com.apple.mobilemail', name: 'Mail account', category: 'Accounts', platform: 'iOS, iPadOS', description: 'Configure an IMAP or POP mail account.', fields: [['EmailAddress','Email address','string'],['AccountName','Account name','string'],['IncomingMailServerHostName','Incoming server','string'],['IncomingMailServerPortNumber','Incoming port','number'],['OutgoingMailServerHostName','Outgoing server','string'],['OutgoingMailServerPortNumber','Outgoing port','number'],['IncomingMailServerUseSSL','Incoming SSL','boolean'],['OutgoingMailServerUseSSL','Outgoing SSL','boolean']] },
  { type: 'com.apple.eas.account', name: 'Exchange account', category: 'Accounts', platform: 'iOS, iPadOS', description: 'Configure a Microsoft Exchange ActiveSync account.', fields: [['EmailAddress','Email address','string'],['Host','Exchange server','string'],['UserName','Username','string'],['UseSSL','Use SSL','boolean'],['OAuth','Use OAuth','boolean']] },
  { type: 'com.apple.carddav.account', name: 'CardDAV account', category: 'Accounts', platform: 'iOS, iPadOS, macOS', description: 'Configure a CardDAV contacts account.', fields: [['HostName','Server','string'],['UserName','Username','string'],['AccountDescription','Description','string'],['UseSSL','Use SSL','boolean']] },
  { type: 'com.apple.caldav.account', name: 'CalDAV account', category: 'Accounts', platform: 'iOS, iPadOS, macOS', description: 'Configure a CalDAV calendar account.', fields: [['HostName','Server','string'],['UserName','Username','string'],['AccountDescription','Description','string'],['UseSSL','Use SSL','boolean']] },
  { type: 'com.apple.credential', name: 'Certificate (PKCS#12)', category: 'Certificates', platform: 'iOS, iPadOS, macOS', description: 'Install a PKCS#12 identity. Binary data must be base64 encoded.', fields: [['PayloadContent','PKCS#12 data (base64)','textarea'],['Password','Import password','password']] },
  { type: 'com.apple.security.root', name: 'Root certificate', category: 'Certificates', platform: 'iOS, iPadOS, macOS', description: 'Install a trusted X.509 certificate in DER or base64 form.', fields: [['PayloadContent','Certificate data (base64)','textarea']] },
  { type: 'com.apple.scep', name: 'SCEP identity', category: 'Certificates', platform: 'iOS, iPadOS, macOS', description: 'Request a certificate from an SCEP server.', fields: [['URL','SCEP URL','string'],['Name','Challenge name','string'],['Subject','Subject (JSON array)','textarea'],['Keysize','Key size','number'],['KeyType','Key type','select:RSA,ECSECPrimeRandom']] },
  { type: 'com.apple.font', name: 'Font', category: 'Other', platform: 'iOS, iPadOS, macOS', description: 'Install a supported font file. PayloadContent is base64 encoded font data.', fields: [['Name','Font name','string'],['PayloadContent','Font data (base64)','textarea']] },
  { type: 'com.apple.airprint', name: 'AirPrint printer', category: 'Other', platform: 'iOS, iPadOS, macOS', description: 'Add an AirPrint printer destination.', fields: [['IPAddress','Printer IP address','string'],['ResourcePath','Resource path','string'],['Port','Port','number'],['ForceTLS','Require TLS','boolean']] },
  { type: 'com.apple.notificationsettings', name: 'Notification settings', category: 'Web & apps', platform: 'iOS, iPadOS', description: 'Configure notifications for an application bundle identifier.', fields: [['BundleIdentifier','App bundle identifier','string'],['NotificationsEnabled','Notifications enabled','boolean'],['ShowInNotificationCenter','Show in Notification Center','boolean'],['BadgesEnabled','Badges enabled','boolean'],['SoundsEnabled','Sounds enabled','boolean']] },
  { type: 'com.apple.ManagedClient.preferences', name: 'Managed preferences', category: 'Advanced', platform: 'macOS', description: 'Deliver preference domain payloads, typically for managed macOS settings.', fields: [['PayloadContent','Preference payload (JSON)','textarea']] },
  { type: 'com.apple.domains', name: 'Managed domains', category: 'Web & apps', platform: 'iOS, iPadOS', description: 'Define managed web domains for supported managed-app behaviours.', fields: [['SafariPasswordAutoFillDomains','Password AutoFill domains (JSON array)','textarea'],['WebDomains','Managed web domains (JSON array)','textarea']] },
  { type: 'com.apple.applicationaccess.new', name: 'App access restrictions', category: 'Restrictions', platform: 'iOS, iPadOS (varies)', description: 'Additional application access restriction payload keys.', fields: [['allowAppClips','Allow App Clips','boolean'],['allowBluetoothModification','Allow Bluetooth changes','boolean'],['allowVPNCreation','Allow VPN creation','boolean']] }
] as const;

export function createPayload(type: string): Payload {
  const item = catalog.find(x => x.type === type);
  if (!item) throw new Error('Unknown payload type');
  const values: Record<string, PlistValue> = {};
  for (const [key,,kind] of item.fields) {
    values[key] = kind === 'boolean' ? true : kind === 'number' ? 0 : kind.startsWith('select:') ? kind.slice(7).split(',')[0] : '';
  }
  return { id: uuid(), type, name: item.name, description: item.description, enabled: true, platform: item.platform, values };
}

export function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function plistValue(value: PlistValue, depth = 0): string {
  const pad = '  '.repeat(depth);
  if (typeof value === 'boolean') return value ? '<true/>' : '<false/>';
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && '__plistData' in value) return '<data>' + String(value.__plistData).replace(/\s+/g, '') + '</data>';
  if (typeof value === 'number') return Number.isInteger(value) ? `<integer>${value}</integer>` : `<real>${value}</real>`;
  if (typeof value === 'string') return `<string>${escapeXml(value)}</string>`;
  if (Array.isArray(value)) return '<array>\n' + value.map(v => pad + '  ' + plistValue(v, depth + 1)).join('\n') + '\n' + pad + '</array>';
  return '<dict>\n' + Object.entries(value).map(([k,v]) => pad + '  <key>' + escapeXml(k) + '</key>\n' + pad + '  ' + plistValue(v, depth + 1)).join('\n') + '\n' + pad + '</dict>';
}
export function toPlist(value: PlistValue) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n' + plistValue(value) + '\n</plist>\n';
}
export function profileObject(meta: { name: string; identifier: string; organization: string; description: string; uuid: string; removal: string }, payloads: Payload[]): PlistValue {
  const enabled = payloads.filter(p => p.enabled);
  return {
    PayloadType: 'Configuration',
    PayloadContent: enabled.map(p => ({
      PayloadType: p.type, PayloadVersion: 1, PayloadIdentifier: meta.identifier + '.' + p.id,
      PayloadUUID: p.id, PayloadDisplayName: p.name, PayloadDescription: p.description,
      ...Object.fromEntries(Object.entries(p.values).map(([key, value]) => [key, (key === 'PayloadContent' && (p.type === 'com.apple.security.root' || p.type === 'com.apple.credential') && typeof value === 'string') ? { __plistData: value.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----/g, '').replace(/\s+/g, '') } : value]))
    })),
    PayloadDisplayName: meta.name, PayloadIdentifier: meta.identifier, PayloadUUID: meta.uuid,
    PayloadVersion: 1, PayloadOrganization: meta.organization, PayloadDescription: meta.description,
    PayloadScope: 'System',
    ...(meta.removal === 'never' ? { PayloadRemovalDisallowed: true } : meta.removal === 'password' ? { RemovalPassword: '' } : {})
  };
}
