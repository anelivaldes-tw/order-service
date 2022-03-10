export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';
export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
export const OUTBOX_REPOSITORY = 'OUTBOX_REPOSITORY';

export enum OrderState { PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED'}
