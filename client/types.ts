export interface Note {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly like: number;
  readonly dislike: number;
  readonly user: string;
}

export enum EntityType {
  STRING = 'string',
  IMAGE = 'image',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
  LINK = 'link',
}

export interface NoteBodyEntity {
  readonly type: EntityType;
  readonly value: string;
}

export interface NoteWithBody extends Note {
  readonly body: NoteBodyEntity[];
}

export interface ArticlesResponse {
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly notes: Note[];
}

export interface Topic {
  readonly name: string;
  readonly count?: number;
}

export interface ActionFunc {
  (id: string): void;
}

export interface Profile {
  readonly name: string;
}

export interface Notification {
  readonly message: string;
  readonly isViewed: boolean;
  readonly createdAt: Date;
}

export interface AsyncState {
  readonly loading: boolean;
  readonly error?: Error;
}

export const GET_PROFILE = 'GET_PROFILE';

export interface ProfileState extends AsyncState {
  readonly profile?: Profile;
}

export interface ProfileAction {
  readonly type: typeof GET_PROFILE;
  readonly loading: boolean;
  readonly profile?: Profile;
  readonly error?: Error;
}

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';

export interface NotificationState extends AsyncState {
  readonly notifications: Notification[];
}

export interface NotificationAction {
  readonly type: typeof GET_NOTIFICATIONS;
  readonly loading: boolean;
  readonly notifications: Notification[];
  readonly error?: Error;
}

export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const LIKE_ARTICLE = 'LIKE_ARTICLE';
export const DISLIKE_ARTICLE = 'DISLIKE_ARTICLE';
export const REMOVE_ARTICLE = 'REMOVE_ARTICLE';

export interface ArticleState extends AsyncState {
  readonly article?: NoteWithBody;
  readonly removed?: boolean;
}

export interface ArticleAction {
  readonly type: typeof FETCH_ARTICLE | typeof LIKE_ARTICLE | typeof DISLIKE_ARTICLE | typeof REMOVE_ARTICLE;
  readonly loading: boolean;
  readonly article?: NoteWithBody;
  readonly removed?: boolean;
  readonly error?: Error;
}

export const FETCH_COMMENTS = 'FETCH_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const LIKE_COMMENT = 'LIKE_COMMENT';
export const DISLIKE_COMMENT = 'DISLIKE_COMMENT';

export interface CommentState extends AsyncState {
  readonly comments: NoteWithBody[];
}

export interface CommentAction {
  readonly type:
    | typeof FETCH_COMMENTS
    | typeof ADD_COMMENT
    | typeof REMOVE_COMMENT
    | typeof LIKE_COMMENT
    | typeof DISLIKE_COMMENT;
  readonly loading: boolean;
  readonly comment?: NoteWithBody;
  readonly comments?: NoteWithBody[];
  readonly removedId?: string;
  readonly error?: Error;
}

export const POST_REPORT = 'POST_REPORT';

export interface ReportAction {
  readonly type: typeof POST_REPORT;
  readonly loading: boolean;
  readonly error?: Error;
}
