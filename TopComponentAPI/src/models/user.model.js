const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database.config');

class User extends Model { };

User.init ({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.NUMBER,
        unique: true,
        allowNull: false,
      },
      adress: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        unique: false,
        allowNull: false,
      },
      accesToken: {
        type: DataTypes.TEXT('long'),
        unique: false,
        allowNull: true,
      },
      emailVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailVerificationCodeExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
      }, 
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
});

module.exports = User