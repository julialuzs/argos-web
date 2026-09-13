import argosConfig from './argos.config.json';
import githubActions from './github-actions.yml';

export const ARGOS_CONFIG_SNIPPET = JSON.stringify(argosConfig, null, 2);
export const GITHUB_ACTIONS_SNIPPET = githubActions.trim();
export const NPX_AUDIT_SNIPPET = 'npx argos-avaliador-acessibilidade';
