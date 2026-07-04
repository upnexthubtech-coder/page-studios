import { Section } from './contentfulClient';

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
}

export function parseVersion(v: string): VersionInfo {
  const parts = v.split('.').map(Number);
  return { major: parts[0] || 1, minor: parts[1] || 0, patch: parts[2] || 0 };
}

export function computeBump(
  prev: Section[],
  curr: Section[]
): { version: VersionInfo; changelog: string } {
  let bump: 'patch' | 'minor' | 'major' = 'patch';
  const changes: string[] = [];

  if (curr.length < prev.length) {
    bump = 'major';
    changes.push('Section(s) removed');
  }

  for (let i = 0; i < prev.length; i++) {
    const oldS = prev[i];
    const newS = curr[i];
    if (!newS) continue;
    if (oldS.type !== newS.type) {
      bump = 'major';
      changes.push(`Type changed from ${oldS.type} to ${newS.type}`);
      continue;
    }
    const allKeys = new Set([...Object.keys(oldS.props), ...Object.keys(newS.props)]);
    for (const key of allKeys) {
      if (JSON.stringify(oldS.props[key]) !== JSON.stringify(newS.props[key])) {
        if (oldS.props[key] !== undefined && newS.props[key] === undefined) {
          if (bump !== 'major') bump = 'major';
          changes.push(`Removed required prop "${key}" in ${oldS.type}`);
        } else if (oldS.props[key] === undefined && newS.props[key] !== undefined) {
          if (bump === 'patch') bump = 'minor';
          changes.push(`Added prop "${key}" in ${newS.type}`);
        } else {
          changes.push(`Changed "${key}" in ${newS.type}`);
        }
      }
    }
  }

  if (curr.length > prev.length) {
    if (bump !== 'major') bump = 'minor';
    changes.push(`${curr.length - prev.length} section(s) added`);
  }

  const last = parseVersion('1.0.0'); // will be overwritten by actual last version in API
  const v = { ...last };
  if (bump === 'major') { v.major += 1; v.minor = 0; v.patch = 0; }
  else if (bump === 'minor') { v.minor += 1; v.patch = 0; }
  else { v.patch += 1; }

  return { version: v, changelog: changes.join('; ') };
}