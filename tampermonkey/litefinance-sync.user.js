// ==UserScript==
// @name         MPIntellect - LiteFinance Broker Sync
// @namespace    https://mpintellect.com
// @version      1.8
// @description  Pull this month's LiteFinance deposits/withdrawals/users/local-ops/calls/local-service-clients/chat-support-stats (calls limited to agents 2033/2034) and push them to the MPIntellect admin dashboard.
// @match        https://admin.litefinance.com/deposits/index*
// @match        https://admin.litefinance.com/withdrawals/index*
// @match        https://admin.litefinance.com/users/index*
// @match        https://admin.litefinance.com/accounts/view*
// @match        https://admin.litefinance.com/calls/index*
// @match        https://admin.litefinance.com/affiliate/referrals*
// @match        https://admin.litefinance.com/chat/statistics-support*
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
  // Call center managers currently tracked, per explicit admin request -
  // everything else (IVR/system calls, any other agent code) is skipped at
  // sync time and never stored.
  const WANTED_AGENT_CODES = ['2033', '2034'];
  // The one LocalService cash-agent account (admin.litefinance.com/accounts/
  // view?server=20&login=905151) - see schema.sql's litefinance_local_ops
  // comment for what its operations mean from the client's side.
  const LOCAL_OPS_LOGIN = '905151';
  // nouhaila laarj's affiliate id (admin.litefinance.com/affiliate/view -
  // her LiteFinance user profile's own "Username" field is literally
  // "LocalService") - the one affiliate account whose referred clients this
  // panel tracks as "Local Service clients".
  const LOCAL_SERVICE_AFFILIATE_ID = '3827279';
  // The two live-chat support managers tracked on admin.litefinance.com/
  // chat/statistics-support (Ayoub Id-croum, SMAIL HRIM) - a different
  // channel from the Commpeak phone-call managers above. Add more ids here
  // if a third support agent is ever tracked.
  const SUPPORT_TEAM_MANAGER_IDS = ['10447', '10529'];
  // How many calendar months of /chat/statistics-support to (re-)fetch on
  // every "Sync Support Stats" click - that page is server-side pre-
  // aggregated (a handful of summary rows per request, not a raw-row page
  // walk), so refetching a year of months every click is cheap. The current,
  // still-in-progress month is always included and just overwrites its own
  // rows as the month fills in.
  const SUPPORT_STATS_MONTHS_BACK = 12;
  const MOROCCO_COUNTRY_CODE = 'MA';

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

  // Delay between two consecutive fetchUserDetail() profile-view requests.
  // A flat 200-400ms between many back-to-back /users/view?id= hits reads
  // as an obvious bot pattern to anyone glancing at an access log - this
  // widens it to something closer to how long an admin would actually
  // glance at a profile before moving to the next one, with an occasional
  // longer pause thrown in so it isn't perfectly even either.
  function humanDelay() {
    const base = 1200 + Math.random() * 2600; // 1.2-3.8s
    const longPause = Math.random() < 0.15 ? 2000 + Math.random() * 4000 : 0; // occasional 2-6s extra
    return sleep(base + longPause);
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

  // Like cellText but keeps line breaks - the Calls table's Agent/Destination
  // cells each pack two distinct values (code+name, phone+email) separated
  // by a literal <br> in the markup (confirmed live via innerHTML - not a
  // block-element/newline split). Splits on raw innerHTML rather than
  // innerText: walkAndSyncCalls parses pages fetched via fetch() + DOMParser
  // into a DETACHED document, where innerText has no layout to work from and
  // silently returns the whole cell as one run-on string (e.g.
  // "2033Karima Hamouch" instead of "2033"/"Karima Hamouch") - found live by
  // diffing this function's output against the page's real innerHTML; the
  // bug would have made WANTED_AGENT_CODES never match anything, so every
  // sync click would silently push 0 rows.
  function splitLines(td) {
    return td.innerHTML
      .split(/<br\s*\/?>/i)
      .map((part) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = part;
        return (tmp.textContent || '').trim();
      })
      .filter(Boolean);
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

  // The LocalService account's "All operations" table - rows look like:
  //   Withdrawal: "WDRW-AR-6221015: USD 1916.00                   To: MT5-ECN-7392273"  (11 cells, Profit last)
  //   Deposit:    "DPST-IT-6218054: USD 20000.00                  From: MT4-R2-489576"   (5 cells, Profit last)
  // cellCount differs by type, so always read the amount from the LAST
  // cell rather than a fixed index.
  function parseLocalOpRow(tr) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 4) return null;
    const id = cellText(tds[0]);
    if (!id) return null;
    const txDate = cellText(tds[1]);
    const rawType = cellText(tds[2]);
    const positionText = cellText(tds[3]);
    const refMatch = positionText.match(/^([A-Z]+-[A-Z]+-\d+)/);
    const counterpartyMatch = positionText.match(/(?:To|From):\s*([\w-]+)/i);
    const amount = parseMoney(cellText(tds[tds.length - 1])).amount;
    return {
      id,
      txDate,
      rawType,
      opRef: refMatch ? refMatch[1] : '',
      counterpartyAccount: counterpartyMatch ? counterpartyMatch[1] : '',
      amount: amount !== null ? Math.abs(amount) : null,
    };
  }

  // /calls/index ("Commpeak Calls"). call_start here comes back already as
  // "YYYY-MM-DD HH:MM:SS" (confirmed live) - unlike every other list on this
  // panel, it needs no chronoKey() re-slice, it's already lexicographically
  // sortable. Destination's email, when present, links to
  // /users/view?id=<X> - the SAME id litefinance_users.id uses, giving a
  // real foreign key between a call and a known client (deposits/
  // withdrawals only ever capture a free-text name).
  function parseCallRow(tr) {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 7) return null;
    const id = cellText(tds[0]);
    if (!id) return null;
    const agentLines = splitLines(tds[1]);
    const destLines = splitLines(tds[2]);
    const link = tds[2].querySelector('a');
    const idMatch = (link?.getAttribute('href') || '').match(/id=(\d+)/);
    // Second Destination line is the client's email when LiteFinance
    // resolved the caller, or the literal placeholder "Unknown user" when it
    // didn't - only keep it when it actually looks like an email, so
    // data.ts's email-fallback match never gets fed that placeholder text.
    const rawSecondLine = destLines[1] || '';
    const clientEmail = /@/.test(rawSecondLine) ? rawSecondLine : null;
    const durMatch = (splitLines(tds[5])[0] || '').match(/(\d+)\s*sec/i);
    return {
      id,
      agentCode: agentLines[0] || null,
      agentName: agentLines[1] || null,
      destination: destLines[0] || null,
      clientEmail,
      userId: idMatch ? idMatch[1] : null,
      callStart: cellText(tds[3]),
      durationSec: durMatch ? parseInt(durMatch[1], 10) : null,
      hangupCause: cellText(tds[6]),
    };
  }

  function num(raw) {
    const n = parseFloat((raw || '').replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  // ---------------------------------------------------------------------
  // /chat/statistics-support ("Support statistics" under the admin's Chat
  // section) - a different channel from /calls/index above (live-chat
  // widget, not Commpeak phone calls). This page already aggregates
  // server-side by whichever "Grouping" is requested (day/week/month/year/
  // country/manager) - fetchChatSupportStats() always requests one of
  // "manager" or "country" so each call returns a handful of pre-summed
  // rows, never a raw per-session list to walk/paginate.
  // ---------------------------------------------------------------------

  function buildChatSupportStatsUrl({ dateFrom, dateTo, grouping, countryCodes, managerIds }) {
    const params = new URLSearchParams();
    params.set('ChatStatisticsSupportForm[date_from]', dateFrom);
    params.set('ChatStatisticsSupportForm[date_to]', dateTo);
    params.set('ChatStatisticsSupportForm[grouping]', grouping);
    (countryCodes || []).forEach((c) => params.append('ChatStatisticsSupportForm[country][]', c));
    (managerIds || []).forEach((m) => params.append('ChatStatisticsSupportForm[manager][]', m));
    params.set('action', 'filter');
    return `/chat/statistics-support?${params.toString()}`;
  }

  // The page renders its data via jQuery DataTables, which splits one
  // logical table into THREE <table> elements: a header-clone (empty
  // tbody), the real data rows, and a footer whose own header row literally
  // holds the "SUMMARY" totals as cell text (confirmed live via
  // console-inspection) - picking "the table with tbody rows" for the data
  // and "the table whose first header cell reads SUMMARY" for the total
  // avoids depending on table order, which DataTables doesn't guarantee.
  function parseChatSupportStatsHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const tables = Array.from(doc.querySelectorAll('table'));
    let dataRows = [];
    let summaryCells = null;
    for (const t of tables) {
      const bodyTrs = Array.from(t.querySelectorAll('tbody tr'));
      if (bodyTrs.length > 0) {
        dataRows = bodyTrs.map((tr) => Array.from(tr.children).map(cellText));
        continue;
      }
      const headerTr = t.querySelector('thead tr') || t.rows[0];
      if (!headerTr) continue;
      const headerCells = Array.from(headerTr.children).map(cellText);
      if ((headerCells[0] || '').toUpperCase() === 'SUMMARY') summaryCells = headerCells;
    }

    const parseRating = (raw) => {
      const v = parseFloat((raw || '').replace(',', '.'));
      return Number.isFinite(v) ? v : null;
    };
    const rows = dataRows
      .filter((cells) => cells.length >= 4 && cells[0])
      .map((cells) => ({
        name: cells[0],
        sessions: parseInt(cells[1], 10) || 0,
        users: parseInt(cells[2], 10) || 0,
        rating: parseRating(cells[3]),
      }));
    const summaryRow = summaryCells
      ? { sessions: parseInt(summaryCells[1], 10) || 0, users: parseInt(summaryCells[2], 10) || 0 }
      : null;
    return { rows, summaryRow };
  }

  async function fetchChatSupportStats(params) {
    const res = await fetch(buildChatSupportStatsUrl(params));
    if (!res.ok) throw new Error(`Support stats request failed (${res.status})`);
    return parseChatSupportStatsHtml(await res.text());
  }

  function chatSupportStatRow(bucketType, bucketKey, counts, dateFrom, dateTo, countryFilter, managerFilter) {
    return {
      bucketType,
      bucketKey,
      dateFrom,
      dateTo,
      countryFilter,
      managerFilter,
      sessions: counts.sessions ?? null,
      users: counts.users ?? null,
      rating: counts.rating ?? null,
    };
  }

  // monthsAgo=0 is the current, still-in-progress month (dateTo = right
  // now, so the request only covers what's actually happened so far);
  // earlier months use the full calendar month.
  function chatSupportMonthRange(monthsAgo) {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const start = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0);
    const end = monthsAgo === 0 ? now : new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59);
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return { dateFrom: fmt(start), dateTo: fmt(end) };
  }

  async function walkAndSyncChatSupportStats(token, sessionToken, onStatus) {
    const managerFilterKey = SUPPORT_TEAM_MANAGER_IDS.join(',');
    let total = 0;

    for (let monthsAgo = 0; monthsAgo < SUPPORT_STATS_MONTHS_BACK; monthsAgo++) {
      const { dateFrom, dateTo } = chatSupportMonthRange(monthsAgo);
      onStatus(`Fetching support stats for ${dateFrom.slice(0, 7)}…`);
      const rowsForMonth = [];

      // Support team (both tracked managers), split per manager - monthly trend per person.
      const teamByManager = await fetchChatSupportStats({
        dateFrom, dateTo, grouping: 'manager', managerIds: SUPPORT_TEAM_MANAGER_IDS,
      });
      teamByManager.rows.forEach((r) =>
        rowsForMonth.push(chatSupportStatRow('manager', r.name, r, dateFrom, dateTo, '', managerFilterKey))
      );
      if (teamByManager.summaryRow) {
        rowsForMonth.push(chatSupportStatRow('summary', 'TOTAL', teamByManager.summaryRow, dateFrom, dateTo, '', managerFilterKey));
      }

      // Support team combined, split per country.
      const teamByCountry = await fetchChatSupportStats({
        dateFrom, dateTo, grouping: 'country', managerIds: SUPPORT_TEAM_MANAGER_IDS,
      });
      teamByCountry.rows.forEach((r) =>
        rowsForMonth.push(chatSupportStatRow('country', r.name, r, dateFrom, dateTo, '', managerFilterKey))
      );

      // Morocco, split per manager - every manager who's ever replied to
      // Morocco, not just the two tracked support-team managers above.
      const moroccoByManager = await fetchChatSupportStats({
        dateFrom, dateTo, grouping: 'manager', countryCodes: [MOROCCO_COUNTRY_CODE],
      });
      moroccoByManager.rows.forEach((r) =>
        rowsForMonth.push(chatSupportStatRow('manager', r.name, r, dateFrom, dateTo, MOROCCO_COUNTRY_CODE, ''))
      );
      if (moroccoByManager.summaryRow) {
        rowsForMonth.push(chatSupportStatRow('summary', 'TOTAL', moroccoByManager.summaryRow, dateFrom, dateTo, MOROCCO_COUNTRY_CODE, ''));
      }

      if (rowsForMonth.length > 0) {
        onStatus(`Pushing ${rowsForMonth.length} support-stat rows for ${dateFrom.slice(0, 7)}…`);
        await pushPage('chat_support_stats', monthsAgo + 1, rowsForMonth, token, sessionToken);
        total += rowsForMonth.length;
      }
      await sleep(300 + Math.random() * 300);
    }
    return total;
  }

  // /affiliate/referrals?id=<LocalService affiliate>'s "Referrals network"
  // tab - the whole table renders in one page load (confirmed live: 440
  // clients / 1319 rows, no "page=N" URL or "Load more" button like every
  // other list on this panel), so this is a one-shot scrape, not a walk.
  // One <tr> per client (first cell has a rowspan covering that client's
  // N account sub-rows, each sub-row repeating only the 11 account-level
  // columns). active/inactive is read straight from that first <tr>'s own
  // CSS class (confirmed live: literally "active"/"inactive", sometimes
  // with an extra "archive" modifier) - never guessed from a background
  // color or any numeric column. Per-client totals are summed across all of
  // that client's account sub-rows for whatever date range is selected on
  // the page (the page's own date filter, not re-applied here).
  function findLocalServiceClientsTable() {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.find((t) => {
      const head = t.querySelector('thead')?.textContent || '';
      return /Referral/.test(head) && /UID/.test(head) && /Registered/.test(head);
    });
  }

  function parseLocalServiceClientsTable(table) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const clients = [];
    let current = null;
    for (const tr of rows) {
      const tds = Array.from(tr.querySelectorAll('td'));
      if (tds.length === 0) continue;
      const cls = tr.className || '';
      if (tds[0].hasAttribute('rowspan')) {
        const link = tds[0].querySelector('a');
        const idMatch = (link?.getAttribute('href') || '').match(/id=(\d+)/);
        if (!idMatch) {
          current = null;
          continue;
        }
        current = {
          id: idMatch[1],
          uid: cellText(tds[1]),
          name: cellText(tds[0]),
          regDate: cellText(tds[2]),
          active: !cls.includes('inactive') && cls.includes('active'),
          totalDpst: 0,
          totalWdrw: 0,
          totalCommission: 0,
          totalTrades: 0,
          totalVolume: 0,
          totalProfit: 0,
        };
        clients.push(current);
        addAccountRow(current, tds.slice(3));
      } else if (current) {
        addAccountRow(current, tds);
      }
    }
    return clients;

    // Account sub-row columns: account, group, dpst, wdrw, comm, equity,
    // balance, float P/L, trades, volume, profit (11 total) - only the
    // period-flow ones (dpst/wdrw/commission/trades/volume/profit) are
    // summed; equity/balance/float P/L are point-in-time snapshots that
    // don't add up meaningfully across accounts.
    function addAccountRow(client, cells) {
      if (cells.length < 11) return;
      client.totalDpst += num(cellText(cells[2]));
      client.totalWdrw += num(cellText(cells[3]));
      client.totalCommission += num(cellText(cells[4]));
      client.totalTrades += Math.round(num(cellText(cells[8])));
      client.totalVolume += num(cellText(cells[9]));
      client.totalProfit += num(cellText(cells[10]));
    }
  }

  async function walkAndSyncLocalServiceClients(token, sessionToken, onStatus) {
    const table = findLocalServiceClientsTable();
    if (!table) {
      onStatus('Referrals network table not found - LiteFinance markup may have changed.', true);
      return 0;
    }
    const clients = parseLocalServiceClientsTable(table);
    let pushed = 0;
    for (let i = 0; i < clients.length; i += PAGE_SIZE) {
      const chunk = clients.slice(i, i + PAGE_SIZE);
      onStatus(`Pushing clients ${i + 1}-${i + chunk.length} of ${clients.length}…`);
      await pushPage('local_service_clients', Math.floor(i / PAGE_SIZE) + 1, chunk, token, sessionToken);
      pushed += chunk.length;
    }
    return pushed;
  }

  function findLocalOpsTable() {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.find((t) => {
      const head = t.querySelector('thead')?.textContent || '';
      return /Deal/.test(head) && /Direction/.test(head);
    });
  }

  // Unlike deposits/withdrawals/users (URL-paginated via ?page=N - probed
  // offset/start/per-page too, all 403), this page has no URL pagination at
  // all - it's a same-page "Load more" button that appends 50 more rows to
  // the existing table each click. So the walk clicks the real button and
  // re-reads the table's growing row count, instead of fetching page URLs.
  async function walkAndSyncLocalOps(token, sessionToken, watermark, onStatus) {
    const watermarkKey = watermark ? chronoKey(watermark) : null;
    const monthCutoffKey = `${firstOfMonthISO().replace(/-/g, '')} 00:00:00`;
    const stopKey = watermarkKey && watermarkKey > monthCutoffKey ? watermarkKey : monthCutoffKey;

    const opsTabLink = Array.from(document.querySelectorAll('a.js_ajax_load')).find(
      (a) => a.textContent.trim() === 'All operations'
    );
    if (opsTabLink) {
      opsTabLink.click();
      await sleep(800);
    }

    const table = findLocalOpsTable();
    if (!table) {
      onStatus('Local ops table not found - LiteFinance markup may have changed.', true);
      return 0;
    }

    let seen = 0;
    const collected = [];
    let reachedCutoff = false;
    for (let guard = 0; guard < 40; guard++) {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      for (; seen < rows.length; seen++) {
        const parsed = parseLocalOpRow(rows[seen]);
        if (!parsed) continue;
        if (chronoKey(parsed.txDate) <= stopKey) {
          reachedCutoff = true;
          break;
        }
        collected.push(parsed);
      }
      if (reachedCutoff) break;
      onStatus(`Fetching local ops… (${collected.length} new so far)`);
      const loadMoreBtn = document.querySelector('.js_ajax_pagination_button');
      if (!loadMoreBtn) break;
      loadMoreBtn.click();
      await sleep(900 + Math.random() * 400);
    }

    let total = 0;
    for (let i = 0; i < collected.length; i += PAGE_SIZE) {
      const chunk = collected.slice(i, i + PAGE_SIZE);
      onStatus(`Pushing ${chunk.length} local ops…`);
      await pushPage('local_ops', Math.floor(i / PAGE_SIZE) + 1, chunk, token, sessionToken);
      total += chunk.length;
    }
    return total;
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
          await humanDelay();
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

  // Simpler than walkAndSync(deposits/withdrawals): /calls/index paginates
  // on a plain ?page=N with no "action=filter"/dateFrom requirement
  // (confirmed live - the bare index page already renders data). No status
  // filtering either - every call is pushed; "successful" is decided at
  // query time server-side (hangup_cause = 'ANSWERED'), never filtered here.
  //
  // Bounded to the current calendar month on a first run (no watermark yet)
  // - per explicit admin request ("only from 01.11.2026 00:00") - same
  // bounded-backfill approach as every other sync here. A full-history walk
  // was tried and explicitly reverted; don't remove this bound again without
  // being asked.
  async function walkAndSyncCalls(token, sessionToken, watermark, onStatus) {
    const monthCutoffKey = `${firstOfMonthISO()} 00:00:00`;
    const stopKey = watermark && watermark > monthCutoffKey ? watermark : monthCutoffKey;

    let page = 1;
    let total = 0;
    for (;;) {
      onStatus(`Fetching calls page ${page}…`);
      const res = await fetch(`/calls/index?page=${page}`);
      if (!res.ok) throw new Error(`calls page ${page} request failed (${res.status})`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const table = doc.querySelector('table');
      if (!table) {
        if (page === 1) {
          onStatus(`No calls table found - LiteFinance's page markup may have changed.`, true);
        }
        break;
      }
      const trs = Array.from(table.querySelectorAll('tbody tr'));
      if (trs.length === 0) break;

      const rows = trs.map(parseCallRow).filter(Boolean);
      // Cutoff is computed against the FULL unfiltered page (every agent) so
      // the chronological walk/watermark stays correct regardless of which
      // agents are wanted - only what gets pushed is narrowed afterward.
      const cutoffIndex = rows.findIndex((r) => r.callStart <= stopKey);
      const newRows = cutoffIndex === -1 ? rows : rows.slice(0, cutoffIndex);
      const wantedRows = newRows.filter((r) => WANTED_AGENT_CODES.includes(r.agentCode));

      if (wantedRows.length > 0) {
        onStatus(`Pushing ${wantedRows.length} calls (page ${page})…`);
        await pushPage('calls', page, wantedRows, token, sessionToken);
        total += wantedRows.length;
      }

      if (cutoffIndex !== -1) break; // reached already-synced rows
      if (trs.length < PAGE_SIZE) break; // last page
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
      await humanDelay();
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
    const onListPage = /\/(deposits|withdrawals|users)\/index/.test(location.pathname);
    const onCallsPage = /\/calls\/index/.test(location.pathname);
    const onLocalOpsPage =
      /\/accounts\/view/.test(location.pathname) && new URLSearchParams(location.search).get('login') === LOCAL_OPS_LOGIN;
    const onLocalServiceClientsPage =
      /\/affiliate\/referrals/.test(location.pathname) &&
      new URLSearchParams(location.search).get('id') === LOCAL_SERVICE_AFFILIATE_ID;
    const onChatSupportStatsPage = /\/chat\/statistics-support/.test(location.pathname);
    if (!onListPage && !onCallsPage && !onLocalOpsPage && !onLocalServiceClientsPage && !onChatSupportStatsPage) return;

    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;bottom:20px;right:20px;z-index:999999;background:#fff;border:1px solid #d1d5db;' +
      'border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);padding:12px 14px;font:13px system-ui,sans-serif;' +
      'color:#1e293b;min-width:240px;';

    const buttons = [];
    let financeButton = null;
    let usersButton = null;
    let localOpsButton = null;
    let callsButton = null;
    let localServiceClientsButton = null;
    let chatSupportStatsButton = null;

    if (onListPage) {
      financeButton = makeButton('Sync Deposits/Withdrawals');
      financeButton.style.marginTop = '0';
      usersButton = makeButton('Sync Clients');
      box.appendChild(financeButton);
      box.appendChild(usersButton);
      buttons.push(financeButton, usersButton);
    }
    if (onLocalOpsPage) {
      localOpsButton = makeButton('Sync Local Service');
      if (buttons.length === 0) localOpsButton.style.marginTop = '0';
      box.appendChild(localOpsButton);
      buttons.push(localOpsButton);
    }
    if (onCallsPage) {
      callsButton = makeButton('Sync Calls');
      if (buttons.length === 0) callsButton.style.marginTop = '0';
      box.appendChild(callsButton);
      buttons.push(callsButton);
    }
    if (onLocalServiceClientsPage) {
      localServiceClientsButton = makeButton('Sync Local Service Clients');
      if (buttons.length === 0) localServiceClientsButton.style.marginTop = '0';
      box.appendChild(localServiceClientsButton);
      buttons.push(localServiceClientsButton);
    }
    if (onChatSupportStatsPage) {
      chatSupportStatsButton = makeButton('Sync Support Stats');
      if (buttons.length === 0) chatSupportStatsButton.style.marginTop = '0';
      box.appendChild(chatSupportStatsButton);
      buttons.push(chatSupportStatsButton);
    }

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

    if (financeButton) {
      financeButton.addEventListener('click', () =>
        run(buttons, async (token, sessionToken, watermark) => {
          const deposits = await walkAndSync('deposits', token, sessionToken, watermark.deposits, setStatus);
          const withdrawals = await walkAndSync('withdrawals', token, sessionToken, watermark.withdrawals, setStatus);
          setStatus(`Done - synced ${deposits} deposits, ${withdrawals} withdrawals.`);
        })
      );
    }

    if (usersButton) {
      usersButton.addEventListener('click', () =>
        run(buttons, async (token, sessionToken, watermark) => {
          const users = await walkAndSyncUsers(token, sessionToken, watermark.users, setStatus);
          setStatus('Checking for gaps in existing clients…');
          const gapsFixed = await fillUserGaps(token, sessionToken, setStatus);
          setStatus(`Done - synced ${users} clients` + (gapsFixed > 0 ? `, fixed ${gapsFixed} gap(s).` : '.'));
        })
      );
    }

    if (localOpsButton) {
      localOpsButton.addEventListener('click', () =>
        run(buttons, async (token, sessionToken, watermark) => {
          const count = await walkAndSyncLocalOps(token, sessionToken, watermark.localOps, setStatus);
          setStatus(`Done - synced ${count} local operations.`);
        })
      );
    }

    if (callsButton) {
      callsButton.addEventListener('click', () =>
        run(buttons, async (token, sessionToken, watermark) => {
          const count = await walkAndSyncCalls(token, sessionToken, watermark.calls, setStatus);
          setStatus(`Done - synced ${count} calls.`);
        })
      );
    }

    if (localServiceClientsButton) {
      localServiceClientsButton.addEventListener('click', () =>
        // One-shot snapshot of whatever date range is selected on the page
        // right now - no watermark, the whole table is re-synced every time.
        run(buttons, async (token, sessionToken) => {
          const count = await walkAndSyncLocalServiceClients(token, sessionToken, setStatus);
          setStatus(`Done - synced ${count} local service clients.`);
        })
      );
    }

    if (chatSupportStatsButton) {
      chatSupportStatsButton.addEventListener('click', () =>
        // Re-fetches its own fixed set of (date range, grouping, filter)
        // combinations every click - no watermark, ignores whatever filter
        // state happens to be on screen right now.
        run(buttons, async (token, sessionToken) => {
          const count = await walkAndSyncChatSupportStats(token, sessionToken, setStatus);
          setStatus(`Done - synced ${count} support-stat rows across the last ${SUPPORT_STATS_MONTHS_BACK} months.`);
        })
      );
    }
  }

  injectUI();
})();
