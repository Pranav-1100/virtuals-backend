const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: { msg: "Username cannot be empty" },
            len: { args: [3, 30], msg: "Username must be between 3 and 30 characters long" }
          }
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: { msg: "Must be a valid email address" }
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: { args: [6, 100], msg: "Password must be at least 6 characters long" }
          }
        },
        role: {
          type: DataTypes.STRING,
          defaultValue: 'user'
        },
        experience: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true
        }
    }, {
        tableName: 'Users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
              if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
              }
            }
        }
    });

    User.prototype.generateToken = function() {
        return jwt.sign(
          { 
            id: this.id,
            email: this.email,
            role: this.role
          }, 
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
    };
    
    User.prototype.validatePassword = function(password) {
        return bcrypt.compare(password, this.password);
    };

    User.associate = function(models) {
        User.belongsToMany(models.User, { 
          through: models.Friendship,
          as: 'Friends',
          foreignKey: 'userId',
          otherKey: 'friendId'
        });
        User.hasOne(models.Pet);
        User.hasMany(models.Inventory);
        User.hasMany(models.Minigame);
        User.hasMany(models.UserAchievement);
        User.hasMany(models.Inventory, { 
            foreignKey: { 
              name: 'userId',
              allowNull: false
            },
            as: 'inventories'
        });
    };

    return User;
};