<script lang="ts">
  import { base } from '$app/paths';
  import { catalog, createPayload, profileObject, toPlist, uuid, type Payload, type PlistValue } from '$lib/profile';

  let meta = $state({ name: 'My Configuration', identifier: 'com.example.profile', organization: '', description: 'Generated with iOS Mobileconfig Gen Full', uuid: uuid(), removal: 'allowed' });
  let payloads = $state<Payload[]>([]);
  let selected = $state('');
  let search = $state('');
  let category = $state('All');
  let tab = $state('editor');
  let showRaw = $state(false);
  let raw = $state('');
  let notice = $state('');
  const categories = ['All', ...new Set(catalog.map(x => x.category))];
  let filtered = $derived(catalog.filter(x => (category === 'All' || x.category === category) && (x.name + x.type + x.description).toLowerCase().includes(search.toLowerCase())));
  let current = $derived(payloads.find(p => p.id === selected));
  let profile = $derived(profileObject(meta, payloads));
  let xml = $derived(toPlist(profile));

  function add(type: string) {
    const p = createPayload(type); payloads.push(p); selected = p.id; tab = 'editor'; notice = p.name + ' added';
  }
  function remove(id: string) { payloads = payloads.filter(p => p.id !== id); if (selected === id) selected = payloads[0]?.id ?? ''; }
  function download() {
    const blob = new Blob([xml], { type: 'application/x-apple-aspen-config; charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = (meta.name || 'configuration').replace(/[^a-z0-9-_]+/gi, '-') + '.mobileconfig'; a.click(); URL.revokeObjectURL(url);
    notice = 'Profile exported';
  }
  async function copy() { await navigator.clipboard.writeText(xml); notice = 'XML copied'; }
  function exportJson() {
    const blob = new Blob([JSON.stringify({ meta, payloads }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'profile-project.json'; a.click(); URL.revokeObjectURL(url);
  }
  function importJson(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => {
      try { const data = JSON.parse(String(reader.result)); if (!data.meta || !Array.isArray(data.payloads)) throw new Error(); meta = data.meta; payloads = data.payloads; selected = payloads[0]?.id ?? ''; notice = 'Project imported'; }
      catch { notice = 'Invalid project JSON'; }
    }; reader.readAsText(file);
  }
  function updateValue(key: string, value: PlistValue) { if (current) current.values[key] = value; }
  function parseValue(value: string): PlistValue {
    try { return JSON.parse(value) as PlistValue; } catch { return value; }
  }
  function getKind(type: string, key: string) {
    return catalog.find(x => x.type === type)?.fields.find(f => f[0] === key)?.[2] ?? 'string';
  }
  function fieldLabel(type: string, key: string) {
    return catalog.find(x => x.type === type)?.fields.find(f => f[0] === key)?.[1] ?? key;
  }
  function fieldKeys(p: Payload) { return Object.keys(p.values); }
  function addCustomField() {
    if (!current) return;
    const key = prompt('Exact Apple payload key (case-sensitive):'); if (!key?.trim()) return;
    if (key in current.values) { notice = 'That key already exists'; return; }
    current.values[key] = ''; notice = 'Custom key added';
  }
  function addArbitrary() {
    const type = prompt('Exact PayloadType identifier (for example com.apple.security.pem):'); if (!type?.trim()) return;
    const name = prompt('Display name for this payload:') || type;
    const p: Payload = { id: uuid(), type, name, description: 'Custom payload. Check Apple platform support and required keys.', enabled: true, platform: 'Check Apple documentation', values: {} };
    payloads.push(p); selected = p.id;
  }
</script>

<svelte:head>
  <title>Mobileconfig Studio — Apple Configuration Profiles</title>
  <meta name="description" content="Build, edit, validate and export Apple configuration profiles." />
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <a class="brand" href={base + '/'} aria-label="Mobileconfig Studio home"><span class="brand-icon">▤</span><span>Mobileconfig <b>Studio</b></span></a>
    <div class="top-actions"><span class="local-pill"><i></i> Runs locally</span><button class="quiet" onclick={exportJson}>Export project</button><label class="quiet import">Import project<input type="file" accept="application/json" onchange={importJson} /></label><button class="primary" onclick={download}>↓ Export .mobileconfig</button></div>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">CONFIGURATION PROFILES</div>
        <h1>Profile editor</h1>
        <p>Create and configure Apple device profiles. Your work stays in this browser until you export it.</p>
      </div>
      <div class="hero-status"><span class="status-led"></span> On this device</div>
    </section>

    <section class="workspace">
      <aside class="sidebar">
        <div class="side-head"><div><span class="eyebrow">PAYLOAD LIBRARY</span><h2>Add payload</h2></div><span class="count">{catalog.length}</span></div>
        <div class="search"><span>⌕</span><input placeholder="Search payloads..." bind:value={search} /></div>
        <div class="categories">{#each categories as c}<button class:active={category === c} onclick={() => category = c}>{c}</button>{/each}</div>
        <div class="library-list">
          {#each filtered as item}
            <button class="library-item" onclick={() => add(item.type)}><span class="payload-symbol">{item.category === 'Network' ? '⌁' : item.category === 'Certificates' ? '◇' : item.category === 'Restrictions' ? '⊘' : item.category === 'Accounts' ? '◎' : '▧'}</span><span class="library-copy"><b>{item.name}</b><small>{item.description}</small></span><span class="plus">+</span></button>
          {/each}
          {#if filtered.length === 0}<div class="empty">No matching payloads.</div>{/if}
        </div>
        <button class="custom-add" onclick={addArbitrary}>＋ Add custom payload type</button>
      </aside>

      <section class="main-panel">
        <div class="panel-tabs"><button class:active={tab === 'editor'} onclick={() => tab = 'editor'}>Profile editor</button><button class:active={tab === 'preview'} onclick={() => tab = 'preview'}>XML preview</button><span class="spacer"></span><span class="payload-total">{payloads.length} payload{payloads.length === 1 ? '' : 's'}</span></div>
        {#if tab === 'editor'}
          <div class="editor-scroll">
            <div class="section-title"><div><span class="eyebrow">GENERAL</span><h2>Profile details</h2></div><span class="status-dot">● Draft</span></div>
            <div class="form-grid">
              <label class="wide">Display name<input bind:value={meta.name} placeholder="My Configuration Profile" /></label>
              <label>Organization<input bind:value={meta.organization} placeholder="Your organization" /></label>
              <label>Profile identifier<input bind:value={meta.identifier} placeholder="com.example.profile" /></label>
              <label class="wide">Description<textarea bind:value={meta.description} rows="2"></textarea></label>
              <label>Removal policy<select bind:value={meta.removal}><option value="allowed">User can remove</option><option value="never">Removal prohibited</option><option value="password">Require removal password (set in XML)</option></select></label>
              <label>Profile UUID<div class="input-action"><input bind:value={meta.uuid} /><button onclick={() => meta.uuid = uuid()}>↻</button></div></label>
            </div>
            <div class="divider"></div>
            <div class="section-title"><div><span class="eyebrow">CONFIGURATION</span><h2>Payloads</h2><p>Choose payloads from the library. Select one to configure its properties.</p></div></div>
            {#if payloads.length === 0}
              <div class="empty-state"><div class="empty-icon">＋</div><h3>Your profile is empty</h3><p>Add a payload from the library to start building your configuration.</p></div>
            {:else}
              <div class="payload-stack">
                {#each payloads as p, i}
                  <div class="payload-row" class:selected={selected === p.id}>
                    <button class="payload-select" onclick={() => selected = p.id}><span class="payload-index">{String(i + 1).padStart(2,'0')}</span><span><b>{p.name}</b><small>{p.type}</small></span></button>
                    <span class="platform-tag">{p.platform}</span><button class="toggle" class:on={p.enabled} aria-label="Toggle payload" onclick={() => p.enabled = !p.enabled}><span></span></button><button class="delete" aria-label="Remove payload" onclick={() => remove(p.id)}>×</button>
                  </div>
                {/each}
              </div>
              {#if current}
                <div class="config-card">
                  <div class="config-heading"><div><span class="eyebrow">PAYLOAD SETTINGS</span><h3>{current.name}</h3><p>{current.description}</p></div><button class="text-button" onclick={addCustomField}>＋ Custom key</button></div>
                  <div class="field-grid">
                    {#each fieldKeys(current) as key}
                      <label class="field" class:full={getKind(current.type,key) === 'textarea'}>
                        <span>{fieldLabel(current.type,key)} <code>{key}</code></span>
                        {#if getKind(current.type,key) === 'boolean'}
                          <button class="boolean-control" class:checked={Boolean(current.values[key])} onclick={() => updateValue(key, !Boolean(current.values[key]))}><span></span>{current.values[key] ? 'Enabled' : 'Disabled'}</button>
                        {:else if getKind(current.type,key).startsWith('select:')}
                          <select value={String(current.values[key])} onchange={e => updateValue(key, e.currentTarget.value)}>{#each getKind(current.type,key).slice(7).split(',') as option}<option>{option}</option>{/each}</select>
                        {:else if getKind(current.type,key) === 'textarea'}
                          <textarea rows="4" value={typeof current.values[key] === 'string' ? String(current.values[key]) : JSON.stringify(current.values[key],null,2)} oninput={e => updateValue(key, parseValue(e.currentTarget.value))} placeholder="Enter text, base64 data, or JSON..."></textarea>
                        {:else}
                          <input type={getKind(current.type,key) === 'password' ? 'password' : getKind(current.type,key) === 'number' ? 'number' : 'text'} value={String(current.values[key] ?? '')} oninput={e => updateValue(key, getKind(current.type,key) === 'number' ? Number(e.currentTarget.value) : e.currentTarget.value)} />
                        {/if}
                      </label>
                    {/each}
                  </div>
                  <div class="advanced-note">Advanced: add exact Apple-defined keys with <b>Custom key</b>. Values are serialized as plist strings unless entered as valid JSON in a textarea.</div>
                </div>
              {/if}
            {/if}
          </div>
        {:else}
          <div class="preview-pane"><div class="preview-heading"><div><span class="eyebrow">GENERATED PROPERTY LIST</span><h2>XML source</h2><p>This is the exact XML content exported in your profile.</p></div><button class="quiet" onclick={copy}>Copy XML</button></div><pre>{xml}</pre></div>
        {/if}
      </section>

      <aside class="inspector">
        <div class="inspector-title"><span class="eyebrow">PROFILE SUMMARY</span><h2>Overview</h2></div>
        <div class="summary-card"><div class="summary-icon">▤</div><b>{meta.name || 'Untitled profile'}</b><small>{meta.identifier || 'No identifier set'}</small><div class="summary-stats"><div><strong>{payloads.length}</strong><span>Payloads</span></div><div><strong>{payloads.filter(p => p.enabled).length}</strong><span>Enabled</span></div></div></div>
        <div class="checklist"><h3>Before you export</h3><div class="check-row"><span class:good={!!meta.name}>✓</span>Profile has a name</div><div class="check-row"><span class:good={!!meta.identifier}>✓</span>Identifier is set</div><div class="check-row"><span class:good={payloads.length > 0}>✓</span>At least one payload</div><div class="check-row"><span class:good={payloads.some(p => p.enabled)}>✓</span>At least one enabled payload</div></div>
        <div class="warning-card"><span>ⓘ</span><div><b>Compatibility matters</b><p>Payload availability depends on OS version, device family, supervision and enrollment. Verify each key against Apple's deployment documentation.</p></div></div>
        <button class="primary export-wide" onclick={download}>↓ Export .mobileconfig</button>
        <button class="secondary-wide" onclick={() => { tab = 'preview'; }}>View generated XML</button>
      </aside>
    </section>
    <footer><span>Mobileconfig Studio <b>·</b> Built for Apple platforms</span><span>Profiles are generated in your browser. No profile data is uploaded.</span></footer>
  </main>
  {#if notice}<div class="toast" role="status">{notice}</div>{/if}
</div>