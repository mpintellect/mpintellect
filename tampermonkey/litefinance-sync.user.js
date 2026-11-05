// ==UserScript==
// @name         MPIntellect - LiteFinance Broker Sync
// @namespace    https://mpintellect.com
// @version      1.0
// @description  Pull this month's LiteFinance deposits/withdrawals/users and push them to the MPIntellect admin dashboard.
// @match        https://admin.litefinance.com/deposits/index*
// @match        https://admin.litefinance.com/withdrawals/index*
// @match        https://admin.litefinance.com/users/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      admin.mpintellect.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const INGEST_URL = 'https://admin.mpintellect.com/api/admin/broker-lite/sync';
  const START_SESSION_URL = 'https://admin.mpintellect.com/api/admin/broker-lite/start-session';
  const WATERMARK_URL = 'https://admin.mpintellect.com/api/admin/broker-lite/watermark';
  const GAPS_URL = 'https://admin.mpintellect.com/api/admin/broker-lite/users-gaps';
  const TOKEN_KEY = 'mz_litefinance_ingest_token';
  const PAGE_SIZE = 50;
  const WANTED_STATUSES = {
    deposits: ['deposited', 'declined'],
    withdrawals: ['done', 'done auto'],
  };

  function getToken() {
    let token = GM_getValue(TOKEN_KEY, '');
    if (!token) {
      token = (prompt('MPIntellect ingest token (ask the admin dashboard owner):') || '').trim();
      if (token) GM_setValue(TOKEN_KEY, token);
    }
    return token;
  }

  function gmRequest(opts) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...opts,
        onload: (resp) => resolve(resp),
        onerror: () => reject(new Error('Network error reaching MPIntellect')),
      });
    });
  }

  async function startSyncSession(token) {
    const code = (prompt('Enter your 6-digit authenticator code to start this sync:') || '').trim();
    if (!/^\d{6}$/.test(code)) {
      throw new Error('A 6-digit code is required to start a sync.');
    }
    const resp = await gmRequest({
      method: 'POST',
      url: START_SESSION_URL,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      data: JSON.stringify({ code }),
    });
    const json = JSON.parse(resp.responseText);
    if (resp.status !== 200 || !json.sessionToken) {
      throw new Error(json.error || `Could not start sync session (${resp.status})`);
    }
    return json.sessionToken;
  }

  function resetToken() {
    GM_setValue(TOKEN_KEY, '');
    alert('LiteFinance ingest token cleared - you will be asked for the new one on your next Sync click.');
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Reset LiteFinance ingest token', resetToken);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function firstOfMonthISO() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  }

  function chronoKey(txDate) {
    const [d, t] = (txDate || '').split(' ');
    const [dd, mm, yyyy] = (d || '').split('.');
    return `${yyyy || ''}${mm || ''}${dd || ''} ${t || ''}`;
  }

  async function getWatermark(token) {
    const resp = await gmRequest({
      method: 'GET',
      url: WATERMARK_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.status !== 200) return { deposits: null, withdrawals: null };
    return JSON.parse(resp.responseText);
  }

  function parseMoney(raw) {
    if (!raw) return { amount: null, currency: '' };
    const trimmed = raw.trim();
    const noThousands = trimmed.replace(/(\d)[,\s](?=\d)/g, '$1');
    const match = noThousands.match(/([\d.]+)/);
    const amount = match ? parseFloat(match[1]) : null;
    const currency = noThousands.replace(/[\d.\s$]/g, '').trim() || (trimmed.includes('$') ? 'USD' : '');
    return { amount, currency };
  }

  function cellText(td) {
    return (td.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function extractUser(td) {
    const country = td.querySelector('img[title]')?.getAttribute('title') || '';
    const badgeSpans = Array.from(td.querySelectorAll('span[title]'));
    const verifSpan = badgeSpans.find((s) => /verified/i.test(s.getAttribute('title') || ''));
    const verification = verifSpan ? verifSpan.getAttribute('title') || '' : '';

    const clone = td.cloneNode(true);
    clone.querySelectorAll('img, span[title]').forEach((el) => el.remove());
    const name = (clone.textContent || '').replace(/\s+/g, ' ').trim();

    return { name, country, verification };
  }

  function parseDepositRow(tr) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 9) return null;
    const id = cellText(tds[0]);
    if (!id) return null;
    const user = extractUser(tds[2]);
    const deposit = parseMoney(cellText(tds[5]));
    const pay = parseMoney(cellText(tds[6]));
    const usd = parseMoney(cellText(tds[7]));
    return {
      id,
      txDate: cellText(tds[1]),
      userName: user.name,
      country: user.country,
      verification: user.verification,
      account: cellText(tds[3]),
      method: cellText(tds[4]),
      depositAmount: deposit.amount,
      depositCurrency: deposit.currency,
      payAmount: pay.amount,
      payCurrency: pay.currency,
      usdAmount: usd.amount,
      status: cellText(tds[8]),
    };
  }

  function parseWithdrawalRow(tr) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 10) return null;
    const id = cellText(tds[0]);
    if (!id) return null;
    const user = extractUser(tds[2]);
    const usd = parseMoney(cellText(tds[5]));
    const pay = parseMoney(cellText(tds[6]));
    const total = parseMoney(cellText(tds[7]));
    return {
      id,
      txDate: cellText(tds[1]),
      userName: user.name,
      country: user.country,
      verification: user.verification,
      account: cellText(tds[3]),
      method: cellText(tds[4]),
      usdAmount: usd.amount,
      payAmount: pay.amount,
      payCurrency: pay.currency,
      totalAmount: total.amount,
      totalCurrency: total.currency,
      status: cellText(tds[8]),
      autoTest: cellText(tds[9]),
    };
  }

  function parseUserRow(tr) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 7) return null;
    const href = tds[0].querySelector('a')?.getAttribute('href') || '';
    const idMatch = href.match(/id=(\d+)/);
    const viewId = idMatch ? idMatch[1] : null;
    if (!viewId) return null;

    return {
      id: viewId,
      clientUid: cellText(tds[2]),
      name: null,
      email: null,
      country: cellText(tds[1]),
      regDate: cellText(tds[4]),
    };
  }

  async function fetchUserDetail(viewId) {
    const res = await fetch(`/users/view?id=${encodeURIComponent(viewId)}`);
    if (!res.ok) return { name: null, email: null, phone: null, emailStatus: null, phoneStatus: null, clientStatus: null };
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fields = {};
    doc.querySelectorAll('tr').forEach((tr) => {
      const th = tr.querySelector('th');
      const td = tr.querySelector('td');
      if (th && td) fields[th.textContent.trim()] = td.textContent.replace(/\s+/g, ' ').trim();
    });
    return {
      name: fields['Name'] || null,
      email: fields['Email'] || null,
      phone: fields['Phone'] || null,
      emailStatus: fields['Email status'] || null,
      phoneStatus: fields['Phone status'] || null,
      clientStatus: fields['Client status'] || null,
    };
  }

  async function pushPage(kind, page, rows, token, sessionToken) {
    const resp = await gmRequest({
      method: 'POST',
      url: INGEST_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Sync-Session': sessionToken,
      },
      data: JSON.stringify({ kind, page, rows }),
    });
    if (resp.status >= 200 && resp.status < 300) {
      return JSON.parse(resp.responseText);
    }
    if (resp.status === 401) GM_setValue(TOKEN_KEY, '');
    throw new Error(`Ingest failed (${resp.status}): ${resp.responseText.slice(0, 200)}`);
  }

  async function walkAndSync(kind, token, sessionToken, watermark, onStatus) {
    const formPrefix = kind === 'deposits' ? 'DepositsFiltersForm' : 'WithdrawalsFiltersForm';
    const basePath = kind === 'deposits' ? '/deposits/index' : '/withdrawals/index';
    const parseRow = kind === 'deposits' ? parseDepositRow : parseWithdrawalRow;
    const dateFrom = firstOfMonthISO();
    const watermarkKey = watermark ? chronoKey(watermark) : null;

    let page = 1;
    let total = 0;
    for (;;) {
      onStatus(`Fetching ${kind} page ${page}…`);
      const qs = `${encodeURIComponent(`${formPrefix}[dateFrom]`)}=${dateFrom}&action=filter&page=${page}`;
      const res = await fetch(`${basePath}?${qs}`);
      if (!res.ok) throw new Error(`${kind} page ${page} request failed (${res.status})`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const table = doc.querySelector('table');
      if (!table) {
        if (page === 1) {
          onStatus(`No ${kind} table found - LiteFinance's page markup may have changed.`, true);
        }
        break;
      }
      const trs = Array.from(table.querySelectorAll('tbody tr'));
      if (trs.length === 0) break;

      const rows = trs.map(parseRow).filter(Boolean);
      const cutoffIndex = watermarkKey ? rows.findIndex((r) => chronoKey(r.txDate) <= watermarkKey) : -1;
      const newRows = cutoffIndex === -1 ? rows : rows.slice(0, cutoffIndex);
      const wantedRows = newRows.filter((r) => WANTED_STATUSES[kind].includes((r.status || '').toLowerCase()));

      if (wantedRows.length > 0) {
        onStatus(`Pushing ${wantedRows.length} ${kind} (page ${page})…`);
        await pushPage(kind, page, wantedRows, token, sessionToken);
        total += wantedRows.length;
      }

      if (cutoffIndex !== -1) break; // reached already-synced rows
      if (trs.length < PAGE_SIZE) break; // last page
      page++;
      await sleep(400 + Math.random() * 400);
    }
    return total;
  }

  async function walkAndSyncUsers(token, sessionToken, watermark, onStatus) {
    const dateFrom = firstOfMonthISO();
    const watermarkKey = watermark ? chronoKey(watermark) : null;

    let page = 1;
    let total = 0;
    for (;;) {
      onStatus(`Fetching users page ${page}…`);
      const qs = `${encodeURIComponent('UsersForm[dateFrom]')}=${dateFrom}&action=filter&page=${page}`;
      const res = await fetch(`/users/index?${qs}`);
      if (!res.ok) throw new Error(`users page ${page} request failed (${res.status})`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const table = doc.querySelector('table');
      if (!table) {
        if (page === 1) {
          onStatus(`No users table found - LiteFinance's page markup may have changed.`, true);
        }
        break;
      }
      const trs = Array.from(table.querySelectorAll('tbody tr'));
      if (trs.length === 0) break;

      const rows = trs.map(parseUserRow).filter(Boolean);
      const cutoffIndex = watermarkKey ? rows.findIndex((r) => chronoKey(r.regDate) <= watermarkKey) : -1;
      const newRows = cutoffIndex === -1 ? rows : rows.slice(0, cutoffIndex);

      if (newRows.length > 0) {
        for (let i = 0; i < newRows.length; i++) {
          onStatus(`Fetching phone for new user ${i + 1}/${newRows.length} (page ${page})…`);
          const detail = await fetchUserDetail(newRows[i].id);
          Object.assign(newRows[i], detail);
          await sleep(200 + Math.random() * 200);
        }
        onStatus(`Pushing ${newRows.length} users (page ${page})…`);
        await pushPage('users', page, newRows, token, sessionToken);
        total += newRows.length;
      }

      if (cutoffIndex !== -1) break;
      if (trs.length < PAGE_SIZE) break;
      page++;
      await sleep(400 + Math.random() * 400);
    }
    return total;
  }

  async function fillUserGaps(token, sessionToken, onStatus) {
    const resp = await gmRequest({
      method: 'GET',
      url: GAPS_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.status !== 200) return 0;
    const { rows } = JSON.parse(resp.responseText);
    if (!rows || rows.length === 0) return 0;

    const fixed = [];
    for (let i = 0; i < rows.length; i++) {
      onStatus(`Filling gap ${i + 1}/${rows.length}…`);
      const detail = await fetchUserDetail(rows[i].id);
      fixed.push({
        id: rows[i].id,
        clientUid: rows[i].client_uid,
        country: rows[i].country,
        regDate: rows[i].reg_date,
        ...detail,
      });
      await sleep(200 + Math.random() * 200);
    }
    await pushPage('users', 0, fixed, token, sessionToken);
    return fixed.length;
  }

  function makeButton(label) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText =
      'background:#3B82F6;color:#fff;border:none;border-radius:6px;padding:8px 12px;font-size:13px;' +
      'font-weight:600;cursor:pointer;width:100%;margin-top:6px;';
    return button;
  }

  function injectUI() {
    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;bottom:20px;right:20px;z-index:999999;background:#fff;border:1px solid #d1d5db;' +
      'border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);padding:12px 14px;font:13px system-ui,sans-serif;' +
      'color:#1e293b;min-width:240px;';

    const financeButton = makeButton('Sync Deposits/Withdrawals');
    financeButton.style.marginTop = '0';
    const usersButton = makeButton('Sync Clients');

    const status = document.createElement('div');
    status.style.cssText = 'margin-top:8px;font-size:12px;color:#64748b;line-height:1.4;';

    const changeTokenLink = document.createElement('a');
    changeTokenLink.textContent = 'Change token';
    changeTokenLink.href = '#';
    changeTokenLink.style.cssText = 'display:inline-block;margin-top:8px;font-size:11px;color:#94a3b8;text-decoration:underline;cursor:pointer;';
    changeTokenLink.addEventListener('click', (e) => {
      e.preventDefault();
      resetToken();
    });

    box.appendChild(financeButton);
    box.appendChild(usersButton);
    box.appendChild(status);
    box.appendChild(changeTokenLink);
    document.body.appendChild(box);

    const setStatus = (text, isError) => {
      status.textContent = text;
      status.style.color = isError ? '#dc2626' : '#64748b';
    };

    async function run(buttons, task) {
      const token = getToken();
      if (!token) {
        setStatus('No token entered - cancelled.', true);
        return;
      }
      buttons.forEach((b) => {
        b.disabled = true;
        b.style.opacity = '0.6';
      });
      status.style.color = '#64748b';
      try {
        setStatus('Waiting for your authenticator code…');
        const sessionToken = await startSyncSession(token);
        setStatus('Checking last sync…');
        const watermark = await getWatermark(token);
        await task(token, sessionToken, watermark);
      } catch (err) {
        setStatus(`Error: ${err.message || err}`, true);
      } finally {
        buttons.forEach((b) => {
          b.disabled = false;
          b.style.opacity = '1';
        });
      }
    }

    financeButton.addEventListener('click', () =>
      run([financeButton, usersButton], async (token, sessionToken, watermark) => {
        const deposits = await walkAndSync('deposits', token, sessionToken, watermark.deposits, setStatus);
        const withdrawals = await walkAndSync('withdrawals', token, sessionToken, watermark.withdrawals, setStatus);
        setStatus(`Done - synced ${deposits} deposits, ${withdrawals} withdrawals.`);
      })
    );

    usersButton.addEventListener('click', () =>
      run([financeButton, usersButton], async (token, sessionToken, watermark) => {
        const users = await walkAndSyncUsers(token, sessionToken, watermark.users, setStatus);
        setStatus('Checking for gaps in existing clients…');
        const gapsFixed = await fillUserGaps(token, sessionToken, setStatus);
        setStatus(`Done - synced ${users} clients` + (gapsFixed > 0 ? `, fixed ${gapsFixed} gap(s).` : '.'));
      })
    );
  }

  injectUI();
})();
