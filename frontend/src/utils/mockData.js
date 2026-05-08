export const mockUsers = [
  {
    id: 1,
    firstName: "Yassine",
    lastName: "El Amrani",
    email: "yassine@stoon.ma",
    password: "Stoon2026!",
    role: "admin",
    photo: "",
    city: "Casablanca",
    school: "EMSI Casablanca",
    fieldOfStudy: "Informatique",
    bio: "Admin ST00N et développeur full-stack.",
    reputation: 4.9
  },
  {
    id: 2,
    firstName: "Salma",
    lastName: "Bennani",
    email: "salma.bennani@example.com",
    password: "Stoon2026!",
    role: "user",
    photo: "",
    city: "Rabat",
    school: "UIR",
    fieldOfStudy: "Commerce",
    bio: "Étudiante en marketing digital, j'organise des événements campus.",
    reputation: 4.7
  },
  {
    id: 3,
    firstName: "Omar",
    lastName: "Ait Lahcen",
    email: "omar.ait@example.com",
    password: "Stoon2026!",
    role: "user",
    photo: "",
    city: "Marrakech",
    school: "ENSA Marrakech",
    fieldOfStudy: "Génie informatique",
    bio: "Covoiturage régulier et entraide en programmation.",
    reputation: 4.6
  },
  {
    id: 4,
    firstName: "Nour",
    lastName: "Idrissi",
    email: "nour.idrissi@example.com",
    password: "Stoon2026!",
    role: "user",
    photo: "",
    city: "Fès",
    school: "Université Sidi Mohamed Ben Abdellah",
    fieldOfStudy: "Médecine",
    bio: "Documents de médecine, résumés et groupes de révision.",
    reputation: 4.8
  }
];

export const mockListings = {
  housing: [
    {
      id: 1,
      module: "housing",
      title: "Chambre lumineuse près de l'UIR",
      description:
        "Chambre meublée dans une colocation calme avec fibre, cuisine équipée, bureau et sécurité. Idéale pour une étudiante qui veut rester proche du campus.",
      type: "chambre",
      city: "Rabat",
      school: "UIR",
      fieldOfStudy: "Toutes filières",
      address: "Technopolis, Rabat",
      price: 1800,
      rooms: 1,
      availableFrom: "2026-06-01",
      status: "active",
      amenities: ["Wi-Fi", "Cuisine équipée", "Bureau", "Sécurité"],
      ownerId: 2,
      views: 248,
      createdAt: "2026-05-03"
    },
    {
      id: 2,
      module: "housing",
      title: "Colocation moderne à Guéliz",
      description:
        "Appartement partagé entre trois étudiants ENSA, charges incluses, salon lumineux et accès rapide aux bus vers le campus.",
      type: "colocation",
      city: "Marrakech",
      school: "ENSA Marrakech",
      fieldOfStudy: "Génie informatique",
      address: "Guéliz, Marrakech",
      price: 2100,
      rooms: 3,
      availableFrom: "2026-05-20",
      status: "active",
      amenities: ["Climatisation", "Wi-Fi", "Machine à laver"],
      ownerId: 3,
      views: 194,
      createdAt: "2026-05-04"
    }
  ],
  marketplace: [
    {
      id: 1,
      module: "marketplace",
      title: "Pack PDF anatomie S2",
      description: "Résumé clair avec schémas, QCM corrigés et fiches de révision pour médecine.",
      category: "document",
      transactionType: "vente",
      price: 60,
      condition: "numerique",
      city: "Fès",
      school: "Université Sidi Mohamed Ben Abdellah",
      fieldOfStudy: "Médecine",
      status: "active",
      ownerId: 4,
      views: 431,
      createdAt: "2026-04-28"
    },
    {
      id: 2,
      module: "marketplace",
      title: "Calculatrice financière HP",
      description: "Très bon état, parfaite pour finance, comptabilité et gestion.",
      category: "materiel",
      transactionType: "vente",
      price: 350,
      condition: "tres_bon",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Finance",
      status: "active",
      ownerId: 1,
      views: 119,
      createdAt: "2026-05-01"
    }
  ],
  rides: [
    {
      id: 1,
      module: "rides",
      title: "Marrakech vers Casablanca",
      description: "Départ ponctuel depuis ENSA Marrakech, bagage moyen accepté.",
      departureCity: "Marrakech",
      destinationCity: "Casablanca",
      departureAt: "2026-05-18T08:30:00",
      seatsAvailable: 3,
      seatsTotal: 4,
      price: 90,
      carModel: "Dacia Sandero",
      city: "Marrakech",
      school: "ENSA Marrakech",
      fieldOfStudy: "Toutes filières",
      status: "active",
      ownerId: 3,
      views: 87,
      createdAt: "2026-05-05"
    },
    {
      id: 2,
      module: "rides",
      title: "Casablanca vers Rabat",
      description: "Trajet après les cours, départ Maarif et arrivée Agdal.",
      departureCity: "Casablanca",
      destinationCity: "Rabat",
      departureAt: "2026-05-20T17:45:00",
      seatsAvailable: 2,
      seatsTotal: 3,
      price: 45,
      carModel: "Renault Clio",
      city: "Casablanca",
      school: "EMSI Casablanca",
      fieldOfStudy: "Toutes filières",
      status: "active",
      ownerId: 1,
      views: 141,
      createdAt: "2026-05-02"
    }
  ],
  events: [
    {
      id: 1,
      module: "events",
      title: "ST00N Campus Night Rabat",
      description: "Soirée networking, musique et rencontres entre étudiants de Rabat.",
      eventType: "soiree",
      city: "Rabat",
      school: "UIR",
      fieldOfStudy: "Toutes filières",
      venue: "Agdal",
      startsAt: "2026-06-07T19:00:00",
      capacity: 150,
      reservedSeats: 37,
      price: 120,
      status: "active",
      ownerId: 2,
      views: 620,
      createdAt: "2026-04-30"
    },
    {
      id: 2,
      module: "events",
      title: "Voyage étudiant Chefchaouen",
      description: "Week-end organisé avec transport, guide local et logement inclus.",
      eventType: "voyage",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Toutes filières",
      venue: "Gare Tanger Ville",
      startsAt: "2026-06-14T07:00:00",
      capacity: 45,
      reservedSeats: 22,
      price: 480,
      status: "active",
      ownerId: 1,
      views: 399,
      createdAt: "2026-05-01"
    }
  ],
  jobs: [
    {
      id: 1,
      module: "jobs",
      title: "Stage développeur React/Node",
      description: "Stage PFE pour construire des interfaces React et APIs Express avec mentorat senior.",
      company: "CasaTech Labs",
      opportunityType: "stage",
      workMode: "hybride",
      city: "Casablanca",
      school: "EMSI Casablanca",
      fieldOfStudy: "Informatique",
      salary: "2500 MAD/mois",
      deadline: "2026-06-30",
      skills: ["React", "Node.js", "MySQL"],
      price: 2500,
      status: "active",
      ownerId: 1,
      views: 734,
      createdAt: "2026-04-29"
    },
    {
      id: 2,
      module: "jobs",
      title: "Service freelance Excel avancé",
      description: "Création de dashboards Excel, nettoyage de données et automatisations simples.",
      company: "Étudiant indépendant",
      opportunityType: "service_freelance",
      workMode: "remote",
      city: "Tanger",
      school: "ENCG Tanger",
      fieldOfStudy: "Finance",
      salary: "À partir de 150 MAD",
      skills: ["Excel", "Power Query", "Finance"],
      price: 150,
      status: "active",
      ownerId: 1,
      views: 210,
      createdAt: "2026-05-04"
    }
  ]
};

export const mockConversations = [
  {
    id: 1,
    title: "Colocation Rabat",
    participantIds: [2, 4],
    messages: [
      {
        id: 1,
        senderId: 4,
        body: "Bonjour Salma, la chambre près de l'UIR est encore disponible ?",
        createdAt: "2026-05-06T10:15:00"
      },
      {
        id: 2,
        senderId: 2,
        body: "Oui, elle est disponible à partir du 1er juin. Tu veux programmer une visite ?",
        createdAt: "2026-05-06T10:22:00"
      }
    ]
  },
  {
    id: 2,
    title: "Trajet Marrakech Casablanca",
    participantIds: [1, 3],
    messages: [
      {
        id: 3,
        senderId: 1,
        body: "Salut Omar, il reste une place pour lundi matin ?",
        createdAt: "2026-05-06T18:30:00"
      }
    ]
  }
];

export const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "Nouveau message",
    body: "Nour vous a écrit à propos de votre colocation.",
    isRead: false,
    createdAt: "2026-05-06T10:15:00"
  },
  {
    id: 2,
    type: "booking",
    title: "Réservation confirmée",
    body: "Votre place pour ST00N Campus Night Rabat est confirmée.",
    isRead: false,
    createdAt: "2026-05-05T16:40:00"
  },
  {
    id: 3,
    type: "system",
    title: "Profil vérifié",
    body: "Votre email étudiant a été vérifié en simulation.",
    isRead: true,
    createdAt: "2026-05-04T09:00:00"
  }
];

export const mockReviews = [
  {
    id: 1,
    reviewerId: 4,
    targetUserId: 2,
    rating: 5,
    comment: "Réponse rapide et annonce très claire.",
    createdAt: "2026-05-02"
  },
  {
    id: 2,
    reviewerId: 2,
    targetUserId: 3,
    rating: 4,
    comment: "Trajet ponctuel et bonne communication.",
    createdAt: "2026-05-01"
  }
];
