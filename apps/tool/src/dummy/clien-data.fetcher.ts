import axios from 'axios';
import cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';
import { DummyData } from './interfaces/dummy.interface';
import _ from 'underscore';

interface Article {
  readonly title: string;
  readonly topic: string;
  readonly nickname: string;
  readonly link: string;
}

@Injectable()
export class ClienDataFetcher {
  private readonly logger = new Logger(ClienDataFetcher.name);

  private readonly URL = 'https://m.clien.net';

  async fetch(): Promise<DummyData[]> {
    const articles = await this.fetchRecommends();

    return await Promise.all(
      articles.map(async (article) => {
        const contents = await this.fetchContents(article.link);
        return {
          title: article.title,
          topic: article.topic,
          nickname: article.nickname,
          contents,
        };
      }),
    );
  }

  private async fetchRecommends(): Promise<Article[]> {
    const res = await axios.get(`${this.URL}/service/recommend`);
    const $ = cheerio.load(res.data);

    const articles = $('.board_recommended .list_recommended')
      .map((i, elm) => {
        const title = $(elm).find('[data-role=list-title-text]').text().trim();
        const topic = $(elm).find('.list_infomation .shortname').text().trim();
        const nickname = $(elm).find('.list_infomation .nickname').text().trim();
        const link = $(elm).find('.list_subject').attr('href');
        this.logger.debug(`[${i}] ${topic} / ${title} : ${nickname} -> ${link}`);

        return {
          title,
          topic,
          nickname,
          link,
        };
      })
      .get();

    return _.chain(articles)
      .filter((article) => article.title && article.topic && article.nickname && article.link)
      .value();
  }

  private async fetchContents(link: string) {
    const res = await axios.get(this.URL + link);
    const $ = cheerio.load(res.data);

    return $('.post_article')
      .children()
      .map((_i, el) => {
        const img = $(el).find('img');
        if (img.length) return img.attr('src');

        const video = $(el).find('video');
        if (video.length) return video.attr('poster');

        const anchor = $(el).find('a');
        if (anchor.length) return anchor.attr('href');

        const br = $(el).find('br');
        if (br.length) return '\n';

        return $(el).text();
      })
      .get()
      .join('\n');
  }
}
