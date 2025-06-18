import { Request, Response } from 'express';
import { Contact } from '../models';
import { Op } from 'sequelize';

class IdentifyController {
  async identify(req: Request, res: Response): Promise<void> {
    try {
      const { email, phoneNumber } = req.body;

      if (!email && !phoneNumber) {
        res.status(400).json({
          success: false,
          message: 'Either email or phoneNumber must be provided',
        });
        return;
      }

      const existingContacts = await Contact.findAll({
        where: {
          [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
        },
        order: [['createdAt', 'ASC']],
      });

      let primaryContact: any;
      let allRelatedContacts: any[] = [];

      if (existingContacts.length === 0) {
        primaryContact = await Contact.create({
          email,
          phoneNumber: phoneNumber?.toString(),
          linkedId: null,
          linkPrecedence: 'primary',
        });

        allRelatedContacts = [primaryContact];
      } else {
        const primaryIds = new Set<number>();

        for (const contact of existingContacts) {
          if (contact.linkPrecedence === 'primary') {
            primaryIds.add(contact.id);
          } else if (contact.linkedId) {
            primaryIds.add(contact.linkedId);
          }
        }

        if (primaryIds.size > 1) {
          const primariesArray = Array.from(primaryIds);
          const oldestPrimaryId = Math.min(...primariesArray);

          for (const primaryId of primariesArray) {
            if (primaryId !== oldestPrimaryId) {
              await Contact.update(
                {
                  linkedId: oldestPrimaryId,
                  linkPrecedence: 'secondary',
                },
                { where: { id: primaryId } }
              );
            }
          }

          primaryContact = await Contact.findByPk(oldestPrimaryId);
        } else {
          const primaryId = primaryIds.values().next().value;
          primaryContact = await Contact.findByPk(primaryId);
        }

        allRelatedContacts = await Contact.findAll({
          where: {
            [Op.or]: [
              { id: primaryContact.id },
              { linkedId: primaryContact.id },
            ],
          },
          order: [['createdAt', 'ASC']],
        });

        const hasNewEmail =
          email && !allRelatedContacts.some(contact => contact.email === email);
        const hasNewPhone =
          phoneNumber &&
          !allRelatedContacts.some(
            contact => contact.phoneNumber === phoneNumber.toString()
          );

        if (hasNewEmail || hasNewPhone) {
          const newSecondary = await Contact.create({
            email,
            phoneNumber: phoneNumber?.toString(),
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary',
          });

          allRelatedContacts.push(newSecondary);
        }
      }

      const emails = [
        ...new Set(
          allRelatedContacts.map(contact => contact.email).filter(Boolean)
        ),
      ];

      const phoneNumbers = [
        ...new Set(
          allRelatedContacts.map(contact => contact.phoneNumber).filter(Boolean)
        ),
      ];

      const secondaryContactIds = allRelatedContacts
        .filter(contact => contact.linkPrecedence === 'secondary')
        .map(contact => contact.id);

      if (primaryContact.email && emails.includes(primaryContact.email)) {
        emails.splice(emails.indexOf(primaryContact.email), 1);
        emails.unshift(primaryContact.email);
      }

      if (
        primaryContact.phoneNumber &&
        phoneNumbers.includes(primaryContact.phoneNumber)
      ) {
        phoneNumbers.splice(
          phoneNumbers.indexOf(primaryContact.phoneNumber),
          1
        );
        phoneNumbers.unshift(primaryContact.phoneNumber);
      }

      res.status(200).json({
        contact: {
          primaryContatctId: primaryContact.id,
          emails,
          phoneNumbers,
          secondaryContactIds,
        },
      });
    } catch (error) {
      console.error('Error in identify function:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during fetching',
      });
    }
  }
}

export default IdentifyController;
