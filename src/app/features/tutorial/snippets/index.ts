import argosConfig from './argos.config.json';
import githubActions from './github-actions.yml';

export const ARGOS_CONFIG_SNIPPET = JSON.stringify(argosConfig, null, 2);
export const GITHUB_ACTIONS_SNIPPET = githubActions.trim();
export const NPM_INSTALL_SNIPPET = 'npm install argos-avaliador-acessibilidade';
export const NPM_AUDIT_SNIPPET =
  'npm run audit -- --config argos.config.ci.json --out reports/report.json';
