import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ContactAttributes {
  id: number;
  phoneNumber?: string;
  email?: string;
  linkedId?: number;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ContactCreationAttributes {
  phoneNumber?: string | null;
  email?: string | null;
  linkedId?: number | null;
  linkPrecedence: 'primary' | 'secondary';
  deletedAt?: Date;
}

class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  public id!: number;
  public phoneNumber?: string;
  public email?: string;
  public linkedId?: number;
  public linkPrecedence!: 'primary' | 'secondary';
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone_number',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    linkedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'linked_id',
    },
    linkPrecedence: {
      type: DataTypes.ENUM('primary', 'secondary'),
      allowNull: false,
      field: 'link_precedence',
      defaultValue: 'primary',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    indexes: [
      {
        fields: ['phone_number'],
      },
      {
        fields: ['email'],
      },
    ],
  }
);

export default Contact;
