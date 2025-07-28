/**
 * Post Service Models
 * Sequelize models for the post microservice
 */

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import config from '../config/config';
import { PostAttributes, PostCreationAttributes } from '../types';

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    }
  }
);

// Post model class
class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public content!: string;
  public imageUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Post model
Post.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 10000]
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_url'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  sequelize,
  tableName: 'posts'
});

const db = {
  sequelize,
  Sequelize,
  Post
};

export { sequelize, Post };
export default db;
