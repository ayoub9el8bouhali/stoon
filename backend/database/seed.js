import bcrypt from "bcryptjs";
import {
  sequelize,
  Booking,
  Conversation,
  ConversationParticipant,
  Event,
  Favorite,
  Housing,
  Job,
  MarketplaceItem,
  Message,
  Notification,
  Review,
  Ride,
  User
} from "../models/index.js";

const passwordHash = await bcrypt.hash("Stoon2026!", 12);

const users = [
  {
    firstName: "Yassine",
    lastName: "El Amrani",
    email: "yassine@stoon.ma",
    passwordHash,
    role: "admin",
    city: "Casablanca",
    school: "EMSI Casablanca",
    fieldOfStudy: "Informatique",
    bio: "Admin ST00N et développeur full-stack.",
    reputation: 4.9
  },
  {
    firstName: "Salma",
    lastName: "Bennani",
    email: "salma.bennani@example.com",
    passwordHash,
    city: "Rabat",
    school: "UIR",
    fieldOfStudy: "Commerce",
    bio: "Étudiante en marketing digital, fan d'événements étudiants.",
    reputation: 4.7
  },
  {
    firstName: "Omar",
    lastName: "Ait Lahcen",
    email: "omar.ait@example.com",
    passwordHash,
    city: "Marrakech",
    school: "ENSA Marrakech",
    fieldOfStudy: "Génie informatique",
    bio: "Je propose du covoiturage régulier Marrakech-Casablanca.",
    reputation: 4.6
  },
  {
    firstName: "Nour",
    lastName: "Idrissi",
    email: "nour.idrissi@example.com",
    passwordHash,
    city: "Fès",
    school: "Université Sidi Mohamed Ben Abdellah",
    fieldOfStudy: "Médecine",
    bio: "Documents de médecine et groupes de révision.",
    reputation: 4.8
  },
  {
    firstName: "Mehdi",
    lastName: "Tazi",
    email: "mehdi.tazi@example.com",
    passwordHash,
    city: "Tanger",
    school: "ENCG Tanger",
    fieldOfStudy: "Finance",
    bio: "Jobs étudiants, tutorat Excel et analyse financière.",
    reputation: 4.5
  }
];

const run = async () => {
  await sequelize.sync({ force: true });
  const createdUsers = [];
  for (const user of users) {
    createdUsers.push(await User.create(user));
  }
  const [admin, salma, omar, nour, mehdi] = createdUsers;

  await Housing.bulkCreate([
    {
      userId: salma.id,
      title: "Chambre lumineuse près de l'UIR",
      description: "Chambre meublée dans une colocation calme avec fibre, cuisine équipée et accès rapide au campus.",
      type: "chambre",
      city: "Rabat",
      school: "UIR",
      fieldOfStudy: "Toutes filières",
      address: "Technopolis, Rabat",
      price: 1800,
      rooms: 1,
      availableFrom: "2026-06-01",
      images: ["/uploads/images/mock-housing-rabat.jpg"],
      amenities: ["Wi-Fi", "Cuisine", "Bureau", "Sécurité"]
    },
    {
      userId: omar.id,
      title: "Colocation moderne Guéliz",
      description: "Appartement partagé entre étudiants ENSA, proche tram/bus, salon agréable et charges incluses.",
      type: "colocation",
      city: "Marrakech",
      school: "ENSA Marrakech",
      fieldOfStudy: "Génie informatique",
      address: "Guéliz, Marrakech",
      price: 2100,
      rooms: 3,
      availableFrom: "2026-05-20",
      images: ["/uploads/images/mock-housing-marrakech.jpg"],
      amenities: ["Climatisation", "Wi-Fi", "Machine à laver"]
    }
  ]);

  await MarketplaceItem.bulkCreate([
    {
      userId: nour.id,
      title: "Pack PDF anatomie S2",
      description: "Résumé clair avec schémas, QCM corrigés et fiches de révision.",
      category: "document",
      transactionType: "vente",
      price: 60,
      condition: "numerique",
      city: "Fès",
      school: "Université Sidi Mohamed Ben Abdellah",
      fieldOfStudy: "Médecine",
      images: ["/uploads/images/mock-docs-medecine.jpg"],
      documentUrl: "/uploads/documents/mock-anatomie.pdf"
    },
    {
      userId: mehdi.id,
      title: "Calculatrice financière HP 10bII+",
      description: "Très bon état, idéale pour finance, comptabilité et gestion.",
      category: "materiel",
      transactionType: "vente",
      price: 350,
      condition: "tres_bon",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Finance",
      images: ["/uploads/images/mock-calculatrice.jpg"]
    }
  ]);

  await Ride.bulkCreate([
    {
      userId: omar.id,
      departureCity: "Marrakech",
      departureAddress: "ENSA Marrakech",
      destinationCity: "Casablanca",
      destinationAddress: "Casa Voyageurs",
      departureAt: "2026-05-18 08:30:00",
      seatsTotal: 4,
      seatsAvailable: 3,
      pricePerSeat: 90,
      carModel: "Dacia Sandero",
      notes: "Départ ponctuel, bagage moyen accepté.",
      city: "Marrakech",
      school: "ENSA Marrakech"
    },
    {
      userId: admin.id,
      departureCity: "Casablanca",
      departureAddress: "Maarif",
      destinationCity: "Rabat",
      destinationAddress: "Agdal",
      departureAt: "2026-05-20 17:45:00",
      seatsTotal: 3,
      seatsAvailable: 2,
      pricePerSeat: 45,
      carModel: "Renault Clio",
      notes: "Trajet après les cours.",
      city: "Casablanca",
      school: "EMSI Casablanca"
    }
  ]);

  await Event.bulkCreate([
    {
      userId: salma.id,
      title: "ST00N Campus Night Rabat",
      description: "Soirée networking, musique et rencontres entre écoles de Rabat.",
      eventType: "soiree",
      city: "Rabat",
      school: "UIR",
      fieldOfStudy: "Toutes filières",
      venue: "Agdal",
      startsAt: "2026-06-07 19:00:00",
      endsAt: "2026-06-07 23:30:00",
      price: 120,
      capacity: 150,
      reservedSeats: 37,
      posterUrl: "/uploads/images/mock-event-rabat.jpg"
    },
    {
      userId: mehdi.id,
      title: "Voyage étudiant Chefchaouen",
      description: "Week-end organisé avec transport, guide local et logement inclus.",
      eventType: "voyage",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Toutes filières",
      venue: "Départ gare Tanger Ville",
      startsAt: "2026-06-14 07:00:00",
      endsAt: "2026-06-15 21:00:00",
      price: 480,
      capacity: 45,
      reservedSeats: 22,
      posterUrl: "/uploads/images/mock-trip-chefchaouen.jpg"
    }
  ]);

  await Job.bulkCreate([
    {
      userId: admin.id,
      title: "Stage développeur React/Node",
      company: "CasaTech Labs",
      description: "Stage PFE pour construire des interfaces React et APIs Express avec mentorat senior.",
      opportunityType: "stage",
      workMode: "hybride",
      city: "Casablanca",
      school: "EMSI Casablanca",
      fieldOfStudy: "Informatique",
      salary: "2500 MAD/mois",
      deadline: "2026-06-30",
      skills: ["React", "Node.js", "MySQL"],
      contactEmail: "talent@casatech.ma"
    },
    {
      userId: mehdi.id,
      title: "Service freelance: tableaux Excel avancés",
      company: "Étudiant indépendant",
      description: "Création de dashboards Excel, nettoyage de données et automatisations simples.",
      opportunityType: "service_freelance",
      workMode: "remote",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Finance",
      salary: "À partir de 150 MAD",
      skills: ["Excel", "Power Query", "Finance"],
      contactEmail: "mehdi.tazi@example.com"
    }
  ]);

  const conversation = await Conversation.create({
    title: "Colocation Rabat",
    lastMessageAt: new Date()
  });
  await ConversationParticipant.bulkCreate([
    { conversationId: conversation.id, userId: salma.id },
    { conversationId: conversation.id, userId: nour.id }
  ]);
  await Message.bulkCreate([
    {
      conversationId: conversation.id,
      senderId: nour.id,
      body: "Bonjour Salma, la chambre près de l'UIR est encore disponible ?"
    },
    {
      conversationId: conversation.id,
      senderId: salma.id,
      body: "Oui, elle est disponible à partir du 1er juin. Tu veux programmer une visite ?"
    }
  ]);

  await Review.create({
    reviewerId: nour.id,
    targetUserId: salma.id,
    rating: 5,
    comment: "Réponse rapide et annonce très claire."
  });

  await Favorite.bulkCreate([
    { userId: nour.id, itemType: "housing", itemId: 1 },
    { userId: salma.id, itemType: "event", itemId: 2 }
  ]);

  await Booking.bulkCreate([
    { userId: salma.id, resourceType: "ride", resourceId: 1, seats: 1 },
    { userId: nour.id, resourceType: "event", resourceId: 1, seats: 2 }
  ]);

  await Notification.bulkCreate([
    {
      userId: salma.id,
      title: "Bienvenue sur ST00N",
      body: "Votre profil est prêt. Publiez une annonce ou rejoignez une conversation.",
      type: "system"
    },
    {
      userId: omar.id,
      title: "Réservation covoiturage",
      body: "Une nouvelle place a été réservée pour Marrakech vers Casablanca.",
      type: "booking"
    }
  ]);

  console.log("Données mock ST00N insérées. Mot de passe commun: Stoon2026!");
  await sequelize.close();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
