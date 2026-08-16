import { Component } from '@angular/core';
import { CodeSnippet } from '@shared/components/code-snippet/code-snippet';
import { DividerModule } from 'primeng/divider';
import { ARGOS_CONFIG_SNIPPET, GITHUB_ACTIONS_SNIPPET } from './snippets';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-tutorial',
  imports: [DividerModule, CardModule, CodeSnippet],
  templateUrl: './tutorial.html',
  styleUrl: './tutorial.css',
})
export class Tutorial {
  readonly argosConfigSnippet = ARGOS_CONFIG_SNIPPET;
  readonly githubActionsSnippet = GITHUB_ACTIONS_SNIPPET;
}
