import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JiraService {
  private readonly enabled: boolean;
  private readonly url: string;
  private readonly username: string;
  private readonly token: string;

  constructor(readonly config: ConfigService<EnvironmentVariables>) {
    this.enabled = config.get('QUEUEING_JIRA_ENABLED');
    this.url = config.get('QUEUEING_JIRA_URL');
    this.username = config.get('QUEUEING_JIRA_USERNAME');
    this.token = config.get('QUEUEING_JIRA_TOKEN');
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async findIssueIds(jql: string, max = 1): Promise<string[]> {
    if (!this.isEnabled()) throw new InternalServerErrorException('Jira service is not enabled.');

    const data = {
      jql,
      maxResults: max,
    };

    const res = await axios.post(`${this.url}/rest/api/3/search`, data, { headers: this.makeHeaders() });
    return res.data.issues.map((issue: { id: string }) => issue.id);
  }

  async createIssue(issueType: string, summary: string, description: string, labels: string[]): Promise<string> {
    if (!this.isEnabled()) throw new InternalServerErrorException('Jira service is not enabled.');

    const data = {
      fields: {
        project: { key: 'QUEUEING' },
        summary,
        description: {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ text: description, type: 'text' }] }],
        },
        issuetype: { name: issueType },
        labels,
      },
    };

    const res = await axios.post(`${this.url}/rest/api/3/issue`, data, { headers: this.makeHeaders() });
    return res.data.id;
  }

  async addLabel(issueId: string, label: string): Promise<void> {
    if (!this.isEnabled()) throw new InternalServerErrorException('Jira service is not enabled.');

    const data = {
      update: {
        labels: [{ add: label }],
      },
    };

    await axios.put(`${this.url}/rest/api/3/issue/${issueId}`, data, {
      headers: this.makeHeaders(),
    });
  }

  async addComment(issueId: string, description: string): Promise<string> {
    if (!this.isEnabled()) throw new InternalServerErrorException('Jira service is not enabled.');

    const data = {
      body: {
        type: 'doc',
        version: 1,
        content: [{ type: 'paragraph', content: [{ text: description, type: 'text' }] }],
      },
    };

    const res = await axios.post(`${this.url}/rest/api/3/issue/${issueId}/comment`, data, {
      headers: this.makeHeaders(),
    });
    return res.data.id;
  }

  private makeHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(`${this.username}:${this.token}`).toString('base64')}`,
    };
  }
}
